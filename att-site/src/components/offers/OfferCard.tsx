import type { Offer } from "@/data/offer-types";
import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";
import { CheckList } from "@/components/ui/Sections";
import { AsOf, Conditions, FinePrint, Price } from "./OfferBits";
import { headlineEs, tr, ui, type Locale } from "@/data/i18n";

/**
 * Plan card used for every priced plan. Always shows: price, conditions, the "as of" date, the Broadband Facts link (broadband plans) and the
 * full att.com fine print (in a disclosure that is present in the HTML).
 */
export function PlanCard({
  offer,
  featured = false,
  badge,
  headingLevel = "h3",
  showAlt = true,
  ctaLabel,
  locale = "en",
}: {
  offer: Offer;
  featured?: boolean;
  badge?: string;
  headingLevel?: "h2" | "h3";
  showAlt?: boolean;
  ctaLabel?: string;
  locale?: Locale;
}) {
  const H = headingLevel;
  const value = offer.price?.amount ?? 0;
  const es = locale === "es";
  return (
    <article className={`card flex h-full flex-col p-6 ${featured ? "card-featured" : ""}`} aria-labelledby={`${offer.id}-title`} data-reveal>
      {/* Badge sits above the title so narrow cards keep the plan name on one line. */}
      {badge ? <span className="badge self-start">{badge}</span> : null}
      <div className={badge ? "mt-3" : undefined}>
        {offer.speed ? <p className="text-sm font-semibold tracking-wide text-ink-muted uppercase">{tr(offer.speed, locale)}</p> : null}
        <H id={`${offer.id}-title`} className="mt-1 text-xl font-bold text-ink">
          {offer.title}
        </H>
      </div>
      {offer.price ? (
        <div className="mt-5">
          <Price price={offer.price} locale={locale} />
          <Conditions items={offer.conditions} />
        </div>
      ) : null}
      {showAlt && offer.altPrice ? (
        <div className="mt-4 rounded-xl bg-brand-tint p-4">
          <p className="text-sm font-semibold text-ink">{tr(offer.altPrice.label, locale)}</p>
          <Price price={offer.altPrice.price} size="md" locale={locale} />
        </div>
      ) : null}
      <AsOf offer={offer} locale={locale} />
      {/* AT&T lists plan features in English; Spanish cards keep the price, conditions and offer details. */}
      {!es && offer.features?.length ? <CheckList className="mt-5 text-sm text-ink" items={offer.features} /> : null}
      <div className="mt-auto pt-6">
        <div className="cta-pair">
          <PhoneLink placement="plan-card" offerId={offer.id} value={value} className="btn btn-primary" label={ctaLabel ?? ui[locale].callNow} />
          <OrderButton placement="plan-card" offerId={offer.id} value={value} planName={offer.title} className="btn btn-secondary" locale={locale} />
        </div>
        <FinePrint offer={offer} locale={locale} />
      </div>
    </article>
  );
}

/** Promotion card (no single price): headline, conditions, as-of date and fine print. */
export function PromoCard({ offer, headingLevel = "h3", locale = "en" }: { offer: Offer; headingLevel?: "h2" | "h3"; locale?: Locale }) {
  const H = headingLevel;
  const es = locale === "es";
  const headline = es ? headlineEs[offer.id] : undefined;
  return (
    <article className="card flex h-full flex-col p-6" aria-labelledby={`${offer.id}-title`} data-reveal>
      <p className="eyebrow">{offer.title}</p>
      <H id={`${offer.id}-title`} className="mt-2 text-xl font-bold text-ink" lang={es && !headline ? "en" : undefined}>
        {headline ?? offer.headline}
      </H>
      {offer.price ? (
        <div className="mt-4">
          <Price price={offer.price} size="md" locale={locale} />
        </div>
      ) : null}
      <Conditions items={offer.conditions} />
      <AsOf offer={offer} locale={locale} />
      {!es && offer.features?.length ? <CheckList className="mt-4 text-sm text-ink" items={offer.features} /> : null}
      <div className="mt-auto pt-6">
        <div className="cta-pair">
          <PhoneLink placement="promo-card" offerId={offer.id} value={offer.price?.amount ?? 0} className="btn btn-primary" label={ui[locale].callNow} />
          <OrderButton placement="promo-card" offerId={offer.id} value={offer.price?.amount ?? 0} planName={offer.title} className="btn btn-secondary" locale={locale} />
        </div>
        <FinePrint offer={offer} locale={locale} />
      </div>
    </article>
  );
}
