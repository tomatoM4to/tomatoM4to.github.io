import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, beforeEach, describe, test } from 'node:test';
import { runInNewContext } from 'node:vm';
import type { Item } from '@shared/common.ts';

const originalDirectory = process.cwd();
const projectDirectory = await mkdtemp(path.join(tmpdir(), 'blog-utils-test-'));
const postsDirectory = path.join(projectDirectory, 'content', 'posts');

async function loadUtils() {
  process.chdir(projectDirectory);
  try {
    return await import('./utils.ts');
  } finally {
    process.chdir(originalDirectory);
  }
}

const {
  createHTML,
  createInitialData,
  createTemplate,
  getAllPostPaths,
  getAllPostPathsSync,
  getItemFromTag,
  getMarkdown,
  getSortedContentList,
  getTags,
  validateContentName,
} = await loadUtils();

const metadata = {
  title: '테스트 글',
  description: '테스트 요약',
  date: '2026-11-09',
  keywords: 'Network, JavaScript',
};

async function writePost(directory: string, data: Record<string, unknown> = metadata, content = '# 테스트 본문\n') {
  const destination = path.join(postsDirectory, directory);
  await mkdir(destination, { recursive: true });
  const frontMatter = Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
  await writeFile(path.join(destination, 'index.md'), `---\n${frontMatter}\n---\n${content}`, 'utf8');
}

beforeEach(async () => {
  await rm(postsDirectory, { recursive: true, force: true });
  await mkdir(postsDirectory, { recursive: true });
});

after(async () => {
  await rm(projectDirectory, { recursive: true, force: true });
});

describe('글 경로 탐색', () => {
  for (const [name, getPaths] of [
    ['비동기', getAllPostPaths],
    ['동기', getAllPostPathsSync],
  ] as const) {
    test(`${name}: 연도별 글과 기존 평면 경로를 찾고 일반 파일은 제외한다`, async () => {
      await writePost('2026/한글 글');
      await writePost('legacy');
      await writeFile(path.join(postsDirectory, 'README.md'), '글이 아닌 파일');
      await writeFile(path.join(postsDirectory, '2026', 'README.md'), '글이 아닌 파일');

      assert.deepEqual(Object.fromEntries(await getPaths()), {
        '한글 글': path.join(postsDirectory, '2026', '한글 글', 'index.md'),
        legacy: path.join(postsDirectory, 'legacy', 'index.md'),
      });
    });

    test(`${name}: 글이 없으면 빈 맵을 반환한다`, async () => {
      assert.equal((await getPaths()).size, 0);
    });

    test(`${name}: 생성 파일명 한도를 넘는 ID를 원본 경로와 함께 거부한다`, async () => {
      const id = 'a'.repeat(251);
      await writePost(`2026/${id}`);
      await assert.rejects(async () => { await getPaths(); }, error => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /Invalid post ID.*255 UTF-8 bytes/);
        assert.ok(error.message.includes(path.join('2026', id, 'index.md')));
        return true;
      });
    });

    test(`${name}: 연도가 달라도 중복 글 ID를 조용히 덮어쓰지 않는다`, async () => {
      await writePost('2025/duplicate');
      await writePost('2026/duplicate');

      await assert.rejects(async () => { await getPaths(); }, /duplicate/i);
    });
  }
});

