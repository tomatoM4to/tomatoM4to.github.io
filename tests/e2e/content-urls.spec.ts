import { test, expect } from '@playwright/test';
import { selectRelease } from '../support/static-site';

test.beforeEach(async () => {
  await selectRelease('a');
});

test('태그 링크·직접 접속·새로고침이 특수문자를 보존해 정적 JSON을 요청한다', async ({ page }) => {
  await page.goto('/tags', { waitUntil: 'domcontentloaded' });
  for (const tag of ['C++', 'C#', 'R&D', '한글 태그', '100%', 'all-tags', '__proto__', '$&', '$$', '$`', "$'"]) {
    const link = page.getByRole('link', { name: `${tag} (1)`, exact: true });
    const href = await link.getAttribute('href');
    expect(new URL(href!, 'http://localhost').searchParams.get('tag')).toBe(tag);
    const response = page.waitForResponse(response => new URL(response.url()).pathname === `/api/tags/${encodeURIComponent(tag)}.json`);
    await link.click();
    expect((await response).status()).toBe(200);
    await expect(page.locator('h3')).toHaveText(['cache-existing']);
    expect(new URL(page.url()).searchParams.get('tag')).toBe(tag);
    const reloaded = await page.reload({ waitUntil: 'domcontentloaded' });
    expect(reloaded?.status()).toBe(200);
    await expect(page.locator('h3')).toHaveText(['cache-existing']);
  }
});

test('글 링크와 상세 API·canonical은 원래 ID를 한 번 인코딩한다', async ({ page }) => {
  const ids = ['한글 글 (1), async&await', 'C# & C++', 'space%20post', 'literal%2Fpost'];
  const paths = ['%ED%95%9C%EA%B8%80%20%EA%B8%80%20(1),%20async&await', 'C%23%20&%20C++', 'space%2520post', 'literal%252Fpost'];
  const posts = ids.map(id => ({ id, title: id, description: '경로 확인', date: '2026-11-11', keywords: 'Test', image: '' }));
  await page.route(url => url.pathname === '/api/recent/1.json', route => route.fulfill({ json: { len: posts.length, data: posts } }));
  await page.route(url => url.pathname.startsWith('/api/posts/'), route => {
    const pathname = new URL(route.request().url()).pathname;
    const post = posts.find(post => pathname === `/api/posts/${encodeURIComponent(post.id)}/index.json`);
    return route.fulfill({ status: post ? 200 : 404, json: post ? { data: post, content: `본문 ${post.id}` } : {} });
  });
  for (const post of posts) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const link = page.getByRole('link').filter({ has: page.getByRole('heading', { name: post.id, exact: true }) });
    const postPath = `/posts/${paths[ids.indexOf(post.id)]}`;
    await expect(link).toHaveAttribute('href', postPath);
    await link.click();
    await expect(page.locator('article')).toHaveText(`본문 ${post.id}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://tomatom4to.github.io${postPath}`);
    expect(decodeURIComponent(new URL(page.url()).pathname.slice('/posts/'.length))).toBe(post.id);
    const iframe = page.locator('giscus-widget iframe');
    await expect(iframe).toHaveAttribute('src', /\/widget\?/);
    expect(new URL((await iframe.getAttribute('src'))!).searchParams.get('term')).toBe(postPath.slice(1));
  }
});
