import fs from 'node:fs/promises';
import path from 'node:path';
import { createHTML } from '@server/utils.ts';
import type { Render } from '@server/types.ts';
import type { InitialData } from '@shared/common.ts';

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
    const rendered = await render({ url: route, initialData });
    const html = createHTML({
      template,
      head: rendered.head,
      body: rendered.body,
      initialData: JSON.stringify(initialData),
    });
    const cleanRoute = route.replace(/\?/g, '_').replace(/%20/g, '-');
    const filePath = path.join(outputDirectory, route === '' ? 'index.html' : `${cleanRoute}.html`);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, html, 'utf8');
  }
}

