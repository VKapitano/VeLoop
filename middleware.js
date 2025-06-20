// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // TESTING: Create a simple cookie-based check
  const authCookie = request.cookies.get('auth-test');
  const isAuthenticated = authCookie?.value === 'true';

  // Auth paths that don't require authentication
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Don't redirect API routes to avoid conflicts with NextAuth
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect logic
  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/data', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes except the root
  if (!isAuthenticated && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Narrow the matcher to exclude more paths where needed
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.ico$|.*\\.svg$).*)',
  ],
};
