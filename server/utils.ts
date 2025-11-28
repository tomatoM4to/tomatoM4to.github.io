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


export async function getMarkdown(name: string): Promise<string> {
  const filePath = path.join(PROJECT_ROOT, 'content', 'posts', name, 'index.md');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return matter(fileContent).content;
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