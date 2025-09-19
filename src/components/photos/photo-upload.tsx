"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface PhotoUploadProps {
  onPhotoUploaded: (photoData: { url: string; file: File }) => void
  maxPhotos?: number
  currentPhotos?: string[]
}

export function PhotoUpload({ onPhotoUploaded, maxPhotos = 6, currentPhotos = [] }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        onPhotoUploaded({ url: data.photo.url, file })
      } else {
        alert('Failed to upload photo')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const remainingSlots = maxPhotos - currentPhotos.length

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Add up to {maxPhotos} photos. The first photo will be your main profile picture.
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Existing Photos */}
        {currentPhotos.map((photoUrl, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-2">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={photoUrl}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      // TODO: Implement photo deletion
                      console.log('Delete photo:', photoUrl)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Upload Slots */}
        {Array.from({ length: remainingSlots }).map((_, index) => (
          <Card key={`upload-${index}`} className="relative">
            <CardContent className="p-2">
              <div
                className={`relative aspect-square rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                  dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  ) : (
                    <Upload className="h-8 w-8 mb-2" />
                  )}
                  <span className="text-sm text-center">
                    {uploading ? 'Uploading...' : 'Click or drag to upload'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <div className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF. Maximum file size: 5MB.
      </div>
    </div>
  )
}
