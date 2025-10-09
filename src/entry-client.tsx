import './index.css';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App someProps={"Hello Client-Side"} />
    </BrowserRouter>
  </StrictMode>,
);
