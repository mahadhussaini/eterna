"use client"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      // Check if user is admin (you can implement role-based access here)
      // For now, we'll allow access - in production you'd check user roles
      setIsAdmin(true)
    }
  }, [status, router])

  if (status === "loading" || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
