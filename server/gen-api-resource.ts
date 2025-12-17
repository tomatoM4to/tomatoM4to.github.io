import fs from 'node:fs/promises';
import path from 'node:path';
import matter, { type GrayMatterFile } from 'gray-matter';
import { getSortedContentList, Item } from './utils.ts';
const PROJECT_ROOT = process.cwd();


async function genMarkdownJSON(markdown: string) {
  const filePath = path.join(PROJECT_ROOT, 'content/posts', markdown, 'index.md');
  const destPath = path.join(PROJECT_ROOT, 'dist/api/posts', markdown);

  let fileContent: string;
  try {
    fileContent = await fs.readFile(filePath, 'utf-8');
  }
  catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error(`File not found : ${filePath}`);
    }
    throw err;
  }

  const content = matter(fileContent);

  await fs.mkdir(destPath, { recursive: true });
  await fs.writeFile(
    path.join(destPath, 'index.json'),
    JSON.stringify(content)
  );

  console.log(`🎉 Created content JSON to: ${destPath}`);
}

const contentList: string[] = [
  ...(await fs.readdir(path.join(PROJECT_ROOT, 'content/posts')))
]

for (const content of contentList) {
  await genMarkdownJSON(content);
}

async function genRecentPostList() {
  const newContentList = await getSortedContentList();

  let buffer: Item[] = [];
  let index = 1;
  for (const post of newContentList) {
    buffer.push(post);
    if (buffer.length >= 4) {
      const destPath = path.join(PROJECT_ROOT, 'dist/api/recent');
      await fs.mkdir(destPath, { recursive: true });
      await fs.writeFile(
        path.join(destPath, `${index++}.json`),
        JSON.stringify({
          len: newContentList.length,
          data: buffer
        })
      );
      buffer = [];
      console.log(`🎉 Created content JSON to: ${destPath}`);
    }
  }

  if (buffer.length > 0) {
    const destPath = path.join(PROJECT_ROOT, 'dist/api/recent');
    await fs.mkdir(destPath, { recursive: true });
    await fs.writeFile(
      path.join(destPath, `${index++}.json`),
      JSON.stringify({
        len: newContentList.length,
        data: buffer
      })
    );
    console.log(`🎉 Created content JSON to: ${destPath}`);
  }
}

genRecentPostList();

