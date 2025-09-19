import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Mock admin check - in production, you'd check user roles
const isAdmin = () => {
  // For demo purposes, allow all authenticated users to be "admins"
  return true
}

// Mock settings storage - in production, you'd use a database
let systemSettings = {
  appName: "Eterna",
  description: "Find your perfect match. Connect with people who share your interests and values.",
  maxMatchesPerDay: 50,
  maxMessagesPerHour: 100,
  enableNotifications: true,
  enablePushNotifications: false,
  requireProfileVerification: false,
  allowGuestBrowsing: false,
  maintenanceMode: false,
  maintenanceMessage: "We're currently performing maintenance. Please check back soon!",
  emailNotifications: false,
  smtpHost: "",
  smtpPort: 587,
  smtpUser: ""
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

    return NextResponse.json({ settings: systemSettings })

  } catch (error) {
    console.error("Admin settings fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !isAdmin()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Update settings (in production, save to database)
    systemSettings = { ...systemSettings, ...body }

    return NextResponse.json({ settings: systemSettings, success: true })

  } catch (error) {
    console.error("Admin settings update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
