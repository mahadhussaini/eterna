"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  Users,
  Camera,
  Bell,
  Crown,
  Shield,
  Video,
  Instagram,
  Zap,
  Star,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const features = [
    {
      icon: Heart,
      title: "Smart Matching",
      description: "Advanced algorithms find your perfect match based on compatibility, interests, and preferences.",
      category: "core",
      premium: false
    },
    {
      icon: Camera,
      title: "Photo Management",
      description: "Upload, organize, and manage your photos with drag-and-drop reordering and privacy controls.",
      category: "core",
      premium: false
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Real-time notifications for matches, messages, and important updates on all devices.",
      category: "core",
      premium: false
    },
    {
      icon: Shield,
      title: "Photo Verification",
      description: "Get verified with our AI-powered photo verification system to build trust and credibility.",
      category: "premium",
      premium: true
    },
    {
      icon: Crown,
      title: "Premium Features",
      description: "Unlimited likes, advanced filters, priority matching, and exclusive premium benefits.",
      category: "premium",
      premium: true
    },
    {
      icon: Zap,
      title: "Advanced Matching",
      description: "AI-powered compatibility suggestions with detailed match insights and recommendations.",
      category: "premium",
      premium: true
    },
    {
      icon: Instagram,
      title: "Social Integration",
      description: "Connect Instagram, Twitter, and other social accounts to enhance your profile.",
      category: "premium",
      premium: true
    },
    {
      icon: Video,
      title: "Video Calling",
      description: "Connect face-to-face with your matches through secure video calls with chat features.",
      category: "premium",
      premium: true
    }
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Matches Made", value: "250K+", icon: Heart },
    { label: "Success Rate", value: "85%", icon: Star },
    { label: "Premium Users", value: "15K+", icon: Crown }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Premium User",
      content: "Found my soulmate within 3 months! The premium features made all the difference.",
      rating: 5
    },
    {
      name: "Mike R.",
      role: "Verified User",
      content: "The verification system gives me peace of mind when meeting new people.",
      rating: 5
    },
    {
      name: "Emma L.",
      role: "Active User",
      content: "The photo management and advanced filters help me find exactly what I'm looking for.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Match with
              <span className="block text-yellow-300">Eterna</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              The most advanced dating app with AI-powered matching, premium features,
              and everything you need to find meaningful connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                <Link href="/auth/signup" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                <Link href="/premium">View Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-pink-100 rounded-full">
                      <Icon className="h-8 w-8 text-pink-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Connections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find, connect, and build meaningful relationships
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="overview">All Features</TabsTrigger>
              <TabsTrigger value="premium">Premium Only</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-pink-100 rounded-lg">
                            <Icon className="h-6 w-6 text-pink-600" />
                          </div>
                          {feature.premium && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="premium">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.filter(f => f.premium).map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-yellow-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Icon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <Crown className="h-5 w-5 text-yellow-600" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and create an authentic profile with photos, interests, and what you&apos;re looking for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Your Match</h3>
              <p className="text-gray-600">
                Our AI-powered matching algorithm finds compatible people based on your preferences and behavior.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect & Chat</h3>
              <p className="text-gray-600">
                Start conversations, go on video calls, and build meaningful connections with your matches.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Join thousands of people who have found meaningful connections on Eterna
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              <Link href="/auth/signup" className="flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
