import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router';
import path from 'node:path';
import fs from 'node:fs/promises';

export async function render(_url: string) {
  let contentPath: string;
  if (_url === "") {
    contentPath = path.join(process.cwd(), "content", "index.md")
  }
  else {
    contentPath = path.join(process.cwd(), "content", `${_url}.md`);
  }
  const initialData = await fs.readFile(contentPath, 'utf8');

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={`/${_url}`}>
        <App someProps="Hello from the server" markdown={initialData} />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, initialData }
};
