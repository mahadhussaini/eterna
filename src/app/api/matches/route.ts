import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all matches for the current user
    const matches = await prisma.match.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      include: {
        target: {
          include: {
            profile: {
              include: {
                photos: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format matches with additional data
    const formattedMatches = await Promise.all(
      matches.map(async (match) => {
        // Count unread messages for this match
        const unreadCount = await prisma.message.count({
          where: {
            matchId: match.id,
            receiverId: session.user.id,
            isRead: false
          }
        })

        return {
          id: match.id,
          createdAt: match.createdAt,
          target: {
            id: match.target.id,
            profile: {
              displayName: match.target.profile?.displayName || match.target.name || "Unknown",
              age: match.target.profile?.age || 0,
              photos: match.target.profile?.photos || []
            }
          },
          lastMessage: match.messages[0] ? {
            content: match.messages[0].content,
            createdAt: match.messages[0].createdAt,
            senderId: match.messages[0].senderId
          } : null,
          unreadCount
        }
      })
    )

    return NextResponse.json({ matches: formattedMatches })

  } catch (error) {
    console.error("Matches error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
