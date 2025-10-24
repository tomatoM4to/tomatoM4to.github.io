import fs from "node:fs/promises";
import path from 'node:path';

const PROJECT_ROOT = process.cwd();

export async function getMarkdownFromUrl(url) {
  let initialData = JSON.stringify('');
  if (url === '') {
    return initialData;
  }
  const initialDataPath = path.join(PROJECT_ROOT, "content", url, 'index.md');
  try {
    initialData = await fs.readFile(initialDataPath, 'utf-8');
    return JSON.stringify(initialData);
  }
  catch {
    return JSON.stringify(`ERROR : File not found : ${initialDataPath}`);
  }
}

export async function getMarkdownFromName(name) {
  const markdownPath = path.join(PROJECT_ROOT, 'content', 'posts', name, 'index.md');
  try {
    const markdown = await fs.readFile(markdownPath, 'utf-8');
    return markdown;
  }
  catch {
    return `ERROR : File not found : ${markdownPath}`;
  }
}