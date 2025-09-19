"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface LayoutConfig {
  shouldShowSidebar: boolean
  shouldShowFooter: boolean
  isFullScreen: boolean
  isMinimal: boolean
}

export function useLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // Determine layout configuration based on current route
  const getLayoutConfig = (path: string): LayoutConfig => {
    // Full screen layouts (video calls, etc.)
    if (path.startsWith('/video/call/') || path.includes('/fullscreen')) {
      return {
        shouldShowSidebar: false,
        shouldShowFooter: false,
        isFullScreen: true,
        isMinimal: false
      }
    }

    // Minimal layouts (auth pages, landing page)
    if (
      path === '/' ||
      path.startsWith('/auth/') ||
      path.startsWith('/features') ||
      path === '/offline'
    ) {
      return {
        shouldShowSidebar: false,
        shouldShowFooter: true,
        isFullScreen: false,
        isMinimal: true
      }
    }

    // Standard app layouts (most pages)
    return {
      shouldShowSidebar: true,
      shouldShowFooter: true,
      isFullScreen: false,
      isMinimal: false
    }
  }

  const layoutConfig = getLayoutConfig(pathname)

  return {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    layoutConfig
  }
}