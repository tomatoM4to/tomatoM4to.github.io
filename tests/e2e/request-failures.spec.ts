import { test, expect, type Page, type Route } from '@playwright/test';
import { POSTS_PER_PAGE } from '../../shared/common';
import { selectRelease } from '../support/static-site';

const posts = Array.from({ length: POSTS_PER_PAGE * 3 }, (_, index) => ({
  id: `request-post-${index + 1}`,
  title: `request-post-${index + 1}`,
  description: `요약 ${index + 1}`,
  date: '2026-11-09',
  keywords: 'Cache, Test',
  image: '',
}));

async function holdJSON(page: Page, pathname: string, json: unknown) {
  let unblock!: () => void;
  let notify!: (route: Route) => void;
  const gate = new Promise<void>(resolve => { unblock = resolve; });
  const requested = new Promise<Route>(resolve => { notify = resolve; });

  await page.route(url => url.pathname === pathname, async route => {
    notify(route);
    await gate;
    if (!route.request().failure()) {
      await route.fulfill({ json });
    }
  });

  return {
    requested,
    async release() {
      unblock();
      const route = await requested;
      const response = await route.request().response();
      await response?.finished();
      await page.evaluate(() => new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }));
    },
  };
}

test.beforeEach(async () => {
  await selectRelease('a');
});

test('홈에서 늦게 도착한 이전 페이지 응답이 현재 목록을 덮지 않는다', async ({ page }) => {
  await page.route(/\/api\/recent\/\d+\.json(?:\?.*)?$/, route => {
    const index = Number(new URL(route.request().url()).pathname.match(/(\d+)\.json$/)?.[1]);
    return route.fulfill({
      json: { len: posts.length, data: posts.slice((index - 1) * POSTS_PER_PAGE, index * POSTS_PER_PAGE) },
    });
  });
  const previous = await holdJSON(page, '/api/recent/2.json', {
    len: posts.length,
    data: posts.slice(POSTS_PER_PAGE, POSTS_PER_PAGE * 2),
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section h3')).toHaveText(posts.slice(0, POSTS_PER_PAGE).map(post => post.title));
  await page.getByRole('link', { name: '2', exact: true }).click();
  await previous.requested;
  const currentTitles = posts.slice(POSTS_PER_PAGE * 2).map(post => post.title);
  try {
    await page.getByRole('link', { name: '3', exact: true }).click();
    await expect(page.locator('section h3')).toHaveText(currentTitles);
  } finally {
    await previous.release();
  }

  await expect(page).toHaveURL(/page=3$/);
  await expect(page.locator('section h3')).toHaveText(currentTitles);
});

test('태그 변경 후 이전 태그 응답이 현재 목록을 덮지 않는다', async ({ page }) => {
  await page.route(url => url.pathname === '/api/tags/Test.json', route => route.fulfill({ json: { len: 1, data: [posts[1]] } }));
  const previous = await holdJSON(page, '/api/tags/Cache.json', { len: 1, data: [posts[0]] });

  await page.goto('/tags', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  await page.getByRole('link', { name: /^Cache \(/ }).click();
  await previous.requested;
  try {
    await page.getByRole('link', { name: /^Test \(/ }).click();
    await expect(page.locator('h3')).toHaveText([posts[1].title]);
  } finally {
    await previous.release();
  }

  await expect(page).toHaveURL(/tag=Test$/);
  await expect(page.locator('h3')).toHaveText([posts[1].title]);
});

test('글 변경 후 이전 응답이 현재 본문과 메타데이터를 덮지 않는다', async ({ page }) => {
  const postJSON = (post: typeof posts[number]) => ({ data: post, content: `본문 ${post.id}` });
  await page.route(url => url.pathname === '/api/recent/1.json', route => route.fulfill({ json: { len: 1, data: [posts[0]] } }));
  await page.route(/\/api\/posts\/[^/]+\/index\.json(?:\?.*)?$/, route => {
    const post = posts.find(item => route.request().url().includes(`/posts/${item.id}/`));
    if (!post) {
      return route.abort();
    }
    return route.fulfill({ json: postJSON(post) });
  });
  const previous = await holdJSON(page, `/api/posts/${posts[1].id}/index.json`, postJSON(posts[1]));
  const navigate = (post: typeof posts[number]) => page.evaluate(pathname => {
    history.pushState({}, '', pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, `/posts/${post.id}`);

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(`a[href="/posts/${posts[0].id}"]`).click();
  await expect(page.locator('header h1')).toHaveText(posts[0].title);
  await navigate(posts[1]);
  await previous.requested;
  try {
    await navigate(posts[2]);
    await expect(page.locator('header h1')).toHaveText(posts[2].title);
  } finally {
    await previous.release();
  }

  await expect(page).toHaveURL(`/posts/${posts[2].id}`);
  await expect.soft(page.locator('header h1')).toHaveText(posts[2].title);
  await expect.soft(page.locator('article')).toHaveText(`본문 ${posts[2].id}`);
  await expect.soft(page).toHaveTitle(posts[2].title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/posts/${posts[2].id}$`));
});

test('검색 JSON이 모두 준비되면 후속 페이지의 글도 검색된다', async ({ page }) => {
  const searchPosts = posts.slice(0, POSTS_PER_PAGE + 1);
  await page.route(/\/api\/recent\/\d+\.json(?:\?.*)?$/, route => {
    const index = Number(new URL(route.request().url()).pathname.match(/(\d+)\.json$/)?.[1]);
    return route.fulfill({
      json: { len: searchPosts.length, data: searchPosts.slice((index - 1) * POSTS_PER_PAGE, index * POSTS_PER_PAGE) },
    });
  });

  await page.goto('/search', { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('포스트 제목, 요약으로 검색...').fill(searchPosts[POSTS_PER_PAGE].title);
  await expect(page.locator('h3')).toHaveText([searchPosts[POSTS_PER_PAGE].title]);
});

for (const failure of ['http', 'network'] as const) {
  test(`검색 JSON 일부가 ${failure} 오류로 실패하면 불완전한 로딩을 알린다`, async ({ page }) => {
    await page.route(url => url.pathname === '/api/recent/1.json', route => route.fulfill({
      json: { len: POSTS_PER_PAGE + 1, data: posts.slice(0, POSTS_PER_PAGE) },
    }));
    await page.route(url => url.pathname === '/api/recent/2.json', route => failure === 'http'
      ? route.fulfill({ status: 503, json: { message: 'test: unavailable' } })
      : route.abort('failed'));
    const failed = failure === 'http'
      ? page.waitForResponse(response => new URL(response.url()).pathname === '/api/recent/2.json' && response.status() === 503)
      : page.waitForEvent('requestfailed', request => new URL(request.url()).pathname === '/api/recent/2.json');

    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await failed;
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/실패|오류|불러오|일부/);
  });
}
