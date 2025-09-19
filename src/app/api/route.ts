import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    name: "Eterna Dating API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile",
      discover: "/api/discover",
      matches: "/api/matches",
      messages: "/api/messages",
      notifications: "/api/notifications",
      photos: "/api/photos",
      admin: "/api/admin",
      push: "/api/push",
      likes: "/api/likes"
    },
    docs: "API documentation available at /api/docs"
  })
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}
