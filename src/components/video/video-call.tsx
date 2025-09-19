"use client"

import { useState, useRef, useEffect } from "react"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Camera,
  CameraOff,
  Settings,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VideoCallProps {
  targetUser: {
    id: string
    displayName: string
    photos: string[]
  }
  onEndCall: () => void
  isPremium?: boolean
}

export function VideoCall({ targetUser, onEndCall, isPremium = false }: VideoCallProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isConnected) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [isConnected])

  useEffect(() => {
    // Simulate connection after component mounts
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    // In a real implementation, this would control the camera
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    // In a real implementation, this would control the microphone
  }

  const handleEndCall = () => {
    setIsConnected(false)
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }
    onEndCall()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!isPremium) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-6">
            Connect face-to-face with your matches through our secure video calling feature.
          </p>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full max-w-4xl mx-auto'}`}>
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {isConnected ? formatDuration(callDuration) : 'Connecting...'}
          </Badge>
          {!isConnected && (
            <div className="flex items-center space-x-2 text-white">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">Connecting to {targetUser.displayName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-white/20"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        {/* Remote Video (Main) */}
        <div className="absolute inset-0">
          {isConnected ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">
                    {targetUser.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{targetUser.displayName}</h3>
                <p className="text-gray-300">Connected</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-pulse w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
                <p>Initializing video call...</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          <div className="w-full h-full bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
            <Camera className={`h-6 w-6 text-white ${!isVideoOn ? 'opacity-50' : ''}`} />
          </div>
          {!isVideoOn && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <CameraOff className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Audio/Video Status */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          {!isAudioOn && (
            <Badge variant="destructive" className="text-xs">
              <MicOff className="h-3 w-3 mr-1" />
              Muted
            </Badge>
          )}
          {!isVideoOn && (
            <Badge variant="destructive" className="text-xs">
              <CameraOff className="h-3 w-3 mr-1" />
              Camera Off
            </Badge>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleVideo}
            className={`rounded-full ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'text-white hover:bg-white/20'}`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={toggleAudio}
            className={`rounded-full ${!isAudioOn ? 'bg-red-500 hover:bg-red-600' : 'text-white hover:bg-white/20'}`}
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowChat(!showChat)}
            className="rounded-full text-white hover:bg-white/20"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Call Chat</h3>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {/* Chat messages would go here */}
            <div className="text-center text-gray-500 text-sm py-8">
              Send messages during your call
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              <Button size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Connecting...</h3>
            <p className="text-gray-300">Please wait while we connect your call</p>
          </div>
        </div>
      )}
    </div>
  )
}
