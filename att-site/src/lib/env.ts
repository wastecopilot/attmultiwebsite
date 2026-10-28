/**
 * Public configuration read from environment variables.
 *
 * Every NEXT_PUBLIC_* value is referenced literally so Next.js inlines it at build time.
 * Production builds refuse to start when a value is missing or placeholder-like
 * (scripts/prebuild-check.ts). Local development uses the labelled test values in .env.local and the
 * page shows a "DEV PREVIEW" badge.
 */
export const env = {
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "",
  phoneTel: process.env.NEXT_PUBLIC_PHONE_TEL ?? "",
  /** GA4 measurement ID (G-…) or Google Tag Manager container ID (GTM-…). */
  tagId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  adsId: process.env.NEXT_PUBLIC_GADS_ID ?? "",
  adsCallLabel: process.env.NEXT_PUBLIC_GADS_CALL_LABEL ?? "",
  /** Optional separate label for "Calls from website" (number swap); falls back to the call label. */
  adsSwapLabel: process.env.NEXT_PUBLIC_GADS_SWAP_LABEL || process.env.NEXT_PUBLIC_GADS_CALL_LABEL || "",
  /** Optional order destination (https URL). When empty, Order Now goes to /check-availability. */
  orderUrl: process.env.NEXT_PUBLIC_ORDER_URL ?? "",
  /** "AUDIT" for local audit builds (npm run build:audit); empty in production. */
  buildLabel: process.env.NEXT_PUBLIC_BUILD_LABEL ?? "",
  isDev: process.env.NODE_ENV === "development",
} as const;

export const isGtmContainer = env.tagId.startsWith("GTM-");
export const ga4Id = env.tagId.startsWith("G-") ? env.tagId : "";
