import type { NextConfig } from "next";

// The site is served from https://authorizedinternetretailer.net/att/ (a sub-path, not the domain root).
const BASE_PATH = "/att";

// Audit builds (npm run build:audit) use labelled test values and go to a separate output folder so a
// production `next start` can never serve them by accident.
const isAuditBuild = process.env.ALLOW_TEST_ENV === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  distDir: isAuditBuild ? ".next-audit" : ".next",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    inlineCss: true,
    // One root layout per route group (English, landing pages, Spanish) needs app/global-not-found.tsx for 404s.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Online order flow and its API: never indexed (the page also sets noindex; it is dynamic, so never cached).
        source: "/order",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // Versioned files in /public (illustrations, icons): safe to cache for a year.
        source: "/(illustrations|icons)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    // Convenience for local runs and for hosts that route the bare origin here: / -> /att
    return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
