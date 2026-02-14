import { type GrayMatterFile } from 'gray-matter';

export const SITE_DOMAIN = 'https://tomatom4to.github.io';
export const SITE_NAME = "tomatoM4to Tech Log";
export const DEFAULT_DESC = '웹, 시스템 아키텍처, 그리고 컴퓨터 과학(CS) 원리를 깊이 있게 탐구합니다.';
export const DEFAULT_KEYWORDS = '백엔드, 프론트 엔드, Nodejs, Backend, CS, 컴퓨터과학, 서버개발, 아키텍처';
export const DEFAULT_IMAGE = 'https://tomatom4to.github.io/terminal.svg';
export const POSTS_PER_PAGE = 5;

export type TagsData = Record<string, number>;

export type InitialData = {
  post?: GrayMatterFile<string>;
  tags: TagsData;
};

export function makeURL(url: string): string {
  if (url.length > 0 && url[0] === '/') {
    return `${SITE_DOMAIN}${url}`;
  }
  return `${SITE_DOMAIN}/${url}`;
}