describe('콘텐츠 로딩', () => {
  test('글 ID로 본문과 문자열 메타데이터를 읽는다', async () => {
    await writePost('2026/한글 글');

    const result = await getMarkdown('한글 글');

    assert.deepEqual(result.data, metadata);
    assert.equal(result.content, '# 테스트 본문\n');
  });

  test('글 상세 초기 데이터는 본문과 전체 태그 집계를 포함한다', async () => {
    await writePost('2026/selected');
    await writePost('2025/other', { ...metadata, keywords: 'Network' });

    const result = await createInitialData('posts/selected');

    assert.deepEqual(result.tags, { Network: 2, JavaScript: 1 });
    assert.deepEqual(result.post?.data, metadata);
    assert.equal(result.post?.content, '# 테스트 본문\n');
  });

  test('목록 화면의 초기 데이터에는 태그 집계만 포함한다', async () => {
    await writePost('2026/selected');

    assert.deepEqual(await createInitialData('tags'), { tags: { Network: 1, JavaScript: 1 } });
  });

  test('posts 부분 문자열이 있는 다른 경로를 글 상세로 판별하지 않는다', async () => {
    await writePost('2026/selected');

    for (const route of ['reposts/selected', 'postscripts']) {
      assert.deepEqual(await createInitialData(route), { tags: { Network: 1, JavaScript: 1 } });
    }
  });

  test('파일명 순서와 무관하게 날짜 내림차순으로 목록을 만들고 image 생략을 허용한다', async () => {
    await writePost('2025/a-old', { ...metadata, date: '2025-12-31' });
    await writePost('2026/z-new', { ...metadata, image: '/img/new.webp' });

    assert.deepEqual(await getSortedContentList(), [
      { id: 'z-new', ...metadata, image: '/img/new.webp' },
      { id: 'a-old', ...metadata, date: '2025-12-31', image: undefined },
    ]);
  });

  for (const image of [null, 42, ['/img/cover.webp']]) {
    test(`image가 문자열이 아닌 ${JSON.stringify(image)}이면 거부한다`, async () => {
      await writePost('2026/invalid-image', { ...metadata, image });

      await assert.rejects(() => getMarkdown('invalid-image'), /Invalid image/);
    });
  }

  test('글이 없으면 목록과 태그 집계가 비어 있다', async () => {
    assert.deepEqual(await getSortedContentList(), []);
    assert.deepEqual(await getTags(), {});
  });

  for (const field of ['title', 'description', 'date', 'keywords'] as const) {
    test(`필수 필드 ${field} 누락을 목록 생성 전에 거부한다`, async () => {
      const incomplete: Record<string, unknown> = { ...metadata };
      delete incomplete[field];
      await writePost('2026/incomplete', incomplete);

      await assert.rejects(getSortedContentList, new RegExp(field, 'i'));
    });
  }

  for (const [field, value] of [
    ['title', ['잘못된 제목']],
    ['description', null],
    ['date', 20261109],
    ['keywords', ['Network']],
  ] as const) {
    test(`필수 필드 ${field}의 잘못된 타입을 거부한다`, async () => {
      await writePost('2026/invalid-type', { ...metadata, [field]: value });

      await assert.rejects(getSortedContentList, new RegExp(field, 'i'));
    });
  }

  for (const date of ['not-a-date', '2026-02-30', '2025-02-29', '1900-02-29', '2026-1-09', '2026-11-09T00:00:00Z']) {
    test(`유효하지 않은 날짜 ${date}를 거부한다`, async () => {
      await writePost('2026/invalid-date', { ...metadata, date });

      await assert.rejects(getSortedContentList, /date/i);
    });
  }

  test('실제 윤년의 2월 29일을 문자열로 유지하고 날짜순으로 정렬한다', async () => {
    await writePost('2000/century-leap', { ...metadata, date: '2000-02-29' });
    await writePost('2024/leap', { ...metadata, date: '2024-02-29' });

    const items = await getSortedContentList();

    assert.deepEqual(items.map(({ id, date }) => ({ id, date })), [
      { id: 'leap', date: '2024-02-29' },
      { id: 'century-leap', date: '2000-02-29' },
    ]);
  });

  for (const [name, load] of [
    ['글 상세', () => getMarkdown('incomplete')],
    ['초기 데이터', () => createInitialData('posts/incomplete')],
    ['태그 집계', getTags],
  ] as const) {
    test(`${name}에서도 필수 메타데이터 누락을 거부한다`, async () => {
      const { title, ...incomplete } = metadata;
      await writePost('2026/incomplete', incomplete);

      await assert.rejects(load, /title/i);
    });
  }
});

describe('태그', () => {
  test('URL 특수문자·한글·공백과 객체 속성 같은 이름을 원문 그대로 집계한다', async () => {
    await writePost('2026/한글 C# & 100%20', { ...metadata, keywords: ' C++ , C#, R&D, 한글 태그, 100%, __proto__, constructor' });
    assert.deepEqual(await getTags(), JSON.parse('{"C++":1,"C#":1,"R&D":1,"한글 태그":1,"100%":1,"__proto__":1,"constructor":1}'));
    assert.equal((await getSortedContentList())[0].id, '한글 C# & 100%20');
  });

  for (const keywords of ['CI/CD', 'CI\\CD', 'question?mark', 'NUL.txt', 'C++,,R&D', 'end.']) {
    test(`파일명으로 쓸 수 없는 태그 ${JSON.stringify(keywords)}는 원본 경로와 함께 거부한다`, async () => {
      await writePost('2026/invalid-tag', { ...metadata, keywords });
      for (const load of [getSortedContentList, getTags, () => getMarkdown('invalid-tag')]) {
        await assert.rejects(load, error => {
          assert.ok(error instanceof Error);
          assert.match(error.message, /Invalid tag/);
          assert.ok(error.message.includes(path.join('2026', 'invalid-tag', 'index.md')));
          return true;
        });
      }
    });
  }

  test('빈 keywords는 태그 없는 글로 허용한다', async () => {
    await writePost('2026/no-tags', { ...metadata, keywords: '' });
    assert.deepEqual(await getTags(), {});
  });

  test('쉼표로 나눈 태그의 주변 공백을 제거해 집계한다', async () => {
    await writePost('2026/first', { ...metadata, keywords: ' Network , JavaScript ' });
    await writePost('2026/second', { ...metadata, keywords: 'Network, TypeScript' });

    assert.deepEqual(await getTags(), { Network: 2, JavaScript: 1, TypeScript: 1 });
  });

  test('부분 문자열이 아닌 태그 전체로 필터링하고 입력 순서를 유지한다', async () => {
    const items: Item[] = [
      { id: 'first', ...metadata, keywords: ' JavaScript , Network ', image: '' },
      { id: 'second', ...metadata, keywords: 'JavaScriptCore', image: '' },
      { id: 'third', ...metadata, keywords: 'JavaScript', image: '' },
    ];

    assert.deepEqual(await getItemFromTag(items, 'JavaScript'), { len: 2, data: [items[0], items[2]] });
    assert.deepEqual(await getItemFromTag(items, 'Script'), { len: 0, data: [] });
    assert.equal(items.length, 3);
  });
});

