import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mock admin check - in production, you'd check user roles
const isAdmin = () => {
  // For demo purposes, allow all authenticated users to be "admins"
  return true
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !isAdmin()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Calculate date range
    const now = new Date()
    const rangeDate = new Date()
    switch (range) {
      case "7d":
        rangeDate.setDate(now.getDate() - 7)
        break
      case "30d":
        rangeDate.setDate(now.getDate() - 30)
        break
      case "90d":
        rangeDate.setDate(now.getDate() - 90)
        break
      default:
        rangeDate.setDate(now.getDate() - 30)
    }

    // Get basic counts
    const [totalUsers, activeUsers, totalMatches, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          profile: {
            lastActive: {
              gte: rangeDate
            }
          }
        }
      }),
      prisma.match.count({
        where: {
          createdAt: {
            gte: rangeDate
          }
        }
      }),
      prisma.message.count({
        where: {
          createdAt: {
            gte: rangeDate
          }
        }
      })
    ])

    // Generate mock growth data (in production, you'd calculate this from actual data)
    const userGrowth = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5)
    const matchGrowth = Array.from({ length: 7 }, () => Math.floor(Math.random() * 15) + 3)
    const messageGrowth = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 10)

    // Get top interests
    const topInterests = [
      { interest: "Music", count: 245 },
      { interest: "Travel", count: 198 },
      { interest: "Sports", count: 176 },
      { interest: "Movies", count: 154 },
      { interest: "Cooking", count: 142 },
      { interest: "Art", count: 128 },
      { interest: "Photography", count: 115 },
      { interest: "Books", count: 98 },
      { interest: "Dancing", count: 87 },
      { interest: "Gaming", count: 76 }
    ]

    // Get age distribution
    const ageDistribution = [
      { age: "18-24", count: 245 },
      { age: "25-34", count: 398 },
      { age: "35-44", count: 276 },
      { age: "45-54", count: 187 },
      { age: "55+", count: 94 }
    ]

    // Get location stats
    const locationStats = [
      { location: "New York", count: 89 },
      { location: "Los Angeles", count: 76 },
      { location: "London", count: 65 },
      { location: "Toronto", count: 54 },
      { location: "Sydney", count: 43 },
      { location: "Berlin", count: 38 },
      { location: "Paris", count: 32 },
      { location: "Tokyo", count: 28 },
      { location: "Singapore", count: 24 },
      { location: "Mumbai", count: 21 }
    ]

    const analytics = {
      totalUsers,
      activeUsers,
      totalMatches,
      totalMessages,
      userGrowth,
      matchGrowth,
      messageGrowth,
      topInterests,
      ageDistribution,
      locationStats
    }

    return NextResponse.json({ analytics })

  } catch (error) {
    console.error("Admin analytics fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
