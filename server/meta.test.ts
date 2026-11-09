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
