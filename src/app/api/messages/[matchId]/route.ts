import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
})

interface Params {
  matchId: string
}

export async function GET(
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

    const messages = await prisma.message.findMany({
      where: {
        matchId: matchId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ messages })

  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
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
    const { content } = messageSchema.parse(body)

    // Verify user has access to this match and get target user
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

    // Determine receiver ID
    const receiverId = match.userId === session.user.id ? match.targetId : match.userId

    // Create message
    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: session.user.id,
        receiverId,
        content,
      }
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "message",
        title: "New message",
        message: "You have a new message",
        data: JSON.stringify({ 
          matchId, 
          senderId: session.user.id,
          messageId: message.id 
        })
      }
    })

    return NextResponse.json({ message }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Message send error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
