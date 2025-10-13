import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const projectRoot = process.cwd()
const templateHtml = isProduction
  ? await fs.readFile(path.join(projectRoot, "dist", "client", "index.html"), "utf-8")
  : ''

// Create http server
const app = express()

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
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv(path.join(projectRoot, "dist", "client"), { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('../src/entry-server.tsx').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile(path.join(projectRoot, "index.html"), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      const entryUrl = path.join(projectRoot, 'src', 'entry-server.tsx');
      render = (await vite.ssrLoadModule(entryUrl)).render
    } else {
      template = templateHtml;
      const entryUrl = pathToFileURL(path.join(projectRoot, 'dist', 'server', 'entry-server.js')).href;
      render = (await import(entryUrl)).render
    }

    const rendered = await render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
