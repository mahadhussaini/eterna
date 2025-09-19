import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Params {
  notificationId: string
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

    const { notificationId } = await params

    // Update the notification to mark it as read
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: session.user.id, // Ensure user can only update their own notifications
        isRead: false // Only update if not already read
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Mark notification read error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
