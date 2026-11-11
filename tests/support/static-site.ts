import { readFile, rename, symlink } from 'node:fs/promises';
import path from 'node:path';
import type { Page } from '@playwright/test';

const SITE_ROOT = '/srv';
export const RECENT_PATH = '/api/recent/1.json';
export const ASSET_PATH = '/cache-probe.svg';
export const POSTS_A = ['cache-existing'];
export const POSTS_B = ['cache-new', 'cache-existing'];
export const HTTP_CACHE_TTL_MS = 1_000;
export const TTL_MARGIN_MS = 200;

export type Release = 'a' | 'b';

export async function readWorkerMap(page: Page): Promise<Record<string, string>> {
  const workerURL = new URL('/sw.js', page.url()).href;
  const worker = page.context().serviceWorkers().find(worker => worker.url() === workerURL);
  if (!worker) return {};

  return worker.evaluate(async url => {
    const { clients } = globalThis as typeof globalThis & {
      clients: { matchAll(): Promise<{ id: string; url: string }[]> };
    };
    const client = (await clients.matchAll()).find(client => client.url === url);
    if (!client) return {};

    const response = await caches.match(`/__etag_map__/${client.id}`);
    return response ? response.json() : {};
  }, page.url());
}

export async function selectRelease(release: Release) {
  const nextLink = path.join(SITE_ROOT, 'site-next');
  await symlink(`releases/${release}`, nextLink);
  // 완성된 배포 디렉터리만 교체하고 origin과 브라우저 캐시는 유지한다.
  await rename(nextLink, path.join(SITE_ROOT, 'site'));
}

export async function readReleaseFile(release: Release, file: string) {
  return readFile(path.join(SITE_ROOT, 'releases', release, file), 'utf8');
}

export async function readReleaseMap(release: Release): Promise<Record<string, string>> {
  const html = await readReleaseFile(release, 'index.html');
  const match = html.match(/window\.__ETAG_MAP__ = (\{.*?\});<\/script>/);
  if (!match) {
    throw new Error(`배포 ${release}에 버전 맵이 없습니다.`);
  }

  const value: unknown = JSON.parse(match[1]);
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || !Object.values(value).every(version => typeof version === 'string')) {
    throw new Error(`배포 ${release}의 버전 맵 형식이 잘못되었습니다.`);
  }

  return value as Record<string, string>;
}

export async function readAccessLog() {
  return readFile(path.join(SITE_ROOT, 'access.log'), 'utf8');
}

export async function requestCount(urlPath: string) {
  const log = await readAccessLog();
  return log.split(`"GET ${urlPath} HTTP/`).length - 1;
}
