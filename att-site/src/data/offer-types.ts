export type OfferCategory = "fiber" | "internet-air" | "wireless-plan" | "wireless-promo" | "phone" | "bundle" | "add-on";

export interface OfferPrice {
  /** Advertised monthly amount in USD (after the discounts named in `conditions`). */
  amount: number;
  /** "/mo." or "/mo. per line" exactly as att.com phrases it. */
  unit: "/mo." | "/mo. per line";
  /** Qualifier printed under the price, e.g. "for 12 mos." or "when you get 4 lines". */
  qualifier?: string;
  /** Price att.com shows struck through ("Was …"), if any. */
  was?: number;
  /** Rate after a promotional period, if att.com states it. */
  thenAmount?: number;
}

export interface Offer {
  /** Stable identifier used in analytics events (offer_id) and in AUDIT.md. */
  id: string;
  category: OfferCategory;
  /** Plan or promotion name exactly as att.com names it. */
  title: string;
  /** One-line headline for cards and the deals page. */
  headline: string;
  price: OfferPrice | null;
  /** A second published price for the same plan, e.g. AT&T Fiber "With wireless plan". */
  altPrice?: { label: string; price: OfferPrice; conditions: string[] };
  /** Short conditions shown with the price (AutoPay, availability, taxes…). */
  conditions: string[];
  /**
   * The monthly AutoPay & paperless bill discount att.com states for this plan (already taken off `price`).
   * The order page uses it to check a quote when the visitor declines AutoPay: att.com price + this amount.
   */
  autopayDiscount?: number;
  /** Full fine print, verbatim from the att.com page or its "See offer details" dialog. */
  finePrint: string;
  /** Plan features, as listed on att.com. */
  features?: string[];
  /** Speeds as att.com labels them (fiber only). */
  speed?: string;
  /** The att.com page the price and fine print were taken from. */
  sourceUrl: string;
  /** When the source page was fetched (ISO 8601, UTC). */
  retrievedAt: string;
  /** End date stated by att.com, or null when none is published. */
  expiresAt: string | null;
  /** Where the same plan/price appears in the reference recording, if it does. */
  videoRef?: string;
}
