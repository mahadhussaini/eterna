import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('photo') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      )
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'photos')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch {
      // Directory might already exist, that's okay
    }

    const fileExtension = file.name.split('.').pop()
    const fileName = `${randomUUID()}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Save file
    await writeFile(filePath, buffer)

    // Create photo URL
    const photoUrl = `/uploads/photos/${fileName}`

    return NextResponse.json({
      photo: {
        id: randomUUID(),
        url: photoUrl,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Photo upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
