const CACHE_NAME = 'expo-pwa-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './datos.json',
  './manifest.json',
  './logo.svg' // Reemplaza por el nombre real de tu logo si cambia
];

// Instalación del Service Worker y almacenamiento en caché inicial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia "Cache First" (Priorizar la caché y buscar en red si no existe)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo de la caché si existe, o haz la petición a la red
        return response || fetch(event.request);
      })
  );
});