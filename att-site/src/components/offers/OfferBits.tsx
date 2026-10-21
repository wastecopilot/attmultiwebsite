import type { Offer, OfferPrice } from "@/data/offer-types";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });

export function formatAsOf(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatMoney(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** "Pricing as of Oct 21, 2026 · source: att.com" — shown with every price and promotion. */
export function AsOf({ offer, className = "" }: { offer: Pick<Offer, "retrievedAt" | "sourceUrl">; className?: string }) {
  return (
    <p className={`as-of ${className}`}>
      As of <time dateTime={offer.retrievedAt}>{formatAsOf(offer.retrievedAt)}</time>. Prices and offers are set by AT&amp;T and may change.
    </p>
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
        Offer details and fine print<span className="sr-only"> for {offer.title}</span>
      </summary>
      <div className="fine-print-body">
        <p>{offer.finePrint}</p>
        <p className="mt-2">
          Source:{" "}
          <a href={offer.sourceUrl} rel="nofollow noopener" target="_blank" className="link">
            att.com<span className="sr-only"> (opens in a new tab)</span>
          </a>
          , retrieved <time dateTime={offer.retrievedAt}>{formatAsOf(offer.retrievedAt)}</time>.
        </p>
      </div>
    </details>
  );
}

/** Short conditions under a price, e.g. "Plus taxes and fees · AutoPay & Paperless bill required". */
export function Conditions({ items }: { items: string[] }) {
  if (!items.length) return null;
  return <p className="conditions">{items.join(" · ")}</p>;
}
