"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register service worker in production and if supported
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const registerServiceWorker = async () => {
        try {
          // Unregister any existing service workers first to avoid conflicts
          const existingRegistrations = await navigator.serviceWorker.getRegistrations()
          for (const registration of existingRegistrations) {
            await registration.unregister()
            console.log('Unregistered existing service worker')
          }

          // Register new service worker
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
                  // New version available
                  console.log('New service worker version available')
                  // Optionally show user notification for update
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
          // Don't show error to user, many browsers have restrictions
        }
      }

      // Delay registration slightly to ensure DOM is ready
      const timer = setTimeout(registerServiceWorker, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  return null // This component doesn't render anything
}