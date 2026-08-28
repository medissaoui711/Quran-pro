/**
 * Service Worker for المصحف الإلكتروني الشريف (Noble Quran PWA)
 * Production-ready Service Worker with offline reading support
 */

const CACHE_VERSION = 'mushaf-pwa-v4';
const STATIC_CACHE = `mushaf-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mushaf-runtime-${CACHE_VERSION}`;
const PAGES_CACHE = `mushaf-pages-${CACHE_VERSION}`;

// Essential App Shell resources to precache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/icon.svg',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
  '/favicon.svg'
];

// Install Event - Precache critical App Shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((err) => {
        console.warn('SW: Precache non-blocking error:', err);
      })
  );
});

// Activate Event - Clean up stale legacy caches and claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, PAGES_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('SW: Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Listen for messages from frontend (e.g. SKIP_WAITING on user update toast)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event - Strategic Routing
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 1. Navigation requests (HTML navigation) -> Network first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/index.html');
          if (fallback) return fallback;
          return new Response('المصحف الإلكتروني الشريف - يعمل بدون اتصال', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
    return;
  }

  // 2. Google Fonts & CDN Assets (Typography, Styles, Bundled JS/CSS) -> Stale-While-Revalidate
  if (
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Quran Page Images and Metadata (AlQuran Cloud / King Fahd Quran CDN) -> Cache First with Network Fallback
  if (
    url.hostname.includes('alquran.cloud') ||
    url.hostname.includes('everyayah.com') ||
    url.hostname.includes('mp3quran.net') ||
    url.pathname.includes('/data/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      caches.open(PAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          if (cached) return cached;
          throw error;
        }
      })
    );
    return;
  }

  // 4. Default Handler -> Cache First, fallback to Network
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((response) => {
            if (
              response &&
              response.status === 200 &&
              response.type === 'basic'
            ) {
              const resClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, resClone);
              });
            }
            return response;
          })
          .catch(() => {
            return new Response('', { status: 408, statusText: 'Offline' });
          })
      );
    })
  );
});
