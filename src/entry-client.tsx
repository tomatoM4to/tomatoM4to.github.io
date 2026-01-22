import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { type GrayMatterFile } from 'gray-matter';
import App from '@src/App';

// @ts-ignore
const rawData = window.__INITIAL_DATA__;

let initialData: GrayMatterFile<string> | null = null;
if (rawData && rawData !== "") {
  initialData = rawData as GrayMatterFile<string>;
}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
