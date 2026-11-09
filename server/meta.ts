import {
  SITE_NAME,
  DEFAULT_DESC,
  DEFAULT_KEYWORDS,
  DEFAULT_IMAGE,
  makeURL,
} from '@shared/common.ts';

export function generateMeta({
  url,
  title,
  desc,
  keywords,
  image,
  type = 'website',
  date,
}: {
  url: string;
  title?: string;
  desc?: string;
  keywords?: string;
  image?: string;
  type: 'website' | 'article';
  date?: string;
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
