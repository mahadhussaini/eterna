"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import {
  Heart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  MessageCircle,
  Crown,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationCenter } from "@/components/notifications/notification-center"

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications] = useState(3) // Mock data

  // Handle SSR by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR or before session is loaded
  if (!mounted || status === 'loading') {
    return (
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 fixed top-0 z-50 w-full">
        <div className="w-full max-w-none px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Left Section - Logo only during loading */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-pink-500" />
                <span className="text-2xl font-bold text-gray-900">Eterna</span>
              </Link>
            </div>

            {/* Center Section - Empty during loading */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Loading placeholder */}
            </div>

            {/* Right Section - Sign In button during loading */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const isAuthenticated = session && status === 'authenticated'

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const isActiveRoute = (route: string) => {
    return pathname === route
  }

  // Return loading state during SSR
  if (!mounted) {
    return (
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 fixed top-0 z-50 w-full">
        <div className="w-full max-w-none px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-pink-500" />
                <span className="text-2xl font-bold text-gray-900">Eterna</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 fixed top-0 z-50 w-full">
        <div className="w-full max-w-none px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <Link href="/" className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <span className="text-2xl font-bold text-gray-900">Eterna</span>
                </div>
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActiveRoute("/dashboard") ? "text-pink-600" : "text-gray-700"
                }`}
              >
                Discover
              </Link>
              <Link
                href="/matches"
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActiveRoute("/matches") ? "text-pink-600" : "text-gray-700"
                }`}
              >
                Matches
              </Link>
              <Link
                href="/search"
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  isActiveRoute("/search") ? "text-pink-600" : "text-gray-700"
                }`}
              >
                <Search className="h-4 w-4 inline mr-1" />
                Search
              </Link>
              <Link
                href="/premium"
                className={`text-sm font-medium transition-colors hover:text-pink-600 flex items-center ${
                  isActiveRoute("/premium") ? "text-pink-600" : "text-gray-700"
                }`}
              >
                <Crown className="h-4 w-4 mr-1" />
                Premium
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {/* Messages */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/matches")}
                    className="relative"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      2
                    </Badge>
                  </Button>

                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(true)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {unreadNotifications > 9 ? "9+" : unreadNotifications}
                      </Badge>
                    )}
                  </Button>

                  {/* Profile Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={session?.user?.name || ""} />
                          <AvatarFallback>
                            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session?.user?.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session?.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile/edit")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/premium")}>
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Premium</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter
        onClose={() => setShowNotifications(false)}
        isVisible={showNotifications}
      />
    </>
  )
}
