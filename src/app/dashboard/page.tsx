"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { SwipeInterface } from "@/components/swipe/swipe-interface-clean"

export default function DashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)

  const checkExistingProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        setHasProfile(true)
      } else if (response.status === 404) {
        setHasProfile(false)
        // No profile found, redirect to setup
        router.push("/profile/setup")
      } else {
        // Some other error, assume no profile for safety
        setHasProfile(false)
        router.push("/profile/setup")
      }
    } catch (error) {
      console.error("Error checking profile:", error)
      setHasProfile(false)
      router.push("/profile/setup")
    } finally {
      setCheckingProfile(false)
    }
  }, [router])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      checkExistingProfile()
    }
  }, [status, router, checkExistingProfile])

  if (status === "loading" || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  return <SwipeInterface />
}
