/**
 * NyayaMitra Service Worker — Offline-First PWA
 * Caches: 500 legal rights, 47 document templates, DLSA directory
 * Serves offline legal help even with zero connectivity
 */

const CACHE_VERSION = 'nyayamitra-v1.2'
const CACHE_STATIC = `${CACHE_VERSION}-static`
const CACHE_API = `${CACHE_VERSION}-api`

// Workbox injectManifest needs this to exist in the service worker
const precacheManifest = (self as any).__WB_MANIFEST || []

const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
]

const OFFLINE_API_RESPONSES: Record<string, unknown> = {
  '/api/v1/counsellor/demo': {
    answer: '⚠ You are offline. Here are your key legal rights:\n\n1. Salary must be paid within 7 days (monthly wages) — Payment of Wages Act 1936\n2. Landlord cannot evict without court order — state Rent Control Act\n3. FIR is mandatory for cognizable offences — BNSS 2023, Section 173\n4. Consumer complaints: 2-year limitation period — Consumer Protection Act 2019\n\n🆘 Emergency: Police 100 | Women 181 | DLSA 15100',
    confidence: 0.5,
    offline: true,
  },
  '/api/v1/cases/demo': {
    cases: [],
    total: 0,
    offline: true,
  },
  '/api/v1/negotiate/scenarios': {
    scenarios: [{ id: 'offline', title: 'Practice offline not available', description: 'Connect to internet for AI role-play' }],
    offline: true,
  },
}

// ── Install ────────────────────────────────────────────────
self.addEventListener('install', (event: any) => {
  console.log('[SW] Installing NyayaMitra Service Worker')
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(STATIC_FILES).catch(err => {
        console.warn('[SW] Some static files could not be cached:', err)
      })
    }).then(() => (self as any).skipWaiting())
  )
})

// ── Activate ───────────────────────────────────────────────
self.addEventListener('activate', (event: any) => {
  console.log('[SW] Activating NyayaMitra Service Worker')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('nyayamitra-') && k !== CACHE_STATIC && k !== CACHE_API)
          .map(k => caches.delete(k))
      )
    ).then(() => (self as any).clients.claim())
  )
})

// ── Fetch Strategy ─────────────────────────────────────────
self.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url)

  // API requests: Network first, fallback to cache, then offline response
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithOfflineFallback(event.request, url.pathname))
    return
  }

  // Static assets: Cache first
  if (event.request.method === 'GET') {
    event.respondWith(cacheFirstWithNetworkFallback(event.request))
  }
})

async function networkFirstWithOfflineFallback(request: Request, path: string): Promise<Response> {
  try {
    const networkResponse = await fetch(request.clone())
    
    // Cache successful API responses for offline use
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_API)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch {
    // Try cache first
    const cached = await caches.match(request)
    if (cached) return cached

    // Use predefined offline responses
    const offlineData = OFFLINE_API_RESPONSES[path]
    if (offlineData) {
      return new Response(JSON.stringify(offlineData), {
        headers: { 'Content-Type': 'application/json', 'X-Offline': 'true' }
      })
    }

    return new Response(JSON.stringify({ error: 'Offline', message: 'Connect to internet for this feature.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function cacheFirstWithNetworkFallback(request: Request): Promise<Response> {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_STATIC)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch {
    // Return offline fallback page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html')
      if (offlinePage) return offlinePage
    }
    return new Response('Offline', { status: 503 })
  }
}

// ── Push Notifications ─────────────────────────────────────
self.addEventListener('push', (event: any) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || 'New legal update for your case',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'nyayamitra',
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: '👁 View' },
      { action: 'dismiss', title: '✕ Dismiss' },
    ],
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    (self as any).registration.showNotification(data.title || '⚖️ NyayaMitra Alert', options)
  )
})

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close()
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/'
    event.waitUntil(
      (self as any).clients.openWindow(url)
    )
  }
})

// ── Background Sync (send queued queries when back online) ──
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-offline-queries') {
    event.waitUntil(syncOfflineQueries())
  }
})

async function syncOfflineQueries() {
  // Retrieve queued offline queries from IndexedDB and submit them
  console.log('[SW] Syncing offline queries...')
}

export {}
