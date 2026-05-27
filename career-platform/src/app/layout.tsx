import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Career Platform - Build Resumes, Find Jobs, Get Hired",
    template: "%s | Career Platform",
  },
  description:
    "All-in-one career platform: Resume & CV builder, ATS checker, job search, cover letter generator, LinkedIn optimization, and more.",
  keywords: [
    "resume builder",
    "cv builder",
    "job search",
    "career",
    "ATS checker",
    "cover letter",
    "LinkedIn",
    "career counselling",
  ],
  authors: [{ name: "Career Platform" }],
  creator: "Career Platform",
  publisher: "Career Platform",
  robots: "index, follow",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5555"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Career Platform",
    title: "Career Platform - Build Resumes, Find Jobs, Get Hired",
    description:
      "All-in-one career platform: Resume & CV builder, ATS checker, job search, cover letter generator, LinkedIn optimization, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Platform - Build Resumes, Find Jobs, Get Hired",
    description:
      "All-in-one career platform: Resume & CV builder, ATS checker, job search, cover letter generator, LinkedIn optimization, and more.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Security headers that can't be set via middleware */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
