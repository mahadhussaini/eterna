"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PWADiagnostic() {
  const [diagnostics, setDiagnostics] = useState({
    manifest: false,
    serviceWorker: false,
    https: false,
    pwaInstallable: false,
    notifications: false
  })

  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runDiagnostics = useCallback(async () => {
    setResults([])
    addResult("Starting PWA diagnostics...")

    // Check HTTPS
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    setDiagnostics(prev => ({ ...prev, https: isHttps }))
    addResult(`HTTPS: ${isHttps ? '✓' : '✗'} (${window.location.protocol})`)

    // Check manifest
    try {
      const manifestResponse = await fetch('/manifest.json')
      const manifest = await manifestResponse.json()
      setDiagnostics(prev => ({ ...prev, manifest: true }))
      addResult(`Manifest: ✓ (${manifest.name})`)
    } catch (error) {
      setDiagnostics(prev => ({ ...prev, manifest: false }))
      addResult(`Manifest: ✗ (${error})`)
    }

    // Check service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        setDiagnostics(prev => ({ ...prev, serviceWorker: !!registration }))
        addResult(`Service Worker: ${registration ? '✓' : '✗'}`)
      } catch (error) {
        setDiagnostics(prev => ({ ...prev, serviceWorker: false }))
        addResult(`Service Worker: ✗ (${error})`)
      }
    } else {
      setDiagnostics(prev => ({ ...prev, serviceWorker: false }))
      addResult("Service Worker: ✗ (not supported)")
    }

    // Check PWA installability
    if ('onbeforeinstallprompt' in window) {
      setDiagnostics(prev => ({ ...prev, pwaInstallable: true }))
      addResult("PWA Installable: ✓")
    } else {
      setDiagnostics(prev => ({ ...prev, pwaInstallable: false }))
      addResult("PWA Installable: ✗ (may already be installed)")
    }

    // Check notifications
    if ('Notification' in window) {
      const permission = Notification.permission
      setDiagnostics(prev => ({ ...prev, notifications: permission === 'granted' }))
      addResult(`Notifications: ${permission === 'granted' ? '✓' : permission === 'denied' ? '✗ (denied)' : '⚠ (not requested)'}`)
    } else {
      setDiagnostics(prev => ({ ...prev, notifications: false }))
      addResult("Notifications: ✗ (not supported)")
    }

    addResult("Diagnostics complete!")
  }, [])

  const clearCache = async () => {
    addResult("Clearing cache...")

    // Clear service worker cache
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
        addResult("Cache cleared successfully")
      } catch (error) {
        addResult(`Cache clear failed: ${error}`)
      }
    }

    // Unregister service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          await registration.unregister()
          addResult("Service worker unregistered")
        }
      } catch (error) {
        addResult(`Service worker unregister failed: ${error}`)
      }
    }

    // Reload page
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  useEffect(() => {
    runDiagnostics()
  }, [runDiagnostics])

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>PWA Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
              diagnostics.https ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <div className="text-sm font-medium">HTTPS</div>
          </div>

          <div className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
              diagnostics.manifest ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <div className="text-sm font-medium">Manifest</div>
          </div>

          <div className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
              diagnostics.serviceWorker ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <div className="text-sm font-medium">SW</div>
          </div>

          <div className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
              diagnostics.pwaInstallable ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <div className="text-sm font-medium">Installable</div>
          </div>

          <div className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
              diagnostics.notifications ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <div className="text-sm font-medium">Notifications</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runDiagnostics} size="sm">
            Run Diagnostics
          </Button>
          <Button onClick={clearCache} variant="outline" size="sm">
            Clear Cache & Reload
          </Button>
        </div>

        {/* Results Log */}
        <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
          <h4 className="font-medium mb-2">Results:</h4>
          <div className="space-y-1 text-sm font-mono">
            {results.map((result, index) => (
              <div key={index} className="text-gray-600">
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Troubleshooting Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Clear browser cache and hard refresh (Ctrl+F5)</li>
            <li>• Check browser developer tools for console errors</li>
            <li>• Ensure you&apos;re accessing the site over HTTPS (or localhost)</li>
            <li>• Try unregistering and re-registering the service worker</li>
            <li>• Check that all PWA icon files exist in the public folder</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
