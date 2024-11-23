import { precaching } from 'workbox-precaching';

self.__WB_MANIFEST = self.__WB_MANIFEST || [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(self.__WB_MANIFEST).catch((error) => {
        console.error('缓存失败:', error);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
}); 