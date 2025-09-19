"use client"

import { useState, useEffect } from "react"
import { Crown, Check, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number // in days
  features: string[]
  isPopular?: boolean
}

interface SubscriptionPlansProps {
  onSelectPlan: (plan: SubscriptionPlan) => void
  currentPlan?: string
}

export function SubscriptionPlans({ onSelectPlan, currentPlan }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, we'll use static data. In production, this would come from the API
    const defaultPlans: SubscriptionPlan[] = [
      {
        id: "free",
        name: "Free",
        description: "Basic features to get you started",
        price: 0,
        duration: 0,
        features: [
          "Create profile",
          "Swipe through profiles",
          "Send 5 likes per day",
          "Basic matching",
          "Limited chat features"
        ]
      },
      {
        id: "premium-monthly",
        name: "Premium Monthly",
        description: "Unlock all features with monthly subscription",
        price: 9.99,
        duration: 30,
        features: [
          "Unlimited likes and swipes",
          "Advanced filters",
          "Priority matching",
          "Read receipts",
          "Photo verification badge",
          "Boost your profile",
          "See who liked you",
          "Advanced analytics"
        ],
        isPopular: true
      },
      {
        id: "premium-yearly",
        name: "Premium Yearly",
        description: "Best value with annual subscription",
        price: 79.99,
        duration: 365,
        features: [
          "All monthly features",
          "Save 30% annually",
          "Premium customer support",
          "Early access to new features",
          "Profile analytics",
          "Advanced matching algorithm"
        ]
      }
    ]

    setPlans(defaultPlans)
    setLoading(false)
  }, [])

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.id === "free") {
      // Handle free plan selection
      console.log("Selected free plan")
      return
    }

    onSelectPlan(plan)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-yellow-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900">Premium Plans</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of Eterna with premium features designed to help you find meaningful connections faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.isPopular ? 'ring-2 ring-primary shadow-lg' : ''} ${
              currentPlan === plan.id ? 'bg-primary/5' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            {currentPlan === plan.id && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Current Plan</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">
                ${plan.price}
                {plan.duration > 0 && (
                  <span className="text-sm font-normal text-gray-600">
                    /{plan.duration === 30 ? 'month' : 'year'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-6"
                variant={plan.isPopular ? "default" : plan.id === "free" ? "outline" : "default"}
                onClick={() => handleSelectPlan(plan)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : plan.id === "free" ? (
                  "Get Started Free"
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Choose {plan.name}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 bg-gray-50 p-6 rounded-lg max-w-4xl mx-auto">
        <p className="mb-2">
          <strong>Cancel anytime:</strong> All premium subscriptions can be cancelled at any time with no penalties.
        </p>
        <p>
          <strong>Money-back guarantee:</strong> Not satisfied? Get a full refund within 30 days of purchase.
        </p>
      </div>
    </div>
  )
}
