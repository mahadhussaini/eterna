// Force dynamic rendering to avoid prerendering issues with authentication
export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/session-provider";
import { AppLayout } from "@/components/layout/app-layout";
import { PWAWrapper } from "@/components/layout/pwa-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eterna - Find Your Perfect Match",
  description: "Connect with people who share your interests and values. Find meaningful relationships with Eterna.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />

        {/* Primary favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* Fallback favicons for older browsers */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Safari pinned tab */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ec4899" />

        {/* Theme and app metadata */}
        <meta name="theme-color" content="#ec4899" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Eterna" />
        <meta name="application-name" content="Eterna" />
        <meta name="description" content="Find your perfect match with Eterna" />
      </head>
      <BodyWithHydrationFix>
        <Providers>
          <PWAWrapper>
            <AppLayout>
              {children}
            </AppLayout>
          </PWAWrapper>
        </Providers>
      </BodyWithHydrationFix>
    </html>
  );
}

// Component to handle hydration mismatch caused by browser extensions
function BodyWithHydrationFix({ children }: { children: React.ReactNode }) {
  // Suppress hydration warnings for browser extension attributes
  if (typeof window !== 'undefined') {
    // List of browser extension attributes that cause hydration mismatches
    const browserExtensionAttributes = [
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'data-new-gr-c-s-loaded',
      'data-grammarly-shadow-root',
      'data-lastpass-icon-container',
      'data-lastpass-password-input',
      'data-passwordmanager-password-input'
    ];

    // Remove browser extension attributes from body to prevent hydration mismatch
    browserExtensionAttributes.forEach(attr => {
      if (document.body.hasAttribute(attr)) {
        document.body.removeAttribute(attr);
      }
    });
  }

  return (
    <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
      {children}
    </body>
  );
}
