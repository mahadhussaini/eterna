"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  User,
  Bell,
  Shield,
  Eye,
  Moon,
  Sun,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PWAStatus } from "@/components/pwa/pwa-status"
import { PushNotificationManager } from "@/components/notifications/push-notification-manager"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState({
    // Account Settings
    email: session?.user?.email || "",
    name: session?.user?.name || "",

    // Privacy Settings
    profileVisibility: "public", // public, friends, private
    showOnlineStatus: true,
    showLastActive: true,
    allowMessages: true,
    allowPhotoRequests: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    matchNotifications: true,
    messageNotifications: true,
    marketingEmails: false,

    // Discovery Settings
    showInSearch: true,
    ageVisible: true,
    distanceVisible: true,
    interestsVisible: true,

    // Appearance
    theme: "light", // light, dark, system
    language: "en"
  })

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const handleSave = async () => {
    setSaving(true)
    try {
      // Here you would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert("Settings saved successfully!")
    } catch {
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!session) {
    return <div>Please sign in to access settings.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and privacy settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="pwa">PWA</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => updateSetting("name", e.target.value)}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
                <p className="text-sm text-gray-600 mt-1">
                  This email is used for account notifications and password recovery
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-red-600">Danger Zone</h4>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Delete Account</h5>
                    <p className="text-sm text-gray-600">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-gray-600">Who can see your profile</p>
                </div>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) => updateSetting("profileVisibility", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-online">Show Online Status</Label>
                    <p className="text-sm text-gray-600">Let others see when you&apos;re online</p>
                  </div>
                  <Switch
                    id="show-online"
                    checked={settings.showOnlineStatus}
                    onCheckedChange={(checked) => updateSetting("showOnlineStatus", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-last-active">Show Last Active</Label>
                    <p className="text-sm text-gray-600">Display when you were last active</p>
                  </div>
                  <Switch
                    id="show-last-active"
                    checked={settings.showLastActive}
                    onCheckedChange={(checked) => updateSetting("showLastActive", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-messages">Allow Messages</Label>
                    <p className="text-sm text-gray-600">Receive messages from other users</p>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={settings.allowMessages}
                    onCheckedChange={(checked) => updateSetting("allowMessages", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-photo-requests">Allow Photo Requests</Label>
                    <p className="text-sm text-gray-600">Let others request to see your photos</p>
                  </div>
                  <Switch
                    id="allow-photo-requests"
                    checked={settings.allowPhotoRequests}
                    onCheckedChange={(checked) => updateSetting("allowPhotoRequests", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <PushNotificationManager />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive email updates about your account</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="match-notifications">Match Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified when you have new matches</p>
                </div>
                <Switch
                  id="match-notifications"
                  checked={settings.matchNotifications}
                  onCheckedChange={(checked) => updateSetting("matchNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="message-notifications">Message Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified about new messages</p>
                </div>
                <Switch
                  id="message-notifications"
                  checked={settings.messageNotifications}
                  onCheckedChange={(checked) => updateSetting("messageNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discovery Settings */}
        <TabsContent value="discovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Discovery Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-in-search">Show in Search Results</Label>
                  <p className="text-sm text-gray-600">Allow others to find you in search</p>
                </div>
                <Switch
                  id="show-in-search"
                  checked={settings.showInSearch}
                  onCheckedChange={(checked) => updateSetting("showInSearch", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="age-visible">Show Age</Label>
                  <p className="text-sm text-gray-600">Display your age on your profile</p>
                </div>
                <Switch
                  id="age-visible"
                  checked={settings.ageVisible}
                  onCheckedChange={(checked) => updateSetting("ageVisible", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="distance-visible">Show Distance</Label>
                  <p className="text-sm text-gray-600">Display distance from other users</p>
                </div>
                <Switch
                  id="distance-visible"
                  checked={settings.distanceVisible}
                  onCheckedChange={(checked) => updateSetting("distanceVisible", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="interests-visible">Show Interests</Label>
                  <p className="text-sm text-gray-600">Display your interests on profile</p>
                </div>
                <Switch
                  id="interests-visible"
                  checked={settings.interestsVisible}
                  onCheckedChange={(checked) => updateSetting("interestsVisible", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-gray-600">Choose your preferred theme</p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => updateSetting("theme", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <p className="text-sm text-gray-600">Select your preferred language</p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting("language", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PWA Settings */}
        <TabsContent value="pwa" className="space-y-6">
          <PWAStatus />
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
