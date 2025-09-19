"use client"

import { useState } from "react"
import { Save, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface Settings {
  appName: string
  description: string
  maxMatchesPerDay: number
  maxMessagesPerHour: number
  enableNotifications: boolean
  enablePushNotifications: boolean
  requireProfileVerification: boolean
  allowGuestBrowsing: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
  emailNotifications: boolean
  smtpHost: string
  smtpPort: number
  smtpUser: string
}

export function SystemSettings() {
  const [settings, setSettings] = useState<Settings>({
    appName: "Eterna",
    description: "Find your perfect match. Connect with people who share your interests and values.",
    maxMatchesPerDay: 50,
    maxMessagesPerHour: 100,
    enableNotifications: true,
    enablePushNotifications: false,
    requireProfileVerification: false,
    allowGuestBrowsing: false,
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing maintenance. Please check back soon!",
    emailNotifications: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUser: ""
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage("Settings saved successfully!")
      } else {
        setMessage("Failed to save settings.")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage("An error occurred while saving settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
          <p className="text-gray-600">Configure your dating app settings and preferences</p>
        </div>

        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message}
        </div>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="appName">App Name</Label>
            <Input
              id="appName"
              value={settings.appName}
              onChange={(e) => updateSetting("appName", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">App Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => updateSetting("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxMatches">Max Matches Per Day</Label>
              <Input
                id="maxMatches"
                type="number"
                value={settings.maxMatchesPerDay}
                onChange={(e) => updateSetting("maxMatchesPerDay", parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="maxMessages">Max Messages Per Hour</Label>
              <Input
                id="maxMessages"
                type="number"
                value={settings.maxMessagesPerHour}
                onChange={(e) => updateSetting("maxMessagesPerHour", parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Enable In-App Notifications</Label>
              <p className="text-sm text-gray-600">Allow users to receive notifications within the app</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotifications">Enable Push Notifications</Label>
              <p className="text-sm text-gray-600">Send push notifications to users&apos; devices</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={settings.enablePushNotifications}
              onCheckedChange={(checked) => updateSetting("enablePushNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profileVerification">Require Profile Verification</Label>
              <p className="text-sm text-gray-600">Users must verify their profile before matching</p>
            </div>
            <Switch
              id="profileVerification"
              checked={settings.requireProfileVerification}
              onCheckedChange={(checked) => updateSetting("requireProfileVerification", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="guestBrowsing">Allow Guest Browsing</Label>
              <p className="text-sm text-gray-600">Allow non-registered users to browse profiles</p>
            </div>
            <Switch
              id="guestBrowsing"
              checked={settings.allowGuestBrowsing}
              onCheckedChange={(checked) => updateSetting("allowGuestBrowsing", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
              <p className="text-sm text-gray-600">Put the app in maintenance mode for updates</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
            />
          </div>

          {settings.maintenanceMode && (
            <div>
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Textarea
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) => updateSetting("maintenanceMessage", e.target.value)}
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
              <p className="text-sm text-gray-600">Send email notifications to users</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          {settings.emailNotifications && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => updateSetting("smtpHost", e.target.value)}
                  placeholder="smtp.example.com"
                />
              </div>

              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => updateSetting("smtpPort", parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => updateSetting("smtpUser", e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
