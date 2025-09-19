"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Info } from "lucide-react"

interface Profile {
  id: string
  displayName: string
  age: number
  bio?: string
  location?: string
  photos: Photo[]
  interests: string[]
}

interface Photo {
  id: string
  url: string
  order: number
  isMain: boolean
}

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const photos = profile.photos || []
  const mainPhoto = photos.find(p => p.isMain) || photos[0]

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === photos.length - 1 ? 0 : prev + 1
    )
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? photos.length - 1 : prev - 1
    )
  }

  return (
    <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
      {/* Photo Display */}
      <div className="relative h-3/4 bg-gray-200">
        {photos.length > 0 ? (
          <>
            <Image
              src={photos[currentPhotoIndex]?.url || mainPhoto?.url || "/placeholder-avatar.jpg"}
              alt={`${profile.displayName}'s photo`}
              fill
              className="object-cover"
              sizes="(max-width: 400px) 100vw, 400px"
            />
            
            {/* Photo Navigation */}
            {photos.length > 1 && (
              <>
                <div className="absolute inset-0 flex">
                  <button
                    className="flex-1 transparent"
                    onClick={prevPhoto}
                    aria-label="Previous photo"
                  />
                  <button
                    className="flex-1 transparent"
                    onClick={nextPhoto}
                    aria-label="Next photo"
                  />
                </div>
                
                {/* Photo Indicators */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {photos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 w-8 rounded-full ${
                        index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-2xl">
                {profile.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="h-1/4 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {profile.displayName}, {profile.age}
            </h3>
          </div>
          
          {profile.location && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}

          {!showDetails && profile.bio && (
            <p className="text-gray-700 text-sm line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>

        {showDetails && (
          <div className="mt-2 space-y-2">
            {profile.bio && (
              <p className="text-gray-700 text-sm">
                {profile.bio}
              </p>
            )}
            
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Interests
                </p>
                <div className="flex flex-wrap gap-1">
                  {profile.interests.slice(0, 6).map((interest) => (
                    <span
                      key={interest}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                  {profile.interests.length > 6 && (
                    <span className="text-gray-500 text-xs">
                      +{profile.interests.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
