import { test, expect } from '@playwright/test';
import { POSTS_A, POSTS_B, RECENT_PATH, selectRelease } from '../support/static-site';

test.beforeEach(async () => {
  await selectRelease('a');
});

test('SW 미지원 환경에서도 hydration한다', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(Navigator.prototype, 'serviceWorker');
  });
  await page.goto('/');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  expect(await page.evaluate(() => (performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure).detail.status)).toBe('skipped');
});

test('등록 실패가 UI를 무한 대기시키지 않는다', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.serviceWorker.register = async () => {
      throw new Error('test: registration unavailable');
    };
  });
  await page.goto('/');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  expect(await page.evaluate(() => (performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure).detail.status)).toBe('uncontrolled');
});

for (const route of ['/search', '/tags?tag=Cache']) {
  test(`${route} 직접 접속도 맵 반영 후 요청한다`, async ({ page, context }) => {
    const apiPath = route.startsWith('/search') ? RECENT_PATH : '/api/tags/Cache.json';
    const [initialResponse] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === apiPath),
      page.goto(route),
    ]);
    expect(await initialResponse.json()).toMatchObject({ len: 1 });
    await page.waitForFunction(async path => Boolean((await caches.match(path))?.headers.get('X-SW-ETag')), apiPath);
    await page.close();
    await selectRelease('b');

    // TTL 경과 대기 없이 전환해 SW의 재검증이 이전 HTTP 캐시도 갱신하는지 확인한다.
    const nextPage = await context.newPage();
    const [nextResponse] = await Promise.all([
      nextPage.waitForResponse(response => new URL(response.url()).pathname === apiPath),
      nextPage.goto(route),
    ]);
    expect(await nextResponse.json()).toMatchObject({ len: 2 });
    if (route.startsWith('/search')) {
      await nextPage.getByPlaceholder('포스트 제목, 요약으로 검색...').fill('cache-new');
      await expect(nextPage.locator('h3')).toHaveText(['cache-new']);
    } else {
      await expect(nextPage.locator('h3')).toHaveText(POSTS_B);
    }
  });
}

test('ACK가 없으면 이전 맵을 우회해 B 목록을 받는다', async ({ page, context }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  await page.waitForFunction(async path => {
    const response = await caches.match(path);
    return Boolean(response?.headers.get('X-SW-ETag'));
  }, RECENT_PATH);
  await page.close();
  await selectRelease('b');

  const nextPage = await context.newPage();
  await nextPage.addInitScript(() => {
    // ACK와 맵 갱신이 모두 유실된 상황을 만든다. HTTP 요청과 캐시는 그대로 둔다.
    ServiceWorker.prototype.postMessage = () => {};
  });
  await nextPage.goto('/');
  await expect(nextPage.locator('section h3')).toHaveText(POSTS_B);
  const result = await nextPage.evaluate(() => {
    const sync = performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure;
    const requests = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return { status: sync.detail.status, waitMs: sync.duration, bypassed: requests.some(entry => entry.name.includes('__sw_bypass=')) };
  });
  expect(result.status).toBe('bypass');
  expect(result.bypassed).toBe(true);
  expect(result.waitMs).toBeLessThan(3_000);
  await testInfo.attach('bootstrap-fallback', { body: Buffer.from(JSON.stringify(result)), contentType: 'application/json' });
});

test('맵 저장 실패 응답을 받으면 즉시 API 캐시를 우회한다', async ({ page }) => {
  await page.addInitScript(() => {
    ServiceWorker.prototype.postMessage = (_message, transfer) => {
      if (Array.isArray(transfer)) {
        (transfer[0] as MessagePort).postMessage({ type: 'ETAG_MAP_ERROR' });
      }
    };
  });
  await page.goto('/');
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  expect(await page.evaluate(() => (performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure).detail.status)).toBe('bypass');
});
