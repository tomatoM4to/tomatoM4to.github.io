import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import type { GrayMatterFile } from 'gray-matter';
import { PassThrough } from 'node:stream';

import {
  SITE_NAME,
  DEFAULT_DESC,
  DEFAULT_KEYWORDS,
  DEFAULT_IMAGE,
  makeURL
} from '@src/shared/common';
import App from '@src/App';

function generateMeta({
  url,
  title,
  desc,
  keywords,
  image,
  type = 'website',
  date,
} : {
  url: string,
  title?: string,
  desc?: string,                // 검색 결과 제목 하단에 노출되는 1~2줄 요약
  keywords?: string,            // 레거시 검색 엔진을 위한 태그(쉽표로 구분)
  image?: string,               // SNS 공유 썸네일 이미지 (Open Graph Image)
  type: 'website' | 'article',  // website: 메인 페이지, 목록, article: 블로그 포스트, 뉴스 기사 등 구체적인 콘텐츠
  date?: string,                // ISO 8601 형식 권장
}): string {
  return (
    `<title>${title ?? SITE_NAME}</title>
    <meta name="description" content="${desc ?? DEFAULT_DESC}" />
    <meta name="keywords" content="${keywords ?? DEFAULT_KEYWORDS}" />
    <meta property="og:title" content="${title ?? SITE_NAME}" />
    <meta property="og:description" content="${desc ?? DEFAULT_DESC}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${makeURL(url)}" />
    <meta property="og:image" content="${image ? makeURL(image) : DEFAULT_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />${date ? `
    <meta property="article:published_time" content="${date}" />` : ''}
    <meta name="author" content="tomatoM4to" />
    <link rel="canonical" href="${makeURL(url)}" />`
  );
}

export async function render({
  url,
  initialData,
}: {
  url: string,
  initialData: GrayMatterFile<string> | null,
}): Promise<{ body: string; head: string; }> {
  let head = '';
  if (url === '') {
    head = generateMeta({
      url: url,
      type: 'website'
    });
  }
  if (url === 'tags') {
    head = generateMeta({
      url: url,
      title: `${SITE_NAME} - tags`,
      type: 'website'
    });
  }
  if (url === 'search') {
    // 검색 페이지는 noindex 처리 유지
    head = generateMeta({
      url: url,
      title: `${SITE_NAME} - search`,
      type: 'website',
    })
  }
  if (url.includes('posts') && initialData?.data) {
    // 개별 포스트 페이지
    const { title, description, image, keywords, date } = initialData.data;
    head = generateMeta({
      url: url,
      title: `${title}`,
      desc: description,
      keywords: keywords,
      date: date,
      image: image,
      type: 'article',
    });
  }

const body = await new Promise<string>((resolve, reject) => {
    let html = '';
    const writable = new PassThrough();
    let isPiped = false;  // StrictMode 일시 두번 실행되는거 방지

    writable.on('data', (chunk) => {
      html += chunk.toString();
    });

    // 스트림이 완전히 종료되었을 때만 resolve
    writable.on('end', () => {
      resolve(html);
    });

    writable.on('error', (err) => {
      reject(err);
    });

    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={`/${url}`}>
          <App markdown={initialData?.content || ''} />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          if (isPiped) return;
          isPiped = true;

          pipe(writable);
          writable.end();
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error('Streaming error observed:', error);
        }
      }
    );
  });
  return { body, head };
};