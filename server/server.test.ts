import assert from 'node:assert/strict';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
let directory: string;
let server: ChildProcessWithoutNullStreams | undefined;
let baseURL: string;
const postId = '한글 %2F #';

before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'blog-server-test-'));
  for (const name of ['src', 'shared', 'server', 'index.html', 'vite.config.ts', 'package.json', 'tsconfig.json', 'tsconfig.server.json']) {
    await cp(path.join(projectRoot, name), path.join(directory, name), {
      recursive: true,
      filter: source => !source.endsWith('.test.ts'),
    });
  }
  await symlink(path.join(projectRoot, 'node_modules'), path.join(directory, 'node_modules'), 'junction');
  const destination = path.join(directory, 'content', 'posts', '2026', postId);
  await mkdir(destination, { recursive: true });
  await writeFile(path.join(destination, 'index.md'), [
    '---',
    'title: "SSR 테스트 제목"',
    'description: "SSR 테스트 요약"',
    'date: "2026-11-11"',
    'keywords: "all-tags, __proto__"',
    '---',
    'SSR 테스트 본문',
  ].join('\n'));
  const emptyTitleDirectory = path.join(directory, 'content', 'posts', '2026', 'empty-title');
  await mkdir(emptyTitleDirectory, { recursive: true });
  await writeFile(path.join(emptyTitleDirectory, 'index.md'), '---\ntitle: ""\ndescription: ""\ndate: "2026-11-10"\nkeywords: ""\n---\n빈 제목의 본문');

  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const address = listener.address();
  assert.ok(address && typeof address !== 'string');
  const { port } = address;
  await new Promise<void>((resolve, reject) => listener.close(error => error ? reject(error) : resolve()));
  baseURL = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ['--import', 'tsx', path.join(directory, 'server', 'server.ts')], {
    cwd: directory,
    env: { ...process.env, NODE_ENV: 'development', BASE: '/', PORT: String(port), TSX_TSCONFIG_PATH: path.join(directory, 'tsconfig.server.json') },
  });
  server = child;
  await new Promise<void>((resolve, reject) => {
    let output = '';
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve();
    };
    const timeout = setTimeout(() => finish(new Error(`SSR startup timed out: ${output}`)), 20_000);
    child.stdout.on('data', chunk => {
      output += chunk.toString();
      if (output.includes('Server started at')) finish();
    });
    child.stderr.on('data', chunk => { output += chunk.toString(); });
    child.once('error', finish);
    child.once('exit', () => finish(new Error(`SSR exited: ${output}`)));
  });
});

after(async () => {
  if (server && server.exitCode === null && server.signalCode === null) {
    const stopped = once(server, 'exit');
    server.kill();
    await stopped;
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

test('all-tags도 다른 태그와 동일한 글 목록 계약으로 응답한다', async () => {
  const response = await fetch(`${baseURL}/api/tags/all-tags.json`);
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.deepEqual(result, {
    len: 1,
    data: [{ id: postId, title: 'SSR 테스트 제목', description: 'SSR 테스트 요약', date: '2026-11-11', keywords: 'all-tags, __proto__' }],
  });
});

test('태그 집계는 HTML 초기 스크립트 실행 뒤에도 객체 속성 이름을 보존한다', async () => {
  const response = await fetch(`${baseURL}/tags?tag=all-tags`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const script = html.match(/<script>(window\.__INITIAL_DATA__ = [\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  assert.equal(runInNewContext(`${script}; JSON.stringify(window.__INITIAL_DATA__.tags)`, { window: {} }), '{"all-tags":1,"__proto__":1}');
  assert.ok(html.replace(/<!--[\s\S]*?-->/g, '').includes('all-tags 태그가 포함된 글'));
});

test('글의 쿼리는 콘텐츠 조회와 canonical에서 제외하고 원문 ID는 한 번만 디코딩한다', async () => {
  const pathname = `/posts/${encodeURIComponent(postId)}`;
  const response = await fetch(`${baseURL}${pathname}?tag=posts&page=2`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('<title>SSR 테스트 제목</title>'));
  assert.ok(html.includes('SSR 테스트 본문'));
  assert.ok(html.includes(`href="https://tomatom4to.github.io${pathname}"`));
});

test('빈 제목의 글도 직접 접속하면 ID 제목과 정적 본문을 제공한다', async () => {
  const response = await fetch(`${baseURL}/posts/empty-title`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('<title>empty-title</title>'));
  assert.ok(html.includes('빈 제목의 본문'));
});

test('생성 대상이 아닌 페이지와 JSON 요청은 HTML 성공 응답이나 서버 오류 대신 404를 반환한다', async () => {
  for (const pathname of ['/missing-page', '/posts/', '/posts/missing-post', '/api', '/api/missing.json', '/api/posts/missing-post/index.json', '/api/tags/missing-tag.json']) {
    const response = await fetch(`${baseURL}${pathname}`);
    assert.equal(response.status, 404, pathname);
  }
});

test('존재하지 않거나 올바른 정수가 아닌 최근 글 페이지를 성공 응답으로 처리하지 않는다', async () => {
  for (const page of ['0', '-1', '01', '1extra', 'NaN', '2']) {
    const response = await fetch(`${baseURL}/api/recent/${page}.json`);
    assert.equal(response.status, 404, page);
  }
});
