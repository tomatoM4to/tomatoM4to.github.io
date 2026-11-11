import { setTimeout as delay } from 'node:timers/promises';
import { test, expect, type Page, type Response } from '@playwright/test';
import {
  ASSET_PATH,
  HTTP_CACHE_TTL_MS,
  POSTS_A,
  POSTS_B,
  RECENT_PATH,
  TTL_MARGIN_MS,
  readAccessLog,
  readReleaseFile,
  readReleaseMap,
  readWorkerMap,
  requestCount,
  selectRelease,
} from '../support/static-site';

const CACHE_READY_TIMEOUT_MS = 15_000;

async function readState(page: Page) {
  const workerMap = await readWorkerMap(page);
  return page.evaluate(async ({ paths, workerMap }) => {
    const documentMap = (window as Window & {
      __ETAG_MAP__?: Record<string, string>;
    }).__ETAG_MAP__;
    const versions: Record<string, {
      document: string | null;
      worker: string | null;
      cached: string | null;
    }> = {};

    for (const path of paths) {
      const cached = await caches.match(path);
      versions[path] = {
        document: documentMap?.[path] ?? null,
        worker: workerMap[path] ?? null,
        cached: cached?.headers.get('X-SW-ETag') ?? null,
      };
    }

    return {
      controlled: Boolean(navigator.serviceWorker.controller),
      readyState: document.readyState,
      posts: Array.from(document.querySelectorAll('section h3'), element => element.textContent),
      versions,
    };
  }, { paths: [RECENT_PATH, ASSET_PATH], workerMap });
}

async function waitForMap(page: Page, version: string) {
  await expect.poll(async () => (await readWorkerMap(page))[RECENT_PATH], {
    timeout: CACHE_READY_TIMEOUT_MS,
  }).toBe(version);
}

async function waitForCached(page: Page, path: string, version: string) {
  await page.waitForFunction(async ({ path, version }) => {
    const response = await caches.match(path);
    return response?.headers.get('X-SW-ETag') === version;
  }, { path, version }, { timeout: CACHE_READY_TIMEOUT_MS });
}

async function fetchResource(page: Page, path: string) {
  // 일반 fetch를 유지해 HTTP 캐시와 SW를 함께 검증한다.
  return page.evaluate(async path => {
    const response = await fetch(path);
    return {
      status: response.status,
      cacheStatus: response.headers.get('X-Cache-Status'),
      version: response.headers.get('X-SW-ETag'),
      body: await response.text(),
    };
  }, path);
}

async function visit(page: Page, reload = false) {
  // 진단용 추가 fetch가 아닌, 앱이 실제로 받은 첫 목록 응답을 수집한다.
  const [response] = await Promise.all([
    page.waitForResponse(response => new URL(response.url()).pathname === RECENT_PATH
      && !response.request().serviceWorker()),
    reload ? page.reload({ waitUntil: 'load' }) : page.goto('/', { waitUntil: 'load' }),
  ]);
  const body: unknown = await response.json();
  await expect(page.locator('section h3')).not.toHaveCount(0);

  return {
    status: response.status(),
    fromServiceWorker: response.fromServiceWorker(),
    headers: await response.allHeaders(),
    body,
  };
}

type ResponseEvent = {
  phase: string;
  path: string;
  status: number;
  fromServiceWorker: boolean;
  workerRequest: boolean;
  headers: Record<string, string>;
  snapshot?: Awaited<ReturnType<typeof readState>>;
  snapshotError?: string;
};

test.beforeEach(async () => {
  await selectRelease('a');
});

test.beforeAll(async () => {
  const [mapA, mapB] = await Promise.all([readReleaseMap('a'), readReleaseMap('b')]);
  expect(mapA[RECENT_PATH]).not.toBe(mapB[RECENT_PATH]);
  expect(mapA[ASSET_PATH]).not.toBe(mapB[ASSET_PATH]);

  const bundles = (map: Record<string, string>) => Object.fromEntries(
    Object.entries(map).filter(([path]) => path.startsWith('/assets/')),
  );
  expect(bundles(mapA)).toEqual(bundles(mapB));
  expect(await readReleaseFile('a', 'sw.js')).toBe(await readReleaseFile('b', 'sw.js'));
});

