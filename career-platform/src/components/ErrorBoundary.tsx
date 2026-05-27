"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<ErrorState>({ hasError: false });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError({
        hasError: true,
        error: event.error,
      });

      // Log error to monitoring service
      if (process.env.NODE_ENV === "production") {
        fetch("/api/log/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "runtime_error",
            message: event.message,
            source: event.filename,
            line: event.lineno,
            stack: event.error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      setError({
        hasError: true,
        error: new Error(String(event.reason)),
      });

      if (process.env.NODE_ENV === "production") {
        fetch("/api/log/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "promise_rejection",
            reason: String(event.reason),
            timestamp: new Date().toISOString(),
            url: window.location.href,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  const handleRetry = () => {
    setError({ hasError: false });
    window.location.reload();
  };

  if (error.hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-gray-600">
              We&apos;re sorry, but an unexpected error has occurred. Our team has been
              notified and is working on a fix.
            </p>

            {process.env.NODE_ENV === "development" && error.error && (
              <div className="mt-4 overflow-auto rounded-lg bg-gray-100 p-4 text-left">
                <p className="font-mono text-sm text-red-600">
                  {error.error.message}
                </p>
                {error.error.stack && (
                  <pre className="mt-2 font-mono text-xs text-gray-600">
                    {error.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Error ID: {Math.random().toString(36).substring(2, 15)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// API Error component for displaying API errors
interface ApiErrorProps {
  error: string;
  onRetry?: () => void;
}

export function ApiError({ error, onRetry }: ApiErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
        <div className="flex-1">
          <h3 className="font-medium text-red-900">Error</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading boundary for suspense
interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingBoundary({ children, fallback }: LoadingBoundaryProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <>
        {fallback || (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
