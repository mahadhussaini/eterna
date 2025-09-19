"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useState } from "react"
import Image from "next/image"
import { VideoCall } from "@/components/video/video-call"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, Clock, Star } from "lucide-react"

export default function VideoPage() {
  const [inCall, setInCall] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<{
    id: string;
    displayName: string;
    photos: string[];
  } | null>(null)

  const mockMatches = [
    {
      id: "1",
      displayName: "Sarah",
      photos: ["/placeholder-avatar.jpg"],
      lastSeen: "2 hours ago",
      compatibility: 92
    },
    {
      id: "2",
      displayName: "Mike",
      photos: ["/placeholder-avatar.jpg"],
      lastSeen: "1 day ago",
      compatibility: 87
    }
  ]

  const handleStartCall = (match: { id: string; displayName: string; photos: string[] }) => {
    setSelectedMatch(match)
    setInCall(true)
  }

  const handleEndCall = () => {
    setInCall(false)
    setSelectedMatch(null)
  }

  if (inCall && selectedMatch) {
    return (
      <VideoCall
        targetUser={selectedMatch}
        onEndCall={handleEndCall}
        isPremium={true}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Calling</h1>
        <p className="text-gray-600">
          Connect face-to-face with your matches through secure video calls
        </p>
      </div>

      {/* Quick Start */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-6 text-center">
          <Video className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Video Call?</h3>
          <p className="text-gray-600 mb-4">
            Start a video call with any of your matches instantly
          </p>
          <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
            <Video className="h-4 w-4 mr-2" />
            Quick Match Call
          </Button>
        </CardContent>
      </Card>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Start a Call with Your Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <Image
                      src={match.photos[0]}
                      alt={match.displayName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{match.displayName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{match.lastSeen}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <Star className="h-4 w-4" />
                      <span>{match.compatibility}% match</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleStartCall(match)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder-avatar.jpg"
                      alt="Sarah"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sarah</h4>
                  <p className="text-sm text-gray-600">Yesterday at 3:45 PM • 12 min</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Call Again
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder-avatar.jpg"
                      alt="Mike"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                <div>
                  <h4 className="font-medium text-gray-900">Mike</h4>
                  <p className="text-sm text-gray-600">2 days ago at 7:30 PM • 8 min</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Call Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Video Call Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🎯 Be Prepared</h4>
              <p>Find a quiet, well-lit space and test your camera and microphone before calling.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💬 Start with Conversation</h4>
              <p>Begin with light conversation to build comfort before diving into deeper topics.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📱 Be Respectful</h4>
              <p>Respect boundaries and be mindful of the other person&apos;s comfort level.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔒 Stay Safe</h4>
              <p>Never share personal information until you feel completely comfortable.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
