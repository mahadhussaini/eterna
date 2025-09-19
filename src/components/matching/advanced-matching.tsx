"use client"

import { useState, useEffect } from "react"
import { Heart, Star, TrendingUp, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface MatchSuggestion {
  id: string
  displayName: string
  age: number
  location?: string
  photos: string[]
  compatibility: number // 0-100
  reasons: string[]
  profile: {
    bio?: string
    interests: string[]
    lookingFor: string[]
  }
}

interface AdvancedMatchingProps {
  isPremium?: boolean
  onMatchAction?: (userId: string, action: 'like' | 'pass') => void
}

export function AdvancedMatching({ isPremium = false, onMatchAction }: AdvancedMatchingProps) {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isPremium) {
      fetchSuggestions()
    }
  }, [isPremium])

  const fetchSuggestions = async () => {
    try {
      // This would normally call an API with advanced matching logic
      // For demo purposes, we'll use mock data
      const mockSuggestions: MatchSuggestion[] = [
        {
          id: "1",
          displayName: "Sarah",
          age: 28,
          location: "New York, NY",
          photos: ["/placeholder-avatar.jpg"],
          compatibility: 92,
          reasons: [
            "Shared interest in photography",
            "Similar life goals",
            "Compatible personalities",
            "Mutual friends"
          ],
          profile: {
            bio: "Adventure seeker who loves capturing moments and exploring new places.",
            interests: ["Photography", "Travel", "Hiking", "Art"],
            lookingFor: ["Long-term relationship", "Adventure buddy"]
          }
        },
        {
          id: "2",
          displayName: "Mike",
          age: 32,
          location: "San Francisco, CA",
          photos: ["/placeholder-avatar.jpg"],
          compatibility: 87,
          reasons: [
            "Tech industry connection",
            "Love for innovation",
            "Shared work ethic",
            "Common hobbies"
          ],
          profile: {
            bio: "Software engineer passionate about AI and sustainable technology.",
            interests: ["Technology", "AI", "Sustainability", "Reading"],
            lookingFor: ["Long-term relationship", "Life partner"]
          }
        }
      ]

      setSuggestions(mockSuggestions)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setLoading(false)
    }
  }

  const handleAction = (action: 'like' | 'pass') => {
    const currentSuggestion = suggestions[currentIndex]
    if (currentSuggestion) {
      onMatchAction?.(currentSuggestion.id, action)
      setCurrentIndex(prev => prev + 1)
    }
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  const getCompatibilityLabel = (score: number) => {
    if (score >= 90) return "Excellent Match"
    if (score >= 80) return "Great Match"
    if (score >= 70) return "Good Match"
    return "Potential Match"
  }

  if (!isPremium) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            Advanced Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600 mb-4">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Premium Feature</p>
            <p>Unlock AI-powered matching suggestions with compatibility scores and personalized recommendations.</p>
          </div>
          <Button>
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentSuggestion = suggestions[currentIndex]

  if (!currentSuggestion) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-600 mb-2">No more suggestions</p>
          <p className="text-gray-500">Check back later for new personalized matches!</p>
          <Button className="mt-4" onClick={fetchSuggestions}>
            Refresh Suggestions
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Match Suggestions</h2>
          <p className="text-gray-600">Personalized matches based on your preferences and behavior</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Zap className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Match Card */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={currentSuggestion.photos[0]}
                  alt={currentSuggestion.displayName}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {/* Name and Compatibility */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentSuggestion.displayName}, {currentSuggestion.age}
                  </h3>
                  <p className="text-gray-600">{currentSuggestion.location}</p>
                </div>

                <div className="mt-2 md:mt-0">
                  <Badge className={`${getCompatibilityColor(currentSuggestion.compatibility)} px-3 py-1`}>
                    <Star className="h-3 w-3 mr-1" />
                    {currentSuggestion.compatibility}% Match
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {getCompatibilityLabel(currentSuggestion.compatibility)}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {currentSuggestion.profile.bio && (
                <p className="text-gray-700">{currentSuggestion.profile.bio}</p>
              )}

              {/* Interests */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Shared Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {currentSuggestion.profile.interests.slice(0, 4).map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Compatibility Reasons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Why you&apos;re compatible</h4>
                <ul className="space-y-1">
                  {currentSuggestion.reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAction('pass')}
              className="px-8"
            >
              Pass
            </Button>
            <Button
              size="lg"
              onClick={() => handleAction('like')}
              className="px-8 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              <Heart className="h-4 w-4 mr-2" />
              Like
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Suggestion {currentIndex + 1} of {suggestions.length}
        </p>
        <div className="flex justify-center mt-2 space-x-1">
          {suggestions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
