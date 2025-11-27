import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import type { GrayMatterFile } from 'gray-matter';
import { ViteDevServer } from 'vite';
import {
  createInitialData,
  getMarkdown,
  createTemplate,
  createHTML
} from '@server/utils.ts';

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const PROJECT_ROOT = process.cwd();

const app = express();

// '/api/:postname.md' 로 하면 req.params 에 .md 가 포함되지 않음
app.get('/api/:postname/index.md', async (req, res) => {
  try {
    const { postname } = req.params;
    const markdown = await getMarkdown(postname);
    res.status(200).set({
      'Content-Type': 'text/plain'
    }).send(markdown);
  }
  catch (e: any) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
});

app.get('/api', (req, res) => {
  console.log('api call route');
  res.status(200).json({ message: 'API root endpoint' });
});

// Add Vite or respective production middlewares
let vite: ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
}
else {
  // @ts-ignore
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv(path.join(PROJECT_ROOT, "dist", "client"), { extensions: [] }))
}

app.use('*all', async (req, res) => {
  try {
    // ex) '', 'tags', 'search', 'posts/postname'
    const url = req.originalUrl.replace(base, '')

    const initialData: GrayMatterFile<string> | null = await createInitialData(url);

    /** @type {string} */
    let template: string;
    /** @type {import('../src/entry-server.tsx').render} */
    let render
    if (!isProduction && vite) {
      // Always read fresh template in development
      template = await fs.readFile(path.join(PROJECT_ROOT, "index.html"), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      const entryUrl = path.join(PROJECT_ROOT, 'src', 'entry-server.tsx');
      render = (await vite.ssrLoadModule(entryUrl)).render
    }
    else {
      template = await createTemplate();
      const entryUrl = pathToFileURL(path.join(PROJECT_ROOT, 'dist', 'server', 'entry-server.js')).href;
      render = (await import(entryUrl)).render
    }

    const rendered = await render(url, initialData);

    const html = createHTML({
      template: template,
      head: rendered.head,
      body: rendered.body,
      initialData: initialData ? JSON.stringify(initialData.content) : JSON.stringify("")
    })

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  }
  catch (e: any) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
