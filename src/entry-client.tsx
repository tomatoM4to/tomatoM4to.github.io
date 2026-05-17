import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { type InitialData } from '@shared/common';
import App from '@src/App';

// @ts-ignore
const initialData: InitialData = window.__INITIAL_DATA__;

// if (import.meta.env.PROD && 'serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then((registration) => {
//       const sendEtagMap = () => {
//         // @ts-ignore
//         if (window.__ETAG_MAP__ && navigator.serviceWorker.controller) {
//           navigator.serviceWorker.controller.postMessage({
//             type: 'UPDATE_ETAG_MAP',
//             // @ts-ignore
//             payload: window.__ETAG_MAP__
//           });
//         }
//       };

//       sendEtagMap();
//       navigator.serviceWorker.addEventListener('controllerchange', sendEtagMap);
//     }).catch(error => {
//       console.log('SW registration failed: ', error);
//     });
//   });
// }

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
