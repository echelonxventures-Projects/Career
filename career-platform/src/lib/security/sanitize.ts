// Input sanitization utilities

const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi,
  /<form[^>]*>.*?<\/form>/gi,
];

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE)\b)/gi,
  /(--|#|\/\*|\*\/|;)/g,
  /(\bOR\b|\bAND\b)\s*\d+\s*=\s*\d+/gi,
];

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (!input) return input;

  let sanitized = input;

  // Remove script tags and other dangerous elements
  XSS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized;
}

/**
 * Check for potential SQL injection patterns
 */
export function checkSqlInjection(input: string): boolean {
  if (!input) return false;

  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        (sanitized as Record<string, unknown>)[key] = value.map((item) =>
          typeof item === "string" ? sanitizeString(item) :
          typeof item === "object" && item !== null ? sanitizeObject(item as Record<string, unknown>) :
          item
        );
      } else {
        (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
      }
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  if (!email) return null;

  // Remove any control characters
  const cleaned = email.replace(/[\x00-\x1F\x7F]/g, "").trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleaned)) return null;

  // Check for common injection attempts
  if (checkSqlInjection(cleaned)) return null;

  return cleaned;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // Only allow http and https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    // Check for localhost/private IPs in production
    const hostname = parsed.hostname;
    if (
      hostname === "localhost" ||
      hostname.startsWith("127.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.")
    ) {
      // In production, block these
      if (process.env.NODE_ENV === "production") {
        return null;
      }
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return "";

  // Remove path traversal characters and dangerous extensions
  return fileName
    .replace(/\.[.\/\\]/g, "") // Remove path traversal
    .replace(/[<>:"|?*]/g, "") // Remove Windows reserved characters
    .replace(/\.\./g, "") // Remove double dots
    .replace(/\.(exe|bat|cmd|sh|php|jsp|asp|aspx)$/i, ".txt") // Change dangerous extensions
    .substring(0, 255); // Limit length
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  if (token.length !== 64 || storedToken.length !== 64) return false;
  return token === storedToken;
}
