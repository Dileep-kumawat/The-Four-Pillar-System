import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes: auth pages and auth API callbacks
  const publicPaths = ['/login', '/api/auth'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // Cron endpoint - secured by CRON_SECRET header, not by session
  if (pathname.startsWith('/api/cron')) {
    return NextResponse.next();
  }

  if (!isPublic && !req.auth) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
