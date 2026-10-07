const CACHE_NAME = 'wishlist-pwa-v2'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

// Install event: cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// Activate event: clean old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event: Network-first with cache fallback for navigation, Stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request

  // Only handle GET requests and http/https schemes
  if (req.method !== 'GET' || !req.url.startsWith('http')) {
    return
  }

  // HTML navigation: Network-first, fallback to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          const clone = networkRes.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          return networkRes
        })
        .catch(() => caches.match('/index.html') || caches.match('/'))
    )
    return
  }

  // Static assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
        }
        return networkRes
      }).catch(() => cachedRes)

      return cachedRes || fetchPromise
    })
  )
})
