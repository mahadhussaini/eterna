"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { Heart, X, Filter, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "./profile-card"
import { DiscoveryFilters } from "@/components/discovery/discovery-filters"
import { NotificationCenter } from "@/components/notifications/notification-center"

interface Profile {
  id: string
  displayName: string
  age: number
  bio?: string
  location?: string
  photos: Photo[]
  interests: string[]
}

interface Photo {
  id: string
  url: string
  order: number
  isMain: boolean
}

interface Filters {
  ageMin: number
  ageMax: number
  distance: number
  interests: string[]
  location: string
  gender: string
  lookingFor: string[]
}

export function SwipeInterface() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    ageMin: 18,
    ageMax: 35,
    distance: 50,
    interests: [],
    location: "",
    gender: "",
    lookingFor: []
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30])
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])
  const likeOpacity = useTransform(x, [0, 150], [0, 1])
  const passOpacity = useTransform(x, [-150, 0], [1, 0])

  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        const unread = data.notifications.filter((n: { isRead: boolean }) => !n.isRead).length
        setUnreadNotifications(unread)
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error)
    }
  }

  const fetchProfiles = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        ageMin: filters.ageMin.toString(),
        ageMax: filters.ageMax.toString(),
        distance: filters.distance.toString(),
        interests: JSON.stringify(filters.interests),
        location: filters.location,
        gender: filters.gender,
        lookingFor: JSON.stringify(filters.lookingFor)
      })

      const response = await fetch(`/api/discover?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProfiles()
    fetchUnreadNotifications()
  }, [fetchProfiles])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const isSwipeRight = info.offset.x > threshold
    const isSwipeLeft = info.offset.x < -threshold

    if (isSwipeRight) {
      handleLike()
    } else if (isSwipeLeft) {
      handlePass()
    } else {
      // Snap back to center
      x.set(0)
    }
  }

  const handleLike = async () => {
    const currentProfile = profiles[currentIndex]
    if (!currentProfile) return

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId: currentProfile.id,
          isLike: true,
        }),
      })
    } catch (error) {
      console.error("Error liking profile:", error)
    }

    goToNextProfile()
  }

  const handlePass = async () => {
    const currentProfile = profiles[currentIndex]
    if (!currentProfile) return

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId: currentProfile.id,
          isLike: false,
        }),
      })
    } catch (error) {
      console.error("Error passing profile:", error)
    }

    goToNextProfile()
  }

  const goToNextProfile = () => {
    x.set(0)
    setCurrentIndex(prev => prev + 1)
    
    // Load more profiles if running low
    if (currentIndex >= profiles.length - 2) {
      fetchProfiles()
    }
  }

  const animateSwipe = (direction: "left" | "right") => {
    const targetX = direction === "right" ? 300 : -300
    x.set(targetX)
    
    setTimeout(() => {
      if (direction === "right") {
        handleLike()
      } else {
        handlePass()
      }
    }, 200)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]
  const nextProfileData = profiles[currentIndex + 1]

  return (
    <div className="bg-gradient-to-br from-pink-50 to-red-50 min-h-[calc(100vh-200px)]">
      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm mb-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-primary">Discover People</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setShowFilters(true)}>
            <Filter className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm h-[600px]">
          {/* Next Profile (Background) */}
          {nextProfileData && (
            <div className="absolute inset-0">
              <ProfileCard profile={nextProfileData} />
            </div>
          )}

          {/* Current Profile (Foreground) */}
          {currentProfile ? (
            <motion.div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{
                x,
                rotate,
                opacity,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              whileTap={{ scale: 0.95 }}
            >
              <ProfileCard profile={currentProfile} />
              
              {/* Swipe Indicators */}
              <motion.div
                className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-12"
                style={{
                  opacity: likeOpacity,
                }}
              >
                LIKE
              </motion.div>

              <motion.div
                className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform -rotate-12"
                style={{
                  opacity: passOpacity,
                }}
              >
                PASS
              </motion.div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white rounded-2xl shadow-lg">
              <div className="text-center">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No more profiles
                </h3>
                <p className="text-gray-500">Check back later for new matches!</p>
                <Button
                  onClick={fetchProfiles}
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {currentProfile && (
        <div className="flex justify-center space-x-8 pb-8">
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => animateSwipe("left")}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => animateSwipe("right")}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      )}

      <DiscoveryFilters
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters)
          setCurrentIndex(0) // Reset to first profile when filters change
        }}
        onClose={() => setShowFilters(false)}
        isVisible={showFilters}
      />

      <NotificationCenter
        onClose={() => {
          setShowNotifications(false)
          fetchUnreadNotifications() // Refresh count when closing
        }}
        isVisible={showNotifications}
      />
    </div>
  )
}
