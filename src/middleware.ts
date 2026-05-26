import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Maintenance Mode Check
  if (process.env.MAINTENANCE_MODE === 'true') {
    const isAllowedMethod = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';
    const isHealthEndpoint = req.nextUrl.pathname.startsWith('/api/internal/health');
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
    
    if (!isAllowedMethod && !isHealthEndpoint && !isAdminRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Service Unavailable', message: 'System is under maintenance.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  const path = req.nextUrl.pathname;
  const sessionToken = req.cookies.get('__session'); // Firebase Auth cookie

  // Explicitly skip middleware for Auth API routes
  if (path.startsWith('/api/auth') || path.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Public paths
  const publicPaths = [
    "/",
    "/about",
    "/services",
    "/faqs",
    "/contact",
    "/api/patient/register",
    "/api/patient/onboard",
    "/api/staff/apply",
  ];

  if (publicPaths.some(p => path === p || path.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login?error=access_denied", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/patient/:path*",
    "/admin/:path*",
    "/staff/:path*"
  ],
};
