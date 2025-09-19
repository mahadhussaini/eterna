"use client"

import { Check, CheckCheck } from "lucide-react"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
}

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwnMessage
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-gray-200 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isOwnMessage ? 'text-white/70' : 'text-gray-500'
        }`}>
          <span className="text-xs">{formatTime(message.createdAt)}</span>
          
          {isOwnMessage && (
            <div className="flex">
              {message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
