import fs from 'node:fs/promises';
import { createServer as createHttpServer } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express, { type Response } from 'express';
import { ViteDevServer } from 'vite';
import {
  createInitialData,
  getMarkdown,
  createTemplate,
  createHTML,
  getSortedContentList,
  getItemFromTag,
  validateContentName
} from '@server/utils.ts';
import { POSTS_PER_PAGE, type Item, type ContentList } from '@shared/common.ts';
import type { Render } from '@server/types.ts';

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const PROJECT_ROOT = process.cwd();
const PAGE_ROUTES = new Set(['', 'tags', 'search', 'license']);

let recentContentList: Item[] | null = null;

const app = express();
const httpServer = createHttpServer(app);

// '/api/:postname.md' 로 하면 req.params 에 .md 가 포함되지 않음
app.get('/api/posts/:postname/index.json', async (req, res) => {
  try {
    const { postname } = req.params;
    const markdown = await getMarkdown(postname);
    res.status(200).set({
      'Content-Type': 'application/json'
    }).send(JSON.stringify(markdown));
  }
  catch (error: unknown) {
    respondError(error, res);
  }
});

app.get('/api/recent/:index.json', async (req, res) => {
  try {
    const { index } = req.params;
    const page = Number(index);
    if (!Number.isSafeInteger(page) || page < 1 || String(page) !== index) {
      res.sendStatus(404);
      return;
    }
    if (!recentContentList) {
      recentContentList = await getSortedContentList();
    }
    if (page > Math.max(1, Math.ceil(recentContentList.length / POSTS_PER_PAGE))) {
      res.sendStatus(404);
      return;
    }
    const parsedIndex = (page - 1) * POSTS_PER_PAGE;

    const posts = recentContentList.slice(parsedIndex, parsedIndex + POSTS_PER_PAGE);
    const contentList: ContentList = {
      len: recentContentList.length,
      data: posts
    }
    res.status(200).json(contentList);
  }
  catch (error: unknown) {
    respondError(error, res);
  }
})

app.get('/api/tags/:tag.json', async (req, res) => {
  try {
    if (!recentContentList) {
      recentContentList = await getSortedContentList();
    }
    const { tag } = req.params;
    const tagContent = await getItemFromTag(recentContentList, tag);
    if (tagContent.len === 0) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(tagContent);
  }
  catch (error: unknown) {
    respondError(error, res);
  }
})


// Add Vite or respective production middlewares
let vite: ViteDevServer | undefined;

function respondError(error: unknown, res: Response) {
  if (error instanceof URIError) {
    res.sendStatus(400);
    return;
  }
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    res.sendStatus(404);
    return;
  }
  const failure = error instanceof Error ? error : new Error(String(error));
  vite?.ssrFixStacktrace(failure);
  console.error(failure);
  res.status(500).end(isProduction ? 'Internal Server Error' : failure.stack);
}

if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: {
      middlewareMode: true,
      // Docker에서 공개한 HTTP 포트로 HMR WebSocket도 연결한다.
      hmr: { server: httpServer },
    },
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
  app.use(base, sirv(path.join(PROJECT_ROOT, "dist"), { extensions: [] }))
}

app.use('*all', async (req, res) => {
  try {
    // ex) '', 'tags', 'search', 'posts/postname'
    const url = req.originalUrl.replace(base, '')
    const pathname = url.split('?', 1)[0]
    const contentPath = decodeURIComponent(pathname);
    if (!PAGE_ROUTES.has(contentPath)) {
      if (!contentPath.startsWith('posts/')) {
        res.sendStatus(404);
        return;
      }
      try {
        validateContentName(contentPath.slice('posts/'.length), 'post ID', req.originalUrl);
      } catch {
        res.sendStatus(404);
        return;
      }
    }

    const initialData = await createInitialData(contentPath);
    if (contentPath === 'tags') {
      initialData.selectedTag = new URLSearchParams(url.slice(pathname.length)).get('tag');
    }

    let template: string;
    /** @type {import('../src/entry-server.tsx').render} */
    let render: Render;
    if (!isProduction && vite) {
      // Always read fresh template in development
      template = await fs.readFile(path.join(PROJECT_ROOT, "index.html"), 'utf-8')
      template = await vite.transformIndexHtml(pathname, template)
      const entryUrl = path.join(PROJECT_ROOT, 'src', 'entry-server.tsx');
      render = (await vite.ssrLoadModule(entryUrl)).render
    }
    else {
      template = await createTemplate();
      const entryUrl = pathToFileURL(path.join(PROJECT_ROOT, 'dist', 'server', 'entry-server.js')).href;
      render = (await import(entryUrl)).render
    }

    const rendered = await render({url: url, initialData: initialData});

    const html = createHTML({
      template: template,
      head: rendered.head,
      body: rendered.body,
      initialData: JSON.stringify(initialData)
    })

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  }
  catch (error: unknown) {
    respondError(error, res);
  }
})

httpServer.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
