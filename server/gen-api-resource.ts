import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
const PROJECT_ROOT = process.cwd();

async function genMarkdownJSON(markdown: string) {
  const filePath = path.join(PROJECT_ROOT, 'content/posts', markdown, 'index.md');
  const destPath = path.join(PROJECT_ROOT, 'dist', 'api', markdown);

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