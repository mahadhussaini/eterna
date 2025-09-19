"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PhotoManager } from "@/components/photos/photo-manager"

export default function ProfilePhotosPage() {
  const { status } = useSession()
  const router = useRouter()
  const [photos, setPhotos] = useState<Array<{
    id: string;
    url: string;
    order: number;
    isMain: boolean;
  }>>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      // Load user's photos
      loadPhotos()
    }
  }, [status, router])

  const loadPhotos = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.profile?.photos || [])
      }
    } catch (error) {
      console.error("Error loading photos:", error)
    }
  }

  const handlePhotosChange = async (updatedPhotos: Array<{
    id: string;
    url: string;
    order: number;
    isMain: boolean;
  }>) => {
    setPhotos(updatedPhotos)
    // Here you would save to the backend
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Photos</h1>
        <p className="text-gray-600">
          Upload, organize, and manage your profile photos. Your first photo will be your main profile picture.
        </p>
      </div>

      <PhotoManager
        photos={photos}
        onPhotosChange={handlePhotosChange}
        maxPhotos={6}
      />

      {/* Photo Guidelines */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Photo Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">✅ Do&apos;s</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use recent, clear photos</li>
              <li>• Show your face clearly</li>
              <li>• Include natural lighting</li>
              <li>• Smile and look approachable</li>
              <li>• Use high-quality images</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">❌ Don&apos;ts</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Group photos (unless you&apos;re clearly featured)</li>
              <li>• Sunglasses or heavy filters</li>
              <li>• Nude or inappropriate content</li>
              <li>• Photos with other people</li>
              <li>• Low-quality or blurry images</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Photo Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-pink-600">{photos.length}</div>
          <div className="text-sm text-gray-600">Photos Uploaded</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">89%</div>
          <div className="text-sm text-gray-600">Profile Completion</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">+24%</div>
          <div className="text-sm text-gray-600">Match Rate Increase</div>
        </div>
      </div>
    </div>
  )
}
