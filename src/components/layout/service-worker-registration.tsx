"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production and if supported
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('Service Worker registered successfully:', registration)

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available, you could show a notification to user here
                  console.log('New service worker version available')
                }
              })
            }
          })

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from service worker:', event.data)
          })

        } catch (error) {
          console.warn('Service Worker registration failed:', error)

          // Don't show error to user, just log it
          // Many users have restrictions that prevent SW registration
        }
      }

      registerServiceWorker()
    }
  }, [])

  return null // This component doesn't render anything
}
