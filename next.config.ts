import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  typedRoutes: true,
  cacheLife: {
    gallery: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
    photos: {
      stale: 300,
      revalidate: 1800,
      expire: 86400,
    },
    blurData: {
      stale: 600,
      revalidate: 3600,
      expire: 86400,
    },
  },
  reactCompiler: {
    compilationMode: "annotation",
  },
  experimental: {
    inlineCss: true,
    viewTransition: true,
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    qualities: [10, 75, 82, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
