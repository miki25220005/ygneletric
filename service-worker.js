// Cache name
const CACHE_NAME = 'electricity-checker-v17-compact-hours-loadshed';

// Core assets to pre-cache
const urlsToCache = [
    './',
    './index.html',
    './style.css?v=17',
    './script.js?v=17',
    './manifest.json',
    './sitemap.xml',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Install: Cache critical assets immediately
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(err => {
                console.warn('Some secondary assets could not be cached immediately:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate: Purge obsolete previous caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Stale-while-revalidate or Cache-first strategy for maximum offline resilience
self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Return cached resource immediately, fetch in background to update
                fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {
                    // Running offline, background revalidation ignored
                });
                return cachedResponse;
            }

            // Fallback to network
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // If offline and requesting an HTML document, fallback to index.html
                if (event.request.headers.get('accept')?.includes('text/html')) {
                    return caches.match('./index.html') || caches.match('/index.html');
                }
            });
        })
    );
});