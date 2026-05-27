import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Error logging schema
const errorLogSchema = z.object({
  type: z.enum(["runtime_error", "promise_rejection", "security_error", "suspicious_url", "api_error"]),
  message: z.string().max(1000).optional(),
  source: z.string().max(500).optional(),
  stack: z.string().max(10000).optional(),
  url: z.string().max(1000).optional(),
  userAgent: z.string().max(500).optional(),
  timestamp: z.string().datetime().optional(),
  reason: z.string().max(1000).optional(),
});

// POST /api/log/error - Log errors for monitoring
export async function POST(request: NextRequest) {
  try {
    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = errorLogSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid error log format", details: validation.error.issues },
        { status: 400 }
      );
    }

    const errorData = validation.data;

    // Log to console (in production, send to monitoring service like Sentry, DataDog, etc.)
    const logEntry = {
      ...errorData,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      receivedAt: new Date().toISOString(),
    };

    // Log based on type
    switch (errorData.type) {
      case "security_error":
        console.error("[SECURITY]", JSON.stringify(logEntry));
        break;
      case "suspicious_url":
        console.warn("[SUSPICIOUS]", JSON.stringify(logEntry));
        break;
      default:
        console.error("[ERROR]", JSON.stringify(logEntry));
    }

    // In production, send to external logging service
    if (process.env.NODE_ENV === "production") {
      // Example: await sendToSentry(logEntry);
      // Example: await sendToDataDog(logEntry);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to log error:", error);
    return NextResponse.json(
      { error: "Failed to log error" },
      { status: 500 }
    );
  }
}

// GET /api/log/error - Get recent errors (admin only)
export async function GET(request: NextRequest) {
  // This endpoint is disabled in production for security
  // In a real app, implement proper admin authentication
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Endpoint disabled in production" },
      { status: 403 }
    );
  }

  // Return mock data for development
  return NextResponse.json({
    errors: [],
    message: "Error logging is active. Check server console for logs.",
  });
}
