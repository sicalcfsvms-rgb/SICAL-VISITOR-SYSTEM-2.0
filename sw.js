const CACHE_NAME = 'sical-vms-cache-v1';
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
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
