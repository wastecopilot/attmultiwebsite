import type { Metadata } from "next";
import { SITE_URL } from "@/data/site";

interface PageSeo {
  /** Full <title>; must be under 60 characters (checked by scripts/audit/seo-check.mjs). */
  title: string;
  /** Meta description; must be under 160 characters. */
  description: string;
  /** Route path without the /att base path, e.g. "/internet/fiber". */
  path: string;
  noindex?: boolean;
  /** Canonical target when it differs from `path` (landing pages point to their main page). */
  canonicalPath?: string;
}

/**
 * Per-page metadata: unique title and description, canonical URL including /att, Open Graph and
 * Twitter cards. The OG/Twitter image comes from the route's opengraph-image.tsx file.
 */
export function pageMetadata({ title, description, path, noindex = false, canonicalPath }: PageSeo): Metadata {
  // Absolute URL including the /att base path (relative values would resolve against the page path).
  const canonical = absoluteUrl(canonicalPath ?? path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Authorized Internet Retailer",
      title,
      description,
      url: canonical,
      // Default image; routes with their own opengraph-image.tsx override it (file-based metadata wins).
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Authorized Internet Retailer: AT&T Fiber, Internet Air and wireless plans" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/twitter-image`] },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
