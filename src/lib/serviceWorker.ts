const MAP_SYNC_TIMEOUT_MS = 2_000;
const MAP_PROTOCOL_VERSION = 1;
// public/sw.js도 이 query를 캐시를 사용하지 않는 API 요청으로 처리한다.
const CACHE_BYPASS_PARAM = '__sw_bypass';

type BootstrapStatus = 'skipped' | 'uncontrolled' | 'ready' | 'bypass';

function bypassApiCache(shouldBypass: () => boolean) {
  const originalFetch = window.fetch.bind(window);

  // ACK를 지원하지 않는 이전 SW도 같은 URL의 캐시를 반환하지 못하도록 요청마다 구분한다.
  window.fetch = (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input, window.location.href);
    const method = init?.method ?? (input instanceof Request ? input.method : 'GET');
    if (!shouldBypass() || url.origin !== window.location.origin || !url.pathname.startsWith('/api/')
        || method.toUpperCase() !== 'GET') {
      return originalFetch(input, init);
    }

    url.searchParams.set(CACHE_BYPASS_PARAM, crypto.randomUUID());
    const request = new Request(input, init);
    return originalFetch(new Request(url, request), { cache: 'no-cache' });
  };
}

export async function prepareServiceWorker(): Promise<BootstrapStatus> {
  const map = window.__ETAG_MAP__;
  if (!import.meta.env.PROD || !map || !('serviceWorker' in navigator)) {
    return 'skipped';
  }

  const workers = navigator.serviceWorker;
  const message = { type: 'UPDATE_ETAG_MAP', payload: map };
  let synchronizedController: ServiceWorker | null = null;
  bypassApiCache(() => Boolean(workers.controller) && workers.controller !== synchronizedController);
  const status = await new Promise<BootstrapStatus>((resolve) => {
    let settled = false;
    let channel: MessageChannel | undefined;

    const finish = (result: BootstrapStatus) => {
      window.clearTimeout(timeout);
      channel?.port1.close();
      channel = undefined;
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const sendMap = () => {
      synchronizedController = null;
      channel?.port1.close();
      if (settled) {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => finish('bypass'), MAP_SYNC_TIMEOUT_MS);
      }
      const controller = workers.controller;
      if (!controller) {
        return;
      }

      const currentChannel = new MessageChannel();
      channel = currentChannel;
      currentChannel.port1.onmessage = (event: MessageEvent<unknown>) => {
        // 준비 도중 제어 SW가 바뀌면 새 controller의 확인 응답을 기다린다.
        if (workers.controller !== controller || channel !== currentChannel) {
          return;
        }

        const data = event.data;
        if (data && typeof data === 'object' && 'type' in data) {
          if (data.type === 'ETAG_MAP_READY') {
            if ('protocolVersion' in data && data.protocolVersion === MAP_PROTOCOL_VERSION) {
              synchronizedController = controller;
              finish('ready');
            } else {
              finish('bypass');
            }
          } else if (data.type === 'ETAG_MAP_ERROR') {
            finish('bypass');
          }
        }
      };
      currentChannel.port1.onmessageerror = () => {
        if (workers.controller === controller && channel === currentChannel) finish('bypass');
      };

      try {
        controller.postMessage(message, [currentChannel.port2]);
      } catch {
        finish('bypass');
      }
    };

    let timeout = window.setTimeout(() => finish('bypass'), MAP_SYNC_TIMEOUT_MS);
    workers.addEventListener('controllerchange', sendMap);
    // 재방문은 기존 SW와 바로 동기화하며 SW 스크립트 업데이트 검사를 기다리지 않는다.
    sendMap();
    void workers.register('/sw.js', { updateViaCache: 'none' }).catch(error => {
      console.warn('SW registration failed:', error);
      if (!settled) finish(workers.controller ? 'bypass' : 'uncontrolled');
    });
  });

  if (status === 'bypass') {
    console.warn('SW map synchronization failed; API requests will bypass the cache.');
  }

  return status;
}
