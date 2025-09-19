"use client"

import Link from "next/link"
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  HelpCircle,
  FileText,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" }
    ],
    support: [
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Safety Center", href: "/safety", icon: Shield },
      { name: "Contact Us", href: "/contact", icon: MessageSquare },
      { name: "Community Guidelines", href: "/guidelines", icon: FileText }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ],
    features: [
      { name: "Premium", href: "/premium" },
      { name: "Verification", href: "/verification" },
      { name: "Video Calls", href: "/video" },
      { name: "Advanced Search", href: "/search" }
    ]
  }

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook, color: "hover:text-blue-600" },
    { name: "Twitter", href: "#", icon: Twitter, color: "hover:text-blue-400" },
    { name: "Instagram", href: "#", icon: Instagram, color: "hover:text-pink-600" },
    { name: "YouTube", href: "#", icon: Youtube, color: "hover:text-red-600" }
  ]

  return (
    <footer className={`bg-gray-900 text-gray-300 ${className || ""}`}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-white">Eterna</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Find your perfect match with our AI-powered dating platform.
              Connect with people who share your interests and values.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-pink-500" />
                <span className="text-sm">support@eterna.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-pink-500" />
                <span className="text-sm">1-800-ETERNAL</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest dating tips and platform updates
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <Button className="bg-pink-600 hover:bg-pink-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Eterna. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>

            {/* App Store Links */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                📱 App Store
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                🤖 Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-red-900 bg-opacity-20 border-t border-red-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
            <Shield className="h-4 w-4 text-red-400" />
            <span>
              Your safety is our priority. Please report any suspicious activity.
              <Link href="/safety" className="text-red-400 hover:text-red-300 ml-1">
                Learn more about our safety measures →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
