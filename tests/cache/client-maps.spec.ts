import { test, expect, type Page } from '@playwright/test';
import {
  ASSET_PATH,
  POSTS_A,
  POSTS_B,
  RECENT_PATH,
  readReleaseMap,
  readWorkerMap,
  requestCount,
  selectRelease,
} from '../support/static-site';

const CACHE_NAME = 'tomato-etag-cache-v3';

async function readStoredMapPaths(page: Page) {
  return page.evaluate(async cacheName => {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    return requests.map(request => new URL(request.url).pathname)
      .filter(path => path === '/__etag_map__' || path.startsWith('/__etag_map__/'));
  }, CACHE_NAME);
}

async function resendMap(page: Page) {
  const reply = await page.evaluate(() => new Promise<string>((resolve, reject) => {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
      reject(new Error('제어 중인 SW가 없습니다.'));
      return;
    }

    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
      channel.port1.close();
      resolve(event.data.type);
    };
    controller.postMessage({ type: 'UPDATE_ETAG_MAP', payload: window.__ETAG_MAP__ }, [channel.port2]);
  }));
  expect(reply).toBe('ETAG_MAP_READY');
}

test.beforeEach(async () => {
  await selectRelease('a');
});

test('이전 문서가 맵을 다시 보내도 새 문서는 자기 맵으로 목록을 요청한다', async ({ page, context }) => {
  const mapA = await readReleaseMap('a');
  await page.goto('/license');
  await expect(page.getByRole('button', { name: /Switch to (light|dark) mode/ })).toBeVisible();
  expect(await page.evaluate(async path => (await fetch(path)).json(), RECENT_PATH)).toMatchObject({ len: 1 });
  await page.waitForFunction(async ({ path, version }) => (
    await caches.match(path)
  )?.headers.get('X-SW-ETag') === version, { path: RECENT_PATH, version: mapA[RECENT_PATH] });

  await selectRelease('b');
  const nextPage = await context.newPage();
  await nextPage.goto('/license');
  await expect(nextPage.getByRole('button', { name: /Switch to (light|dark) mode/ })).toBeVisible();
  await resendMap(page);

  const before = await requestCount(RECENT_PATH);
  const response = nextPage.waitForResponse(response => new URL(response.url()).pathname === RECENT_PATH
    && !response.request().serviceWorker());
  await nextPage.getByRole('link', { name: 'tomatoM4to', exact: true }).click();
  expect(await (await response).json()).toMatchObject({ len: 2 });
  await expect(nextPage.locator('section h3')).toHaveText(POSTS_B);
  expect(await requestCount(RECENT_PATH)).toBeGreaterThan(before);
  expect(await readStoredMapPaths(nextPage)).toHaveLength(2);
});

test('SW 재시작 후에도 문서의 맵으로 네트워크 없이 캐시를 사용한다', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  await page.waitForFunction(async path => Boolean(
    (await caches.match(path))?.headers.get('X-SW-ETag')
  ), RECENT_PATH);
  const session = await context.newCDPSession(page);
  const workerURL = new URL('/sw.js', page.url()).href;
  const running = new Promise<string>(resolve => {
    session.on('ServiceWorker.workerVersionUpdated', ({ versions }) => {
      const version = versions.find(version => version.scriptURL === workerURL
        && version.status === 'activated' && version.runningStatus === 'running');
      if (version) resolve(version.versionId);
    });
  });
  await session.send('ServiceWorker.enable');
  const versionId = await running;
  const stopped = new Promise<void>(resolve => {
    session.on('ServiceWorker.workerVersionUpdated', ({ versions }) => {
      if (versions.some(version => version.versionId === versionId && version.runningStatus === 'stopped')) {
        resolve();
      }
    });
  });
  await session.send('ServiceWorker.stopWorker', { versionId });
  await stopped;
  await session.detach();

  const before = await requestCount(RECENT_PATH);
  const result = await page.evaluate(async path => {
    const response = await fetch(path);
    return { status: response.headers.get('X-Cache-Status'), body: await response.json() };
  }, RECENT_PATH);
  expect(result.status).toBe('HIT-0-RTT');
  expect(result.body).toMatchObject({ len: 1 });
  expect(await requestCount(RECENT_PATH)).toBe(before);
});

test('맵을 보내지 않은 문서는 이전 전역 맵으로 에셋 캐시를 판정하지 않는다', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  await page.evaluate(async ({ path, cacheName }) => {
    await fetch(path);
    const cache = await caches.open(cacheName);
    await cache.put('/__etag_map__', new Response(JSON.stringify(window.__ETAG_MAP__)));
  }, { path: ASSET_PATH, cacheName: CACHE_NAME });
  await page.waitForFunction(async path => Boolean(
    (await caches.match(path))?.headers.get('X-SW-ETag')
  ), ASSET_PATH);

  await selectRelease('b');
  const nextPage = await context.newPage();
  await nextPage.addInitScript(() => {
    ServiceWorker.prototype.postMessage = () => {};
  });
  await nextPage.goto('/license');
  await expect(nextPage.getByRole('button', { name: /Switch to (light|dark) mode/ })).toBeVisible();
  const before = await requestCount(ASSET_PATH);
  const result = await nextPage.evaluate(async path => {
    const response = await fetch(path);
    return { status: response.headers.get('X-Cache-Status'), body: await response.text() };
  }, ASSET_PATH);
  expect(result.body).toContain('Release B updated');
  expect(result.status).not.toBe('HIT-0-RTT');
  expect(await requestCount(ASSET_PATH)).toBeGreaterThan(before);
});

test('종료된 문서와 이전 전역 맵을 정리하고 활성 문서의 맵과 응답은 유지한다', async ({ page, context }) => {
  await page.goto('/?tab=closed');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  await page.waitForFunction(async path => Boolean(
    (await caches.match(path))?.headers.get('X-SW-ETag')
  ), RECENT_PATH);
  const nextPage = await context.newPage();
  await nextPage.goto('/license?tab=active');
  await expect(nextPage.getByRole('button', { name: /Switch to (light|dark) mode/ })).toBeVisible();
  await expect.poll(async () => (await readStoredMapPaths(nextPage)).length).toBe(2);
  await page.close();
  await nextPage.evaluate(async cacheName => {
    const cache = await caches.open(cacheName);
    await cache.put('/__etag_map__', new Response('{}'));
  }, CACHE_NAME);
  await resendMap(nextPage);
  await expect.poll(async () => (await readStoredMapPaths(nextPage)).length).toBe(1);
  expect((await readWorkerMap(nextPage))[RECENT_PATH]).toBe((await readReleaseMap('a'))[RECENT_PATH]);

  const before = await requestCount(RECENT_PATH);
  expect(await nextPage.evaluate(async path => (
    await fetch(path)
  ).headers.get('X-Cache-Status'), RECENT_PATH)).toBe('HIT-0-RTT');
  expect(await requestCount(RECENT_PATH)).toBe(before);
});