test('콘텐츠 이름은 Windows 금지 문자·예약 이름·끝 공백 및 생성 파일명 길이를 검사한다', () => {
  for (const field of ['post ID', 'tag'] as const) {
    for (const name of ['', '.', '..', 'bad/name', 'bad\\name', 'a:b', 'a?b', 'a*b', '<name>', 'a|b', 'a"b', 'a\u0000b', 'a\u001fb', 'end ', 'end.', 'CON', 'nul.txt', 'COM¹', 'lpt9.log', '한'.repeat(84)]) {
      assert.throws(() => validateContentName(name, field, 'source/index.md'), error => {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes(`Invalid ${field} ${JSON.stringify(name)} in source/index.md:`));
        return true;
      });
    }
    for (const name of ['한글 글 (1), async&await', 'C++', 'C#', 'R&D', '100%20', 'COM10', '한'.repeat(83) + 'a']) {
      assert.doesNotThrow(() => validateContentName(name, field, 'source/index.md'));
    }
  }
});

describe('HTML 생성', () => {
  const template = '<head><!--app-head--></head><main><!--app-html--></main><!--app-window-->';

  function restoreData(html: string): unknown {
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(script);
    return runInNewContext(`${script}; JSON.stringify(window.__INITIAL_DATA__)`, { window: {} });
  }

  test('템플릿의 본문, 메타 태그, 초기 데이터를 삽입한다', () => {
    const html = createHTML({
      template,
      head: '<title>제목</title>',
      body: '<p>본문</p>',
      initialData: '{"tags":{}}',
    });
    assert.ok(html.startsWith('<head><title>제목</title></head><main><p>본문</p></main>'));
    assert.equal(restoreData(html), '{"tags":{}}');
  });

  for (const field of ['head', 'body', 'initialData'] as const) {
    test(`${field}의 문자열 치환 토큰을 원문 그대로 보존한다`, () => {
      const tokens = "문자열 $& $$ $` $'";
      const input = { template, head: '', body: '', initialData: '{}' };
      input[field] = field === 'initialData' ? JSON.stringify({ content: tokens }) : tokens;

      const html = createHTML(input);
      assert.ok(html.startsWith(`<head>${input.head}</head><main>${input.body}</main>`));
      assert.equal(restoreData(html), input.initialData);
    });
  }

  test('객체 속성 이름과 문자열 이스케이프를 초기 데이터 복원 뒤에도 보존한다', () => {
    const data = {
      tags: Object.fromEntries([['__proto__', 1], ['constructor', 2]]),
      content: '줄바꿈\n따옴표 " 역슬래시 \\ <끝>',
    };
    const html = createHTML({ template, head: '', body: '', initialData: JSON.stringify(data) });
    assert.equal(restoreData(html), JSON.stringify(data));
  });

  test('삽입한 HTML과 초기 데이터 안의 템플릿 표식을 다시 치환하지 않는다', () => {
    const head = '<title><!--app-html--></title>';
    const body = '<pre><!--app-window--></pre>';
    const data = { content: '<!--app-head--> <!--app-html--> <!--app-window-->', tags: {} };
    const html = createHTML({ template, head, body, initialData: JSON.stringify(data) });

    assert.ok(html.startsWith(`<head>${head}</head><main>${body}</main>`));
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(script);
    const restored: unknown = runInNewContext(`${script}; JSON.stringify(window.__INITIAL_DATA__)`, { window: {} });
    assert.equal(restored, JSON.stringify(data));
  });

  test('본문의 script 종료 문자열이 데이터 스크립트를 닫지 않고 복원된다', () => {
    const data = { content: '<script>example()</script>\n</ScRiPt>\n<!-- 예제 -->', tags: {} };
    const html = createHTML({ template, head: '', body: '', initialData: JSON.stringify(data) });

    assert.equal([...html.matchAll(/<\/script\s*>/gi)].length, 1);
    const script = html.match(/<script>([\s\S]*?)<\/script>/i)?.[1];
    assert.ok(script);
    const restored: unknown = runInNewContext(`${script}; JSON.stringify(window.__INITIAL_DATA__)`, { window: {} });
    assert.equal(restored, JSON.stringify(data));
  });

  test('프로젝트 dist의 HTML 템플릿을 읽는다', async () => {
    const distDirectory = path.join(projectDirectory, 'dist');
    await mkdir(distDirectory, { recursive: true });
    await writeFile(path.join(distDirectory, 'index.html'), template, 'utf8');

    assert.equal(await createTemplate(), template);
  });
});
