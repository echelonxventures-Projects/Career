import { NextResponse } from "next/server";
import { prisma, checkDatabaseHealth } from "@/lib/prisma";
import { checkRedisHealth } from "@/lib/security/rateLimit";
import { NextRequest } from "next/server";

// Health check endpoint for monitoring and load balancers
export async function GET(request: NextRequest) {
  const checks = {
    database: false,
    redis: false,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
  };

  try {
    // Check database
    checks.database = await checkDatabaseHealth();
  } catch (error) {
    console.error("Database health check failed:", error);
  }

  try {
    // Check Redis (if configured)
    checks.redis = await checkRedisHealth();
  } catch (error) {
    console.error("Redis health check failed:", error);
    // Redis is optional, don't fail the health check
    checks.redis = true;
  }

  const isHealthy = checks.database && checks.redis;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      ...checks,
    },
    { status: isHealthy ? 200 : 503 }
  );
}

// HEAD request for simple health checks (load balancers)
export async function HEAD() {
  try {
    const dbHealthy = await checkDatabaseHealth();
    return new NextResponse(null, {
      status: dbHealthy ? 200 : 503,
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
