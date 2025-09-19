"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"
import { MobileNav } from "./mobile-nav"
import { BackgroundPattern } from "./background-pattern"
import { useLayout } from "@/hooks/use-layout"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, closeSidebar, layoutConfig } = useLayout()

  // Landing page should have no layout constraints
  if (pathname === '/') {
    return <>{children}</>
  }
  
  // Full screen layout (for video calls, etc.)
  if (layoutConfig.isFullScreen) {
    return (
      <div className="min-h-screen bg-black">
        {children}
      </div>
    )
  }

  // Minimal layout (for auth pages)
  if (layoutConfig.isMinimal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onMenuClick={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 pt-16">
          {children}
        </main>
        {layoutConfig.shouldShowFooter && <Footer />}
      </div>
    )
  }

  // Standard layout with conditional sidebar and proper footer positioning
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BackgroundPattern variant="gradient" />
      {/* Header - Always visible */}
      <Header
        onMenuClick={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />

      {/* Main Layout Container */}
      <div className="flex min-h-screen">
        {/* Sidebar - Conditional and transparent */}
        {layoutConfig.shouldShowSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}

        {/* Main Content Area - Flex column to push footer down */}
        <main
          className={`flex-1 flex flex-col pt-16 ${
            layoutConfig.shouldShowSidebar ? 'md:ml-64' : ''
          }`}
        >
          {/* Page Content - Takes available space */}
          <div className="flex-1 pb-20 md:pb-0">
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </div>

          {/* Footer - Always at bottom when present */}
          {layoutConfig.shouldShowFooter && (
            <Footer className="mt-auto" />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {layoutConfig.shouldShowSidebar && <MobileNav />}

    </div>
  )
}