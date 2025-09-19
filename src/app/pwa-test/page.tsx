"use client"

import { PWAStatus } from "@/components/pwa/pwa-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function PWATestPage() {
  const pwaFeatures = [
    {
      name: "Service Worker",
      description: "Enables offline functionality and caching",
      test: () => 'serviceWorker' in navigator,
      critical: true
    },
    {
      name: "Web App Manifest",
      description: "Enables installation and app-like behavior",
      test: () => document.querySelector('link[rel="manifest"]') !== null,
      critical: true
    },
    {
      name: "HTTPS",
      description: "Required for PWA features",
      test: () => location.protocol === 'https:' || location.hostname === 'localhost',
      critical: true
    },
    {
      name: "Push Notifications",
      description: "Browser support for push notifications",
      test: () => 'PushManager' in window && 'Notification' in window,
      critical: false
    },
    {
      name: "Background Sync",
      description: "Sync data when connection is restored",
      test: () => 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      critical: false
    },
    {
      name: "Web Share API",
      description: "Native sharing capabilities",
      test: () => 'share' in navigator,
      critical: false
    },
    {
      name: "Cache API",
      description: "Browser caching for offline support",
      test: () => 'caches' in window,
      critical: false
    },
    {
      name: "IndexedDB",
      description: "Client-side database for offline data",
      test: () => 'indexedDB' in window,
      critical: false
    }
  ]

  const getStatusIcon = (passed: boolean, critical: boolean) => {
    if (passed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (critical) {
      return <XCircle className="h-5 w-5 text-red-500" />
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (passed: boolean, critical: boolean) => {
    if (passed) {
      return <Badge className="bg-green-100 text-green-800">Supported</Badge>
    } else if (critical) {
      return <Badge className="bg-red-100 text-red-800">Missing</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Optional</Badge>
    }
  }

  const passedTests = pwaFeatures.filter(feature => feature.test()).length
  const criticalTests = pwaFeatures.filter(feature => feature.critical).length
  const passedCritical = pwaFeatures.filter(feature => feature.critical && feature.test()).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PWA Compatibility Test</h1>
        <p className="text-gray-600">
          Test your browser&apos;s compatibility with Progressive Web App features
        </p>
      </div>

      {/* Overall Status */}
      <Card className={`${passedCritical === criticalTests ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            {passedCritical === criticalTests ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {passedCritical === criticalTests ? 'PWA Ready!' : 'PWA Issues Detected'}
          </h3>
          <p className="text-gray-600 mb-4">
            {passedTests} of {pwaFeatures.length} features supported
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              {passedCritical}/{criticalTests} Critical
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              {passedTests - passedCritical}/{pwaFeatures.length - criticalTests} Optional
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Feature Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pwaFeatures.map((feature, index) => {
              const passed = feature.test()
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(passed, feature.critical)}
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        {feature.name}
                        {feature.critical && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Critical
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(passed, feature.critical)}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* PWA Status Component */}
      <PWAStatus />

      {/* Installation Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Installation Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">📱 Mobile (Chrome/Edge)</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Tap the menu (⋮) in your browser</li>
                <li>2. Select &quot;Add to Home screen&quot;</li>
                <li>3. Tap &quot;Add&quot; to confirm</li>
                <li>4. Find Eterna on your home screen</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900 mb-3">🍎 iOS Safari</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Tap the Share button (□↗)</li>
                <li>2. Scroll down and tap &quot;Add to Home Screen&quot;</li>
                <li>3. Tap &quot;Add&quot; to confirm</li>
                <li>4. Find Eterna on your home screen</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900 mb-3">💻 Desktop (Chrome/Edge)</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Click the install icon in the address bar</li>
                <li>2. Or go to menu → &quot;Install Eterna&quot;</li>
                <li>3. Click &quot;Install&quot; to confirm</li>
                <li>4. App will open in its own window</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900 mb-3">🦊 Firefox</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Click the menu (☰) button</li>
                <li>2. Select &quot;Install this site as an app&quot;</li>
                <li>3. Click &quot;Install&quot; to confirm</li>
                <li>4. App will be added to your applications</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Support */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🌐</div>
              <h4 className="font-medium">Chrome</h4>
              <p className="text-xs text-green-600">Full Support</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔷</div>
              <h4 className="font-medium">Edge</h4>
              <p className="text-xs text-green-600">Full Support</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🦊</div>
              <h4 className="font-medium">Firefox</h4>
              <p className="text-xs text-yellow-600">Partial Support</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🍎</div>
              <h4 className="font-medium">Safari</h4>
              <p className="text-xs text-yellow-600">Limited Support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
