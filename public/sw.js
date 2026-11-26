// Network-first for pages, with a friendly offline page as the fallback.
// Everything is resolved against the service worker's scope, so it works under /Portfolio/ on GitHub Pages
// (the old version hard-coded '/offline.html' and '/', which 404 there and made install fail).
const CACHE = 'ysr-v2'
const OFFLINE_URL = new URL('offline.html', self.registration.scope).href

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
})
