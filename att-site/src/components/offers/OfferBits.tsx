import type { Offer, OfferPrice } from "@/data/offer-types";
import { BROADBAND_FACTS_URL } from "@/data/site";
import { tr, type Locale } from "@/data/i18n";

const dateFmt = {
  en: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" }),
  es: new Intl.DateTimeFormat("es-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" }),
};

export function formatAsOf(iso: string, locale: Locale = "en"): string {
  return dateFmt[locale].format(new Date(iso));
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
export function AsOf({ offer, className = "", locale = "en" }: { offer: Pick<Offer, "retrievedAt" | "category" | "title">; className?: string; locale?: Locale }) {
  return (
    <>
      <p className={`as-of ${className}`}>
        {locale === "es" ? "Precios vigentes al" : "Pricing as of"} <time dateTime={offer.retrievedAt}>{formatAsOf(offer.retrievedAt, locale)}</time>
      </p>
      {BROADBAND_CATEGORIES.includes(offer.category) ? (
        <p className="bb-facts">
          <a href={BROADBAND_FACTS_URL} target="_blank" rel="noopener" className="link">
            {locale === "es" ? "Etiqueta de Broadband Facts de AT&T" : "AT&T Broadband Facts label"}
          </a>
        </p>
      ) : null}
    </>
  );
}

/** Large price display: $70/mo. with optional struck "was" price and qualifier. */
export function Price({ price, size = "lg", locale = "en" }: { price: OfferPrice; size?: "lg" | "md"; locale?: Locale }) {
  const [dollars, cents] = price.amount.toFixed(2).split(".");
  const es = locale === "es";
  const perMonth = tr("/mo.", locale);
  return (
    <div className="price">
      {price.was ? (
        <p className="price-was">
          <span className="sr-only">{es ? "Precio regular " : "Regular price "}</span>
          <s>
            {formatMoney(price.was)}
            {perMonth}
          </s>
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
          {tr(price.unit, locale)}
        </span>
        <span className="sr-only">
          ${price.amount.toFixed(2)}{" "}
          {price.unit === "/mo. per line" ? (es ? "al mes por línea" : "per month per line") : es ? "al mes" : "per month"}
        </span>
      </p>
      {price.qualifier ? <p className="price-qualifier">{tr(price.qualifier, locale)}</p> : null}
      {price.thenAmount ? (
        <p className="price-then">
          {es
            ? `Luego ${formatMoney(price.thenAmount)}/mes después del período promocional.`
            : `Then ${formatMoney(price.thenAmount)}/mo. after the promotional period.`}
        </p>
      ) : null}
    </div>
  );
}

/** Fine print, always present in the HTML; the summary keeps the card compact. AT&T's text stays in English. */
export function FinePrint({ offer, open = false, locale = "en" }: { offer: Offer; open?: boolean; locale?: Locale }) {
  return (
    <details className="fine-print" open={open}>
      <summary>
        {locale === "es" ? "Ver detalles de la oferta (en inglés)" : "See offer details"}
        <span className="sr-only"> {locale === "es" ? "de" : "for"} {offer.title}</span>
      </summary>
      <div className="fine-print-body" lang="en">
        <p>{offer.finePrint}</p>
      </div>
    </details>
  );
}

/** Short conditions under a price, e.g. "Plus taxes and fees · AutoPay & Paperless bill required" (AT&T's English wording). */
export function Conditions({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <p className="conditions" lang="en">
      {items.join(" · ")}
    </p>
  );
}
