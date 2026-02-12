import { useEffect, type DependencyList } from "react";
import { useHeadMount } from "./useMount";
import {
  DEFAULT_DESC,
  DEFAULT_KEYWORDS,
  DEFAULT_IMAGE,
  SITE_DOMAIN,
} from "@shared/common";


type Meta = {
  title: string
  url: string
  desc?: string
  keywords?: string
  image?: string
  type?: 'website' | 'article'
  date?: string
}


function updateMeta(selector: string, content?: string, qualifiedName: string = 'content') {
  let element = document.querySelector(selector);

  if (!element) {
    console.warn(`[Meta Update] 태그를 찾을 수 없습니다: ${selector}`);
    return;
  }

  let finalContent = content;
  if (!finalContent) {
    switch (selector) {
      case 'meta[name="description"]':
      case 'meta[property="og:description"]':
        finalContent = DEFAULT_DESC;
        break;

      case 'meta[name="keywords"]':
        finalContent = DEFAULT_KEYWORDS;
        break;

      case 'meta[property="og:image"]':
      case 'meta[name="twitter:image"]':
        finalContent = DEFAULT_IMAGE;
        break;

      case 'meta[property="og:url"]':
        finalContent = SITE_DOMAIN;
        break;

      case 'meta[property="og:type"]':
        finalContent = 'website';
        break;

      case 'meta[property="og:title"]':
        finalContent = document.title;
        break;

      default:
        console.warn(`[Meta Update] 기본값이 정의되지 않은 태그입니다: ${selector}`);
        break;
    }
  }

  if (finalContent) {
    element.setAttribute(qualifiedName, finalContent);
  }
}


function updateTitle(content?: string) {
  if (!content) return;
  document.title = content;
}


function updateDate(content?: string) {
  let element = document.querySelector('meta[property="article:published_time"]');

  if (content && !element) {
    element = document.createElement('meta');
    element.setAttribute('property', 'article:published_time');
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
  if (content && element) {
    element.setAttribute('content', content);
  }
  if (!content && element) {
    element.remove();
  }
}


export function updateHead(meta: Meta) {
  const {
    title,
    desc,
    keywords,
    url,
    image,
    type,
    date
  } = meta;
  updateTitle(title);
  updateMeta('meta[name="description"]', desc);
  updateMeta('meta[name="keywords"]', keywords);
  updateMeta('meta[property="og:title"]', title);
  updateMeta('meta[property="og:description"]', desc);
  updateMeta('meta[property="og:type"]', type);
  updateMeta('meta[property="og:url"]', url);
  updateMeta('meta[property="og:image"]', image);
  updateMeta('link[rel="canonical"]', url, 'href');
  updateDate(date);
}


export function useHead(meta: Meta, deps?: DependencyList) {
  const { headMountRef } = useHeadMount();

  useEffect(() => {
    if (!headMountRef.current) {
      return;
    }
    updateHead(meta);
  }, deps);
}
