import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /login to /auth/signin
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Handle manifest requests - ensure they go to the correct path
  if (pathname === '/login/manifest.json' || pathname.includes('/login')) {
    // If someone is requesting manifest from /login, redirect to proper manifest
    if (pathname.includes('manifest')) {
      return NextResponse.redirect(new URL('/manifest.json', request.url))
    }
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
