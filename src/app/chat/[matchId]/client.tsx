"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"

export function ChatPageClient({ matchId }: { matchId: string }) {
  const { status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  return <ChatInterface matchId={matchId} />
}
