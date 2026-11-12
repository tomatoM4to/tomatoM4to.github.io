import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from 'node:path';
import matter, { type GrayMatterFile } from "gray-matter";
import { type InitialData, type Item, type ContentList, type TagsData } from "@shared/common.ts";
import { type MarkdownPost } from "@server/types.ts";

const PROJECT_ROOT = process.cwd();
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts');
const REQUIRED_META_FIELDS = ['title', 'description', 'date', 'keywords'] as const;
const POST_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INVALID_FILENAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f]/;
const RESERVED_FILENAME = /^(?:CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])(?:\.|$)/i;
const MAX_FILENAME_BYTES = 255;

export function validateContentName(name: string, field: 'post ID' | 'tag', filePath: string) {
  let reason = '';
  if (!name) reason = 'expected a non-empty filename';
  else if (field === 'post ID' && /\.html$/i.test(name)) reason = 'post ID must not end with .html';
  else if (INVALID_FILENAME_CHARACTERS.test(name)) reason = 'contains a forbidden filename character';
  else if (/[. ]$/.test(name)) reason = 'filename must not end with a dot or space';
  else if (RESERVED_FILENAME.test(name)) reason = 'reserved Windows filename';
  else if (Buffer.byteLength(`${name}.html`, 'utf8') > MAX_FILENAME_BYTES) reason = 'generated filename exceeds 255 UTF-8 bytes';
  if (reason) throw new Error(`Invalid ${field} ${JSON.stringify(name)} in ${filePath}: ${reason}`);
}

function addPostPath(postMap: Map<string, string>, postName: string, filePath: string) {
  validateContentName(postName, 'post ID', filePath);
  const previousPath = postMap.get(postName);
  if (previousPath) {
    throw new Error(`Duplicate post ID "${postName}": ${previousPath}, ${filePath}`);
  }
  postMap.set(postName, filePath);
}

