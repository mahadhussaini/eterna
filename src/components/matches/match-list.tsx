"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MessageCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Match {
  id: string
  createdAt: string
  target: {
    id: string
    profile: {
      displayName: string
      age: number
      photos: Photo[]
    }
  }
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount: number
}

interface Photo {
  id: string
  url: string
  isMain: boolean
}

export function MatchList() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matches")
      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches || [])
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const openChat = (matchId: string) => {
    router.push(`/chat/${matchId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No matches yet
        </h3>
        <p className="text-gray-500 mb-6">
          Keep swiping to find your perfect match!
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Start Swiping
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
        <span className="text-sm text-gray-500">
          {matches.length} match{matches.length !== 1 ? "es" : ""}
        </span>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => {
          const mainPhoto = match.target.profile.photos.find(p => p.isMain) || match.target.profile.photos[0]
          
          return (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openChat(match.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {mainPhoto ? (
                      <Image
                        src={mainPhoto.url}
                        alt={match.target.profile.displayName}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {match.target.profile.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {match.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {match.unreadCount > 9 ? "9+" : match.unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {match.target.profile.displayName}, {match.target.profile.age}
                    </h3>
                    {match.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(match.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {match.lastMessage ? (
                    <p className="text-sm text-gray-600 truncate">
                      {match.lastMessage.content}
                    </p>
                  ) : (
                    <div className="flex items-center text-primary text-sm">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>You matched! Say hello.</span>
                    </div>
                  )}
                </div>

                <MessageCircle className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
