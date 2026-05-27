import * as Sentry from "@sentry/nextjs";
import { getEnv } from "./env";

const env = getEnv();

export function initMonitoring(): void {
  if (env.SENTRY_DSN) {
    console.info(`Monitoring initialized (environment: ${env.NODE_ENV})`);
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("Error:", error, context || "");
  }
}

export function setUser(id: string, email?: string): void {
  if (env.SENTRY_DSN) {
    Sentry.setUser({ id, email });
  }
}

export function setTag(key: string, value: string): void {
  if (env.SENTRY_DSN) {
    Sentry.setTag(key, value);
  }
}
