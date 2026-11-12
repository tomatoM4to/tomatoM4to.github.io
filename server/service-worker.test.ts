import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

test('SW 활성화는 블로그의 이전 캐시만 삭제하고 다른 앱 캐시를 보존한다', async () => {
  const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
  const deleted: string[] = [];
  let claimed = false;
  let activate: ((event: { waitUntil(promise: Promise<unknown>): void }) => void) | undefined;
  runInNewContext(source, {
    console: { log() {} },
    self: {
      addEventListener(name: string, listener: NonNullable<typeof activate>) {
        if (name === 'activate') activate = listener;
      },
      clients: { async claim() { claimed = true; } },
    },
    caches: {
      async keys() {
        return ['tomato-etag-cache-v1', 'tomato-etag-cache-v2', 'tomato-etag-cache-v3', 'other-app-offline-v1', 'other-tomato-etag-cache-v1'];
      },
      async delete(name: string) {
        deleted.push(name);
        return true;
      },
      async open() { return { async keys() { return []; } }; },
    },
  });
  assert.ok(activate);
  let completed: Promise<unknown> | undefined;
  activate({ waitUntil(promise) { completed = promise; } });
  assert.ok(completed);
  await completed;
  assert.deepEqual(deleted.sort(), ['tomato-etag-cache-v1', 'tomato-etag-cache-v2']);
  assert.equal(claimed, true);
});
