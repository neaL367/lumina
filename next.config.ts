import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
