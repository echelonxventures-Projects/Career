import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { error } = searchParams;

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    OAuthSignin: "Error signing in with OAuth provider.",
    OAuthCallback: "Error during OAuth callback.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Error during callback.",
    OAuthAccountNotLinked: "Account already exists with a different sign in method.",
    EmailSignin: "Check your email for the sign in link.",
    CredentialsSignin: "Invalid credentials.",
    SessionRequired: "You must be signed in to access this page.",
    Default: "Unable to sign in.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Authentication Error
            </h1>
            <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/auth/signin"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              If you continue to experience issues, please{" "}
              <Link href="/contact" className="text-indigo-600 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
