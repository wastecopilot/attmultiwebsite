/**
 * Google Consent Mode v2 settings shared by the inline <head> snippet (src/lib/tag-snippet.ts) and the
 * cookie banner (src/components/consent/CookieBanner.tsx).
 *
 * Defaults (applied before any tag loads):
 *   - EEA, UK and Switzerland: ad_storage, ad_user_data, ad_personalization, analytics_storage = denied.
 *   - Everywhere else (US opt-out model): granted, except that a Global Privacy Control signal
 *     (navigator.globalPrivacyControl === true) sets the three advertising signals to denied.
 *   - A stored choice (cookie, 12 months) is applied immediately with gtag('consent','update', …).
 */
export const CONSENT_COOKIE = "att_consent";
export const CONSENT_MAX_AGE_DAYS = 365;
export const CONSENT_VERSION = 1;

/** EU-27 + Iceland, Liechtenstein, Norway (EEA) + United Kingdom + Switzerland. */
export const STRICT_CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
] as const;

export interface ConsentChoice {
  v: number;
  analytics: boolean;
  ads: boolean;
  /** ISO timestamp of the choice. */
  ts: string;
}

type ConsentValue = "granted" | "denied";
export interface ConsentState {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
}

export function toConsentState(choice: Pick<ConsentChoice, "analytics" | "ads">): ConsentState {
  const ads: ConsentValue = choice.ads ? "granted" : "denied";
  return {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: choice.analytics ? "granted" : "denied",
  };
}

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]+)`));
  if (!m) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1])) as ConsentChoice;
    return parsed.v === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

/** Store the visitor's choice for 12 months and update Google consent state. */
export function saveConsent(choice: Pick<ConsentChoice, "analytics" | "ads">): ConsentChoice {
  const record: ConsentChoice = { v: CONSENT_VERSION, analytics: choice.analytics, ads: choice.ads, ts: new Date().toISOString() };
  const maxAge = CONSENT_MAX_AGE_DAYS * 86_400;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  window.gtag?.("consent", "update", toConsentState(record));
  window.dataLayer?.push({ event: "consent_update", consent_analytics: record.analytics, consent_ads: record.ads });
  window.dispatchEvent(new CustomEvent("att:consent", { detail: record }));
  return record;
}

/** Whether first-party advertising storage (e.g. the 90-day click-ID cookie) is currently allowed. */
export function adStorageAllowed(): boolean {
  const stored = readConsent();
  if (stored) return stored.ads;
  // No stored choice: follow the default the head snippet applied for this visitor.
  return typeof window !== "undefined" && (window as unknown as { __attConsentDefaultAds?: boolean }).__attConsentDefaultAds === true;
}
