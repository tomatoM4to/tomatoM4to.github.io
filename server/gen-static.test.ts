import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { generateStaticPages } from './gen-static.ts';
import type { InitialData } from '@shared/common.ts';

let outputDirectory: string;
const template = '<head><!--app-head--></head><main><!--app-html--></main><!--app-window-->';

beforeEach(async () => {
  outputDirectory = await mkdtemp(path.join(tmpdir(), 'blog-static-test-'));
});

afterEach(async () => {
  await rm(outputDirectory, { recursive: true, force: true });
});

test('경로별 초기 데이터로 페이지를 생성하고 원본 템플릿을 보관한다', async () => {
  const rendered: { url: string; initialData: InitialData }[] = [];

  await generateStaticPages({
    postNames: ['한글 글', 'C# & C++', 'space%20post', 'space-post'],
    template,
    loadInitialData: async route => ({ tags: { [route || 'home']: 1 } }),
    render: async input => {
      rendered.push(input);
      return { head: `<title>${input.url || 'home'}</title>`, body: `<p>${input.url}</p>` };
    },
    outputDirectory,
  });

  assert.deepEqual(rendered, [
    { url: '', initialData: { tags: { home: 1 } } },
    { url: 'search', initialData: { tags: { search: 1 } } },
    { url: 'tags', initialData: { tags: { tags: 1 } } },
    { url: 'license', initialData: { tags: { license: 1 } } },
    { url: 'posts/%ED%95%9C%EA%B8%80%20%EA%B8%80', initialData: { tags: { 'posts/한글 글': 1 } } },
    { url: 'posts/C%23%20&%20C++', initialData: { tags: { 'posts/C# & C++': 1 } } },
    { url: 'posts/space%2520post', initialData: { tags: { 'posts/space%20post': 1 } } },
    { url: 'posts/space-post', initialData: { tags: { 'posts/space-post': 1 } } },
  ]);
  assert.equal(await readFile(path.join(outputDirectory, 'template.html'), 'utf8'), template);
  assert.equal(await readFile(path.join(outputDirectory, 'license.html'), 'utf8'),
    '<head><title>license</title></head><main><p>license</p></main><script>window.__INITIAL_DATA__ = {"tags":{"license":1}}</script>');
  assert.deepEqual((await readdir(outputDirectory)).sort(), ['index.html', 'license.html', 'posts', 'search.html', 'tags.html', 'template.html']);
  assert.deepEqual((await readdir(path.join(outputDirectory, 'posts'))).sort(), ['C# & C++.html', 'space%20post.html', 'space-post.html', '한글 글.html']);
  assert.match(await readFile(path.join(outputDirectory, 'posts', 'space%20post.html'), 'utf8'), /<p>posts\/space%2520post<\/p>/);
  assert.match(await readFile(path.join(outputDirectory, 'posts', 'space-post.html'), 'utf8'), /<p>posts\/space-post<\/p>/);
  assert.equal(await readFile(path.join(outputDirectory, 'index.html'), 'utf8'),
    '<head><title>home</title></head><main><p></p></main><script>window.__INITIAL_DATA__ = {"tags":{"home":1}}</script>');
  assert.equal(await readFile(path.join(outputDirectory, 'posts', '한글 글.html'), 'utf8'),
    '<head><title>posts/%ED%95%9C%EA%B8%80%20%EA%B8%80</title></head><main><p>posts/%ED%95%9C%EA%B8%80%20%EA%B8%80</p></main><script>window.__INITIAL_DATA__ = {"tags":{"posts/한글 글":1}}</script>');
});

test('콘텐츠 로딩 실패를 호출자에게 전달한다', async () => {
  const failure = new Error('content unavailable');
  await assert.rejects(generateStaticPages({
    postNames: [],
    template,
    loadInitialData: async () => { throw failure; },
    render: async () => { assert.fail('콘텐츠 로딩 실패 후 렌더러를 호출하면 안 된다'); },
    outputDirectory,
  }), error => error === failure);
});

test('렌더러 실패를 호출자에게 전달한다', async () => {
  const failure = new Error('render failed');
  await assert.rejects(generateStaticPages({
    postNames: [],
    template,
    loadInitialData: async () => ({ tags: {} }),
    render: async () => { throw failure; },
    outputDirectory,
  }), error => error === failure);
});

test('출력 경로에 쓸 수 없으면 실패한다', async () => {
  const blocked = path.join(outputDirectory, 'blocked');
  await writeFile(blocked, 'directory 대신 파일');

  await assert.rejects(generateStaticPages({
    postNames: [],
    template,
    loadInitialData: async () => ({ tags: {} }),
    render: async () => ({ head: '', body: '' }),
    outputDirectory: blocked,
  }), /EEXIST|ENOTDIR/);
});
