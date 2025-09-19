"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone, Monitor, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay or on user interaction
      setTimeout(() => {
        if (!localStorage.getItem('installPromptDismissed')) {
          setShowPrompt(true)
        }
      }, 30000) // Show after 30 seconds
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissed', 'true')
  }

  const handleIOSInstall = () => {
    alert('To install Eterna on iOS:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"')
  }

  // Don't show if already installed or dismissed
  if (isStandalone || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Install Eterna
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Get the full app experience with offline access and push notifications!
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>Faster</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="h-3 w-3 text-blue-500 mr-1" />
                  <span>Native Feel</span>
                </div>
                <div className="flex items-center">
                  <Monitor className="h-3 w-3 text-green-500 mr-1" />
                  <span>Offline Access</span>
                </div>
                <div className="flex items-center">
                  <Download className="h-3 w-3 text-purple-500 mr-1" />
                  <span>Push Notifications</span>
                </div>
              </div>

              {/* Install Button */}
              <div className="flex space-x-2">
                {isIOS ? (
                  <Button
                    onClick={handleIOSInstall}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                    size="sm"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    iOS Install Guide
                  </Button>
                ) : (
                  <Button
                    onClick={handleInstallClick}
                    disabled={!deferredPrompt}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install App
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  size="sm"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}