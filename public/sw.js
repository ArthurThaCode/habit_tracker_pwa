const CACHE_NAME = 'habit-tracker-v2';
const STATIC_ASSETS_PATH = '/_next/static/';
const ASSETS_TO_CACHE = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

// Assets loaded before this worker took control of the page never reach the fetch handler.
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_STATIC_ASSETS') return;
  const urls = event.data.urls.filter((url) => {
    const { origin, pathname } = new URL(url);
    return origin === self.location.origin && pathname.startsWith(STATIC_ASSETS_PATH);
  });
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urls)));
});

function fetchAndCacheStaticAsset(request) {
  return fetch(request).then((response) => {
    if (response.ok && new URL(request.url).pathname.startsWith(STATIC_ASSETS_PATH)) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetchAndCacheStaticAsset(event.request).catch(() => {
        // Fallback to cached index if fetch fails (e.g. offline)
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
