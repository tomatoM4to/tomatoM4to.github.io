import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  getAllPostPaths,
  getItemFromTag,
  getSortedContentList,
  getTags,
  type Item,
  delay
} from '@server/utils.ts';


const PROJECT_ROOT = process.cwd();


async function genMarkdownJSON(postName: string, filePath: string) {
  const destPath = path.join(PROJECT_ROOT, 'dist/api/posts', postName);

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

  const { orig, ...content } = matter(fileContent);

  await fs.mkdir(destPath, { recursive: true });
  await fs.writeFile(
    path.join(destPath, 'index.json'),
    JSON.stringify(content)
  );

  console.log(`🎉 Created content JSON to: ${destPath}`);
}


async function genRecentPostList(sortedContentList: Item[]) {
  let buffer: Item[] = [];
  let index = 1;
  for (const post of sortedContentList) {
    buffer.push(post);
    if (buffer.length >= 4) {
      const destPath = path.join(PROJECT_ROOT, 'dist/api/recent');
      await fs.mkdir(destPath, { recursive: true });
      await fs.writeFile(
        path.join(destPath, `${index++}.json`),
        JSON.stringify({
          len: sortedContentList.length,
          data: buffer
        })
      );
      buffer = [];
      console.log(`🐍 Created content JSON to: ${destPath}`);
    }
  }

  if (buffer.length > 0) {
    const destPath = path.join(PROJECT_ROOT, 'dist/api/recent');
    await fs.mkdir(destPath, { recursive: true });
    await fs.writeFile(
      path.join(destPath, `${index++}.json`),
      JSON.stringify({
        len: sortedContentList.length,
        data: buffer
      })
    );
    console.log(`🐍 Created content JSON to: ${destPath}`);
  }
}

async function createTagContentList(sortedContentList: Item[]) {
  const allTags = await getTags();
  const destPath = path.join(PROJECT_ROOT, 'dist/api/tags');
  await fs.mkdir(destPath, { recursive: true });
  for (const [tag, count] of Object.entries(allTags)) {
    const tagContent = await getItemFromTag(sortedContentList, tag);
    const newDestPath = path.join(destPath, `${tag}.json`);
    await fs.writeFile(
      newDestPath,
      JSON.stringify(tagContent)
    );
    console.log(`❄️ Created Tag-Content JSON to: ${newDestPath}`);
  }
}

(async function main() {
  const sortedContentList = await getSortedContentList();
  const postMap = await getAllPostPaths();

  for (const [postName, filePath] of postMap) {
    genMarkdownJSON(postName, filePath);
  }
  await delay(100);
  await genRecentPostList(sortedContentList);
  await delay(100);
  await createTagContentList(sortedContentList);
})();

