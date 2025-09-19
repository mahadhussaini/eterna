"use client"

interface BackgroundPatternProps {
  variant?: "default" | "minimal" | "gradient"
  className?: string
}

export function BackgroundPattern({ variant = "default", className = "" }: BackgroundPatternProps) {
  if (variant === "minimal") {
    return (
      <div className={`fixed top-16 left-0 right-0 bottom-0 -z-10 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div className={`fixed top-16 left-0 right-0 bottom-0 -z-10 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]" />
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(236,72,153,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-red-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
    </div>
  )
}
