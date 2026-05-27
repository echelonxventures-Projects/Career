import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {},

  // Output standalone for Docker
  output: "standalone",

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com https://*.linkedin.com https://*.google.com https://*.github.com",
              "frame-src 'self' https://*.google.com",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "camera=()",
              "geolocation=()",
              "gyroscope=()",
              "magnetometer=()",
              "microphone=()",
              "payment=(self)",
              "usb=()",
            ].join(", "),
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
      {
        // Cache static assets
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // No cache for API routes
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.linkedin.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // Security: Disable source maps in production
  productionBrowserSourceMaps: false,

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Redirects for security
  async redirects() {
    return [
      {
        source: "/wp-admin",
        destination: "/",
        permanent: false,
      },
      {
        source: "/wp-login",
        destination: "/",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/",
        permanent: false,
      },
      {
        source: "/.env",
        destination: "/",
        permanent: false,
      },
      {
        source: "/config",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
