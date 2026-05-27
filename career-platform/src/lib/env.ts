import { z } from "zod";

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().startsWith("postgresql"),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().min(1).max(100).default(20),

  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // OAuth (optional for credential-only auth)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),

  // Stripe (optional if billing disabled)
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_BASIC: z.string().optional(),
  STRIPE_PRICE_PREMIUM: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),

  // AI
  OPENAI_API_KEY: z.string().optional(),

  // Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // Security
  ENCRYPTION_KEY: z.string().optional(),
  ENABLE_RATE_LIMITING: z.coerce.boolean().default(true),
  CORS_ORIGINS: z.string().default(""),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Feature flags
  ENABLE_AI_FEATURES: z.coerce.boolean().default(true),
  ENABLE_STRIPE_BILLING: z.coerce.boolean().default(false),
  ENABLE_LINKEDIN_INTEGRATION: z.coerce.boolean().default(false),
  ENABLE_EMAIL_NOTIFICATIONS: z.coerce.boolean().default(false),
  ENABLE_SECURITY_HEADERS: z.coerce.boolean().default(true),

  // App
  NEXT_PUBLIC_APP_NAME: z.string().default("Career Platform"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:5555"),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().default("support@careerplatform.com"),

  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | null = null;

export function getEnv(): Env {
  if (parsedEnv) return parsedEnv;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`
    );
    throw new Error(
      `❌ Invalid environment variables:\n${missing.join("\n")}\n\n` +
        "Check .env or .env.local for missing/incorrect values."
    );
  }
  parsedEnv = result.data;
  return parsedEnv;
}

export function requireEnv(key: keyof Env): string {
  const val = getEnv()[key];
  if (val === undefined || val === null || val === "") {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return String(val);
}
