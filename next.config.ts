import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
    const connectSources = [
      "'self'",
      "https://*.convex.cloud",
      "https://*.convex.site",
      "wss://*.convex.cloud",
      "wss://*.convex.site",
      "https://uploadthing.com",
      "https://*.uploadthing.com",
      "https://*.ufs.sh",
      "https://utfs.io",
      convexUrl,
      appUrl,
      isDev ? "ws://localhost:*" : "",
      isDev ? "http://localhost:*" : "",
    ].filter(Boolean);
    const scriptSources = ["'self'", "'unsafe-inline'", isDev ? "'unsafe-eval'" : ""].filter(Boolean);
    const contentSecurityPolicy = [
      "default-src 'self'",
      `script-src ${scriptSources.join(" ")}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://utfs.io https://ufs.sh https://*.ufs.sh",
      "font-src 'self' data:",
      `connect-src ${connectSources.join(" ")}`,
      "media-src 'self' https://utfs.io https://ufs.sh https://*.ufs.sh",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      isDev ? "" : "upgrade-insecure-requests",
    ]
      .filter(Boolean)
      .join("; ");

    return [
      {
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
        source: "/:path*",
      },
    ];
  },
  images: {
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    formats: ["image/avif", "image/webp"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "ufs.sh",
        protocol: "https",
      },
      {
        hostname: "**.ufs.sh",
        protocol: "https",
      },
    ],
  },
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
