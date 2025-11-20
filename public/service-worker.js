const CACHE_NAME = 'kropland-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install - cachear assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Service Worker: Assets cacheados');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('⚠️ Algunos assets no se pudieron cachear (es normal en desarrollo)');
      });
    })
  );
  self.skipWaiting();
});

// Activate - limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Limpiando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Network First, fallback a Cache
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip no-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions y otros esquemas no soportados
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Network first strategy
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            try {
              cache.put(request, responseToCache);
            } catch (error) {
              console.warn('⚠️ No se pudo cachear:', request.url);
            }
          });
        }
        return response;
      })
      .catch(error => {
        // Si falla, buscar en caché
        return caches.match(request).then(response => {
          if (response) {
            console.log('📦 Usando caché:', request.url);
            return response;
          }
          
          // Si tampoco hay caché, retornar página offline
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          // Para otros tipos de request, retornar error
          return new Response('Offline - Contenido no disponible', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Mensaje desde el cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});