import { test, expect, type Page, type Route } from '@playwright/test';
import { POSTS_PER_PAGE, SITE_NAME } from '../../shared/common';
import { selectRelease } from '../support/static-site';

const posts = Array.from({ length: POSTS_PER_PAGE * 3 }, (_, index) => ({
  id: `request-post-${index + 1}`,
  title: `request-post-${index + 1}`,
  description: `요약 ${index + 1}`,
  date: '2026-11-09',
  keywords: 'Cache, Test',
  image: '',
}));

async function settleUI(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

async function mockRecentPages(page: Page, items = posts) {
  await page.route(/\/api\/recent\/\d+\.json(?:\?.*)?$/, route => {
    const index = Number(new URL(route.request().url()).pathname.match(/(\d+)\.json$/)?.[1]);
    return route.fulfill({
      json: { len: items.length, data: items.slice((index - 1) * POSTS_PER_PAGE, index * POSTS_PER_PAGE) },
    });
  });
}

async function holdResponse(page: Page, pathname: string, response: { json: unknown } | { error: 'failed' }) {
  let unblock!: () => void;
  let notify!: (route: Route) => void;
  const gate = new Promise<void>(resolve => { unblock = resolve; });
  const requested = new Promise<Route>(resolve => { notify = resolve; });

  await page.route(url => url.pathname === pathname, async route => {
    notify(route);
    await gate;
    if (route.request().failure()) {
      return;
    }
    if ('error' in response) {
      await route.abort(response.error);
      return;
    }
    await route.fulfill({ json: response.json });
  });

  return {
    requested,
    async release() {
      unblock();
      const route = await requested;
      const response = await route.request().response();
      await response?.finished();
      await settleUI(page);
    },
  };
}

test.beforeEach(async () => {
  await selectRelease('a');
});

test('홈에서 늦게 도착한 이전 페이지 응답이 현재 목록을 덮지 않는다', async ({ page }) => {
  await mockRecentPages(page);
  const previous = await holdResponse(page, '/api/recent/2.json', {
    json: { len: posts.length, data: posts.slice(POSTS_PER_PAGE, POSTS_PER_PAGE * 2) },
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

test('홈에서 이전 응답의 JSON 반환이 지연되어도 현재 목록을 덮지 않는다', async ({ page }) => {
  await mockRecentPages(page);
  await page.addInitScript(() => {
    const readJSON = Response.prototype.json;
    Response.prototype.json = async function (this: Response) {
      const result: unknown = await readJSON.call(this);
      if (this.url && new URL(this.url).pathname === '/api/recent/2.json') {
        document.documentElement.dataset.testJsonPending = 'true';
        await new Promise<void>(resolve => {
          window.addEventListener('test:release-json', () => resolve(), { once: true });
        });
      }
      return result;
    };
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section h3')).toHaveText(posts.slice(0, POSTS_PER_PAGE).map(post => post.title));
  await page.getByRole('link', { name: '2', exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.testJsonPending === 'true');
  const currentTitles = posts.slice(POSTS_PER_PAGE * 2).map(post => post.title);
  try {
    await page.getByRole('link', { name: '3', exact: true }).click();
    await expect(page.locator('section h3')).toHaveText(currentTitles);
  } finally {
    await page.evaluate(() => window.dispatchEvent(new Event('test:release-json')));
    await settleUI(page);
  }

  await expect(page).toHaveURL(/page=3$/);
  await expect(page.locator('section h3')).toHaveText(currentTitles);
});

test('태그 변경 후 이전 태그 응답이 현재 목록을 덮지 않는다', async ({ page }) => {
  await page.route(url => url.pathname === '/api/tags/Test.json', route => route.fulfill({ json: { len: 1, data: [posts[1]] } }));
  const previous = await holdResponse(page, '/api/tags/Cache.json', { json: { len: 1, data: [posts[0]] } });

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

test('이전 태그 요청의 실패가 현재 요청의 로딩 표시를 끝내지 않는다', async ({ page }) => {
  const previous = await holdResponse(page, '/api/tags/Cache.json', { error: 'failed' });
  const current = await holdResponse(page, '/api/tags/Test.json', { json: { len: 1, data: [posts[1]] } });

  await page.goto('/tags', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  await page.getByRole('link', { name: /^Cache \(/ }).click();
  await previous.requested;
  await page.getByRole('link', { name: /^Test \(/ }).click();
  await current.requested;
  const placeholders = page.locator('[data-slot="skeleton"]');
  try {
    await expect(placeholders).not.toHaveCount(0);
    const placeholderCount = await placeholders.count();
    await previous.release();
    await expect.soft(placeholders).toHaveCount(placeholderCount);
  } finally {
    await current.release();
  }

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
  const previous = await holdResponse(page, `/api/posts/${posts[1].id}/index.json`, { json: postJSON(posts[1]) });
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

test('글을 떠난 뒤 이전 응답이 다른 화면의 메타데이터를 덮지 않는다', async ({ page }) => {
  await mockRecentPages(page, posts.slice(0, 1));
  const previous = await holdResponse(page, `/api/posts/${posts[0].id}/index.json`, {
    json: { data: posts[0], content: `본문 ${posts[0].id}` },
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(`a[href="/posts/${posts[0].id}"]`).click();
  await previous.requested;
  try {
    await page.getByRole('link', { name: 'tomatoM4to', exact: true }).click();
    await expect(page.locator('section h3')).toHaveText([posts[0].title]);
    await expect(page).toHaveTitle(SITE_NAME);
  } finally {
    await previous.release();
  }

  await expect(page).toHaveURL('/');
  await expect.soft(page).toHaveTitle(SITE_NAME);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).not.toBeNull();
  expect(new URL(canonical!).pathname).toBe('/');
});

test('검색 JSON이 모두 준비되면 후속 페이지의 글도 검색된다', async ({ page }) => {
  const searchPosts = posts.slice(0, POSTS_PER_PAGE + 1);
  await mockRecentPages(page, searchPosts);

  await page.goto('/search', { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('포스트 제목, 요약으로 검색...').fill(searchPosts[POSTS_PER_PAGE].title);
  await expect(page.locator('h3')).toHaveText([searchPosts[POSTS_PER_PAGE].title]);
});

for (const failure of ['http', 'network', 'json'] as const) {
  test(`검색 JSON 일부가 ${failure} 오류로 실패하면 불완전한 로딩을 알린다`, async ({ page }) => {
    await page.route(url => url.pathname === '/api/recent/1.json', route => route.fulfill({
      json: { len: POSTS_PER_PAGE + 1, data: posts.slice(0, POSTS_PER_PAGE) },
    }));
    await page.route(url => url.pathname === '/api/recent/2.json', route => {
      if (failure === 'network') {
        return route.abort('failed');
      }
      if (failure === 'json') {
        return route.fulfill({ contentType: 'application/json', body: '{"len":' });
      }
      return route.fulfill({ status: 503, json: { message: 'test: unavailable' } });
    });
    const failed = failure === 'network'
      ? page.waitForEvent('requestfailed', request => new URL(request.url()).pathname === '/api/recent/2.json')
      : page.waitForResponse(response => new URL(response.url()).pathname === '/api/recent/2.json'
        && response.status() === (failure === 'http' ? 503 : 200));

    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await failed;
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/실패|오류|불러오|일부/);
    await expect(page.getByPlaceholder('포스트 제목, 요약으로 검색...')).toBeDisabled();
    await expect(page.locator('h3')).toHaveCount(0);
  });
}
