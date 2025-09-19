"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, ArrowLeft, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
}

interface Match {
  id: string
  target: {
    id: string
    profile: {
      displayName: string
      photos: Photo[]
    }
  }
}

interface Photo {
  id: string
  url: string
  isMain: boolean
}

interface ChatInterfaceProps {
  matchId: string
}

export function ChatInterface({ matchId }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [matchData, setMatchData] = useState<Match | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMatchAndMessages = useCallback(async () => {
    try {
      // Fetch match data
      const matchResponse = await fetch(`/api/matches/${matchId}`)
      if (matchResponse.ok) {
        const matchData = await matchResponse.json()
        setMatchData(matchData.match)
      }

      // Fetch messages
      const messagesResponse = await fetch(`/api/messages/${matchId}`)
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json()
        setMessages(messagesData.messages || [])
      }
    } catch (error) {
      console.error("Error fetching chat data:", error)
    } finally {
      setLoading(false)
    }
  }, [matchId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const markMessagesAsRead = useCallback(async () => {
    if (!session?.user?.id) return

    const unreadMessages = messages.filter(
      msg => !msg.isRead && msg.receiverId === session.user.id
    )

    if (unreadMessages.length > 0) {
      try {
        await fetch(`/api/messages/${matchId}/read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageIds: unreadMessages.map(msg => msg.id)
          })
        })
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    }
  }, [session?.user?.id, messages, matchId])

  useEffect(() => {
    fetchMatchAndMessages()
  }, [fetchMatchAndMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Mark messages as read when component mounts or messages change
    markMessagesAsRead()
  }, [markMessagesAsRead])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      const response = await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setNewMessage(messageContent) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  const handleTyping = () => {
    setIsTyping(true)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Match not found</p>
          <Button onClick={() => router.push("/matches")}>
            Back to Matches
          </Button>
        </div>
      </div>
    )
  }

  const targetProfile = matchData.target.profile
  const mainPhoto = targetProfile.photos.find(p => p.isMain) || targetProfile.photos[0]

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/matches")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {mainPhoto ? (
              <Image
                src={mainPhoto.url}
                alt={targetProfile.displayName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">
                  {targetProfile.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">
              {targetProfile.displayName}
            </h3>
            <p className="text-xs text-gray-500">Online now</p>
          </div>
        </div>

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
              {mainPhoto && (
                <Image
                  src={mainPhoto.url}
                  alt={targetProfile.displayName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              You matched with {targetProfile.displayName}!
            </h4>
            <p className="text-gray-600 text-sm">
              Start the conversation and say hello.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === session?.user?.id}
            />
          ))
        )}
        
        <TypingIndicator
          username={targetProfile.displayName}
          isVisible={isTyping}
        />
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
