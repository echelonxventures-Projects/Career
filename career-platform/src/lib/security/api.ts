import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rateLimit";
import { RATE_LIMITS } from "@/lib/security/schemas";
import { ZodSchema } from "zod";

// Security: API response wrapper with security headers
export function secureResponse(data: unknown, status = 200, init?: ResponseInit) {
  const response = NextResponse.json(data, { ...init, status });

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Security: Error response wrapper
export function errorResponse(error: string, status = 400) {
  // Log security-sensitive errors
  if (status >= 500) {
    console.error(`API Error [${status}]:`, error);
  }

  return secureResponse({ error }, status);
}

// Security: Check authentication
export async function requireAuth(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }
    return session;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}

// Security: Rate limit check
export async function checkRateLimitForRequest(
  request: NextRequest,
  limitType: keyof typeof RATE_LIMITS,
  userId?: string
) {
  const key = getRateLimitKey(request, limitType, userId);
  const result = await checkRateLimit(key, RATE_LIMITS[limitType]);

  if (!result.allowed) {
    return {
      allowed: false,
      response: errorResponse(
        `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
        429
      ),
    };
  }

  return { allowed: true, remaining: result.remaining };
}

// Security: Validate request body with Zod
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));

      return {
        success: false,
        response: errorResponse(`Validation failed: ${JSON.stringify(errors)}`, 400),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      response: errorResponse("Invalid JSON body", 400),
    };
  }
}

// Security: Validate query parameters
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  const params: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    // Handle arrays
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    return {
      success: false,
      response: errorResponse(`Validation failed: ${JSON.stringify(errors)}`, 400),
    };
  }

  return { success: true, data: result.data };
}

// Security: Check origin
export function checkOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXTAUTH_URL,
    "http://localhost:5555",
    "http://localhost:3000",
  ].filter(Boolean);

  if (!origin) return true; // Allow requests without origin (same-origin)
  return allowedOrigins.includes(origin);
}

// Security: Sanitize SQL input
export function sanitizeSqlInput(input: string): string {
  return input
    .replace(/[\x00\x08\x0b\x0c\x0e-\x1f]/g, "") // Remove control chars
    .replace(/[;'"\\]/g, "") // Remove dangerous chars
    .trim()
    .substring(0, 1000); // Limit length
}

// Security: API handler wrapper
interface APIHandlerOptions {
  requireAuth?: boolean;
  rateLimit?: keyof typeof RATE_LIMITS;
  schema?: ZodSchema;
}

export function createAPIHandler(
  handler: (req: NextRequest, session?: unknown) => Promise<NextResponse>,
  options: APIHandlerOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Check origin
      if (!checkOrigin(request)) {
        return errorResponse("Invalid origin", 403);
      }

      // Check auth if required
      let session = null;
      if (options.requireAuth) {
        session = await requireAuth(request);
        if (!session) {
          return errorResponse("Unauthorized", 401);
        }
      }

      // Check rate limit
      if (options.rateLimit) {
        const rateLimitResult = await checkRateLimitForRequest(
          request,
          options.rateLimit,
          session?.user?.id
        );
        if (!rateLimitResult.allowed && rateLimitResult.response) {
          return rateLimitResult.response;
        }
      }

      // Validate body if schema provided
      if (options.schema && ["POST", "PUT", "PATCH"].includes(request.method)) {
        const validation = await validateRequestBody(request, options.schema);
        if (!validation.success) {
          return validation.response;
        }
        // Attach validated data to request for handler use
        (request as unknown as Record<string, unknown>).validatedData = validation.data;
      }

      return await handler(request, session);
    } catch (error) {
      console.error("API handler error:", error);
      return errorResponse("Internal server error", 500);
    }
  };
}
