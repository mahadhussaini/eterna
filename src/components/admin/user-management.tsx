"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Ban, UserCheck, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  name?: string
  verified: boolean
  createdAt: string
  profile?: {
    displayName: string
    age: number
    location?: string
    isVisible: boolean
  }
  _count?: {
    sentLikes: number
    receivedLikes: number
    matches: number
    sentMessages: number
  }
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Manage user accounts and profiles</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by email, name, or display name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.profile?.displayName ? (
                      <span className="text-sm font-medium">
                        {user.profile.displayName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-sm font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {user.profile?.displayName || user.name || "No name"}
                      </h3>
                      {user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      {!user.profile?.isVisible && (
                        <Badge variant="outline" className="text-xs">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>Age: {user.profile?.age || "N/A"}</span>
                      <span>Location: {user.profile?.location || "N/A"}</span>
                      <span>Joined: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* User Stats */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {user._count?.matches || 0}
                    </div>
                    <div className="text-xs text-gray-500">Matches</div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {user._count?.sentMessages || 0}
                    </div>
                    <div className="text-xs text-gray-500">Messages</div>
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {selectedUser?.id === user.id && (
                      <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg z-10 py-2 w-48">
                        <button
                          onClick={() => handleUserAction(user.id, "view")}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, user.profile?.isVisible ? "hide" : "show")}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          {user.profile?.isVisible ? "Hide Profile" : "Show Profile"}
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, "ban")}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, "delete")}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
