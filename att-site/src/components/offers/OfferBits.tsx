import type { Offer, OfferPrice } from "@/data/offer-types";
import { BROADBAND_FACTS_URL } from "@/data/site";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });

export function formatAsOf(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatMoney(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** Plan categories that are broadband services under the FCC label rules (fixed and mobile). */
const BROADBAND_CATEGORIES: Offer["category"][] = ["fiber", "internet-air", "wireless-plan", "bundle"];

/**
 * "Pricing as of Oct 21, 2026" — shown with every price and promotion. For internet and wireless plans it
 * also links AT&T's Broadband Facts labels, so the label link always sits next to the plan's price.
 */
export function AsOf({ offer, className = "" }: { offer: Pick<Offer, "retrievedAt" | "category" | "title">; className?: string }) {
  return (
    <>
      <p className={`as-of ${className}`}>
        Pricing as of <time dateTime={offer.retrievedAt}>{formatAsOf(offer.retrievedAt)}</time>
      </p>
      {BROADBAND_CATEGORIES.includes(offer.category) ? (
        <p className="bb-facts">
          <a href={BROADBAND_FACTS_URL} target="_blank" rel="noopener" className="link">
            AT&amp;T Broadband Facts label<span className="sr-only"> for {offer.title} (opens att.com in a new tab)</span>
          </a>
        </p>
      ) : null}
    </>
  );
}

/** Large price display: $70/mo. with optional struck "was" price and qualifier. */
export function Price({ price, size = "lg" }: { price: OfferPrice; size?: "lg" | "md" }) {
  const [dollars, cents] = price.amount.toFixed(2).split(".");
  return (
    <div className="price">
      {price.was ? (
        <p className="price-was">
          <span className="sr-only">Regular price </span>
          <s>{formatMoney(price.was)}/mo.</s>
        </p>
      ) : null}
      <p className={size === "lg" ? "price-main" : "price-main price-md"}>
        <span className="price-dollar" aria-hidden="true">
          $
        </span>
        <span className="price-amount" aria-hidden="true">
          {dollars}
        </span>
        <span className="price-cents" aria-hidden="true">
          .{cents}
        </span>
        <span className="price-unit" aria-hidden="true">
          {price.unit}
        </span>
        <span className="sr-only">
          ${price.amount.toFixed(2)} {price.unit === "/mo. per line" ? "per month per line" : "per month"}
        </span>
      </p>
      {price.qualifier ? <p className="price-qualifier">{price.qualifier}</p> : null}
      {price.thenAmount ? <p className="price-then">Then {formatMoney(price.thenAmount)}/mo. after the promotional period.</p> : null}
    </div>
  );
}

/** Fine print, always present in the HTML; the summary keeps the card compact. */
export function FinePrint({ offer, open = false }: { offer: Offer; open?: boolean }) {
  return (
    <details className="fine-print" open={open}>
      <summary>
        See offer details<span className="sr-only"> for {offer.title}</span>
      </summary>
      <div className="fine-print-body">
        <p>{offer.finePrint}</p>
      </div>
    </details>
  );
}

/** Short conditions under a price, e.g. "Plus taxes and fees · AutoPay & Paperless bill required". */
export function Conditions({ items }: { items: string[] }) {
  if (!items.length) return null;
  return <p className="conditions">{items.join(" · ")}</p>;
}
