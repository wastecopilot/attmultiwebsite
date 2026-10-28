/**
 * Short plan summaries for the availability pages (shown when a visitor arrives from an Order Now button).
 * Built from offers.ts so names and prices never drift.
 */
import type { OfferCategory } from "./offer-types";
import { offers } from "./offers";
import { tr, type Locale } from "./i18n";
import type { PlanSummary } from "@/components/forms/AvailabilityZip";

const SERVICE: Record<Locale, Record<OfferCategory, string>> = {
  en: {
    fiber: "AT&T Fiber",
    "internet-air": "AT&T Internet Air",
    "wireless-plan": "AT&T Wireless",
    "wireless-promo": "AT&T Wireless",
    phone: "AT&T Phone",
    bundle: "Internet and wireless bundle",
    "add-on": "AT&T Fiber add-on",
  },
  es: {
    fiber: "AT&T Fiber",
    "internet-air": "AT&T Internet Air",
    "wireless-plan": "Servicio inalámbrico de AT&T",
    "wireless-promo": "Servicio inalámbrico de AT&T",
    phone: "AT&T Phone",
    bundle: "Paquete de internet y servicio inalámbrico",
    "add-on": "Complemento de AT&T Fiber",
  },
};

const money = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

export function planSummaries(locale: Locale = "en"): Record<string, PlanSummary> {
  return Object.fromEntries(
    offers.map((o) => [
      o.id,
      {
        title: o.title,
        service: SERVICE[locale][o.category],
        price: o.price ? `${money(o.price.amount)}${tr(o.price.unit, locale)}${o.price.qualifier ? ` ${tr(o.price.qualifier, locale)}` : ""}` : undefined,
        value: o.price?.amount ?? 0,
      },
    ]),
  );
}
