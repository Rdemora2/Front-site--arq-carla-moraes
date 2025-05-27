// Service Worker para PWA com cache inteligente e estratégias otimizadas
const CACHE_NAME = 'carla-moraes-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;
const API_CACHE = `${CACHE_NAME}-api`;
const FONT_CACHE = `${CACHE_NAME}-fonts`;

// Recursos para cache imediato
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/images/logo/logo_full.webp',
  '/images/logo/logo_reduced.webp',
  '/images/favicon/favicon.ico',
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cacheFirst',
  NETWORK_FIRST: 'networkFirst',
  STALE_WHILE_REVALIDATE: 'staleWhileRevalidate',
  NETWORK_ONLY: 'networkOnly',
  CACHE_ONLY: 'cacheOnly',
};

// Configurações por tipo de recurso
const RESOURCE_CONFIG = {
  // Recursos estáticos - Cache First
  static: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    maxEntries: 100,
  },
  
  // Imagens - Cache First com fallback
  images: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: IMAGE_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    maxEntries: 200,
  },
  
  // API calls - Network First
  api: {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: API_CACHE,
    maxAge: 5 * 60 * 1000, // 5 minutos
    maxEntries: 50,
  },
  
  // Fonts - Cache First
  fonts: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: FONT_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    maxEntries: 30,
  },
};

// Utility functions
const isStaticResource = (url) => {
  return url.pathname.includes('.js') || 
         url.pathname.includes('.css') || 
         url.pathname.includes('.woff') ||
         url.pathname === '/' ||
         url.pathname.includes('.html');
};

const isImageResource = (url) => {
  return url.pathname.includes('.webp') ||
         url.pathname.includes('.jpg') ||
         url.pathname.includes('.png') ||
         url.pathname.includes('.svg') ||
         url.pathname.includes('.ico');
};

const isApiResource = (url) => {
  return url.pathname.includes('/api/') ||
         url.hostname.includes('formspree.io') ||
         url.hostname.includes('analytics');
};

const isFontResource = (url) => {
  return url.pathname.includes('.woff') ||
         url.pathname.includes('.woff2') ||
         url.pathname.includes('.ttf') ||
         url.hostname.includes('fonts.googleapis.com') ||
         url.hostname.includes('fonts.gstatic.com');
};

// Cache management
const cleanCache = async (cacheName, maxEntries, maxAge) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  // Remove entries older than maxAge
  const now = Date.now();
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      const date = dateHeader ? new Date(dateHeader).getTime() : 0;
      if (now - date > maxAge) {
        await cache.delete(request);
      }
    }
  }
  
  // Keep only maxEntries most recent items
  const remainingKeys = await cache.keys();
  if (remainingKeys.length > maxEntries) {
    const toDelete = remainingKeys.slice(0, remainingKeys.length - maxEntries);
    await Promise.all(toDelete.map(key => cache.delete(key)));
  }
};

// Cache strategies implementation
const cacheFirst = async (request, config) => {
  const cache = await caches.open(config.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Clean cache in background
    cleanCache(config.cacheName, config.maxEntries, config.maxAge);
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline fallback if available
    if (isImageResource(new URL(request.url))) {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
};

const networkFirst = async (request, config) => {
  const cache = await caches.open(config.cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      // Clean cache in background
      cleanCache(config.cacheName, config.maxEntries, config.maxAge);
    }
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request, config) => {
  const cache = await caches.open(config.cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
};

// Route handler
const handleRequest = async (request) => {
  const url = new URL(request.url);
  
  // Determine resource type and config
  let config;
  if (isStaticResource(url)) {
    config = RESOURCE_CONFIG.static;
  } else if (isImageResource(url)) {
    config = RESOURCE_CONFIG.images;
  } else if (isApiResource(url)) {
    config = RESOURCE_CONFIG.api;
  } else if (isFontResource(url)) {
    config = RESOURCE_CONFIG.fonts;
  } else {
    // Default to network first for unknown resources
    config = RESOURCE_CONFIG.api;
  }
  
  // Apply cache strategy
  switch (config.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, config);
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, config);
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, config);
    default:
      return fetch(request);
  }
};

// Service Worker Events
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (!cacheName.startsWith(CACHE_NAME)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !isFontResource(url) && !isApiResource(url)) {
    return;
  }
  
  event.respondWith(handleRequest(event.request));
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(
      // Handle offline form submissions
      syncContactForm()
    );
  }
});

const syncContactForm = async () => {
  // Implementation for offline form submission sync
  // This would retrieve stored form data and submit when online
  console.log('Syncing contact form submissions...');
};

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/images/favicon/android-chrome-192x192.png',
      badge: '/images/favicon/android-chrome-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
      },
      actions: [
        {
          action: 'open',
          title: 'Ver',
          icon: '/images/favicon/favicon-32x32.png'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status);
    });
  }
});

const getCacheStatus = async () => {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
};
