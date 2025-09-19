import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const profileSchema = z.object({
  displayName: z.string().min(1),
  bio: z.string().optional(),
  age: z.number().min(18).max(100),
  gender: z.string().min(1),
  location: z.string().min(1),
  interests: z.array(z.string()),
  lookingFor: z.array(z.string()),
  ageMin: z.number().min(18),
  ageMax: z.number().max(100),
  maxDistance: z.number().min(1).max(500),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    console.log("Session in profile POST:", session) // Debug log

    if (!session?.user?.id) {
      console.log("No session or user ID found") // Debug log
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = profileSchema.parse(body)

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      )
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        displayName: data.displayName,
        bio: data.bio,
        age: data.age,
        gender: data.gender,
        location: data.location,
        interests: JSON.stringify(data.interests),
        lookingFor: JSON.stringify(data.lookingFor),
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        maxDistance: data.maxDistance,
      },
    })

    return NextResponse.json({ profile }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Profile creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    console.log("Session in profile GET:", session) // Debug log

    if (!session?.user?.id) {
      console.log("No session or user ID found in GET") // Debug log
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        photos: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const profileWithParsedFields = {
      ...profile,
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      lookingFor: profile.lookingFor ? JSON.parse(profile.lookingFor) : [],
    }

    return NextResponse.json({ profile: profileWithParsedFields })

  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = profileSchema.parse(body)

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        displayName: data.displayName,
        bio: data.bio,
        age: data.age,
        gender: data.gender,
        location: data.location,
        interests: JSON.stringify(data.interests),
        lookingFor: JSON.stringify(data.lookingFor),
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        maxDistance: data.maxDistance,
      },
    })

    return NextResponse.json({ profile })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
