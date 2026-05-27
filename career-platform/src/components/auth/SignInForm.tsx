"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Globe, Link as LinkIcon, AlertCircle } from "lucide-react";

interface SignInFormProps {
  error?: string;
  callbackUrl?: string;
}

export function SignInForm({ error, callbackUrl }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState<"google" | "linkedin" | null>(null);

  const handleSignIn = async (provider: "google" | "linkedin") => {
    setIsLoading(provider);
    await signIn(provider, {
      callbackUrl: callbackUrl || "/dashboard",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access your resumes, job applications, and more
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">
              {error === "OAuthSignin" && "Error signing in with OAuth provider."}
              {error === "OAuthCallback" && "Error during OAuth callback."}
              {error === "OAuthCreateAccount" && "Could not create OAuth account."}
              {error === "EmailCreateAccount" && "Could not create email account."}
              {error === "Callback" && "Error during callback."}
              {error === "OAuthAccountNotLinked" && "Account already exists with different provider."}
              {error === "EmailSignin" && "Check your email for the sign in link."}
              {error === "CredentialsSignin" && "Invalid credentials."}
              {error === "SessionRequired" && "You must be signed in to access this page."}
              {!error.includes("OAuth") && !error.includes("Callback") && !error.includes("Credentials") && !error.includes("Session") && !error.includes("Email") && "An error occurred during sign in."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button
          onClick={() => handleSignIn("google")}
          disabled={isLoading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoading === "google" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <Globe className="h-5 w-5 text-red-500" />
          )}
          Continue with Google
        </button>

        <button
          onClick={() => handleSignIn("linkedin")}
          disabled={isLoading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoading === "linkedin" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <LinkIcon className="h-5 w-5 text-blue-600" />
          )}
          Continue with LinkedIn
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-indigo-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-indigo-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
