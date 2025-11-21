import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import { createInitialData, getMarkdown, createTemplate, createHTML } from './utils.js';

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const PROJECT_ROOT = process.cwd();

const app = express();

// '/api/:postname.md' 로 하면 req.params 에 .md 가 포함되지 않음
app.get('/api/:postname/index.md', async (req, res) => {
  const { postname } = req.params;

  const markdown = await getMarkdown(postname);

  res.status(200).set({
    'Content-Type': 'text/plain'
  }).send(markdown)
});

app.get('/api', (req, res) => {
  console.log('api call route');
  res.status(200).json({ message: 'API root endpoint' });
});

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
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
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv(path.join(PROJECT_ROOT, "dist", "client"), { extensions: [] }))
}

app.use('*all', async (req, res) => {
  try {
    // ex) '', 'tags', 'search', 'posts/postname'
    const url = req.originalUrl.replace(base, '')

    /** @type {Promise<matter.GrayMatterFile<string>> | null} */
    const initialData = await createInitialData(url);

    /** @type {string} */
    let template
    /** @type {import('../src/entry-server.tsx').render} */
    let render
    if (!isProduction) {
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

    const html = createHTML(
      template,
      rendered.head ?? '',
      rendered.body ?? '',
      JSON.stringify(initialData.content)
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  }
  catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
