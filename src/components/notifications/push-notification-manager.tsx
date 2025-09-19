"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PushNotificationManagerProps {
  onPermissionChange?: (granted: boolean) => void
}

export function PushNotificationManager({ onPermissionChange }: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    checkPermission()
    checkSubscription()
    loadSettings()
  }, [])

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking subscription:', error)
      }
    }
  }

  const loadSettings = () => {
    const enabled = localStorage.getItem('pushNotificationsEnabled') === 'true'
    setPushEnabled(enabled)
  }

  const saveSettings = (enabled: boolean) => {
    localStorage.setItem('pushNotificationsEnabled', enabled.toString())
    setPushEnabled(enabled)
  }

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      onPermissionChange?.(result === 'granted')

      if (result === 'granted') {
        await subscribeToPush()
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
    }
  }

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in this browser')
      return
    }

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready

      // You'll need to get these from your backend/server
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

      if (!vapidPublicKey) {
        console.warn('VAPID public key not configured')
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      })

      if (response.ok) {
        setIsSubscribed(true)
        saveSettings(true)
      } else {
        console.error('Failed to subscribe to push notifications')
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const unsubscribeFromPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return
    }

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()

        // Remove subscription from server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        })

        setIsSubscribed(false)
        saveSettings(false)
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      if (permission === 'default') {
        await requestPermission()
      } else if (permission === 'granted') {
        await subscribeToPush()
      }
    } else {
      await unsubscribeFromPush()
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Enabled', color: 'text-green-600', icon: Bell }
      case 'denied':
        return { text: 'Blocked', color: 'text-red-600', icon: BellOff }
      default:
        return { text: 'Not requested', color: 'text-gray-600', icon: BellOff }
    }
  }

  const status = getPermissionStatus()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <StatusIcon className="h-5 w-5 mr-2" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="push-notifications">Enable Push Notifications</Label>
            <p className="text-sm text-gray-600">
              Get notified about new matches, messages, and likes
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushEnabled}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Permission Status:</span>
          <span className={`font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

        {isSubscribed && (
          <div className="flex items-center justify-between text-sm">
            <span>Subscription:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        )}

        <div className="space-y-2">
          {permission === 'default' && (
            <Button
              onClick={requestPermission}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Enable Notifications
            </Button>
          )}

          {permission === 'denied' && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              Notifications are blocked. Please enable them in your browser settings.
            </div>
          )}

          {permission === 'granted' && !isSubscribed && (
            <Button
              onClick={subscribeToPush}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Subscribe to Notifications
            </Button>
          )}

          {isSubscribed && (
            <Button
              variant="outline"
              onClick={unsubscribeFromPush}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Unsubscribe
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Privacy:</strong> We only send notifications for important activities like new matches and messages.
          You can unsubscribe at any time.
        </div>
      </CardContent>
    </Card>
  )
}
