const CACHE_NAME = 'civic-report-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install - cache assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Fetch - serve from cache if available
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
      .catch(() => new Response('Offline', { status: 503 }))
  );
});