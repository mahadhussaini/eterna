"use client"

import { useState, useRef } from "react"
import { Camera, CheckCircle, XCircle, Loader2, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface VerificationStatus {
  isVerified: boolean
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  submittedAt?: string
  verifiedAt?: string
  rejectionReason?: string
  confidence?: number
}

interface PhotoVerificationProps {
  currentStatus: VerificationStatus
  onSubmitForVerification: (photoBlob: Blob) => Promise<void>
  isPremium?: boolean
}

export function PhotoVerification({
  currentStatus,
  onSubmitForVerification,
  isPremium = false
}: PhotoVerificationProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    setSubmitting(true)
    try {
      await onSubmitForVerification(selectedFile)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Verification submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusDisplay = () => {
    switch (currentStatus.status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'Verified',
          description: 'Your photo has been verified and you now have a verification badge.'
        }
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Rejected',
          description: currentStatus.rejectionReason || 'Your photo was not approved. Please try with a different photo.'
        }
      case 'pending':
        return {
          icon: Loader2,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'Under Review',
          description: 'Your photo is being reviewed. This usually takes 24-48 hours.'
        }
      default:
        return {
          icon: Shield,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'Not Verified',
          description: 'Get verified to build trust and increase your chances of matching.'
        }
    }
  }

  const statusDisplay = getStatusDisplay()
  const StatusIcon = statusDisplay.icon

  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            Photo Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-6">
              Get a verification badge to show other users that your profile is authentic and build trust in your connections.
            </p>
            <Button>Upgrade to Premium</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Photo Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className={`p-4 rounded-lg border ${statusDisplay.borderColor} ${statusDisplay.bgColor}`}>
          <div className="flex items-center space-x-3">
            <StatusIcon className={`h-6 w-6 ${statusDisplay.color} ${
              currentStatus.status === 'pending' ? 'animate-spin' : ''
            }`} />
            <div>
              <h4 className={`font-semibold ${statusDisplay.color}`}>
                {statusDisplay.text}
              </h4>
              <p className="text-sm text-gray-600">{statusDisplay.description}</p>
            </div>
          </div>

          {currentStatus.isVerified && (
            <div className="mt-3">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Account
              </Badge>
            </div>
          )}
        </div>

        {/* Verification Requirements */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Verification Requirements</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Clear, high-quality photo</li>
            <li>• Face must be clearly visible</li>
            <li>• No sunglasses or heavy makeup</li>
            <li>• Natural lighting and neutral background</li>
            <li>• Recent photo (within 6 months)</li>
          </ul>
        </div>

        {/* Photo Upload */}
        {(currentStatus.status === 'not_submitted' || currentStatus.status === 'rejected') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo for Verification
              </label>

              {!previewUrl ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload a photo</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Submit for Verification
                    </Button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Processing Info */}
        {currentStatus.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Verification in Progress</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Our team is reviewing your photo. You&apos;ll receive a notification once the verification is complete.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  Submitted: {currentStatus.submittedAt ? new Date(currentStatus.submittedAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Benefits of Verification</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ Build trust with other users</li>
            <li>✓ Get priority in search results</li>
            <li>✓ Access to verified-only features</li>
            <li>✓ Increased match success rate</li>
            <li>✓ Premium verification badge</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
