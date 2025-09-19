import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { subscription } = body

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      )
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.pushSubscription.findFirst({
      where: {
        userId: session.user.id,
        endpoint: subscription.endpoint
      }
    })

    if (existingSubscription) {
      // Update existing subscription
      await prisma.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          subscriptionData: JSON.stringify(subscription),
          updatedAt: new Date()
        }
      })
    } else {
      // Create new subscription
      await prisma.pushSubscription.create({
        data: {
          userId: session.user.id,
          endpoint: subscription.endpoint,
          subscriptionData: JSON.stringify(subscription)
        }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Push subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
