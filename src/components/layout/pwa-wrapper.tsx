"use client"

import { useEffect, useState } from "react"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { ServiceWorkerRegistration } from "./service-worker-registration"

interface PWAWrapperProps {
  children: React.ReactNode
}

export function PWAWrapper({ children }: PWAWrapperProps) {
  const [showOfflineNotice, setShowOfflineNotice] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineNotice(false)
    }

    const handleOffline = () => {
      setShowOfflineNotice(true)

      // Hide offline notice after 5 seconds
      setTimeout(() => {
        setShowOfflineNotice(false)
      }, 5000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {/* Main Content */}
      {children}

      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">You&apos;re offline</span>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Service Worker Registration */}
      <ServiceWorkerRegistration />
    </>
  )
}
