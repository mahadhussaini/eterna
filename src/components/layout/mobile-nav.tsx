"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  MessageCircle,
  Search,
  User,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      label: "Discover",
      icon: Heart,
      badge: null
    },
    {
      href: "/matches",
      label: "Matches",
      icon: MessageCircle,
      badge: 2
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      badge: null
    },
    {
      href: "/profile/edit",
      label: "Profile",
      icon: User,
      badge: null
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      badge: null
    }
  ]

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/")
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-40 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveRoute(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 relative",
                isActive
                  ? "text-pink-600 bg-pink-50/80"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium mt-1">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-600 rounded-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}