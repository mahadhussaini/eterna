"use client"

import { useState, useEffect } from "react"
import { Flag, Eye, Check, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Report {
  id: string
  reason: string
  details?: string
  status: string
  createdAt: string
  sender: {
    id: string
    email: string
    profile?: {
      displayName: string
    }
  }
  target: {
    id: string
    email: string
    profile?: {
      displayName: string
    }
  }
}

export function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, pending, reviewed, resolved

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (reportId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchReports() // Refresh the list
      }
    } catch (error) {
      console.error("Error updating report:", error)
    }
  }

  const filteredReports = reports.filter(report => {
    if (filter === "all") return true
    return report.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports Management</h2>
        <p className="text-gray-600">Handle user reports and maintain community safety</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === "pending").length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === "reviewed").length}</p>
                <p className="text-sm text-gray-600">Reviewed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === "resolved").length}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Flag className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{reports.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {["all", "pending", "reviewed", "resolved"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Flag className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          Report against {report.target.profile?.displayName || report.target.email}
                        </h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Reason:</strong> {report.reason}
                      </p>
                      {report.details && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Details:</strong> {report.details}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        <span>Reported by: {report.sender.profile?.displayName || report.sender.email}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {report.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportAction(report.id, "review")}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportAction(report.id, "dismiss")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </>
                    )}

                    {report.status === "reviewed" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleReportAction(report.id, "resolve")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {filter === "all"
                  ? "No reports found."
                  : `No ${filter} reports found.`
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
