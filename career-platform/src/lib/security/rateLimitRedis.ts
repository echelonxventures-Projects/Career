// Redis-based rate limiting for production
// Falls back to in-memory for development

import { Redis } from "@upstash/redis";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory fallback for development
const memoryStore = new Map<string, RateLimitEntry>();

// Redis client (only initialized if env vars are set)
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

interface RateLimitOptions {
  limit: number;
  window: number; // in seconds
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowKey = Math.floor(now / (options.window * 1000));
  const key = `rate_limit:${identifier}:${windowKey}`;

  // Use Redis in production, memory in development
  if (redis && process.env.NODE_ENV === "production") {
    return await checkRedisRateLimit(key, identifier, options, now);
  } else {
    return await checkMemoryRateLimit(key, identifier, options, now);
  }
}

async function checkRedisRateLimit(
  key: string,
  identifier: string,
  options: RateLimitOptions,
  now: number
): Promise<RateLimitResult> {
  if (!redis) {
    throw new Error("Redis not initialized");
  }

  const pipeline = redis.pipeline();
  pipeline.get(key);
  pipeline.ttl(key);

  const [currentCount, ttl] = await pipeline.exec<[string | null, number]>();

  const count = currentCount ? parseInt(currentCount, 10) : 0;
  const resetTime = now + (ttl > 0 ? ttl * 1000 : options.window * 1000);

  if (count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime,
      retryAfter: Math.ceil((resetTime - now) / 1000),
    };
  }

  // Increment count
  const newCount = count + 1;
  const multi = redis.pipeline();
  multi.set(key, newCount.toString(), { ex: options.window });
  await multi.exec();

  return {
    allowed: true,
    remaining: options.limit - newCount,
    resetTime,
    retryAfter: 0,
  };
}

async function checkMemoryRateLimit(
  key: string,
  identifier: string,
  options: RateLimitOptions,
  now: number
): Promise<RateLimitResult> {
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + options.window * 1000,
    };
    memoryStore.set(key, newEntry);

    return {
      allowed: true,
      remaining: options.limit - 1,
      resetTime: newEntry.resetTime,
      retryAfter: 0,
    };
  }

  if (entry.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  memoryStore.set(key, entry);

  return {
    allowed: true,
    remaining: options.limit - entry.count,
    resetTime: entry.resetTime,
    retryAfter: 0,
  };
}

// Get rate limit key based on request
export function getRateLimitKey(
  req: Request,
  type: string,
  userId?: string
): string {
  if (userId) {
    return `user:${userId}:${type}`;
  }

  // Use IP address as fallback
  const ip = req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return `ip:${ip}:${type}`;
}

// Clean up old entries periodically (development only)
if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 60000); // Clean up every minute
}

// Health check for Redis
export async function checkRedisHealth(): Promise<boolean> {
  if (!redis) return false;
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
