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
  reportId: string
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
    const { reportId } = resolvedParams
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "review":
        await prisma.report.update({
          where: { id: reportId },
          data: { status: "reviewed" }
        })
        break

      case "resolve":
        await prisma.report.update({
          where: { id: reportId },
          data: { status: "resolved" }
        })
        break

      case "dismiss":
        await prisma.report.update({
          where: { id: reportId },
          data: { status: "resolved" }
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
    console.error("Admin report action error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
