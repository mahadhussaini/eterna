import { ChatPageClient } from "./client"

interface ChatPageProps {
  params: Promise<{
    matchId: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatPageClient matchId={resolvedParams.matchId} />
    </div>
  )
}
