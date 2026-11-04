import { setTimeout as delay } from 'node:timers/promises';
import { test, expect, type BrowserContext } from '@playwright/test';
import { HTTP_CACHE_TTL_MS, TTL_MARGIN_MS, POSTS_A, selectRelease } from '../support/static-site';

const SAMPLE_COUNT = 5;

async function measureVisit(context: BrowserContext) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    // DOM 표시 시점을 기록한다. Playwright가 결과를 읽는 시점의 대기 비용은 제외한다.
    const observer = new MutationObserver(() => {
      if (document.querySelector('section h3') && !performance.getEntriesByName('test:list-visible').length) {
        performance.mark('test:list-visible');
      }
      if (document.querySelector('button[aria-label^="Switch to"]') && !performance.getEntriesByName('test:ui-mounted').length) {
        performance.mark('test:ui-mounted');
      }
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section h3')).toHaveText(POSTS_A);
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  await page.waitForFunction(() => performance.getEntriesByName('first-contentful-paint').length > 0);

  const result = await page.evaluate(() => {
    const sync = performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure;
    return {
      status: String(sync.detail.status),
      syncMs: sync.duration,
      bootstrapStartMs: performance.getEntriesByName('app:cache-sync-start')[0].startTime,
      hydrationStartMs: performance.getEntriesByName('app:hydrate-start')[0].startTime,
      firstPaintMs: performance.getEntriesByName('first-contentful-paint')[0].startTime,
      uiMountedMs: performance.getEntriesByName('test:ui-mounted')[0].startTime,
      listVisibleMs: performance.getEntriesByName('test:list-visible')[0].startTime,
    };
  });
  // UI가 표시된 것뿐 아니라 실제 이벤트 처리도 가능한지 확인한다.
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  await page.close();
  return result;
}

for (const scenario of ['no-sw', 'cold-sw', 'warm-sw', 'registration-stalled'] as const) {
  test(`루트 동기화 비용 · ${scenario}`, async ({ browser, baseURL }, testInfo) => {
    await selectRelease('a');
    const samples: Awaited<ReturnType<typeof measureVisit>>[] = [];
    for (let index = 0; index < SAMPLE_COUNT; index++) {
      const context = await browser.newContext({
        baseURL,
        serviceWorkers: scenario === 'no-sw' ? 'block' : 'allow',
      });
      try {
        if (scenario === 'no-sw') {
          await context.addInitScript(() => {
            Reflect.deleteProperty(Navigator.prototype, 'serviceWorker');
          });
        } else if (scenario === 'registration-stalled') {
          // 등록 Promise가 완료되지 않는 실패 경로의 최악 대기 비용을 별도로 측정한다.
          await context.addInitScript(() => {
            navigator.serviceWorker.register = () => new Promise(() => {});
          });
        }

        if (scenario === 'warm-sw') {
          // 첫 설치와 제어된 재방문으로 캐시를 채운 뒤 HTTP TTL을 넘겨 측정한다.
          await measureVisit(context);
          await measureVisit(context);
          await delay(HTTP_CACHE_TTL_MS + TTL_MARGIN_MS);
        }
        const sample = await measureVisit(context);
        const expectedStatus = scenario === 'no-sw' ? 'skipped'
          : scenario === 'registration-stalled' ? 'bypass' : 'ready';
        expect(sample.status).toBe(expectedStatus);
        samples.push(sample);
      } finally {
        await context.close();
      }
    }

    const metrics = ['syncMs', 'firstPaintMs', 'uiMountedMs', 'listVisibleMs'] as const;
    const summary = Object.fromEntries(metrics.map(metric => {
      const values = samples.map(sample => sample[metric]).sort((a, b) => a - b);
      return [metric, { median: values[Math.floor(values.length / 2)], min: values[0], max: values.at(-1) }];
    }));
    console.log(JSON.stringify({ scenario, samples: samples.length, summary }));
    await testInfo.attach('bootstrap-performance', {
      body: Buffer.from(JSON.stringify({ scenario, summary, samples }, null, 2)),
      contentType: 'application/json',
    });
  });
}
