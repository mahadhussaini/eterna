"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PhotoVerification } from "@/components/verification/photo-verification"

export default function VerificationPage() {
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

  const handleSubmitForVerification = async (photoBlob: Blob) => {
    // This would handle the photo verification submission
    console.log("Submitting photo for verification:", photoBlob)
    // In a real implementation, this would upload to your verification service
  }

  const currentStatus = {
    isVerified: false,
    status: "not_submitted" as const,
    submittedAt: undefined,
    verifiedAt: undefined,
    rejectionReason: undefined,
    confidence: undefined
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Photo Verification</h1>
        <p className="text-gray-600">
          Get verified to build trust and increase your chances of meaningful connections
        </p>
      </div>

      <PhotoVerification
        currentStatus={currentStatus}
        onSubmitForVerification={handleSubmitForVerification}
        isPremium={true} // This would be determined by user's subscription status
      />

      {/* Verification Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Get Verified?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Build Trust</h4>
              <p className="text-sm text-gray-600">Show others you&apos;re a real person with verified photos</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-xs font-bold">↑</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Better Matches</h4>
              <p className="text-sm text-gray-600">Verified profiles get priority in search results</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-xs font-bold">🛡️</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Safety Badge</h4>
              <p className="text-sm text-gray-600">Display verification badge to signal authenticity</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-xs font-bold">📈</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Higher Visibility</h4>
              <p className="text-sm text-gray-600">Appear more prominently in search results</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">How long does verification take?</h4>
            <p className="text-sm text-gray-600">Most verifications are processed within 24-48 hours during business days.</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">What if my photo is rejected?</h4>
            <p className="text-sm text-gray-600">You&apos;ll receive specific feedback on why your photo was rejected and can submit a new one.</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Is my photo stored securely?</h4>
            <p className="text-sm text-gray-600">Yes, all photos are encrypted and stored securely. We only use them for verification purposes.</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Can I remove my verification?</h4>
            <p className="text-sm text-gray-600">Yes, you can remove your verification badge at any time in your settings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
