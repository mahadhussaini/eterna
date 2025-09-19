"use client"

interface TypingIndicatorProps {
  username: string
  isVisible: boolean
}

export function TypingIndicator({ username, isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
      </div>
      <span className="text-sm text-gray-500">{username} is typing...</span>
    </div>
  )
}
