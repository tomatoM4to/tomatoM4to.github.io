import fs from "node:fs/promises";
import path from 'node:path';
import matter, { type GrayMatterFile } from "gray-matter";

const PROJECT_ROOT = process.cwd();


export async function createInitialData(url: string): Promise<GrayMatterFile<string> | null> {
  if (!url.includes('posts')) {
    return null;
  }
  const initialDataPath = path.join(PROJECT_ROOT, "content", url, 'index.md');
  let fileContent;
  try {
    fileContent = await fs.readFile(initialDataPath, 'utf-8');
  }
  catch (err) {
    console.error(`[ERROR] File not found or unreadable: ${initialDataPath}`, err);
    throw new Error(`File not found: ${initialDataPath}`);
  }
  return matter(fileContent);
}


export async function getMarkdown(name: string): Promise<GrayMatterFile<string>> {
  const filePath = path.join(PROJECT_ROOT, 'content', 'posts', name, 'index.md');
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

export async function getSortedContentList(): Promise<Item[]> {
  const contentList: string[] = [
    ...(await fs.readdir(path.join(PROJECT_ROOT, 'content/posts')))
  ]
  const newContentList: Item[] = [];

  for (const post of contentList) {
    const filePath = path.join(PROJECT_ROOT, 'content/posts', post, 'index.md');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const meta = matter(fileContent);
    newContentList.push({
      id: post,
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