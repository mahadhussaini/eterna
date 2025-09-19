"use client"

import { PWADiagnostic } from "@/components/debug/pwa-debug"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function DebugPage() {
  const router = useRouter()

  // Client-side only state to prevent hydration mismatches
  const [clientInfo, setClientInfo] = useState({
    userAgent: 'Loading...',
    viewport: 'Loading...',
    online: 'Loading...',
    pwaSupport: 'Loading...'
  })

  useEffect(() => {
    // Update client-side information after hydration
    setClientInfo({
      userAgent: navigator.userAgent.slice(0, 50) + '...',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      online: navigator.onLine ? 'Yes' : 'No',
      pwaSupport: 'serviceWorker' in navigator ? 'Yes' : 'No'
    })

    // Listen for online/offline events
    const handleOnline = () => setClientInfo(prev => ({ ...prev, online: 'Yes' }))
    const handleOffline = () => setClientInfo(prev => ({ ...prev, online: 'No' }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug & Diagnostics</h1>
        <p className="text-gray-600">
          Tools to help troubleshoot and diagnose PWA and app issues.
        </p>
      </div>

      <PWADiagnostic />

      {/* Additional Debug Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Environment Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>User Agent:</span>
              <span className="font-mono text-xs">{clientInfo.userAgent}</span>
            </div>
            <div className="flex justify-between">
              <span>Viewport:</span>
              <span>{clientInfo.viewport}</span>
            </div>
            <div className="flex justify-between">
              <span>Online:</span>
              <span>{clientInfo.online}</span>
            </div>
            <div className="flex justify-between">
              <span>PWA Support:</span>
              <span>{clientInfo.pwaSupport}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.location.reload()}
            >
              Hard Refresh Page
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.location.href = '/manifest.json'}
            >
              View Manifest
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                if ('caches' in window) {
                  caches.keys().then(names => {
                    names.forEach(name => caches.delete(name))
                    alert('Cache cleared!')
                  })
                } else {
                  alert('Cache API not available')
                }
              }}
            >
              Clear App Cache
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
