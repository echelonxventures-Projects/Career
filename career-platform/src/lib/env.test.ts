import { describe, it, expect } from "vitest";
import { envSchema } from "./env";

describe("env schema", () => {
  it("should accept valid config", () => {
    const result = envSchema.safeParse({
      DATABASE_URL: "postgresql://user@localhost:5432/test",
      NEXTAUTH_URL: "http://localhost:5555",
      NEXTAUTH_SECRET: "a".repeat(32),
      LOG_LEVEL: "debug",
      NODE_ENV: "test",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing DATABASE_URL", () => {
    const result = envSchema.safeParse({
      NEXTAUTH_URL: "http://localhost:5555",
      NEXTAUTH_SECRET: "a".repeat(32),
    });
    expect(result.success).toBe(false);
  });
});
