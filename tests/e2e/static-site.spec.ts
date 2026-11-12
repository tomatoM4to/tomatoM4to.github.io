import { test, expect } from '@playwright/test';
import { RECENT_PATH, selectRelease } from '../support/static-site';

test.beforeEach(async () => {
  await selectRelease('a');
});

test('정적 글 직접 접속과 클라이언트 탐색', async ({ page }) => {
  await page.goto('/posts/cache-existing', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'cache-existing', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: '테스트 에셋' })).toBeVisible();
  await expect(page.locator('article')).toContainText('const answer = 42;');
  await expect(page.locator('.katex')).toBeVisible();
  await expect(page.locator('.mermaid-wrapper svg')).toBeVisible();

  await page.getByRole('link', { name: 'tomatoM4to', exact: true }).click();
  await expect(page.locator('section h3')).toHaveText(['cache-existing']);
  await page.locator('a[href="/posts/cache-existing"]').click();
  await expect(page.getByRole('heading', { name: 'cache-existing', exact: true })).toBeVisible();
});

test('글 직접 접속은 상세 API 재요청 없이 초기 데이터로 hydration한다', async ({ page }) => {
  const requests: string[] = [];
  await page.route(/\/api\/posts\/.*\/index\.json(?:\?.*)?$/, route => {
    requests.push(route.request().url());
    return route.abort('failed');
  });

  await page.goto('/posts/cache-existing', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'cache-existing', exact: true })).toBeVisible();
  await expect(page.locator('article')).toContainText('const answer = 42;');
  expect(requests).toEqual([]);
});

test('정적 라우팅·캐시 헤더·조건부 요청·404', async ({ request }) => {
  for (const urlPath of ['/tags', '/search', '/license']) {
    const response = await request.get(urlPath);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  }

  const response = await request.get(RECENT_PATH);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(response.headers()['cache-control']).toBe('max-age=1');
  expect(response.headers().etag).toBeTruthy();
  expect(response.headers()['last-modified']).toBeTruthy();

  const validators: Record<string, string>[] = [
    { 'If-None-Match': response.headers().etag },
    { 'If-Modified-Since': response.headers()['last-modified'] },
  ];
  for (const headers of validators) {
    const conditional = await request.get(RECENT_PATH, { headers });
    expect(conditional.status()).toBe(304);
  }

  for (const urlPath of ['/missing-test-page', '/api/missing-test.json']) {
    expect((await request.get(urlPath)).status()).toBe(404);
  }
});

test('페이지네이션의 비활성 이전·다음은 주소와 키보드 포커스를 갖지 않는다', async ({ page }) => {
  await page.route(/\/api\/recent\/[12]\.json$/, route => route.fulfill({
    json: { len: 6, data: [{ id: 'cache-existing', title: '키보드 탐색', description: '', date: '2026-11-11', keywords: '' }] },
  }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const pagination = page.getByRole('navigation', { name: 'pagination' });
  const previous = pagination.getByRole('link', { name: 'Go to previous page' });
  const next = pagination.getByRole('link', { name: 'Go to next page' });
  await expect(previous).toHaveAttribute('aria-disabled', 'true');
  await expect(previous).not.toHaveAttribute('href');
  await pagination.getByRole('link', { name: '1', exact: true }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('section a[href="/posts/cache-existing"]')).toBeFocused();

  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/?page=2');
  await expect(next).toHaveAttribute('aria-disabled', 'true');
  await expect(next).not.toHaveAttribute('href');
  await pagination.getByRole('link', { name: '2', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toBeFocused();
});

test('라이선스는 정적 본문·직접 접속·새로고침·내부 이동을 지원한다', async ({ page, request }) => {
  const staticResponse = await request.get('/license');
  expect(staticResponse.status()).toBe(200);
  expect(await staticResponse.text()).toMatch(/<h1[^>]*>Open Source Licenses<\/h1>/);

  const response = await page.goto('/license', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Open Source Licenses', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__ETAG_MAP__?.['/license'])).toEqual(expect.any(String));

  const reloaded = await page.reload({ waitUntil: 'domcontentloaded' });
  expect(reloaded?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Open Source Licenses', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'tomatoM4to', exact: true }).click();
  await expect(page.locator('section h3')).toHaveText(['cache-existing']);
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.getByRole('link', { name: 'License', exact: true }).click();
  await expect(page).toHaveURL('/license');
  await expect(page.getByRole('heading', { name: 'Open Source Licenses', exact: true })).toBeVisible();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
});
