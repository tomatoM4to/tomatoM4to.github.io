import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import matter from 'gray-matter';
import { generatePostJSON, generateRecentPostLists, generateTagLists } from './gen-api-resource.ts';
import type { Item } from '@shared/common.ts';
import type { MarkdownPost } from './types.ts';

let outputDirectory: string;
const contentList: Item[] = ['z-new', 'a-second', 'third', 'fourth', 'fifth', 'sixth'].map(id => ({
  id,
  title: `제목 ${id}`,
  description: '요약',
  date: '2026-11-09',
  keywords: 'Network',
}));

function createMarkdown(content = '본문'): MarkdownPost {
  return Object.assign(matter(content), {
    data: {
      title: '따옴표 "제목"',
      description: '테스트 요약',
      date: '2026-11-09',
      keywords: '',
    },
  });
}

beforeEach(async () => {
  outputDirectory = await mkdtemp(path.join(tmpdir(), 'blog-api-test-'));
});

afterEach(async () => {
  await rm(outputDirectory, { recursive: true, force: true });
});

test('글 ID 경로에 메타데이터와 본문을 저장하고 원본 Buffer는 제외한다', async () => {
  const markdown = createMarkdown('<script>example()</script> $&\n');
  await generatePostJSON({ postName: '한글 글', markdown, outputDirectory });

  const result: unknown = JSON.parse(await readFile(path.join(outputDirectory, 'api', 'posts', '한글 글', 'index.json'), 'utf8'));
  assert.deepEqual(result, {
    content: '<script>example()</script> $&\n',
    data: { title: '따옴표 "제목"', description: '테스트 요약', date: '2026-11-09', keywords: '' },
    isEmpty: false,
    excerpt: '',
  });
});

test('글이 없으면 최근 글 페이지를 생성하지 않는다', async () => {
  await generateRecentPostLists({ contentList: [], outputDirectory });
  assert.deepEqual(await readdir(outputDirectory), []);
});

test('글 5개는 순서와 전체 개수를 유지한 한 페이지로 저장한다', async () => {
  const posts = [contentList[0], contentList[1], contentList[2], contentList[3], contentList[4]];
  await generateRecentPostLists({ contentList: posts, outputDirectory });

  const destination = path.join(outputDirectory, 'api', 'recent');
  assert.deepEqual(await readdir(destination), ['1.json']);
  const result: unknown = JSON.parse(await readFile(path.join(destination, '1.json'), 'utf8'));
  assert.deepEqual(result, { len: 5, data: posts });
});

test('글 6개는 5개와 1개로 나누고 두 페이지에 전체 개수를 저장한다', async () => {
  await generateRecentPostLists({ contentList, outputDirectory });

  const destination = path.join(outputDirectory, 'api', 'recent');
  assert.deepEqual((await readdir(destination)).sort(), ['1.json', '2.json']);
  const first: unknown = JSON.parse(await readFile(path.join(destination, '1.json'), 'utf8'));
  const second: unknown = JSON.parse(await readFile(path.join(destination, '2.json'), 'utf8'));
  assert.deepEqual(first, { len: 6, data: [contentList[0], contentList[1], contentList[2], contentList[3], contentList[4]] });
  assert.deepEqual(second, { len: 6, data: [contentList[5]] });
});

test('태그 전체 이름으로 선택한 글을 순서대로 저장한다', async () => {
  const posts = [
    { ...contentList[0], keywords: ' JavaScript , Network ' },
    { ...contentList[1], keywords: 'Script' },
    { ...contentList[2], keywords: 'JavaScript' },
  ];
  await generateTagLists({ contentList: posts, tags: { JavaScript: 2, Network: 1, Script: 1 }, outputDirectory });

  const destination = path.join(outputDirectory, 'api', 'tags');
  assert.deepEqual((await readdir(destination)).sort(), ['JavaScript.json', 'Network.json', 'Script.json']);
  const javascript: unknown = JSON.parse(await readFile(path.join(destination, 'JavaScript.json'), 'utf8'));
  const script: unknown = JSON.parse(await readFile(path.join(destination, 'Script.json'), 'utf8'));
  const network: unknown = JSON.parse(await readFile(path.join(destination, 'Network.json'), 'utf8'));
  assert.deepEqual(javascript, { len: 2, data: [posts[0], posts[2]] });
  assert.deepEqual(script, { len: 1, data: [posts[1]] });
  assert.deepEqual(network, { len: 1, data: [posts[0]] });
});

test('파일 저장 실패를 호출자에게 전달한다', async () => {
  await writeFile(path.join(outputDirectory, 'api'), 'directory 대신 파일');

  await assert.rejects(generatePostJSON({ postName: 'blocked', markdown: createMarkdown(), outputDirectory }), /EEXIST|ENOTDIR/);
  await assert.rejects(generateRecentPostLists({ contentList, outputDirectory }), /EEXIST|ENOTDIR/);
  await assert.rejects(generateTagLists({ contentList, tags: { Network: 6 }, outputDirectory }), /EEXIST|ENOTDIR/);
});

test('글 ID와 태그의 URL 특수문자를 JSON 파일명에 그대로 보존한다', async () => {
  const id = '한글 C# & 100%20';
  const tags = { 'C++': 1, 'C#': 1, 'R&D': 1, '한글 태그': 1, '100%': 1 };
  const posts = [{ ...contentList[0], id, keywords: Object.keys(tags).join(',') }];
  await generatePostJSON({ postName: id, markdown: createMarkdown(), outputDirectory });
  await generateTagLists({ contentList: posts, tags, outputDirectory });
  assert.equal(JSON.parse(await readFile(path.join(outputDirectory, 'api', 'posts', id, 'index.json'), 'utf8')).content, '본문');
  for (const tag of Object.keys(tags)) {
    assert.deepEqual(JSON.parse(await readFile(path.join(outputDirectory, 'api', 'tags', `${tag}.json`), 'utf8')), { len: 1, data: posts });
  }
});
