/**
 * @file tomatoM4to.github.io를 위한 서비스 워커
 * @description 정적 사이트의 지연 시간(Latency) 최적화를 위해 ETag 맵 기반 캐싱 전략을 구현합니다.
 * "Rethinking Web Caching" 최적화 기법을 기반으로 합니다.
 *
 * 주요 기능:
 * - 사전 주입된 ETag 맵을 사용한 0-RTT 캐시 히트 (네트워크 왕복 없는 검증)
 * - 버전 관리를 통한 자동 캐시 무효화
 * - 최신성 보장을 위한 내비게이션 요청(HTML) 특별 처리
 * - URL 인코딩된 경로 지원 (한글, 공백 등 처리)
 */

/** @type {string} 캐시 스토리지 이름 - 이전 캐시를 삭제하려면 버전을 올리세요. */
const CACHE_NAME = 'tomato-etag-cache-v3';

/** @type {string} 캐시 내에 ETag 맵을 저장하기 위해 사용하는 내부 키 */
const ETAG_MAP_CACHE_KEY = '/__etag_map__';

/**
 * 서비스 워커 설치(Install) 이벤트
 * 대기 중인 서비스 워커를 즉시 활성화 상태로 전환합니다.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

/**
 * 서비스 워커 활성화(Activate) 이벤트
 * 현재 CACHE_NAME과 일치하지 않는 오래된 캐시들을 삭제합니다.
 * 서비스 워커가 즉시 모든 클라이언트를 제어할 수 있도록 합니다.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * 메시지(Message) 이벤트 리스너
 * 메인 스레드로부터 ETag 맵을 전달받아 캐시에 영구 저장합니다.
 * 이 맵은 네트워크 요청 없이 캐시된 응답의 유효성을 검증하는 데 사용됩니다.
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_ETAG_MAP') {
    const etagMap = event.data.payload || {};
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.put(
          new Request(ETAG_MAP_CACHE_KEY),
          new Response(JSON.stringify(etagMap))
        );
      })
    );
  }
});

/**
 * 캐시에서 저장된 ETag 맵을 가져옵니다.
 * @returns {Promise<Object>} 경로명(Pathname)과 ETag 문자열이 매핑된 객체
 */
async function getEtagMap() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(ETAG_MAP_CACHE_KEY);
    if (response) {
      return await response.json();
    }
  } catch (e) {
    console.error('Failed to get ETag map from cache', e);
  }
  return {};
}

/**
 * 페치(Fetch) 이벤트 리스너
 * "HTML은 네트워크 우선", "에셋은 ETag 검증 기반 캐시" 전략을 수행합니다.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // CORS 이슈 및 불필요한 추적 방지를 위해 동일 출처(Same-origin) 요청만 처리
  if (url.origin !== location.origin) return;

  event.respondWith(
    (async () => {
      /**
       * 1. 내비게이션 및 HTML 전략: 네트워크 우선 (Network-First)
       * 최신 ETag 맵과 메타 태그를 가져오기 위해 항상 네트워크에서 HTML을 먼저 가져옵니다.
       * 오프라인 상태일 경우에만 캐시된 버전을 반환합니다.
       */
      if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.startsWith('/posts/')) {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_NAME);
          event.waitUntil(cache.put(event.request, networkResponse.clone()));
          return networkResponse;
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(event.request);
          if (cached) return cached;
          throw err;
        }
      }

      /**
       * 2. 에셋 및 API 전략: ETag 매핑 (0-RTT 검증)
       * 미리 계산된 ETag 맵을 사용하여 캐시된 버전이 여전히 유효한지 확인합니다.
       */
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);

      let etagMap = await getEtagMap();
      let pathname = url.pathname;

      /**
       * [수정] 한글 및 공백 등 비 ASCII 문자를 처리하기 위해 URI 컴포넌트를 디코딩합니다.
       * ETag 맵의 키는 인코딩되지 않은 파일 시스템 경로인 반면, url.pathname은 인코딩된 상태입니다.
       */
      try {
        pathname = decodeURIComponent(url.pathname);
      } catch (e) {
        console.error('[SW] Failed to decode URI component:', url.pathname);
      }

      const currentEtag = etagMap[pathname];

      if (cachedResponse) {
        const cachedEtag = cachedResponse.headers.get('X-SW-ETag');

        // ETag가 일치하면 네트워크 요청 없이 캐시에서 즉시 반환 (0-RTT 히트)
        if (cachedEtag && currentEtag && cachedEtag === currentEtag) {
          const headers = new Headers(cachedResponse.headers);
          headers.set('X-Cache-Status', 'HIT-0-RTT');
          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: headers
          });
        }
        console.log(`[SW] ETag Mismatch for ${url.pathname}: cached=${cachedEtag}, current=${currentEtag}`);
      }

      /**
       * 3. 캐시 미스 또는 ETag 불일치: 네트워크에서 가져오기
       * 새로운 응답을 네트워크에서 가져와 현재 ETag와 함께 캐시에 저장합니다.
       */
      try {
        const networkResponse = await fetch(event.request);
        const responseToCache = networkResponse.clone();

        const statusHeader = cachedResponse ? 'MISS-ETAG-MISMATCH' : 'MISS-NOT-IN-CACHE';

        if (currentEtag) {
          const headers = new Headers(responseToCache.headers);
          headers.set('X-SW-ETag', currentEtag);
          headers.set('X-Cache-Status', statusHeader);

          const responseWithEtag = new Response(await responseToCache.blob(), {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
          });
          event.waitUntil(cache.put(event.request, responseWithEtag));
        } else {
          // ETag 맵에 정보가 없는 경우 일반적인 방식으로 캐시 저장
          event.waitUntil(cache.put(event.request, responseToCache));
        }

        return networkResponse;
      } catch (error) {
        // 네트워크 실패 시 최후의 수단으로 (비록 오래되었을 수 있는) 캐시 반환
        if (cachedResponse) return cachedResponse;
        throw error;
      }
    })()
  );
});
