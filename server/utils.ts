import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from 'node:path';
import matter, { type GrayMatterFile } from "gray-matter";

const PROJECT_ROOT = process.cwd();
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts');

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
          postMap.set(post.name, path.join(yearDir, post.name, 'index.md'));
        }
      }
    } else {
      // 하위 호환: 연도 폴더 없이 바로 포스트 폴더가 있는 경우
      postMap.set(entry.name, path.join(POSTS_DIR, entry.name, 'index.md'));
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
          postMap.set(post.name, path.join(yearDir, post.name, 'index.md'));
        }
      }
    } else {
      postMap.set(entry.name, path.join(POSTS_DIR, entry.name, 'index.md'));
    }
  }

  return postMap;
}

/** postName 으로 실제 파일 경로를 찾는다 */
async function resolvePostPath(postName: string): Promise<string> {
  const postMap = await getAllPostPaths();
  const resolved = postMap.get(postName);
  if (resolved) return resolved;
  // fallback: 직접 경로
  return path.join(POSTS_DIR, postName, 'index.md');
}

export async function createInitialData(url: string): Promise<GrayMatterFile<string> | null> {
  if (!url.includes('posts')) {
    return null;
  }
  // url 은 "posts/postname" 형태
  const postName = url.replace(/^posts\//, '');
  const filePath = await resolvePostPath(postName);
  let fileContent;
  try {
    fileContent = await fs.readFile(filePath, 'utf-8');
  }
  catch (err) {
    console.error(`[ERROR] File not found or unreadable: ${filePath}`, err);
    throw new Error(`File not found: ${filePath}`);
  }
  return matter(fileContent);
}


export async function getMarkdown(name: string): Promise<GrayMatterFile<string>> {
  const filePath = await resolvePostPath(name);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return matter(fileContent);
  }
  catch (err) {
    console.error(`[ERROR] File not found or unreadable: ${filePath}`, err);
    throw new Error(`File not found: ${filePath}`);
  }
}


export async function createTemplate(): Promise<string> {
  const p = path.join(PROJECT_ROOT, "dist", 'index.html');
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
  const html = template
    .replace(`<!--app-head-->`, head ?? '')
    .replace(`<!--app-html-->`, body ?? '')
    .replace(
      `<!--app-window-->`,
      `<script>window.__INITIAL_DATA__ = ${initialData}</script>`
    );
    return html;
}

export type Item = {
  id: string
  title: string,
  description: string,
  date: string,
  image: string,
  keywords: string,
}

export type ContentList = {
  len: number,
  data: Item[]
}

export async function getSortedContentList(): Promise<Item[]> {
  const postMap = await getAllPostPaths();
  const newContentList: Item[] = [];

  for (const [postName, filePath] of postMap) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const meta = matter(fileContent);
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
    const dateA = new Date(a.date as string).getTime();
    const dateB = new Date(b.date as string).getTime();
    return dateB - dateA;
  });
  return newContentList;
}

export type Render = ({
  url,
  initialData
}: {
  url: string,
  initialData: GrayMatterFile<string> | null
}) => Promise<{
  body: string;
  head: string;
}>;

export async function getTags(): Promise<Record<string, number>> {
  const postMap = await getAllPostPaths();
  const tagCount: Record<string, number> = {};

  for (const [postName, filePath] of postMap) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const meta = matter(fileContent);

    if (meta.data.keywords) {
      for (const keyword of meta.data.keywords.split(',')) {
        const trimmed = keyword.trim();
        tagCount[trimmed] = (tagCount[trimmed] || 0) + 1;
      }
    }
  }
  return tagCount;
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

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};