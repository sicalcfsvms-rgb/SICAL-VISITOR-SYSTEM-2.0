const CACHE_NAME = 'sical-vms-cache-v2';
const assetsToCache = [
  '/SICAL-VISITOR-SYSTEM-2.0/',
  '/SICAL-VISITOR-SYSTEM-2.0/index.html',
  '/SICAL-VISITOR-SYSTEM-2.0/manifest.json',
  '/SICAL-VISITOR-SYSTEM-2.0/icon.jpg',
  '/SICAL-VISITOR-SYSTEM-2.0/SICAL_CFS_VMS_2.0_BG.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://unpkg.com/html5-qrcode'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached asset, but fetch updated version in background if online
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback for navigation requests if offline
        if (event.request.mode === 'navigate') {
          return caches.match('/SICAL-VISITOR-SYSTEM-2.0/index.html');
        }
      });
    })
  );
});
