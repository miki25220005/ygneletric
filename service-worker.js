// Cache name
const CACHE_NAME = 'electricity-checker-v1';

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
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.woff2', // Cache Font Awesome fonts
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.ttf'  // Fallback font
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(error => {
                console.error('Failed to cache some resources:', error);
            });
        })
    );
    self.skipWaiting(); // Force the service worker to activate immediately
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of all clients immediately
});

// Fetch event to serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return cached response if available
            if (response) {
                return response;
            }
            // If not in cache, try to fetch from network
            return fetch(event.request).catch(() => {
                // If fetch fails (offline), return a fallback response
                return caches.match('/index.html'); // Fallback to index.html
            });
        })
    );
});