import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

test('버전 맵의 문자열 치환 토큰을 모든 HTML에서 원문 키로 복원한다', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'blog-etag-test-'));
  try {
    const dist = path.join(directory, 'dist');
    const destination = path.join(dist, 'api', 'tags');
    await mkdir(destination, { recursive: true });
    const names = ['$&', '$$', '$`', "$'"];
    for (const name of names) {
      await writeFile(path.join(destination, `${name}.json`), '{}');
    }
    const template = '<!doctype html>\n<html lang="ko"><body><!--etag-maps--></body></html>';
    for (const name of ['index.html', 'tags.html']) {
      await writeFile(path.join(dist, name), template);
    }
    const scriptPath = fileURLToPath(new URL('../scripts/inject-etag-map.js', import.meta.url));
    const result = spawnSync(process.execPath, [scriptPath], { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    for (const name of ['index.html', 'tags.html']) {
      const html = await readFile(path.join(dist, name), 'utf8');
      const scripts = [...html.matchAll(/<script id="etag-maps">([\s\S]*?)<\/script>/g)];
      assert.equal(scripts.length, 1);
      const restored: string = runInNewContext(`${scripts[0][1]}; JSON.stringify(window.__ETAG_MAP__)`, { window: {} });
      const map: Record<string, string> = JSON.parse(restored);
      assert.deepEqual(Object.keys(map).sort(), ['/', '/tags', ...names.map(value => `/api/tags/${value}.json`)].sort());
      assert.ok(Object.values(map).every(version => typeof version === 'string' && version.length > 0));
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
