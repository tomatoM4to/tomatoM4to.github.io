import fs from "node:fs/promises";
import path from 'node:path';

const PROJECT_ROOT = process.cwd();

export async function getMarkdown(url) {
  let initialData = JSON.stringify('');
  if (url !== '') {
    const initialDataPath = path.join(PROJECT_ROOT, "content", `${url}.md`);
    initialData = await fs.readFile(initialDataPath, 'utf-8');
    initialData = JSON.stringify(initialData);
  }
  return initialData;
}
