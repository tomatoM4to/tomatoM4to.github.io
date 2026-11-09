import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateMeta } from './meta.ts';
import { DEFAULT_DESC, DEFAULT_IMAGE, SITE_NAME, makeURL } from '@shared/common.ts';

test('기본 메타데이터와 페이지 URL을 생성한다', () => {
  const head = generateMeta({ url: 'tags', type: 'website' });

  assert.ok(head.includes(`<title>${SITE_NAME}</title>`));
  assert.ok(head.includes(`<meta name="description" content="${DEFAULT_DESC}" />`));
  assert.ok(head.includes(`<meta property="og:image" content="${DEFAULT_IMAGE}" />`));
  assert.ok(head.includes(`<link rel="canonical" href="${makeURL('tags')}" />`));
});

test('제목의 특수문자가 title과 Open Graph 태그의 구조를 바꾸지 않는다', () => {
  const head = generateMeta({
    url: 'posts/example',
    title: '제목 "인용" & </title><script>example()</script>',
    type: 'article',
  });

  assert.ok(head.includes('<title>제목 &quot;인용&quot; &amp; &lt;/title&gt;&lt;script&gt;example()&lt;/script&gt;</title>'));
  assert.ok(head.includes('<meta property="og:title" content="제목 &quot;인용&quot; &amp; &lt;/title&gt;&lt;script&gt;example()&lt;/script&gt;" />'));
});

test('설명의 따옴표와 특수문자가 description 속성을 벗어나지 않는다', () => {
  const head = generateMeta({
    url: 'posts/example',
    desc: '설명 "인용" & <태그>',
    type: 'article',
  });

  assert.ok(head.includes('<meta name="description" content="설명 &quot;인용&quot; &amp; &lt;태그&gt;" />'));
  assert.ok(head.includes('<meta property="og:description" content="설명 &quot;인용&quot; &amp; &lt;태그&gt;" />'));
});
