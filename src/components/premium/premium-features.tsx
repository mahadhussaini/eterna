"use client"

import { useState } from "react"
import { Heart, Eye, Zap, MessageCircle, Star, Shield, TrendingUp, Crown, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  isPremium: boolean
  currentUsage?: string
  limit?: string
}

export function PremiumFeatures() {
  const [isPremiumUser] = useState(false) // This would come from user's subscription status

  const features: Feature[] = [
    {
      icon: Heart,
      title: "Unlimited Likes",
      description: "Send as many likes as you want without daily limits",
      isPremium: true,
      currentUsage: "5/5",
      limit: "Daily"
    },
    {
      icon: Eye,
      title: "See Who Liked You",
      description: "View everyone who liked your profile before matching",
      isPremium: true
    },
    {
      icon: Zap,
      title: "Profile Boost",
      description: "Get 10x more visibility for 30 minutes",
      isPremium: true
    },
    {
      icon: MessageCircle,
      title: "Advanced Chat Features",
      description: "Read receipts, typing indicators, and message history",
      isPremium: true
    },
    {
      icon: Star,
      title: "Priority Matching",
      description: "Get matched with higher quality profiles first",
      isPremium: true
    },
    {
      icon: Shield,
      title: "Photo Verification",
      description: "Get verified badge and build trust with other users",
      isPremium: true
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Detailed insights about your profile performance",
      isPremium: true
    },
    {
      icon: Crown,
      title: "Premium Support",
      description: "24/7 priority customer support",
      isPremium: true
    }
  ]

  const premiumFeatures = features.filter(f => f.isPremium)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Unlock Premium Features
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take your dating experience to the next level with exclusive premium features designed to help you find meaningful connections faster.
        </p>
      </div>

      {/* Current Status */}
      <Card className={`max-w-md mx-auto ${isPremiumUser ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-50'}`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            {isPremiumUser ? (
              <Crown className="h-12 w-12 text-white" />
            ) : (
              <Crown className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isPremiumUser ? "Premium Member" : "Free Member"}
          </h3>
          <p className="text-sm opacity-80">
            {isPremiumUser
              ? "Enjoying all premium features"
              : "Upgrade to unlock premium features"
            }
          </p>
        </CardContent>
      </Card>

      {/* Usage Limits (for free users) */}
      {!isPremiumUser && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Current Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">5/5</div>
                <div className="text-sm text-gray-600">Likes Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">10</div>
                <div className="text-sm text-gray-600">Messages Left</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button className="w-full">
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                {isPremiumUser && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>

                  {feature.currentUsage && !isPremiumUser && (
                    <div className="text-xs text-gray-500">
                      {feature.currentUsage} {feature.limit}
                    </div>
                  )}

                  {!isPremiumUser && (
                    <div className="mt-4">
                      <Badge variant="outline" className="text-xs">
                        Premium Only
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Benefits Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Go Premium?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10x</div>
              <div className="text-sm text-gray-600">More Profile Views</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-gray-600">Faster Matching</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-gray-600">Premium Support</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
