const CACHE_NAME = 'tomato-etag-cache-v1';
const ETAG_MAP_CACHE_KEY = '/__etag_map__';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_ETAG_MAP') {
    const etagMap = event.data.payload || {};
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.put(
          new Request(ETAG_MAP_CACHE_KEY),
          new Response(JSON.stringify(etagMap))
        );
      })
    );
  }
});

async function getEtagMap() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(ETAG_MAP_CACHE_KEY);
    if (response) {
      return await response.json();
    }
  } catch (e) {
    console.error('Failed to get ETag map from cache', e);
  }
  return {};
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  event.respondWith(
    (async () => {
      // 1. Navigation requests (HTML) MUST go to the network to get the fresh HTML + ETag map.
      if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.startsWith('/posts/')) {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_NAME);
          event.waitUntil(cache.put(event.request, networkResponse.clone()));
          return networkResponse;
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(event.request);
          if (cached) return cached;
          throw err;
        }
      }

      // 2. Other requests (assets, api) use ETag mapping
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      
      let etagMap = await getEtagMap();
      const currentEtag = etagMap[url.pathname];

      if (cachedResponse) {
        const cachedEtag = cachedResponse.headers.get('X-SW-ETag');
        
        // If ETags match, serve from cache immediately without network request (0 RTT)
        if (cachedEtag && currentEtag && cachedEtag === currentEtag) {
          return cachedResponse;
        }
      }

      // 3. Not in cache or ETag mismatch
      try {
        const networkResponse = await fetch(event.request);
        const responseToCache = networkResponse.clone();
        
        if (currentEtag) {
          const headers = new Headers(responseToCache.headers);
          headers.set('X-SW-ETag', currentEtag);
          
          const responseWithEtag = new Response(await responseToCache.blob(), {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
          });
          event.waitUntil(cache.put(event.request, responseWithEtag));
        } else {
          event.waitUntil(cache.put(event.request, responseToCache));
        }

        return networkResponse;
      } catch (error) {
        if (cachedResponse) return cachedResponse;
        throw error;
      }
    })()
  );
});
