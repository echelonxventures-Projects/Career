// Rate limiting exports - uses Redis in production, memory in development

import {
  checkRateLimit as checkRedisRateLimit,
  getRateLimitKey,
  checkRedisHealth,
} from "./rateLimitRedis";

// Re-export for backward compatibility
export { getRateLimitKey, checkRedisHealth };

// Use Redis rate limiter (handles fallback automatically)
export const checkRateLimit = checkRedisRateLimit;
