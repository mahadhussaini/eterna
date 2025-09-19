import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mock admin check - in production, you'd check user roles
const isAdmin = () => {
  // For demo purposes, allow all authenticated users to be "admins"
  return true
}

interface Params {
  userId: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !isAdmin()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const resolvedParams = await params
    const { userId } = resolvedParams
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "hide":
        await prisma.profile.update({
          where: { userId },
          data: { isVisible: false }
        })
        break

      case "show":
        await prisma.profile.update({
          where: { userId },
          data: { isVisible: true }
        })
        break

      case "ban":
        await prisma.user.update({
          where: { id: userId },
          data: { verified: false }
        })
        break

      case "delete":
        await prisma.user.delete({
          where: { id: userId }
        })
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Admin user action error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
