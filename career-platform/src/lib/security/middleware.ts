import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Security headers configuration
const SECURITY_HEADERS = {
  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.stripe.com https://*.linkedin.com",
    "frame-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  // Prevent browsers from MIME-sniffing responses
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection in browsers
  "X-XSS-Protection": "1; mode=block",

  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // HTTPS-only cookies and strict transport security
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",

  // Referrer policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions policy
  "Permissions-Policy": [
    "accelerometer=()",
    "camera=()",
    "geolocation=()",
    "gyroscope=()",
    "magnetometer=()",
    "microphone=()",
    "payment=(self)",
    "usb=()",
  ].join(", "),

  // Remove server information
  "X-DNS-Prefetch-Control": "off",

  // Cache control for sensitive pages
  "Cache-Control": "no-store, max-age=0",
};

// CSRF token cookie name
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

// Routes that require CSRF protection
const CSRF_PROTECTED_ROUTES = [
  "/api/resumes",
  "/api/cover-letters",
  "/api/ats-check",
  "/api/share",
  "/api/jobs/apply",
];

// Routes that skip CSRF (safe methods or public endpoints)
const CSRF_EXEMPT_ROUTES = [
  "/api/auth",
  "/api/webhooks",
  "/api/jobs",
];

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Remove potentially dangerous headers
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

export function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return null;
  }

  // Check if route is exempt
  const path = request.nextUrl.pathname;
  if (CSRF_EXEMPT_ROUTES.some((route) => path.startsWith(route))) {
    return null;
  }

  // Check if route requires CSRF protection
  const requiresCsrf = CSRF_PROTECTED_ROUTES.some((route) =>
    path.startsWith(route)
  );

  if (!requiresCsrf) {
    return null;
  }

  // Get CSRF token from header
  const csrfToken = request.headers.get(CSRF_HEADER_NAME);
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!csrfToken || !cookieToken) {
    return NextResponse.json(
      { error: "CSRF token missing" },
      { status: 403 }
    );
  }

  // Validate CSRF token (constant-time comparison)
  if (!constantTimeCompare(csrfToken, cookieToken)) {
    return NextResponse.json(
      { error: "Invalid CSRF token" },
      { status: 403 }
    );
  }

  return null;
}

// Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// CORS configuration
export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXTAUTH_URL,
    "http://localhost:5555",
    "http://localhost:3000",
  ].filter(Boolean);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }

  return null;
}

// Request validation middleware
export function validateRequestMiddleware(request: NextRequest) {
  // Check content type for POST/PUT/PATCH requests
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentType = request.headers.get("content-type");

    if (contentType && !contentType.includes("application/json")) {
      // Allow multipart/form-data for file uploads
      if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json(
          { error: "Invalid content type. Expected application/json" },
          { status: 400 }
        );
      }
    }
  }

  // Check request size (10MB limit)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Request body too large" },
      { status: 413 }
    );
  }

  return null;
}

// Combine all middleware
export function applySecurityMiddleware(request: NextRequest) {
  // Apply CORS first
  const corsResponse = corsMiddleware(request);
  if (corsResponse) return corsResponse;

  // Apply request validation
  const validationResponse = validateRequestMiddleware(request);
  if (validationResponse) return validationResponse;

  // Apply CSRF protection
  const csrfResponse = csrfMiddleware(request);
  if (csrfResponse) return csrfResponse;

  // Apply security headers
  return securityMiddleware(request);
}
