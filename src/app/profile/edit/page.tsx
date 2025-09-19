"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ProfileEditor } from "@/components/profile/profile-editor"

export default function EditProfilePage() {
  const { status } = useSession()
  const router = useRouter()
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      // Check if user has a profile
      fetch("/api/profile")
        .then(res => {
          if (res.status === 404) {
            router.push("/profile/setup")
          } else if (res.ok) {
            setHasProfile(true)
          }
        })
        .catch(() => {
          router.push("/profile/setup")
        })
    }
  }, [status, router])

  if (status === "loading" || hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your profile information and photos</p>
      </div>

      <ProfileEditor />
    </div>
  )
}