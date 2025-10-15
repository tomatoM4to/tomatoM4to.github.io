import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router';

export function render(_url: string) {
  const url = `${_url}`;

  // call SSR function or API
  const initialData = "# 서버에서 렌더링됨!"

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App someProps="Hello from the server" markdown={initialData} />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, initialData }
};
