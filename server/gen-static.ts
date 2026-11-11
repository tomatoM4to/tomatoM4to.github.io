import fs from 'node:fs/promises';
import path from 'node:path';
import { createHTML } from '@server/utils.ts';
import type { Render } from '@server/types.ts';
import { encodePostId, type InitialData } from '@shared/common.ts';

export async function generateStaticPages({
  postNames,
  template,
  render,
  loadInitialData,
  outputDirectory,
}: {
  postNames: string[];
  template: string;
  render: Render;
  loadInitialData: (route: string) => Promise<InitialData>;
  outputDirectory: string;
}) {
  const routes = ['', 'search', 'tags', 'license', ...postNames.map(name => `posts/${name}`)];
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(path.join(outputDirectory, 'template.html'), template, 'utf8');

  for (const route of routes) {
    const initialData = await loadInitialData(route);
    const url = route.startsWith('posts/') ? `posts/${encodePostId(route.slice('posts/'.length))}` : route;
    const rendered = await render({ url, initialData });
    const html = createHTML({
      template,
      head: rendered.head,
      body: rendered.body,
      initialData: JSON.stringify(initialData),
    });
    const filePath = path.join(outputDirectory, route === '' ? 'index.html' : `${route}.html`);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, html, 'utf8');
  }
}

