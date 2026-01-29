/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// Bundle analyzer (optional, install @next/bundle-analyzer if needed)
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import("next").NextConfig} */
const config = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // React strict mode for development
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Security: Remove X-Powered-By header is handled by middleware
  // Headers are set in middleware.ts
};

// module.exports = withBundleAnalyzer(config);
export default config;
