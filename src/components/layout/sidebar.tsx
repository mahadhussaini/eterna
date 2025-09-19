"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Heart,
  User,
  MessageCircle,
  Search,
  Crown,
  Shield,
  BarChart3,
  Users as UsersIcon,
  Flag,
  Camera,
  Video,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/")
  }

  const mainNavItems = [
    {
      href: "/dashboard",
      label: "Discover",
      icon: Heart,
      description: "Find new matches"
    },
    {
      href: "/matches",
      label: "Matches",
      icon: MessageCircle,
      description: "Your conversations",
      badge: 2
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      description: "Advanced search"
    }
  ]

  const profileItems = [
    {
      href: "/profile/edit",
      label: "Edit Profile",
      icon: User,
      description: "Update your info"
    },
    {
      href: "/profile/photos",
      label: "My Photos",
      icon: Camera,
      description: "Manage photos"
    }
  ]

  const premiumItems = [
    {
      href: "/premium",
      label: "Premium",
      icon: Crown,
      description: "Upgrade features"
    },
    {
      href: "/verification",
      label: "Verification",
      icon: Shield,
      description: "Get verified"
    }
  ]

  const socialItems = [
    {
      href: "/social",
      label: "Social",
      icon: Star,
      description: "Connect accounts"
    },
    {
      href: "/video",
      label: "Video Calls",
      icon: Video,
      description: "Face-to-face"
    }
  ]

  const adminItems = [
    {
      href: "/admin",
      label: "Admin Panel",
      icon: Shield,
      description: "Manage platform"
    },
    {
      href: "/admin/users",
      label: "User Management",
      icon: UsersIcon,
      description: "Manage users"
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: Flag,
      description: "Review reports"
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Platform stats"
    }
  ]

  const NavItem = ({ item, onClick }: {
    item: {
      href: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
      badge?: number;
    },
    onClick?: () => void
  }) => {
    const Icon = item.icon
    const isActive = isActiveRoute(item.href)

    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
          isActive
            ? "bg-pink-100/70 text-pink-700 border border-pink-200/50 backdrop-blur-sm shadow-sm"
            : "text-gray-700 hover:bg-white/50 hover:backdrop-blur-sm hover:shadow-sm"
        )}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-pink-600")} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="text-xs h-5 px-1.5">
                {item.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{item.description}</p>
        </div>
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-md border-r border-gray-200">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Discover
          </h3>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </nav>
        </div>

        <Separator />

        {/* Profile */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Profile
          </h3>
          <nav className="space-y-1">
            {profileItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </nav>
        </div>

        <Separator />

        {/* Premium Features */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Premium
          </h3>
          <nav className="space-y-1">
            {premiumItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </nav>
        </div>

        <Separator />

        {/* Social & Communication */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Connect
          </h3>
          <nav className="space-y-1">
            {socialItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </nav>
        </div>

        {/* Admin Section (only show if user is admin) */}
        {session?.user && (
          <>
            <Separator />
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Admin
              </h3>
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavItem key={item.href} item={item} onClick={onClose} />
                ))}
                {/* Debug Tools */}
                <NavItem
                  item={{
                    href: "/debug",
                    label: "Debug Tools",
                    icon: () => <span className="text-xs">🔧</span>,
                    description: "PWA diagnostics"
                  }}
                  onClick={onClose}
                />
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Support Link */}
      <div className="p-4 border-t border-gray-200/30 bg-white/40">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Need help?</p>
          <Button variant="outline" size="sm" className="w-full bg-white/80 backdrop-blur-sm hover:bg-white/95 border-gray-300/50">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:top-16 md:bottom-0 md:z-30 md:h-[calc(100vh-4rem)]">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white/85 backdrop-blur-lg shadow-xl border-r border-gray-200/40">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
