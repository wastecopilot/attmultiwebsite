/**
 * Client-side measurement helpers. Every interaction event carries the page, the offer id and a value
 * (the offer's monthly price in USD where an offer is in context, otherwise 0).
 *
 * Events are sent two ways so either setup works without code changes:
 *   - window.dataLayer.push({ event, ... })  → Google Tag Manager custom-event triggers
 *   - gtag("event", name, { send_to: GA4 })  → GA4 when a G- measurement ID is configured
 */
import { env, ga4Id } from "./env";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
  }
}

export type TrackedEvent =
  | "phone_click"
  | "order_click"
  | "zip_check"
  | "cta_click"
  // Online order flow (/att/order). Plan id and value only: never any personal data.
  | "begin_order"
  | "order_plans_shown"
  | "order_options_chosen"
  | "order_quote_started"
  | "order_quote_shown"
  | "order_step_details"
  | "order_submit"
  | "order_failed";

export interface EventParams {
  offer_id?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

function pagePath(): string {
  return typeof window === "undefined" ? "" : window.location.pathname;
}

export function track(event: TrackedEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const payload = {
    page: pagePath(),
    offer_id: params.offer_id ?? "none",
    value: params.value ?? 0,
    currency: "USD",
    ...params,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  if (ga4Id && window.gtag) window.gtag("event", event, { ...payload, send_to: ga4Id });
}

/** Google Ads click-to-call conversion. Fired on every tel: click via <PhoneLink>. */
export function trackCallConversion(params: EventParams = {}): void {
  if (typeof window === "undefined" || !env.adsId || !env.adsCallLabel) return;
  window.gtag?.("event", "conversion", {
    send_to: `${env.adsId}/${env.adsCallLabel}`,
    value: params.value ?? 0,
    currency: "USD",
    transport_type: "beacon",
  });
}
