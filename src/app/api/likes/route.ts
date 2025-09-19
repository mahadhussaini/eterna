import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const likeSchema = z.object({
  targetId: z.string(),
  isLike: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { targetId, isLike } = likeSchema.parse(body)

    // Prevent self-liking
    if (targetId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot like yourself" },
        { status: 400 }
      )
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: session.user.id,
          receiverId: targetId
        }
      }
    })

    if (existingLike) {
      return NextResponse.json(
        { error: "Already responded to this profile" },
        { status: 400 }
      )
    }

    // Create the like/pass record (we don't need the response data)
    await prisma.like.create({
      data: {
        senderId: session.user.id,
        receiverId: targetId,
        isLike,
      }
    })

    let isMatch = false
    let matchId = null

    // If it's a like, check for mutual match
    if (isLike) {
      const mutualLike = await prisma.like.findFirst({
        where: {
          senderId: targetId,
          receiverId: session.user.id,
          isLike: true
        }
      })

      if (mutualLike) {
        // Create a match
        const match = await prisma.match.create({
          data: {
            userId: session.user.id,
            targetId: targetId,
          }
        })

        // Also create the reverse match for easier querying
        await prisma.match.create({
          data: {
            userId: targetId,
            targetId: session.user.id,
          }
        })

        isMatch = true
        matchId = match.id

        // Create notifications for both users
        await prisma.notification.createMany({
          data: [
            {
              userId: session.user.id,
              type: "match",
              title: "It's a Match!",
              message: "You have a new match",
              data: JSON.stringify({ matchId: match.id, userId: targetId })
            },
            {
              userId: targetId,
              type: "match",
              title: "It's a Match!",
              message: "You have a new match",
              data: JSON.stringify({ matchId: match.id, userId: session.user.id })
            }
          ]
        })
      } else {
        // Create notification for the liked user
        await prisma.notification.create({
          data: {
            userId: targetId,
            type: "like",
            title: "Someone likes you!",
            message: "You received a new like",
            data: JSON.stringify({ userId: session.user.id })
          }
        })
      }
    }

    return NextResponse.json({ 
      success: true,
      isMatch,
      matchId
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Like error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all likes received by the current user
    const receivedLikes = await prisma.like.findMany({
      where: {
        receiverId: session.user.id,
        isLike: true
      },
      include: {
        sender: {
          include: {
            profile: {
              include: {
                photos: {
                  where: { isMain: true },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedLikes = receivedLikes.map(like => ({
      id: like.id,
      createdAt: like.createdAt,
      user: {
        id: like.sender.id,
        name: like.sender.name,
        profile: like.sender.profile ? {
          displayName: like.sender.profile.displayName,
          age: like.sender.profile.age,
          photos: like.sender.profile.photos || []
        } : null
      }
    }))

    return NextResponse.json({ likes: formattedLikes })

  } catch (error) {
    console.error("Get likes error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
