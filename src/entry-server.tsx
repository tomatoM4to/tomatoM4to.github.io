import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router';
import type { GrayMatterFile } from 'gray-matter';

const SITE_DOMAIN = 'https://tomatom4to.github.io';
const SITE_NAME = "tomatoM4to 의 개발 블로그";

function makeURL(url: string): string {
  if (url.length > 0 && url[0] === '/') {
    return `${SITE_DOMAIN}${url}`;
  }
  return `${SITE_DOMAIN}/${url}`;
}

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
  const defaultTitle: string = 'tomatoM4to Tech Log';
  const defaultDesc: string = '웹, 시스템 아키텍처, 그리고 컴퓨터 과학(CS) 원리를 깊이 있게 탐구합니다.';
  const defaultKeywords: string = '백엔드, 프론트 엔드, Nodejs, Backend, CS, 컴퓨터과학, 서버개발, 아키텍처';
  const defaultImage: string = makeURL('vite.svg');
  return (
    `<title>${title ?? defaultTitle}</title>
    <meta name="description" content="${desc ?? defaultDesc}" />
    <meta name="keywords" content="${keywords ?? defaultKeywords}" />
    <meta property="og:title" content="${title ?? defaultTitle}" />
    <meta property="og:description" content="${desc ?? defaultDesc}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${makeURL(url)}" />
    <meta property="og:image" content="${image ? makeURL(image) : defaultImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title ?? defaultTitle}" />
    <meta name="twitter:description" content="${desc ?? defaultDesc}" />
    <meta name="twitter:image" content="${image ? makeURL(image) : defaultImage}" />${date ? `
    <meta property="article:published_time" content="${date}" />` : ''}
    <meta name="author" content="tomatoM4to" />
    <link rel="canonical" href="${makeURL(url)}" />`
  );
}

export async function render(url: string, initialData: GrayMatterFile<string> | null) {
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
      title: `${title} - ${SITE_NAME}`,
      desc: description,
      keywords: keywords,
      date: date,
      image: image,
      type: 'article',
    });
  }

  const body = renderToString(
    <StrictMode>
      <StaticRouter location={`/${url}`}>
        <App markdown={initialData?.content || ''} />
      </StaticRouter>
    </StrictMode>,
  );

  return { body, head };
};