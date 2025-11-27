import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from '@src/App';

// @ts-ignore
let initialData = window.__INITIAL_DATA__;

if (initialData === undefined) {
  initialData = "# Hydrate Error";
}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App markdown={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
