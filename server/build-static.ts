import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateStaticPages } from '@server/gen-static.ts';
import { createInitialData, createTemplate, getAllPostPathsSync } from '@server/utils.ts';
import type { Render } from '@server/types.ts';

const outputDirectory = path.resolve('dist');
const rendererURL = pathToFileURL(path.join(outputDirectory, 'server', 'entry-server.js')).href;
const render: Render = (await import(rendererURL)).render;

await generateStaticPages({
  postNames: [...getAllPostPathsSync().keys()],
  template: await createTemplate(),
  render,
  loadInitialData: createInitialData,
  outputDirectory,
});

console.log('✅ Static HTML generation completed.');
