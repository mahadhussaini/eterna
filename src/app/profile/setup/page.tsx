"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { ProfileSetupForm } from "@/components/profile/profile-setup-form"

export default function ProfileSetupPage() {
  const { status } = useSession()
  const router = useRouter()
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)

  const checkExistingProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        setHasProfile(true)
        // Profile exists, redirect to dashboard
        router.push("/dashboard")
      } else if (response.status === 404) {
        setHasProfile(false)
      } else {
        // Some other error, assume no profile
        setHasProfile(false)
      }
    } catch (error) {
      console.error("Error checking profile:", error)
      setHasProfile(false)
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
          <p className="text-white mt-4">Loading...</p>
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

  if (hasProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Profile already exists. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Tell us about yourself to find your perfect match
            </p>
          </div>

          <ProfileSetupForm />
        </div>
      </div>
    </div>
  )
}
