import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router';

export function render(_url: string) {
  const url = `${_url}`;

  // call SSR function or API

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App someProps="Hello from the server" />
      </StaticRouter>
    </StrictMode>,
  )
  return { html }
};
