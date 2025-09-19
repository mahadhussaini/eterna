"use client"

import { useState } from "react"
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music,
  Link as LinkIcon,
  CheckCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SocialAccount {
  platform: string
  username: string
  isConnected: boolean
  isVerified: boolean
  followers?: number
  posts?: number
  url?: string
}

interface SocialIntegrationProps {
  connectedAccounts: SocialAccount[]
  onConnect: (platform: string) => Promise<void>
  onDisconnect: (platform: string) => Promise<void>
  isPremium?: boolean
}

export function SocialIntegration({
  connectedAccounts,
  onConnect,
  onDisconnect,
  isPremium = false
}: SocialIntegrationProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [customUrl, setCustomUrl] = useState("")

  const platforms = [
    {
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Share your lifestyle and photos"
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Show your personality and thoughts"
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Connect with friends and interests"
    },
    {
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Share your creative side"
    },
    {
      name: "Spotify",
      icon: Music,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Show your music taste"
    }
  ]

  const handleConnect = async (platform: string) => {
    setConnecting(platform)
    try {
      await onConnect(platform)
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error)
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (platform: string) => {
    try {
      await onDisconnect(platform)
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error)
    }
  }

  const handleAddCustomLink = () => {
    if (customUrl.trim()) {
      // Handle custom link addition
      console.log("Adding custom link:", customUrl)
      setCustomUrl("")
    }
  }

  const getAccountStatus = (platform: string) => {
    return connectedAccounts.find(acc => acc.platform === platform)
  }

  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-blue-500" />
            Social Media Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <LinkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-6">
              Connect your social media accounts to build a more complete profile and increase your chances of meaningful connections.
            </p>
            <Button>Upgrade to Premium</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Integration</h2>
        <p className="text-gray-600">
          Connect your social accounts to showcase your personality and build trust with other users.
        </p>
      </div>

      {/* Connected Accounts Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => {
              const account = getAccountStatus(platform.name)
              const Icon = platform.icon

              return (
                <div key={platform.name} className="text-center">
                  <div className={`w-12 h-12 ${platform.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`h-6 w-6 ${platform.color}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                  {account?.isConnected ? (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Not Connected
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Connections */}
      <div className="grid gap-4">
        {platforms.map((platform) => {
          const account = getAccountStatus(platform.name)
          const Icon = platform.icon

          return (
            <Card key={platform.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${platform.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${platform.color}`} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.description}</p>

                      {account?.isConnected && (
                        <div className="flex items-center space-x-4 mt-2">
                          {account.username && (
                            <span className="text-sm text-gray-500">@{account.username}</span>
                          )}
                          {account.followers && (
                            <span className="text-sm text-gray-500">
                              {account.followers.toLocaleString()} followers
                            </span>
                          )}
                          {account.isVerified && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {account?.isConnected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.name)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(platform.name)}
                        disabled={connecting === platform.name}
                      >
                        {connecting === platform.name && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Custom Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-url">Add Custom Link</Label>
              <p className="text-sm text-gray-600 mb-2">
                Add links to your website, blog, or other social profiles
              </p>
              <div className="flex space-x-2">
                <Input
                  id="custom-url"
                  placeholder="https://your-website.com"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <Button onClick={handleAddCustomLink} disabled={!customUrl.trim()}>
                  Add Link
                </Button>
              </div>
            </div>

            {/* Existing Custom Links */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Your Links</h4>
              <div className="space-y-2">
                {/* This would be populated from user's saved links */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">your-website.com</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Connect Social Media?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Build Trust</h4>
                <p className="text-sm text-gray-600">Verified social accounts increase credibility</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Better Matching</h4>
                <p className="text-sm text-gray-600">Show your interests and personality</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Profile Completion</h4>
                <p className="text-sm text-gray-600">Complete profiles get more attention</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Social Proof</h4>
                <p className="text-sm text-gray-600">Show your social presence and network</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
