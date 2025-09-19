import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const { photos }: { photos: Array<{ id: string; url: string; order: number; isMain: boolean }> } = body

    if (!Array.isArray(photos)) {
      return NextResponse.json(
        { error: "Invalid photos data" },
        { status: 400 }
      )
    }

    // Delete existing photos
    await prisma.photo.deleteMany({
      where: { profile: { userId: session.user.id } }
    })

    // Create new photos
    if (photos.length > 0) {
      await prisma.photo.createMany({
        data: photos.map((photo) => ({
          profileId: "", // Will be set after getting profile ID
          url: photo.url,
          order: photo.order,
          isMain: photo.isMain
        }))
      })

      // Update profile ID for photos
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id }
      })

      if (profile) {
        await prisma.photo.updateMany({
          where: {
            profileId: "",
            url: { in: photos.map((p) => p.url) }
          },
          data: { profileId: profile.id }
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Update photos error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
