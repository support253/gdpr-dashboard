import { NextRequest, NextResponse } from 'next/server';
import { sessionToken, safeEqual } from './lib/auth-token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API routes through
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for a valid signed auth cookie
  const authCookie = request.cookies.get('gdpr-auth');
  const secret = process.env.DASHBOARD_PASSWORD;
  if (secret && authCookie?.value && safeEqual(authCookie.value, await sessionToken(secret))) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
