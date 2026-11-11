import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { PassThrough } from 'node:stream';

import {
  SITE_NAME,
  type InitialData
} from '@shared/common';
import App from '@src/App';
import { generateMeta } from '../server/meta.ts';

export async function render({
  url,
  initialData,
}: {
  url: string,
  initialData: InitialData,
}): Promise<{ body: string; head: string; }> {
  const pathname = url.split('?', 1)[0];
  let head = '';
  if (pathname === '') {
    // Home
    head = generateMeta({
      url: pathname,
      type: 'website'
    });
  }
  if (pathname === 'tags') {
    head = generateMeta({
      url: pathname,
      title: `${SITE_NAME} - tags`,
      type: 'website'
    });
  }
  if (pathname === 'search') {
    // 검색 페이지는 noindex 처리 유지
    head = generateMeta({
      url: pathname,
      title: `${SITE_NAME} - search`,
      type: 'website',
    })
  }
  if (pathname === 'license') {
    head = generateMeta({
      url: pathname,
      title: `${SITE_NAME} - license`,
      type: 'website',
    });
  }
  if (pathname.startsWith('posts/') && initialData.post?.data) {
    // 개별 포스트 페이지
    const { title, description, image, keywords, date } = initialData.post.data;
    head = generateMeta({
      url: pathname,
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
          <App initialData={initialData} />
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
