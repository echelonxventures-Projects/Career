"use client";

import { useEffect, useState } from "react";

// Error boundary for catching and logging errors
export function useSecurityLogger() {
  useEffect(() => {
    // Log security events to monitoring service
    const handleSecurityError = (event: ErrorEvent) => {
      const errorData = {
        type: "security_error",
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Send to logging endpoint (in production, use proper logging service)
      if (process.env.NODE_ENV === "production") {
        fetch("/api/log/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorData),
          // Use keepalive to ensure the request completes even if page unloads
          keepalive: true,
        }).catch(() => {
          // Silently fail if logging fails
        });
      } else {
        console.error("Security Error:", errorData);
      }
    };

    // Monitor for suspicious activity
    const monitorSuspiciousActivity = () => {
      // Detect potential XSS attempts in URL
      const urlParams = new URLSearchParams(window.location.search);
      const hasSuspiciousParams = urlParams.toString().match(
        /<script|javascript:|on\w+=/i
      );

      if (hasSuspiciousParams) {
        const eventData = {
          type: "suspicious_url",
          url: window.location.href,
          timestamp: new Date().toISOString(),
        };

        if (process.env.NODE_ENV === "production") {
          fetch("/api/log/security", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
            keepalive: true,
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("error", handleSecurityError);
    monitorSuspiciousActivity();

    return () => {
      window.removeEventListener("error", handleSecurityError);
    };
  }, []);
}

// Hook for CSRF token management
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    // Get CSRF token from cookie or generate new one
    const getCsrfToken = () => {
      const cookies = document.cookie.split(";");
      const csrfCookie = cookies.find((c) => c.trim().startsWith("csrf-token="));
      if (csrfCookie) {
        return csrfCookie.split("=")[1];
      }
      return "";
    };

    setCsrfToken(getCsrfToken());
  }, []);

  return csrfToken;
}

// Secure fetch wrapper with CSRF token
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("csrf-token="))
    ?.split("=")[1];

  const headers = new Headers(options.headers);

  // Add CSRF token for non-GET requests
  if (options.method && options.method !== "GET" && csrfToken) {
    headers.set("X-CSRF-Token", csrfToken);
  }

  // Ensure content-type is set
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
  });
}

// Input validation helper
export function validateInput(
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    noHtml?: boolean;
  }
): { valid: boolean; error?: string } {
  if (rules.required && !value.trim()) {
    return { valid: false, error: "This field is required" };
  }

  if (rules.minLength && value.length < rules.minLength) {
    return {
      valid: false,
      error: `Minimum ${rules.minLength} characters required`,
    };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      valid: false,
      error: `Maximum ${rules.maxLength} characters allowed`,
    };
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, error: "Invalid format" };
  }

  if (rules.noHtml && /<[^>]+>/.test(value)) {
    return { valid: false, error: "HTML tags are not allowed" };
  }

  return { valid: true };
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
