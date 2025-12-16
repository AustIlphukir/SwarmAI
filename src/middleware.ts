import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow internal Next files, static assets and APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Allow the homepage and privacy page (unlock entry points)
  if (pathname === '/' || pathname === '/privacy') {
    return NextResponse.next();
  }

  // Check for the unlock cookie set by the unlock API
  const cookie = req.cookies.get('swarm_home_unlocked')?.value;
  if (cookie === '1') {
    return NextResponse.next();
  }

  // Redirect to homepage and preserve original path in query
  url.pathname = '/';
  url.searchParams.set('redirect', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
