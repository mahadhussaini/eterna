import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const ageMin = parseInt(searchParams.get("ageMin") || "18")
    const ageMax = parseInt(searchParams.get("ageMax") || "35")
    const distance = parseInt(searchParams.get("distance") || "50") // Reserved for future distance-based filtering
    void distance // Explicitly mark as unused for now
    const interests = searchParams.get("interests") ? JSON.parse(searchParams.get("interests")!) : []
    const location = searchParams.get("location") || ""
    const gender = searchParams.get("gender") || ""
    const lookingFor = searchParams.get("lookingFor") ? JSON.parse(searchParams.get("lookingFor")!) : []

    // Get current user's profile for filtering
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!currentUserProfile) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      )
    }

    // Get users that the current user has already liked/passed
    const existingLikes = await prisma.like.findMany({
      where: {
        senderId: session.user.id
      },
      select: {
        receiverId: true
      }
    })

    const likedUserIds = existingLikes.map(like => like.receiverId)

    // Build filter conditions
    const filterConditions: Record<string, unknown>[] = [
      { userId: { not: session.user.id } }, // Not the current user
      { userId: { notIn: likedUserIds } }, // Not already liked/passed
      { isVisible: true }, // Profile is visible
    ]

    // Age filter
    if (ageMin > 18 || ageMax < 100) {
      filterConditions.push({
        age: {
          gte: ageMin,
          lte: ageMax
        }
      })
    }

    // Gender filter
    if (gender) {
      filterConditions.push({ gender })
    }

    // Location filter (simple text match for now)
    if (location) {
      filterConditions.push({
        location: {
          contains: location,
          mode: 'insensitive'
        }
      })
    }

    // Interests filter (find users with at least one shared interest)
    if (interests.length > 0) {
      filterConditions.push({
        interests: {
          not: null
        }
      })
      // Note: Full interest matching would require more complex logic
      // For now, we'll just ensure profiles have interests defined
    }

    // Looking for filter (find users with matching relationship goals)
    if (lookingFor.length > 0) {
      filterConditions.push({
        lookingFor: {
          not: null
        }
      })
      // Note: Full relationship matching would require more complex logic
    }

    // Find potential matches based on filters
    const potentialMatches = await prisma.profile.findMany({
      where: {
        AND: filterConditions
      },
      include: {
        photos: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: 10, // Limit to 10 profiles at a time
      orderBy: {
        lastActive: 'desc' // Show most recently active users first
      }
    })

    // Parse JSON fields and format response
    const formattedProfiles = potentialMatches.map(profile => ({
      id: profile.userId,
      displayName: profile.displayName,
      age: profile.age,
      bio: profile.bio,
      location: profile.location,
      photos: profile.photos || [],
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      lookingFor: profile.lookingFor ? JSON.parse(profile.lookingFor) : [],
    }))

    // Shuffle the results for variety
    const shuffledProfiles = formattedProfiles.sort(() => Math.random() - 0.5)

    return NextResponse.json({ 
      profiles: shuffledProfiles,
      hasMore: shuffledProfiles.length === 10
    })

  } catch (error) {
    console.error("Discovery error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
