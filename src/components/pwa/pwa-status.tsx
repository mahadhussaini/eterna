"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Download, Smartphone, Bell, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BadgeConfig {
  variant: 'default' | 'secondary' | 'destructive'
  color: string
}

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [cacheSize, setCacheSize] = useState<string>('0 MB')
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'installing' | 'installed' | 'error' | 'unknown'>('unknown')
  const [notificationPermission, setNotificationPermission] = useState<'default' | 'granted' | 'denied'>('default')

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check if installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as { standalone?: boolean }).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    checkInstalled()

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setServiceWorkerStatus('installed')
      }).catch(() => {
        setServiceWorkerStatus('error')
      })
    }

    // Estimate cache size
    const estimateCacheSize = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate()
          const sizeInMB = (estimate.usage || 0) / (1024 * 1024)
          setCacheSize(`${sizeInMB.toFixed(2)} MB`)
        } catch (error) {
          console.error('Error estimating cache size:', error)
        }
      }
    }

    estimateCacheSize()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getStatusBadge = (status: string, type: 'connection' | 'installation' | 'service' | 'notification'): BadgeConfig => {
    const defaultConfig: BadgeConfig = { variant: 'secondary', color: 'bg-gray-100 text-gray-800' }

    const variants = {
      connection: {
        online: { variant: 'default', color: 'bg-green-100 text-green-800' },
        offline: { variant: 'destructive', color: 'bg-red-100 text-red-800' }
      },
      installation: {
        installed: { variant: 'default', color: 'bg-blue-100 text-blue-800' },
        not_installed: { variant: 'secondary', color: 'bg-gray-100 text-gray-800' }
      },
      service: {
        installed: { variant: 'default', color: 'bg-green-100 text-green-800' },
        installing: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
        error: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
        unknown: { variant: 'secondary', color: 'bg-gray-100 text-gray-800' }
      },
      notification: {
        granted: { variant: 'default', color: 'bg-green-100 text-green-800' },
        denied: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
        default: { variant: 'secondary', color: 'bg-gray-100 text-gray-800' }
      }
    }

    return (variants[type] as Record<string, BadgeConfig>)[status] || defaultConfig
  }

  const renderStatusBadge = (status: string, type: 'connection' | 'installation' | 'service' | 'notification') => {
    const config = getStatusBadge(status, type)
    return (
      <Badge className={config.color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      alert('Cache cleared successfully!')
      window.location.reload()
    }
  }

  const handleTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Eterna Test', {
        body: 'This is a test notification from Eterna!',
        icon: '/icon-192x192.svg',
        badge: '/icon-96x96.svg'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PWA Status</h2>
        <p className="text-gray-600">Monitor your Progressive Web App capabilities and performance</p>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">Connection</span>
            </div>
            {renderStatusBadge(isOnline ? 'online' : 'offline', 'connection')}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Download className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Installation</span>
            </div>
            {renderStatusBadge(isInstalled ? 'installed' : 'not_installed', 'installation')}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Service Worker</span>
            </div>
            {renderStatusBadge(serviceWorkerStatus, 'service')}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            {renderStatusBadge(notificationPermission, 'notification')}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Cache Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Size:</span>
              <span className="font-medium">{cacheSize}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Service Worker:</span>
              <span className="font-medium capitalize">{serviceWorkerStatus}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cache Strategy:</span>
              <span className="font-medium">Network First</span>
            </div>

            <Button
              onClick={handleClearCache}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Clear Cache
            </Button>
          </CardContent>
        </Card>

        {/* Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>PWA Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Offline Access</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${serviceWorkerStatus === 'installed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs">{serviceWorkerStatus === 'installed' ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${notificationPermission === 'granted' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs">{notificationPermission === 'granted' ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Background Sync</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${'serviceWorker' in navigator ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs">{'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Install Prompt</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${'BeforeInstallPromptEvent' in window || isInstalled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-xs">{isInstalled ? 'Installed' : 'Available'}</span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleTestNotification}
                disabled={notificationPermission !== 'granted'}
                size="sm"
                className="w-full"
              >
                Test Notification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PWA Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">PWA Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🚀 Performance</h4>
              <ul className="space-y-1">
                <li>• Cache static assets</li>
                <li>• Lazy load images</li>
                <li>• Minimize bundle size</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔒 Security</h4>
              <ul className="space-y-1">
                <li>• Use HTTPS</li>
                <li>• Secure service worker</li>
                <li>• Validate permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📱 User Experience</h4>
              <ul className="space-y-1">
                <li>• Fast loading</li>
                <li>• Offline functionality</li>
                <li>• Native app feel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 Maintenance</h4>
              <ul className="space-y-1">
                <li>• Update service worker</li>
                <li>• Clear old caches</li>
                <li>• Monitor performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
