import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { generatePostJSON, generateRecentPostLists, generateTagLists } from '@server/gen-api-resource.ts';
import { getAllPostPaths, getSortedContentList, getTags } from '@server/utils.ts';

const outputDirectory = path.resolve('dist');
const contentList = await getSortedContentList();
const postPaths = await getAllPostPaths();

for (const [postName, filePath] of postPaths) {
  const markdown = matter(await fs.readFile(filePath, 'utf8'));
  await generatePostJSON({ postName, markdown, outputDirectory });
}

await generateRecentPostLists({ contentList, outputDirectory });
await generateTagLists({ contentList, tags: await getTags(), outputDirectory });

console.log('✅ Static API generation completed.');
