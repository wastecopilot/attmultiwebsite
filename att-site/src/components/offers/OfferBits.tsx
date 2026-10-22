import type { Offer, OfferPrice } from "@/data/offer-types";
import { BROADBAND_FACTS_URL } from "@/data/site";
import { tr, type Locale } from "@/data/i18n";

export function formatMoney(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** Plan categories that are broadband services under the FCC label rules (fixed and mobile). */
const BROADBAND_CATEGORIES: Offer["category"][] = ["fiber", "internet-air", "wireless-plan", "bundle"];

/** Link to AT&T's Broadband Facts labels, placed next to every internet, wireless and bundle price (FCC label rules). */
export function BroadbandFacts({ offer, locale = "en" }: { offer: Pick<Offer, "category">; locale?: Locale }) {
  if (!BROADBAND_CATEGORIES.includes(offer.category)) return null;
  return (
    <p className="bb-facts mt-2">
      <a href={BROADBAND_FACTS_URL} target="_blank" rel="noopener" className="link">
        {locale === "es" ? "Etiqueta de Broadband Facts de AT&T" : "AT&T Broadband Facts label"}
      </a>
    </p>
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
