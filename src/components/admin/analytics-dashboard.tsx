"use client"

import { useState, useEffect, useCallback } from "react"
import { TrendingUp, Users, Heart, MessageSquare, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Analytics {
  totalUsers: number
  activeUsers: number
  totalMatches: number
  totalMessages: number
  userGrowth: number[]
  matchGrowth: number[]
  messageGrowth: number[]
  topInterests: { interest: string; count: number }[]
  ageDistribution: { age: string; count: number }[]
  locationStats: { location: string; count: number }[]
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d") // 7d, 30d, 90d

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, fetchAnalytics])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data.</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor your app&apos;s performance and user engagement</p>
        </div>

        <div className="flex space-x-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600">+8% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Total Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMatches.toLocaleString()}</div>
            <p className="text-xs text-green-600">+15% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-green-600">+20% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart visualization would go here</p>
                <p className="text-sm text-gray-500 mt-1">
                  Integration with charting library needed
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
              {analytics.userGrowth.slice(-7).map((value, index) => (
                <div key={index}>
                  <div className="bg-blue-500 rounded" style={{ height: `${value * 2}px` }}></div>
                  <span className="text-gray-600 mt-1 block">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Message Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Message activity chart</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
              {analytics.messageGrowth.slice(-7).map((value, index) => (
                <div key={index}>
                  <div className="bg-green-500 rounded" style={{ height: `${value * 0.5}px` }}></div>
                  <span className="text-gray-600 mt-1 block">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Top Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topInterests.slice(0, 10).map((item, index) => (
                <div key={item.interest} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm">{item.interest}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.ageDistribution.map((item) => (
                <div key={item.age} className="flex items-center justify-between">
                  <span className="text-sm">{item.age} years</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(item.count / Math.max(...analytics.ageDistribution.map(d => d.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.locationStats.slice(0, 10).map((item, index) => (
                <div key={item.location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm">{item.location}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
