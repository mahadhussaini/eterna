// Eterna PWA Service Worker
const CACHE_NAME = 'eterna-v1.0.0'
const STATIC_CACHE = 'eterna-static-v1.0.0'
const DYNAMIC_CACHE = 'eterna-dynamic-v1.0.0'
const API_CACHE = 'eterna-api-v1.0.0'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/matches',
  '/search',
  '/profile/edit',
  '/settings',
  '/premium',
  '/verification',
  '/social',
  '/video',
  '/offline',
  '/manifest.json',
  '/favicon.svg',
  '/icon-72x72.svg',
  '/icon-96x96.svg',
  '/icon-128x128.svg',
  '/icon-144x144.svg',
  '/icon-152x152.svg',
  '/icon-192x192.svg',
  '/icon-384x384.svg',
  '/icon-512x512.svg',
  '/favicon.svg'
]

self.addEventListener('install', (event) => {
  console.log('🛠️ Eterna Service Worker installing...')
  self.skipWaiting()

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets...')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error)
      })
  )
})

self.addEventListener('activate', (event) => {
  console.log('⚡ Eterna Service Worker activating...')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('✅ Service Worker activated successfully')
      return self.clients.claim()
    })
  )
})

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push message received:', event)

  let data = {}

  if (event.data) {
    try {
      data = event.data.json()
    } catch (error) {
      console.warn('Failed to parse push data:', error)
      data = {}
    }
  }

  const options = {
    body: data.body || 'You have a new notification from Eterna',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1,
      url: data.url || '/dashboard',
      type: data.type || 'general'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    tag: data.tag || 'eterna-notification',
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Eterna', options).catch((error) => {
      console.warn('Failed to show notification:', error)
    })
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event)

  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      try {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }

        // If no suitable window is found, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen).catch((error) => {
            console.warn('Failed to open window:', error)
          })
        }
      } catch (error) {
        console.warn('Error handling notification click:', error)
      }
    })
  )
})

// Handle background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('🔄 Performing background sync...')
  try {
    // Sync any pending actions
    await Promise.all([
      sendPendingMessages(),
      updatePendingProfile(),
      syncOfflineData()
    ])
    console.log('✅ Background sync completed')
  } catch (error) {
    console.error('❌ Background sync failed:', error)
  }
}

async function sendPendingMessages() {
  // Send any messages that failed to send while offline
  console.log('💬 Sending pending messages...')
  // Implementation would check IndexedDB or local storage for pending messages
}

async function updatePendingProfile() {
  // Update profile changes that failed while offline
  console.log('👤 Updating pending profile changes...')
  // Implementation would sync profile updates
}

async function syncOfflineData() {
  // Sync any other offline data
  console.log('📊 Syncing offline data...')
  // Implementation would sync various offline data
}

// Comprehensive caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle different types of requests
  if (request.method !== 'GET') return

  // API requests - Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline API response
            return new Response(
              JSON.stringify({
                error: 'You are currently offline. Please check your connection.',
                offline: true
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            )
          })
        })
    )
    return
  }

  // Static assets - Cache first
  if (STATIC_ASSETS.includes(url.pathname) ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      })
    )
    return
  }

  // HTML pages - Network first with offline fallback
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline page
            return caches.match('/offline').then((offlineResponse) => {
              return offlineResponse || new Response(
                '<html><head><title>Offline - Eterna</title></head><body><div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;"><h1>You are offline</h1><p>Please check your internet connection and try again.</p><p><small>Eterna Dating App</small></p></div></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              )
            })
          })
        })
    )
    return
  }

  // Other requests - Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || new Response(
            'Offline - Content not available',
            { status: 503 }
          )
        })
      })
  )
})
