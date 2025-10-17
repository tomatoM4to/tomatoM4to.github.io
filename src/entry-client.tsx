import './index.css';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router';

// @ts-ignore
let initialData = window.__INITIAL_DATA__;

if (initialData === undefined) {
  initialData = "# Hydrate Error";
}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App someProps={"Hello Client-Side"} markdown={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
