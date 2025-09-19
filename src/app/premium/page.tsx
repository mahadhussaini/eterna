"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SubscriptionPlans } from "@/components/premium/subscription-plans"
import { PremiumFeatures } from "@/components/premium/premium-features"

interface Plan {
  id: string
  name: string
  price: number
}

export default function PremiumPage() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  const handleSelectPlan = (plan: Plan) => {
    // Here you would typically integrate with a payment processor like Stripe
    console.log("Selected plan:", plan)
    alert(`Selected ${plan.name} plan for $${plan.price}. Payment integration would be added here.`)
  }

  return (
    <div className="space-y-12">
          {/* Current Features Section */}
          <PremiumFeatures />

          {/* Subscription Plans */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <SubscriptionPlans
              onSelectPlan={handleSelectPlan}
              currentPlan="free" // This would come from user's actual subscription
            />
          </div>
    </div>
  )
}
