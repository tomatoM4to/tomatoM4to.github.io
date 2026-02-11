import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { type InitialData } from '@src/shared/common';
import App from '@src/App';

// @ts-ignore
const initialData: InitialData = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
