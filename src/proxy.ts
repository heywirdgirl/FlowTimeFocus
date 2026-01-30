import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has('firebase-auth-cookie');

  // Allow access to social feed and guest playground
  if (pathname === '/' || pathname === '/dashboard') {
    return NextResponse.next();
  }

  // Protect personal workspaces
  if (pathname.startsWith('/dashboard/')) {
    if (!hasAuthCookie) {
      // Unauthenticated users trying to access a personal workspace
      // are redirected to the guest playground.
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
