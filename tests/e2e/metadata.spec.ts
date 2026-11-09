import { test, expect } from '@playwright/test';
import { generateMeta } from '../../server/meta';

test('제목을 HTML로 파싱해도 원래 텍스트와 태그 구조를 유지한다', async ({ page }) => {
  const title = '제목 "인용" & </title><script>example()</script>';
  const head = generateMeta({ url: 'posts/example', title, type: 'article' });
  const actual = await page.evaluate(markup => {
    const document = new DOMParser().parseFromString(markup, 'text/html');
    const ogTitle = document.querySelector('meta[property="og:title"]');

    return {
      title: document.title,
      ogTitle: ogTitle?.getAttribute('content'),
      titleCount: document.querySelectorAll('title').length,
      scriptCount: document.querySelectorAll('script').length,
      attributes: ogTitle?.getAttributeNames().sort(),
    };
  }, head);

  expect(actual).toEqual({ title, ogTitle: title, titleCount: 1, scriptCount: 0, attributes: ['content', 'property'] });
});

test('설명을 HTML로 파싱해도 속성 값이 보존되고 새 태그가 생기지 않는다', async ({ page }) => {
  const description = '설명 "인용" & <태그>"><script>example()</script>';
  const head = generateMeta({ url: 'posts/example', desc: description, type: 'article' });
  const actual = await page.evaluate(markup => {
    const document = new DOMParser().parseFromString(markup, 'text/html');
    const description = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');

    return {
      description: description?.getAttribute('content'),
      ogDescription: ogDescription?.getAttribute('content'),
      attributes: description?.getAttributeNames().sort(),
      ogAttributes: ogDescription?.getAttributeNames().sort(),
      scriptCount: document.querySelectorAll('script').length,
    };
  }, head);

  expect(actual).toEqual({
    description,
    ogDescription: description,
    attributes: ['content', 'name'],
    ogAttributes: ['content', 'property'],
    scriptCount: 0,
  });
});
