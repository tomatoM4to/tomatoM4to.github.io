import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from '@src/App';
import { prepareServiceWorker } from '@src/lib/serviceWorker';

async function bootstrap() {
  performance.mark('app:cache-sync-start');
  const status = await prepareServiceWorker();
  performance.mark('app:cache-sync-end');
  performance.measure('app:cache-sync', {
    start: 'app:cache-sync-start',
    end: 'app:cache-sync-end',
    detail: { status },
  });

  // load를 기다리지 않고 모든 페이지의 초기 effect가 맵 반영 뒤 실행되게 한다.
  performance.mark('app:hydrate-start');
  hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <StrictMode>
      <BrowserRouter>
        <App initialData={window.__INITIAL_DATA__} />
      </BrowserRouter>
    </StrictMode>,
  );
}

void bootstrap();
