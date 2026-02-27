const CACHE_NAME = 'punttilaattori-v4-cache';
const ASSETS = [
  './',
  './index.html', // rename your dashboard file to index.html if you haven't
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event: cache all necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Fetch event: serve from cache if offline, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found, otherwise fetch from network
        return response || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            // Cache new external requests dynamically
            if (event.request.url.startsWith('https')) {
              cache.put(event.request.url, fetchRes.clone());
            }
            return fetchRes;
          });
        });
      })
  );
});