// Cache name
const CACHE_NAME = 'electricity-checker-v3'; // Updated to force re-caching

// Files to cache (include all assets needed for offline use)
const urlsToCache = [
    '/',
    '/index.html',
    '/index-dark.html',
    '/script.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.ttf'
];

// Install the service worker and cache assets immediately
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Service Worker: Caching files...');
            return cache.addAll(urlsToCache).then(() => {
                console.log('Service Worker: All files cached successfully!');
            }).catch(error => {
                console.error('Service Worker: Failed to cache some resources:', error);
            });
        })
    );
    self.skipWaiting(); // Force the service worker to activate immediately
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of all clients immediately
});

// Fetch event to serve cached content when offline (cache-first strategy)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Service Worker: Serving from cache:', event.request.url);
                return response;
            }
            console.log('Service Worker: Fetching from network:', event.request.url);
            // If not in cache, fetch from network and cache the response
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                // Cache the fetched response
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(error => {
                console.error('Service Worker: Fetch failed (offline):', error);
                // Fallback to index.html if offline and resource not cached
                return caches.match('/index.html');
            });
        })
    );
});