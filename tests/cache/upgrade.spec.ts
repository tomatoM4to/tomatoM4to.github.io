import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { test, expect, type Page, type Worker } from '@playwright/test';
import {
  POSTS_B,
  RECENT_PATH,
  readReleaseFile,
  readReleaseMap,
  readWorkerMap,
  requestCount,
  selectRelease,
} from '../support/static-site';

const legacyWorker = await readFile(new URL('../fixtures/sw-global.js', import.meta.url), 'utf8');

async function sendMap(page: Page) {
  return page.evaluate(() => new Promise<unknown>(resolve => {
    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
      channel.port1.close();
      resolve(event.data);
    };
    navigator.serviceWorker.controller!.postMessage({
      type: 'UPDATE_ETAG_MAP', payload: window.__ETAG_MAP__,
    }, [channel.port2]);
  }));
}

async function workerKind(worker: Worker) {
  return worker.evaluate('typeof ETAG_MAP_CACHE_PREFIX');
}

for (const installation of ['delayed', 'failed', 'map-timeout'] as const) {
  test(`전역 맵 워커에서 업그레이드 · 설치 ${installation}`, async ({ page, context }, testInfo) => {
    const originalA = await readReleaseFile('a', 'sw.js');
    const originalB = await readReleaseFile('b', 'sw.js');
    const workerPathA = '/srv/releases/a/sw.js';
    const workerPathB = '/srv/releases/b/sw.js';
    try {
      await selectRelease('a');
      await writeFile(workerPathA, legacyWorker);
      await page.addInitScript(() => {
        Object.assign(window, { legacyFetch: window.fetch.bind(window) });
      });
      await page.goto('/license?document=old');
      await expect(page.getByRole('button', { name: /Switch to (light|dark) mode/ })).toBeVisible();
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
      const oldWorker = context.serviceWorkers()[0];
      expect(await workerKind(oldWorker)).toBe('undefined');
      expect(await sendMap(page)).toEqual({ type: 'ETAG_MAP_READY' });
      expect(await page.evaluate(async path => {
        const { legacyFetch } = window as typeof window & { legacyFetch: typeof fetch };
        return (await legacyFetch(path)).json();
      }, RECENT_PATH)).toMatchObject({ len: 1 });
      const mapA = await readReleaseMap('a');
      await page.waitForFunction(async ({ path, version }) => (
        await caches.match(path)
      )?.headers.get('X-SW-ETag') === version, { path: RECENT_PATH, version: mapA[RECENT_PATH] });

      await writeFile(workerPathB, `${originalB}\nself.addEventListener('install', event => {
        event.waitUntil(new Promise((resolve, reject) => {
          self.finishUpgrade = success => success ? resolve() : reject(new Error('test: upgrade failed'));
        }));
      });\n`);
      await selectRelease('b');
      const nextPage = await context.newPage();
      await nextPage.addInitScript(() => {
        const state = {
          controller: navigator.serviceWorker.controller,
          changes: 0,
          replies: [] as unknown[],
          apiUrls: [] as string[],
          apiPending: false,
          releaseApi: () => {},
        };
        Object.assign(window, { upgradeEvidence: state });
        navigator.serviceWorker.addEventListener('controllerchange', () => state.changes++);
        const originalMessage = ServiceWorker.prototype.postMessage;
        ServiceWorker.prototype.postMessage = function(message, transfer) {
          if (message.type !== 'UPDATE_ETAG_MAP' || !Array.isArray(transfer)) {
            return originalMessage.call(this, message, Array.isArray(transfer) ? { transfer } : transfer);
          }
          const port = transfer[0] as MessagePort;
          const relay = new MessageChannel();
          relay.port1.onmessage = event => {
            state.replies.push(event.data);
            port.postMessage(event.data);
            relay.port1.close();
            port.close();
          };
          originalMessage.call(this, message, { transfer: [relay.port2] });
        };
        const originalFetch = window.fetch.bind(window);
        let held = false;
        window.fetch = async (input, init) => {
          const url = new URL(input instanceof Request ? input.url : input, location.href);
          if (url.pathname === '/api/recent/1.json') state.apiUrls.push(url.href);
          if (url.pathname === '/api/recent/1.json' && !held) {
            held = true;
            state.apiPending = true;
            await new Promise<void>(resolve => { state.releaseApi = resolve; });
          }
          return originalFetch(input, init);
        };
      });
      await nextPage.goto('/?document=new', { waitUntil: 'domcontentloaded' });
      await nextPage.waitForFunction(() => {
        const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { apiPending: boolean } };
        return upgradeEvidence.apiPending;
      });
      await expect.poll(async () => (await nextPage.evaluate(async () => (
        await navigator.serviceWorker.getRegistration()
      )?.installing?.state))).toBe('installing');
      const newWorker = context.serviceWorkers().find(worker => worker !== oldWorker)!;
      expect(newWorker).toBeTruthy();
      expect(await workerKind(newWorker)).toBe('string');
      await sendMap(page);
      const before = await requestCount(RECENT_PATH);
      const responsePromise = nextPage.waitForResponse(response => new URL(response.url()).pathname === RECENT_PATH
        && !response.request().serviceWorker());
      await nextPage.evaluate(() => {
        const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { releaseApi(): void } };
        upgradeEvidence.releaseApi();
      });
      const response = await responsePromise;
      const body: unknown = await response.json();
      await expect(nextPage.locator('section h3')).toHaveCount((body as { len: number }).len);
      const initial = await nextPage.evaluate(() => {
        const { upgradeEvidence } = window as typeof window & {
          upgradeEvidence: { controller: ServiceWorker; changes: number; replies: unknown[]; apiUrls: string[] };
        };
        return {
          sameController: navigator.serviceWorker.controller === upgradeEvidence.controller,
          changes: upgradeEvidence.changes,
          replies: upgradeEvidence.replies,
          apiUrls: upgradeEvidence.apiUrls,
          status: (performance.getEntriesByName('app:cache-sync')[0] as PerformanceMeasure).detail.status,
          titles: [...document.querySelectorAll('section h3')].map(element => element.textContent),
        };
      });
      const evidence = {
        browser: context.browser()!.version(), installation, initial, body, url: response.url(), headers: response.headers(),
        serverRequests: (await requestCount(RECENT_PATH)) - before,
        globalVersion: await page.evaluate(async path => (await (await caches.match('/__etag_map__'))!.json())[path], RECENT_PATH),
        cachedList: await page.evaluate(async path => {
          const response = (await caches.match(path))!;
          return { len: (await response.json()).len, version: response.headers.get('X-SW-ETag') };
        }, RECENT_PATH),
        mapA: mapA[RECENT_PATH], mapB: (await readReleaseMap('b'))[RECENT_PATH],
      };
      await testInfo.attach('upgrade-before-control-change', {
        body: Buffer.from(JSON.stringify(evidence, null, 2)), contentType: 'application/json',
      });
      expect(initial.sameController).toBe(true);
      expect(initial.changes).toBe(0);
      expect(initial.replies).toContainEqual({ type: 'ETAG_MAP_READY' });
      expect.soft(initial.status).toBe('bypass');
      expect.soft(new URL(initial.apiUrls[0]).searchParams.has('__sw_bypass')).toBe(true);
      expect(evidence.globalVersion).toBe(mapA[RECENT_PATH]);
      expect(evidence.cachedList).toEqual({ len: 1, version: mapA[RECENT_PATH] });
      expect.soft(body).toMatchObject({ len: 2 });
      expect.soft(initial.titles).toEqual(POSTS_B);
      expect.soft(evidence.serverRequests).toBeGreaterThan(0);
      expect.soft(response.headers()['x-cache-status']).not.toBe('HIT-0-RTT');

      if (installation !== 'failed') {
        await newWorker.evaluate(() => {
          const originalPut = Cache.prototype.put;
          const pending = new Promise<void>(resolve => {
            Object.assign(globalThis, { releaseMaps: resolve });
          });
          Cache.prototype.put = async function(request, response) {
            const url = new URL(request instanceof Request ? request.url : request, location.href);
            if (url.pathname.startsWith('/__etag_map__/')) {
              Object.assign(globalThis, { mapPending: true });
              await pending;
            }
            return originalPut.call(this, request, response);
          };
        });
      }
      await newWorker.evaluate(success => {
        const { finishUpgrade } = globalThis as typeof globalThis & { finishUpgrade(success: boolean): void };
        finishUpgrade(success);
      }, installation !== 'failed');
      if (installation === 'failed') {
        await nextPage.waitForFunction(async () => !(await navigator.serviceWorker.getRegistration())?.installing);
        expect(await nextPage.evaluate(() => {
          const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { controller: ServiceWorker } };
          return navigator.serviceWorker.controller === upgradeEvidence.controller;
        })).toBe(true);
        const beforeRetry = await requestCount(RECENT_PATH);
        const result = await nextPage.evaluate(async path => {
          const response = await fetch(path);
          return { body: await response.json(), status: response.headers.get('X-Cache-Status') };
        }, RECENT_PATH);
        expect.soft(result.body).toMatchObject({ len: 2 });
        expect.soft(await requestCount(RECENT_PATH)).toBeGreaterThan(beforeRetry);
      } else {
        await nextPage.waitForFunction(() => {
          const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { changes: number } };
          return upgradeEvidence.changes > 0;
        });
        await expect.poll(() => newWorker.evaluate('Boolean(self.mapPending)')).toBe(true);
        const beforePending = await requestCount(RECENT_PATH);
        const pendingResult = await nextPage.evaluate(async path => {
          const response = await fetch(path);
          return { url: response.url, body: await response.json(), status: response.headers.get('X-Cache-Status') };
        }, RECENT_PATH);
        expect(pendingResult.body).toMatchObject({ len: 2 });
        expect(new URL(pendingResult.url).searchParams.has('__sw_bypass')).toBe(false);
        const pendingServerRequests = (await requestCount(RECENT_PATH)) - beforePending;
        expect(pendingServerRequests).toBeGreaterThan(0);
        expect(await nextPage.evaluate(() => {
          const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { apiUrls: string[] } };
          return new URL(upgradeEvidence.apiUrls.at(-1)!).searchParams.has('__sw_bypass');
        })).toBe(true);
        if (installation === 'map-timeout') {
          await delay(2_100);
        }
        await newWorker.evaluate('self.releaseMaps()');
        await expect.poll(async () => (await readWorkerMap(nextPage))[RECENT_PATH]).toBe((await readReleaseMap('b'))[RECENT_PATH]);
        await expect.poll(() => nextPage.evaluate(() => {
          const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { replies: unknown[] } };
          return upgradeEvidence.replies;
        })).toContainEqual({ type: 'ETAG_MAP_READY', protocolVersion: 1 });
        if (installation === 'map-timeout') {
          const beforeLateAck = await requestCount(RECENT_PATH);
          const lateResult = await nextPage.evaluate(async path => (await fetch(path)).json(), RECENT_PATH);
          expect(lateResult).toMatchObject({ len: 2 });
          expect(await requestCount(RECENT_PATH)).toBeGreaterThan(beforeLateAck);
          expect(await nextPage.evaluate(() => {
            const { upgradeEvidence } = window as typeof window & { upgradeEvidence: { apiUrls: string[] } };
            return new URL(upgradeEvidence.apiUrls.at(-1)!).searchParams.has('__sw_bypass');
          })).toBe(true);
          await testInfo.attach('upgrade-map-timeout', {
            body: Buffer.from(JSON.stringify({ pendingResult, pendingServerRequests, lateResult })), contentType: 'application/json',
          });
          return;
        }
        await sendMap(page);
        expect((await readWorkerMap(page))[RECENT_PATH]).toBe(mapA[RECENT_PATH]);
        const result = await nextPage.evaluate(async path => (await fetch(path)).json(), RECENT_PATH);
        expect(result).toMatchObject({ len: 2 });
        const mapB = await readReleaseMap('b');
        await nextPage.waitForFunction(async ({ path, version }) => (
          await caches.match(path)
        )?.headers.get('X-SW-ETag') === version, { path: RECENT_PATH, version: mapB[RECENT_PATH] });
        const session = await context.newCDPSession(nextPage);
        const running = new Promise<string>(resolve => {
          session.on('ServiceWorker.workerVersionUpdated', ({ versions }) => {
            const version = versions.find(version => version.status === 'activated' && version.runningStatus === 'running');
            if (version) resolve(version.versionId);
          });
        });
        await session.send('ServiceWorker.enable');
        const versionId = await running;
        const stopped = new Promise<void>(resolve => {
          session.on('ServiceWorker.workerVersionUpdated', ({ versions }) => {
            if (versions.some(version => version.versionId === versionId && version.runningStatus === 'stopped')) resolve();
          });
        });
        await session.send('ServiceWorker.stopWorker', { versionId });
        await stopped;
        await session.detach();
        const beforeRestart = await requestCount(RECENT_PATH);
        const restarted = await nextPage.evaluate(async path => {
          const response = await fetch(path);
          return { body: await response.json(), status: response.headers.get('X-Cache-Status') };
        }, RECENT_PATH);
        expect(restarted).toMatchObject({ body: { len: 2 }, status: 'HIT-0-RTT' });
        const restartServerRequests = (await requestCount(RECENT_PATH)) - beforeRestart;
        expect(restartServerRequests).toBe(0);
        await testInfo.attach('upgrade-after-control-change', {
          body: Buffer.from(JSON.stringify({ pendingResult, pendingServerRequests, restarted, restartServerRequests }, null, 2)), contentType: 'application/json',
        });
      }
    } finally {
      await writeFile(workerPathA, originalA);
      await writeFile(workerPathB, originalB);
    }
  });
}
