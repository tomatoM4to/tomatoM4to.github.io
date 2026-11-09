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
  for (const urlPath of ['/tags', '/search']) {
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