for (const serviceWorkers of ['block', 'allow'] as const) {
  test.describe(`SW ${serviceWorkers}`, () => {
    test.use({ serviceWorkers });

    for (const slowLoad of [false, true]) {
      test(`배포 후 첫 접속 · ${slowLoad ? '느린 이미지' : '일반 로딩'}`, async ({
        page, context, request, baseURL,
      }, testInfo) => {
        const enabled = serviceWorkers === 'allow';
        const [mapA, mapB] = await Promise.all([readReleaseMap('a'), readReleaseMap('b')]);
        const logStart = (await readAccessLog()).length;
        const evidence: Record<string, unknown> = {};
        const events: ResponseEvent[] = [];
        const pending: Promise<void>[] = [];
        let phase = 'initial-a';

        if (!baseURL) {
          throw new Error('테스트 서버의 baseURL이 필요합니다.');
        }

        const origin = new URL(baseURL).origin;
        const recordResponse = async (response: Response, responsePhase: string) => {
          const url = new URL(response.url());
          if (url.origin !== origin || !['/', RECENT_PATH, ASSET_PATH].includes(url.pathname)) {
            return;
          }

          const workerRequest = Boolean(response.request().serviceWorker());
          const event: ResponseEvent = {
            phase: responsePhase,
            path: url.pathname,
            status: response.status(),
            fromServiceWorker: response.fromServiceWorker(),
            workerRequest,
            headers: await response.allHeaders(),
          };
          events.push(event);

          if (url.pathname === RECENT_PATH && !workerRequest) {
            try {
              event.snapshot = await readState(response.frame().page());
            } catch (error) {
              event.snapshotError = String(error);
            }
          }
        };
        const onResponse = (response: Response) => {
          pending.push(recordResponse(response, phase));
        };
        context.on('response', onResponse);

        try {
          await test.step('A에 접속하고 캐시 재사용 확인', async () => {
            evidence.initial = await visit(page);
            await expect(page.locator('section h3')).toHaveText(POSTS_A);

            if (enabled) {
              await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
              await waitForMap(page, mapA[RECENT_PATH]);
            }

            phase = 'warm-a';
            for (const path of [RECENT_PATH, ASSET_PATH]) {
              expect((await fetchResource(page, path)).status).toBe(200);
              if (enabled) {
                await waitForCached(page, path, mapA[path]);
              }
            }

            if (enabled) {
              // HTTP TTL 경과를 기다리는 것으로 캐시 삭제나 요청 모킹을 대신한다.
              await delay(HTTP_CACHE_TTL_MS + TTL_MARGIN_MS);
              for (const path of [RECENT_PATH, ASSET_PATH]) {
                const before = await requestCount(path);
                const response = await fetchResource(page, path);
                expect(response.cacheStatus).toBe('HIT-0-RTT');
                expect(await requestCount(path)).toBe(before);
              }
            }

            evidence.beforeDeployment = await readState(page);
          });

          await page.close();
          await selectRelease('b');
          await delay(HTTP_CACHE_TTL_MS + TTL_MARGIN_MS);
          phase = 'verify-origin-b';
          const originResponse = await request.get(RECENT_PATH);
          expect(originResponse.status()).toBe(200);
          expect(originResponse.headers()['cache-control']).toBe('max-age=1');
          const originBody: unknown = await originResponse.json();
          expect(originBody).toMatchObject({ len: POSTS_B.length, data: POSTS_B.map(id => ({ id })) });

          const nextPage = await context.newPage();
          if (slowLoad) {
            // 테스트 이미지만 실제 전송 속도를 제한해 load 이전의 요청 순서를 재현한다.
            await nextPage.addInitScript(() => {
              window.addEventListener('DOMContentLoaded', () => {
                const image = new Image();
                image.loading = 'eager';
                image.hidden = true;
                image.src = `/cache-load-gate.svg?visit=${crypto.randomUUID()}`;
                document.body.appendChild(image);
              }, { once: true });
            });
          }

          await test.step('같은 context의 새 탭에서 B 최초 접속 검증', async () => {
            phase = 'first-visit-b';
            const before = await requestCount(RECENT_PATH);
            evidence.firstVisit = await visit(nextPage);
            evidence.firstVisitOriginRequests = (await requestCount(RECENT_PATH)) - before;
            const state = await readState(nextPage);
            evidence.firstVisitSnapshot = state;
            expect(state.versions[RECENT_PATH].document).toBe(mapB[RECENT_PATH]);
            if (enabled) {
              expect(state.versions[RECENT_PATH].worker).toBe(mapB[RECENT_PATH]);
              const timing = await nextPage.evaluate(() => {
                const sync = performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure;
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                return { syncMs: sync.duration, status: sync.detail.status, hydrationAt: performance.getEntriesByName('app:hydrate-start')[0].startTime, loadAt: navigation.loadEventEnd };
              });
              evidence.bootstrap = timing;
              expect(timing.status).toBe('ready');
              if (slowLoad) {
                expect(timing.hydrationAt).toBeLessThan(timing.loadAt);
              }
            }

            // 실패는 유지하되 이후 맵 반영·새로고침 진단도 수집한다. xfail이나 재시도로 숨기지 않는다.
            await expect.soft(nextPage.locator('section h3'), '첫 접속에서 새 글이 표시되어야 한다')
              .toHaveText(POSTS_B, { timeout: 3_000 });
            await testInfo.attach('first-visit', {
              body: await nextPage.screenshot({ fullPage: true }),
              contentType: 'image/png',
            });
          });

          await test.step('맵 반영 후 에셋 갱신과 추가 새로고침 진단', async () => {
            if (enabled) {
              await waitForMap(nextPage, mapB[RECENT_PATH]);
            }
            evidence.afterMapUpdate = await readState(nextPage);

            phase = 'asset-b';
            const asset = await fetchResource(nextPage, ASSET_PATH);
            expect(asset.body).toContain('Release B updated');
            if (enabled) {
              await waitForCached(nextPage, ASSET_PATH, mapB[ASSET_PATH]);
              const cached = await fetchResource(nextPage, ASSET_PATH);
              expect(cached.cacheStatus).toBe('HIT-0-RTT');
              expect(cached.body).toContain('Release B updated');
            }

            phase = 'reload-b';
            evidence.afterReload = await visit(nextPage, true);
            await expect(nextPage.locator('section h3')).toHaveText(POSTS_B);
            evidence.afterReloadSnapshot = await readState(nextPage);
          });
        } finally {
          context.off('response', onResponse);
          const outcomes = await Promise.allSettled(pending);
          const observerErrors = outcomes.flatMap(result => result.status === 'rejected' ? [String(result.reason)] : []);
          await testInfo.attach('cache-evidence', {
            body: Buffer.from(JSON.stringify({ ...evidence, events, observerErrors }, null, 2)),
            contentType: 'application/json',
          });
          await testInfo.attach('nginx-access', {
            body: Buffer.from((await readAccessLog()).slice(logStart)),
            contentType: 'text/plain',
          });
          expect.soft(observerErrors, '응답 관찰 중 오류가 없어야 한다').toEqual([]);
        }
      });
    }
  });
}
