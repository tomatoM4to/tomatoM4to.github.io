import { test, expect, type Page, type Route } from '@playwright/test';
import { POSTS_PER_PAGE, SITE_NAME } from '../../shared/common';
import { selectRelease } from '../support/static-site';

const POST_REQUEST_TIMEOUT_MS = 10_000;
const LIST_REQUEST_TIMEOUT_MS = 10_000;

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

for (const screen of ['홈', '태그'] as const) {
  const isHome = screen === '홈';
  const pathname = isHome ? '/api/recent/2.json' : '/api/tags/Test.json';
  const nextPathname = isHome ? '/api/recent/3.json' : '/api/tags/Cache.json';
  const currentPosts = isHome ? posts.slice(POSTS_PER_PAGE, POSTS_PER_PAGE * 2) : [posts[1]];
  const result = { len: isHome ? posts.length : 1, data: currentPosts };

  async function openList(page: Page) {
    if (isHome) {
      await mockRecentPages(page);
    } else {
      await page.route(url => url.pathname === '/api/tags/Cache.json', route => route.fulfill({ json: { len: 1, data: [posts[0]] } }));
    }
    await page.goto(isHome ? '/' : '/tags', { waitUntil: 'domcontentloaded' });
    if (!isHome) {
      await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
      await page.getByRole('link', { name: /^Cache \(/ }).click();
    }
    await expect(page.locator('h3')).toHaveText((isHome ? posts.slice(0, POSTS_PER_PAGE) : [posts[0]]).map(post => post.title));
  }

  async function selectCurrentList(page: Page) {
    await page.getByRole('link', { name: isHome ? '2' : /^Test \(/, exact: isHome }).click();
  }

  for (const failure of ['http', 'network', 'json'] as const) {
    test(`${screen}의 현재 목록이 ${failure} 오류로 실패하면 이전 목록을 숨기고 같은 요청을 재시도한다`, async ({ page }) => {
      await openList(page);
      let attempts = 0;
      await page.route(url => url.pathname === pathname, route => {
        if (++attempts > 1) return route.fulfill({ json: result });
        if (failure === 'network') return route.abort('failed');
        if (failure === 'json') return route.fulfill({ contentType: 'application/json', body: '{"len":' });
        return route.fulfill({ status: 503, json: {} });
      });
      await selectCurrentList(page);
      await expect(page.getByRole('alert')).toContainText('글 목록을 불러오지 못했습니다.');
      await expect(page.locator('h3')).toHaveCount(0);
      await page.getByRole('button', { name: '다시 시도', exact: true }).click();
      await expect(page.locator('h3')).toHaveText(currentPosts.map(post => post.title));
      await expect(page.getByRole('alert')).toHaveCount(0);
      expect(new URL(page.url()).searchParams.get(isHome ? 'page' : 'tag')).toBe(isHome ? '2' : 'Test');
      expect(attempts).toBe(2);
    });
  }

  test(`${screen}의 빈 목록 성공 응답은 요청 실패로 표시하지 않는다`, async ({ page }) => {
    await openList(page);
    await page.route(url => url.pathname === pathname, route => route.fulfill({ json: { len: 0, data: [] } }));
    const responded = page.waitForResponse(response => new URL(response.url()).pathname === pathname);
    await selectCurrentList(page);
    await responded;
    await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
    await expect(page.locator('h3')).toHaveCount(0);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test(`${screen} 목록 응답이 지연되면 시간 초과를 안내하고 재시도로 복구한다`, async ({ page }) => {
    await page.clock.install();
    await openList(page);
    const pending = await holdResponse(page, pathname, { json: result });
    await selectCurrentList(page);
    await pending.requested;
    try {
      await expect(page.locator('h3')).toHaveCount(0);
      await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS);
      await expect(page.getByRole('alert')).toContainText('글 목록을 불러오는 시간이 초과되었습니다.');
      await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
    } finally {
      await pending.release();
    }
    await page.getByRole('button', { name: '다시 시도', exact: true }).click();
    await expect(page.locator('h3')).toHaveText(currentPosts.map(post => post.title));
    await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test(`${screen} 목록 JSON 결과가 늦게 반환돼도 시간 초과 뒤 재시도 결과를 덮지 않는다`, async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(pathname => {
      const readJSON = Response.prototype.json;
      let delayed = false;
      Response.prototype.json = async function (this: Response) {
        const result: unknown = await readJSON.call(this);
        if (!delayed && this.url && new URL(this.url).pathname === pathname) {
          delayed = true;
          document.documentElement.dataset.testJsonPending = 'true';
          await new Promise<void>(resolve => {
            window.addEventListener('test:release-json', () => resolve(), { once: true });
          });
        }
        return result;
      };
    }, pathname);
    await openList(page);
    let attempts = 0;
    await page.route(url => url.pathname === pathname, route => route.fulfill({
      json: ++attempts === 1 ? { len: 1, data: [posts[0]] } : result,
    }));
    await selectCurrentList(page);
    await page.waitForFunction(() => document.documentElement.dataset.testJsonPending === 'true');
    try {
      await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS);
      await expect(page.getByRole('alert')).toContainText('글 목록을 불러오는 시간이 초과되었습니다.');
      await page.getByRole('button', { name: '다시 시도', exact: true }).click();
      await expect(page.locator('h3')).toHaveText(currentPosts.map(post => post.title));
    } finally {
      await page.evaluate(() => window.dispatchEvent(new Event('test:release-json')));
      await settleUI(page);
    }
    await expect(page.locator('h3')).toHaveText(currentPosts.map(post => post.title));
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test(`${screen} 목록 변경 후 이전 타이머가 현재 요청을 시간 초과로 바꾸지 않는다`, async ({ page }) => {
    await page.clock.install();
    await openList(page);
    const previous = await holdResponse(page, pathname, { error: 'failed' });
    const nextPosts = isHome ? posts.slice(POSTS_PER_PAGE * 2) : [posts[2]];
    const current = await holdResponse(page, nextPathname, { json: { len: isHome ? posts.length : 1, data: nextPosts } });
    await selectCurrentList(page);
    await previous.requested;
    try {
      await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS / 2);
      await page.getByRole('link', { name: isHome ? '3' : /^Cache \(/, exact: isHome }).click();
      await current.requested;
      await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS / 2);
      await previous.release();
      await expect(page.getByRole('alert')).toHaveCount(0);
      await expect(page.locator('h3')).toHaveCount(0);
      await expect(page.locator('[data-slot="skeleton"]')).not.toHaveCount(0);
    } finally {
      await previous.release();
      await current.release();
    }
    await expect(page.locator('h3')).toHaveText(nextPosts.map(post => post.title));
    await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}

test('홈 첫 목록 요청 실패도 빈 목록과 구분하고 재시도로 복구한다', async ({ page }) => {
  let attempts = 0;
  await page.route(url => url.pathname === '/api/recent/1.json', route => ++attempts === 1
    ? route.fulfill({ status: 503, json: {} })
    : route.fulfill({ json: { len: 1, data: [posts[0]] } }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('alert')).toContainText('글 목록을 불러오지 못했습니다.');
  await expect(page.locator('h3')).toHaveCount(0);
  await page.getByRole('button', { name: '다시 시도', exact: true }).click();
  await expect(page.locator('h3')).toHaveText([posts[0].title]);
  await expect(page.getByRole('alert')).toHaveCount(0);
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

for (const failure of ['http', 'network', 'json'] as const) {
  test(`글 상세 JSON이 ${failure} 오류로 실패하면 안내 후 재시도할 수 있다`, async ({ page }) => {
    await mockRecentPages(page, posts.slice(0, 1));
    let attempts = 0;
    await page.route(url => url.pathname === `/api/posts/${posts[0].id}/index.json`, route => {
      attempts++;
      if (attempts > 1) {
        return route.fulfill({ json: { data: posts[0], content: '재시도한 본문' } });
      }
      if (failure === 'network') return route.abort('failed');
      if (failure === 'json') {
        return route.fulfill({ contentType: 'application/json', body: '{"content":' });
      }
      return route.fulfill({ status: 503 });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator(`a[href="/posts/${posts[0].id}"]`).click();
    await expect(page.getByRole('alert')).toContainText('글을 불러오지 못했습니다.');
    await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
    await page.getByRole('button', { name: '다시 시도', exact: true }).click();
    await expect(page.locator('header h1')).toHaveText(posts[0].title);
    await expect(page.locator('article')).toHaveText('재시도한 본문');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page).toHaveTitle(posts[0].title);
    expect(attempts).toBe(2);
  });
}

test('글 상세 응답이 지연되면 시간 초과를 안내하고 재시도할 수 있다', async ({ page }) => {
  await page.clock.install();
  await mockRecentPages(page, posts.slice(0, 1));
  const pending = await holdResponse(page, `/api/posts/${posts[0].id}/index.json`, {
    json: { data: posts[0], content: '재시도한 본문' },
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(`a[href="/posts/${posts[0].id}"]`).click();
  await pending.requested;
  try {
    await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS);
    await expect(page.getByRole('alert')).toContainText('글을 불러오는 시간이 초과되었습니다.');
    await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
  } finally {
    await pending.release();
  }

  await page.getByRole('button', { name: '다시 시도', exact: true }).click();
  await expect(page.locator('article')).toHaveText('재시도한 본문');
  await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('header h1')).toHaveText(posts[0].title);
});

test('글 JSON 결과 전달이 지연돼도 시간 초과 이후 재시도한 본문을 덮지 않는다', async ({ page }) => {
  await page.clock.install();
  await mockRecentPages(page, posts.slice(0, 1));
  await page.addInitScript(() => {
    const readJSON = Response.prototype.json;
    let delayed = false;
    Response.prototype.json = async function (this: Response) {
      const result: unknown = await readJSON.call(this);
      if (!delayed && this.url && new URL(this.url).pathname.startsWith('/api/posts/')) {
        delayed = true;
        document.documentElement.dataset.testJsonPending = 'true';
        await new Promise<void>(resolve => {
          window.addEventListener('test:release-json', () => resolve(), { once: true });
        });
      }
      return result;
    };
  });
  let attempts = 0;
  await page.route(url => url.pathname === `/api/posts/${posts[0].id}/index.json`, route => {
    attempts++;
    return route.fulfill({ json: {
      data: { ...posts[0], title: attempts === 1 ? '지연된 제목' : posts[0].title },
      content: attempts === 1 ? '지연된 본문' : '재시도한 본문',
    } });
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(`a[href="/posts/${posts[0].id}"]`).click();
  await page.waitForFunction(() => document.documentElement.dataset.testJsonPending === 'true');
  try {
    await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS);
    await expect(page.getByRole('alert')).toContainText('글을 불러오는 시간이 초과되었습니다.');
    await page.getByRole('button', { name: '다시 시도', exact: true }).click();
    await expect(page.locator('article')).toHaveText('재시도한 본문');
  } finally {
    await page.evaluate(() => window.dispatchEvent(new Event('test:release-json')));
    await settleUI(page);
  }

  await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('article')).toHaveText('재시도한 본문');
  await expect(page).toHaveTitle(posts[0].title);
});

test('글 이동 후 이전 타이머가 현재 요청을 시간 초과로 바꾸지 않는다', async ({ page }) => {
  await page.clock.install();
  await mockRecentPages(page, posts.slice(0, 1));
  const previous = await holdResponse(page, `/api/posts/${posts[0].id}/index.json`, {
    json: { data: posts[0], content: '이전 본문' },
  });
  const current = await holdResponse(page, `/api/posts/${posts[1].id}/index.json`, {
    json: { data: posts[1], content: '현재 본문' },
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(`a[href="/posts/${posts[0].id}"]`).click();
  await previous.requested;
  try {
    await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS / 2);
    await page.evaluate(pathname => {
      history.pushState({}, '', pathname);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, `/posts/${posts[1].id}`);
    await current.requested;
    await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS / 2);
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page.locator('[data-slot="skeleton"]')).not.toHaveCount(0);
  } finally {
    await previous.release();
    await current.release();
  }

  await expect(page.locator('article')).toHaveText('현재 본문');
  await page.clock.fastForward(POST_REQUEST_TIMEOUT_MS);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page).toHaveTitle(posts[1].title);
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

for (const delayedPage of [1, 2]) {
  test(`검색 ${delayedPage}번째 목록이 응답하지 않아도 무한 로딩하지 않는다`, async ({ page }) => {
    await page.clock.install();
    await mockRecentPages(page);
    const pending = await holdResponse(page, `/api/recent/${delayedPage}.json`, {
      json: { len: posts.length, data: posts.slice((delayedPage - 1) * POSTS_PER_PAGE, delayedPage * POSTS_PER_PAGE) },
    });
    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await pending.requested;
    try {
      await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS);
      await expect(page.getByRole('alert')).toContainText('검색 자료를 불러오지 못했습니다.');
      await expect(page.getByPlaceholder('포스트 제목, 요약으로 검색...')).toBeDisabled();
      await expect(page.getByText('데이터 로딩 중...', { exact: true })).toHaveCount(0);
    } finally {
      await pending.release();
    }
    await expect(page.getByPlaceholder('포스트 제목, 요약으로 검색...')).toBeDisabled();
    await expect(page.getByRole('alert')).toBeVisible();
  });
}

test('빈 제목의 글도 ID를 제목으로 표시하고 본문 로딩을 완료한다', async ({ page }) => {
  const post = { ...posts[0], title: '' };
  await mockRecentPages(page, [post]);
  await page.route(url => url.pathname === `/api/posts/${post.id}/index.json`, route => (
    route.fulfill({ json: { data: post, content: '빈 제목의 본문' } })
  ));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link').filter({ has: page.getByRole('heading', { name: post.id, exact: true }) }).click();
  await expect(page.locator('header h1')).toHaveText(post.id);
  await expect(page.locator('article')).toHaveText('빈 제목의 본문');
  await expect(page).toHaveTitle(post.id);
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
});

test('검색 JSON 결과 전달이 늦어도 시간 초과 이후 검색을 활성화하지 않는다', async ({ page }) => {
  await page.clock.install();
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
  await page.goto('/search', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.testJsonPending === 'true');
  try {
    await page.clock.fastForward(LIST_REQUEST_TIMEOUT_MS);
    await expect(page.getByRole('alert')).toBeVisible();
  } finally {
    await page.evaluate(() => window.dispatchEvent(new Event('test:release-json')));
    await settleUI(page);
  }
  await expect(page.getByPlaceholder('포스트 제목, 요약으로 검색...')).toBeDisabled();
  await expect(page.getByRole('alert')).toBeVisible();
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
