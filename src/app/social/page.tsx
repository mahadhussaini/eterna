"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { SocialIntegration } from "@/components/social/social-integration"

export default function SocialPage() {
  const connectedAccounts = [
    {
      platform: "Instagram",
      username: "@johndoe",
      isConnected: true,
      isVerified: true,
      followers: 1250,
      posts: 89
    },
    {
      platform: "Twitter",
      username: "@johndoe",
      isConnected: false,
      isVerified: false
    }
  ]

  const handleConnect = async (platform: string) => {
    console.log(`Connecting to ${platform}`)
    // This would handle the OAuth flow for each platform
  }

  const handleDisconnect = async (platform: string) => {
    console.log(`Disconnecting from ${platform}`)
    // This would remove the connection
  }

  return (
    <div>
      <SocialIntegration
        connectedAccounts={connectedAccounts}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isPremium={true}
      />
    </div>
  )
}
