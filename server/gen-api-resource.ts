import fs from 'node:fs/promises';
import path from 'node:path';
import type { GrayMatterFile } from 'gray-matter';
import { getItemFromTag } from '@server/utils.ts';
import type { Item } from '@server/types.ts';
import { POSTS_PER_PAGE, type TagsData } from '@shared/common.ts';

export async function generatePostJSON({
  postName,
  markdown,
  outputDirectory,
}: {
  postName: string;
  markdown: GrayMatterFile<string>;
  outputDirectory: string;
}) {
  const destination = path.join(outputDirectory, 'api', 'posts', postName);
  const { orig, ...content } = markdown;

  await fs.mkdir(destination, { recursive: true });
  await fs.writeFile(path.join(destination, 'index.json'), JSON.stringify(content), 'utf8');
}

export async function generateRecentPostLists({
  contentList,
  outputDirectory,
}: {
  contentList: Item[];
  outputDirectory: string;
}) {
  for (let offset = 0; offset < contentList.length; offset += POSTS_PER_PAGE) {
    const destination = path.join(outputDirectory, 'api', 'recent');
    const page = offset / POSTS_PER_PAGE + 1;
    const content = {
      len: contentList.length,
      data: contentList.slice(offset, offset + POSTS_PER_PAGE),
    };

    await fs.mkdir(destination, { recursive: true });
    await fs.writeFile(path.join(destination, `${page}.json`), JSON.stringify(content), 'utf8');
  }
}

export async function generateTagLists({
  contentList,
  tags,
  outputDirectory,
}: {
  contentList: Item[];
  tags: TagsData;
  outputDirectory: string;
}) {
  const destination = path.join(outputDirectory, 'api', 'tags');
  await fs.mkdir(destination, { recursive: true });

  for (const tag of Object.keys(tags)) {
    const content = await getItemFromTag(contentList, tag);
    await fs.writeFile(path.join(destination, `${tag}.json`), JSON.stringify(content), 'utf8');
  }
}

