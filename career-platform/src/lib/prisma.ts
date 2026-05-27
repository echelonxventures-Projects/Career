import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, PoolConfig } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Connection pool configuration
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Production settings
  max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || "20", 10),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || "30000", 10),
  connectionTimeoutMillis: parseInt(process.env.DATABASE_TIMEOUT || "5000", 10),
  // SSL for production
  ssl: process.env.NODE_ENV === "production" && process.env.DATABASE_SSL !== "false"
    ? { rejectUnauthorized: false }
    : undefined,
};

const pool = new Pool(poolConfig);

// Log pool events in development
if (process.env.NODE_ENV !== "production") {
  pool.on("connect", () => console.log("New database connection"));
  pool.on("error", (err) => console.error("Database pool error:", err));
}

// Log pool events in production
if (process.env.NODE_ENV === "production") {
  pool.on("error", (err) => {
    console.error("Unexpected database pool error:", err);
    // In production, you might want to alert on-call here
  });
}

const adapter = new PrismaPg(pool);

// Prisma client with logging
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development"
    ? ["query", "info", "warn", "error"]
    : process.env.LOG_LEVEL === "debug"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

// Reuse client in development (hot reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  await pool.end();
});

// Health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
