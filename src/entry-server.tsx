import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router';


export async function render(_url: string, initialData: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={`/${_url}`}>
        <App markdown={initialData} />
      </StaticRouter>
    </StrictMode>,
  )
  return { html }
};
