/**
 * Click-ID and campaign-parameter preservation for Google Ads.
 *
 * - On arrival, gclid / gbraid / wbraid and utm_* values are read from the URL.
 * - They are kept in memory for the whole visit and appended to internal links when clicked, so they
 *   survive navigation without any storage (this works under every consent state).
 * - They are written to a first-party cookie for 90 days ONLY when advertising storage is allowed
 *   (stored "Accept" choice, or the US opt-out default without a Global Privacy Control signal).
 *   A later "Reject non-essential" deletes the cookie.
 */
import { adStorageAllowed } from "./consent";

export const ATTRIBUTION_PARAMS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export const ATTRIBUTION_COOKIE = "att_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 90;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

let memory: Attribution = {};

function fromUrl(search: string): Attribution {
  const sp = new URLSearchParams(search);
  const out: Attribution = {};
  for (const k of ATTRIBUTION_PARAMS) {
    const v = sp.get(k);
    if (v) out[k] = v.slice(0, 200);
  }
  return out;
}

function readCookie(): Attribution {
  const m = document.cookie.match(new RegExp(`(?:^|; )${ATTRIBUTION_COOKIE}=([^;]+)`));
  if (!m) return {};
  try {
    return JSON.parse(decodeURIComponent(m[1])) as Attribution;
  } catch {
    return {};
  }
}

function writeCookie(a: Attribution): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(a))}; Max-Age=${ATTRIBUTION_MAX_AGE_DAYS * 86_400}; Path=/; SameSite=Lax${secure}`;
}

export function clearAttributionCookie(): void {
  document.cookie = `${ATTRIBUTION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/** Call once on page load (and again after a consent change). */
export function captureAttribution(): Attribution {
  const fresh = fromUrl(window.location.search);
  const stored = adStorageAllowed() ? readCookie() : {};
  // A new ad click replaces the previous one; otherwise keep what we had.
  memory = Object.keys(fresh).length ? { ...fresh } : { ...stored, ...memory };
  if (adStorageAllowed()) {
    if (Object.keys(memory).length) writeCookie(memory);
  } else {
    clearAttributionCookie();
  }
  return memory;
}

export function currentAttribution(): Attribution {
  return memory;
}

/** Returns href with the preserved parameters added (internal links only; existing values win). */
export function decorateHref(href: string): string {
  if (!Object.keys(memory).length) return href;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return href;
    for (const [k, v] of Object.entries(memory)) if (v && !url.searchParams.has(k)) url.searchParams.set(k, v);
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}
