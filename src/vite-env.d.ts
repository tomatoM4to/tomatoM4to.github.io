/// <reference types="vite/client" />

interface Window {
  __INITIAL_DATA__: import('@shared/common').InitialData;
  __ETAG_MAP__?: Record<string, string>;
}
