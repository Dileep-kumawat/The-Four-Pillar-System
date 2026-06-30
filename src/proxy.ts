import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes: landing page, auth pages, auth API callbacks, and PWA assets
  const publicPaths = [
    '/login',
    '/api/auth',
    '/sw.js',
    '/manifest.json',
  ];
  const isPublic =
    pathname === '/' ||
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico');

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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|sw\\.js|manifest\\.json|.*\\.png$|.*\\.svg$|.*\\.ico$).*)',
  ],
};

