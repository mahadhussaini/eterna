import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { userId: session.user.id },
          { targetId: session.user.id }
        ]
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                photos: true
              }
            }
          }
        },
        target: {
          include: {
            profile: {
              include: {
                photos: true
              }
            }
          }
        }
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      )
    }

    // Determine which user is the target (not the current user)
    const isCurrentUserTheUser = match.userId === session.user.id
    const targetUser = isCurrentUserTheUser ? match.target : match.user

    const formattedMatch = {
      id: match.id,
      target: {
        id: targetUser.id,
        profile: {
          displayName: targetUser.profile?.displayName || targetUser.name || "Unknown",
          photos: targetUser.profile?.photos || []
        }
      }
    }

    return NextResponse.json({ match: formattedMatch })

  } catch (error) {
    console.error("Match fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
