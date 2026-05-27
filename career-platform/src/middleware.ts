import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/resume-builder",
  "/cv-builder",
  "/cover-letter",
  "/ats-checker",
  "/career-counselling",
  "/career-pathways",
  "/study-guide",
  "/thesis-consultancy",
  "/linkedin",
  "/share",
  "/settings",
  "/dashboard",
];

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  "/api/resumes",
  "/api/cover-letters",
  "/api/cvs",
  "/api/ats-check",
  "/api/applications",
];

// Public API routes that don't require auth
const PUBLIC_API_ROUTES = [
  "/api/jobs",
  "/api/health",
];

// Security headers
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(self), usb=()",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if it's an API route
  const isApiRoute = pathname.startsWith("/api/");

  // Handle CORS for API routes
  if (isApiRoute) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      "http://localhost:5555",
      "http://localhost:3000",
    ].filter(Boolean);

    // Create response
    const response = NextResponse.next();

    // Add CORS headers
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Check if route is protected
    const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Skip auth check for public API routes
    const isPublicApi = PUBLIC_API_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedApi && !isPublicApi) {
      const token = await getToken({ req: request });
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401, headers: securityHeaders }
        );
      }
    }

    return response;
  }

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = await getToken({ req: request });
    if (!token) {
      // Redirect to sign-in page
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Configure middleware to run on all routes except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