function validatePost(markdown: GrayMatterFile<string>, filePath: string): asserts markdown is MarkdownPost {
  const metadata: Record<string, unknown> = markdown.data;

  for (const field of REQUIRED_META_FIELDS) {
    if (typeof metadata[field] !== 'string') {
      throw new Error(`Invalid ${field} in ${filePath}: expected a string`);
    }
  }

  if (typeof metadata.keywords === 'string' && metadata.keywords) {
    for (const keyword of metadata.keywords.split(',')) {
      validateContentName(keyword.trim(), 'tag', filePath);
    }
  }

  const date = metadata.date;
  if (typeof date !== 'string' || !POST_DATE_PATTERN.test(date)) {
    throw new Error(`Invalid date in ${filePath}: expected YYYY-MM-DD`);
  }
  const timestamp = Date.parse(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid date in ${filePath}: ${date}`);
  }
  if (metadata.image !== undefined && typeof metadata.image !== 'string') {
    throw new Error(`Invalid image in ${filePath}: expected a string`);
  }
}

export async function readPost(filePath: string): Promise<MarkdownPost> {
  const markdown = matter(await fs.readFile(filePath, 'utf8'));
  validatePost(markdown, filePath);
  return markdown;
}

/**
 * content/posts 하위의 연도 폴더(2021, 2022, ...)를 모두 스캔하여
 * postName -> 실제 파일 경로 매핑을 반환한다.
 * 연도 폴더가 아닌 직접 하위 폴더도 하위 호환을 위해 포함한다.
 */
export async function getAllPostPaths(): Promise<Map<string, string>> {
  const postMap = new Map<string, string>();
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    // 연도 폴더인 경우 (4자리 숫자)
    if (/^\d{4}$/.test(entry.name)) {
      const yearDir = path.join(POSTS_DIR, entry.name);
      const posts = await fs.readdir(yearDir, { withFileTypes: true });
      for (const post of posts) {
        if (post.isDirectory()) {
          addPostPath(postMap, post.name, path.join(yearDir, post.name, 'index.md'));
        }
      }
    } else {
      // 하위 호환: 연도 폴더 없이 바로 포스트 폴더가 있는 경우
      addPostPath(postMap, entry.name, path.join(POSTS_DIR, entry.name, 'index.md'));
    }
  }

  return postMap;
}

/**
 * 동기 버전 - gen-static.ts 에서 사용
 */
export function getAllPostPathsSync(): Map<string, string> {
  const postMap = new Map<string, string>();
  const entries = fsSync.readdirSync(POSTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    if (/^\d{4}$/.test(entry.name)) {
      const yearDir = path.join(POSTS_DIR, entry.name);
      const posts = fsSync.readdirSync(yearDir, { withFileTypes: true });
      for (const post of posts) {
        if (post.isDirectory()) {
          addPostPath(postMap, post.name, path.join(yearDir, post.name, 'index.md'));
        }
      }
    } else {
      addPostPath(postMap, entry.name, path.join(POSTS_DIR, entry.name, 'index.md'));
    }
  }

  return postMap;
}

/** postName 으로 실제 파일 경로를 찾는다 */
async function resolvePostPath(postName: string): Promise<string> {
  validateContentName(postName, 'post ID', POSTS_DIR);
  const postMap = await getAllPostPaths();
  const resolved = postMap.get(postName);
  if (resolved) return resolved;
  // fallback: 직접 경로
  return path.join(POSTS_DIR, postName, 'index.md');
}

export async function createInitialData(url: string): Promise<InitialData> {
  // 모든 페이지에 태그 데이터 포함
  const tags = await getTags();

  if (url === 'tags') {
    return { tags, selectedTag: null };
  }

  if (!url.startsWith('posts/')) {
    return { tags };
  }
  // url 은 "posts/postname" 형태
  const postName = url.replace(/^posts\//, '');
  return { post: await getMarkdown(postName), tags };
}


export async function getMarkdown(name: string): Promise<MarkdownPost> {
  return readPost(await resolvePostPath(name));
}


export async function createTemplate(): Promise<string> {
  const templatePath = path.join(PROJECT_ROOT, "dist", 'template.html');
  const p = fsSync.existsSync(templatePath) ? templatePath : path.join(PROJECT_ROOT, "dist", 'index.html');
  return await fs.readFile(p, 'utf-8');
}


export function createHTML({
  template,
  head,
  body,
  initialData
}: {
  template: string,
  head: string,
  body: string,
  initialData: string // JSON
}) {
  const safeData = JSON.stringify(initialData).replace(/</g, '\\u003c');
  return template.replace(/<!--app-(?:head|html|window)-->/g, marker => {
    if (marker === '<!--app-head-->') return head ?? '';
    if (marker === '<!--app-html-->') return body ?? '';
    return `<script>window.__INITIAL_DATA__ = JSON.parse(${safeData})</script>`;
  });
}

export async function getSortedContentList(): Promise<Item[]> {
  const postMap = await getAllPostPaths();
  const newContentList: Item[] = [];

  for (const [postName, filePath] of postMap) {
    const meta = await readPost(filePath);
    newContentList.push({
      id: postName,
      title: meta.data.title,
      description: meta.data.description,
      date: meta.data.date,
      image: meta.data.image,
      keywords: meta.data.keywords
    });
  }
  newContentList.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  return newContentList;
}

export async function getTags(): Promise<TagsData> {
  const postMap = await getAllPostPaths();
  const tagCount = new Map<string, number>();

  for (const [, filePath] of postMap) {
    const meta = await readPost(filePath);

    if (meta.data.keywords) {
      for (const keyword of meta.data.keywords.split(',')) {
        const trimmed = keyword.trim();
        tagCount.set(trimmed, (tagCount.get(trimmed) || 0) + 1);
      }
    }
  }
  return Object.fromEntries(tagCount);
}


export async function getItemFromTag(
  sortedContentList: Item[], tag: string
): Promise<ContentList> {
  const filteredItems = sortedContentList.filter(item => {
    if (!item.keywords) return false;
    const keywords = item.keywords.split(',').map(k => k.trim());
    return keywords.includes(tag);
  });

  return {
    len: filteredItems.length,
    data: filteredItems
  };
}

export async function randDelay() {
  return new Promise<void>((resolve) => {
    if (Math.random() < 0.1) {
      setTimeout(resolve, 100)
    }
    else {
      resolve()
    }
  });
};
