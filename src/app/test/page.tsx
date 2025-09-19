"use client"

import { useSession } from "next-auth/react"

export default function TestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Session Test</h1>

        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>

          <div>
            <strong>Session Data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          {session?.user && (
            <div>
              <strong>User ID:</strong> {session.user.id}
              <br />
              <strong>Email:</strong> {session.user.email}
              <br />
              <strong>Name:</strong> {session.user.name}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">API Test</h2>
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/profile")
                const data = await response.json()
                alert(`API Response: ${response.status}\n${JSON.stringify(data, null, 2)}`)
              } catch (error) {
                alert(`Error: ${error}`)
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Profile API
          </button>
        </div>
      </div>
    </div>
  )
}
