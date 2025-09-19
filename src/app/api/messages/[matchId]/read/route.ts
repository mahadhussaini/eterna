import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const readSchema = z.object({
  messageIds: z.array(z.string()),
})

interface Params {
  matchId: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { matchId } = await params
    const body = await request.json()
    const { messageIds } = readSchema.parse(body)

    // Verify user has access to this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { userId: session.user.id },
          { targetId: session.user.id }
        ]
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      )
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        matchId: matchId,
        receiverId: session.user.id, // Only allow marking own received messages as read
        isRead: false // Only update unread messages
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Mark read error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
