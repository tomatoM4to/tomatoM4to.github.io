import {
  SITE_NAME,
  DEFAULT_DESC,
  DEFAULT_KEYWORDS,
  DEFAULT_IMAGE,
  makeURL,
} from '@shared/common.ts';

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, character => HTML_ENTITIES[character]);
}

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
  const pageTitle = escapeHTML(title ?? SITE_NAME);
  const description = escapeHTML(desc ?? DEFAULT_DESC);
  const pageURL = escapeHTML(makeURL(url));
  return (
    `<title>${pageTitle}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${escapeHTML(keywords ?? DEFAULT_KEYWORDS)}" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${pageURL}" />
    <meta property="og:image" content="${escapeHTML(image ? makeURL(image) : DEFAULT_IMAGE)}" />
    <meta name="twitter:card" content="summary_large_image" />${date ? `
    <meta property="article:published_time" content="${escapeHTML(date)}" />` : ''}
    <meta name="author" content="tomatoM4to" />
    <link rel="canonical" href="${pageURL}" />`
  );
}
