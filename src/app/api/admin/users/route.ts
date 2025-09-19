import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mock admin check - in production, you'd check user roles
const isAdmin = () => {
  // For demo purposes, allow all authenticated users to be "admins"
  return true
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !isAdmin()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        profile: {
          include: {
            photos: true
          }
        },
        _count: {
          select: {
            sentLikes: true,
            receivedLikes: true,
            matches: true,
            sentMessages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit for admin view
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error("Admin users fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
