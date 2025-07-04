import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionId, orgId } = auth;
  // console.log('Middleware auth:', { userId, sessionId, orgId, pathname: req.nextUrl.pathname });

  if (!isPublicRoute(req)) {
    await auth.protect({
      unauthotizedUrl: new URL('/login', req.url),
      unauthenticatedUrl: new URL('/login', req.url)
    });
    NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};