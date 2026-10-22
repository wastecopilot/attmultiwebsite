import type { Metadata } from "next";
import { SITE_URL } from "@/data/site";
import { ENGLISH_PAGES, SPANISH_PAGES } from "@/data/i18n";

/**
 * Whether search engines may index this deployment. Off while the project's production address is a
 * *.vercel.app staging URL (Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time), on everywhere else.
 * NEXT_PUBLIC_SITE_INDEXABLE=1 forces it on (needed when the live domain reaches this project through a
 * rewrite from another Vercel project); =0 forces it off.
 */
const forcedIndexing = process.env.NEXT_PUBLIC_SITE_INDEXABLE;
export const siteIndexable =
  forcedIndexing === "1" ? true : forcedIndexing === "0" ? false : !(process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "").endsWith(".vercel.app");

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
  // English and Spanish versions of the same page point to each other (hreflang).
  const spanish = path.startsWith("/es");
  const en = spanish ? ENGLISH_PAGES[path] : SPANISH_PAGES[path] ? path : undefined;
  const es = spanish ? path : SPANISH_PAGES[path];
  const languages = en && es && !canonicalPath ? { "en-US": absoluteUrl(en), "es-US": absoluteUrl(es), "x-default": absoluteUrl(en) } : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: languages ? { canonical, languages } : { canonical },
    openGraph: {
      type: "website",
      locale: spanish ? "es_US" : "en_US",
      siteName: "Authorized Internet Retailer",
      title,
      description,
      url: canonical,
      // Default image; routes with their own opengraph-image.tsx override it (file-based metadata wins).
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Authorized Internet Retailer: AT&T Fiber, Internet Air and wireless plans" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/twitter-image`] },
    robots: noindex || !siteIndexable ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
