import { precacheAndRoute } from 'workbox-precaching'

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

const CACHE_VERSION = 'nyayamitra-v1.2'
const CACHE_STATIC = `${CACHE_VERSION}-static`
const CACHE_API = `${CACHE_VERSION}-api`

const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
]

const OFFLINE_API_RESPONSES: Record<string, any> = {
  '/api/v1/counsellor/demo': {
    answer: '⚠ You are offline. Here are your key legal rights:\n\n1. Salary must be paid within 7 days (monthly wages) — Payment of Wages Act 1936\n2. Landlord cannot evict without court order — state Rent Control Act\n3. FIR is mandatory for cognizable offences — BNSS 2023, Section 173\n4. Consumer complaints: 2-year limitation period — Consumer Protection Act 2019\n\n🆘 Emergency: Police 100 | Women 181 | DLSA 15100',
    confidence: 0.5,
    offline: true,
  },
}

// @ts-ignore
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_FILES))
  )
})

// @ts-ignore
self.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request)
        if (cached) return cached
        const offlineData = OFFLINE_API_RESPONSES[url.pathname]
        if (offlineData) return new Response(JSON.stringify(offlineData), { headers: { 'Content-Type': 'application/json' } })
        return new Response(JSON.stringify({ error: 'Offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
      })
    )
  }
})

export {}
