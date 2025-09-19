// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
      <div className="container mx-auto px-4 py-16 text-white">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 mr-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h1 className="text-6xl font-bold">Eterna</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Find your perfect match. Connect with people who share your interests and values.
            Your journey to meaningful relationships starts here.
          </p>
        </header>

        <main className="text-center max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="opacity-80">Our advanced algorithm finds compatible matches based on your interests and preferences.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="opacity-80">Connect instantly with your matches through our secure messaging platform.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="opacity-80">Your privacy and safety are our top priorities with verified profiles and secure data.</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button asChild variant="outline" size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
