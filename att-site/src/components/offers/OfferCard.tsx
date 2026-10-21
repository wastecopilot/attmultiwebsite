import type { Offer } from "@/data/offer-types";
import { PhoneLink } from "@/components/PhoneLink";
import { CheckList } from "@/components/ui/Sections";
import { AsOf, Conditions, FinePrint, Price } from "./OfferBits";

/**
 * Plan card used for every priced plan. Always shows: price, conditions, "as of" date and the
 * full att.com fine print (in a disclosure that is present in the HTML).
 */
export function PlanCard({
  offer,
  featured = false,
  badge,
  headingLevel = "h3",
  showAlt = true,
  ctaLabel = "Call Now",
}: {
  offer: Offer;
  featured?: boolean;
  badge?: string;
  headingLevel?: "h2" | "h3";
  showAlt?: boolean;
  ctaLabel?: string;
}) {
  const H = headingLevel;
  const value = offer.price?.amount ?? 0;
  return (
    <article className={`card flex h-full flex-col p-6 ${featured ? "card-featured" : ""}`} aria-labelledby={`${offer.id}-title`} data-reveal>
      <div className="flex items-start justify-between gap-3">
        <div>
          {offer.speed ? <p className="text-sm font-semibold tracking-wide text-ink-muted uppercase">{offer.speed}</p> : null}
          <H id={`${offer.id}-title`} className="mt-1 text-xl font-bold text-ink">
            {offer.title}
          </H>
        </div>
        {badge ? <span className="badge shrink-0">{badge}</span> : null}
      </div>
      {offer.price ? (
        <div className="mt-5">
          <Price price={offer.price} />
          <Conditions items={offer.conditions} />
        </div>
      ) : null}
      {showAlt && offer.altPrice ? (
        <div className="mt-4 rounded-xl bg-brand-tint p-4">
          <p className="text-sm font-semibold text-ink">{offer.altPrice.label}</p>
          <Price price={offer.altPrice.price} size="md" />
        </div>
      ) : null}
      <AsOf offer={offer} />
      {offer.features?.length ? <CheckList className="mt-5 text-sm text-ink" items={offer.features} /> : null}
      <div className="mt-auto pt-6">
        <PhoneLink placement="plan-card" offerId={offer.id} value={value} className="btn btn-primary w-full" label={ctaLabel} />
        <FinePrint offer={offer} />
      </div>
    </article>
  );
}

/** Promotion card (no single price): headline, conditions, as-of date and fine print. */
export function PromoCard({ offer, headingLevel = "h3" }: { offer: Offer; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="card flex h-full flex-col p-6" aria-labelledby={`${offer.id}-title`} data-reveal>
      <p className="eyebrow">{offer.title}</p>
      <H id={`${offer.id}-title`} className="mt-2 text-xl font-bold text-ink">
        {offer.headline}
      </H>
      {offer.price ? (
        <div className="mt-4">
          <Price price={offer.price} size="md" />
        </div>
      ) : null}
      <Conditions items={offer.conditions} />
      <AsOf offer={offer} />
      {offer.features?.length ? <CheckList className="mt-4 text-sm text-ink" items={offer.features} /> : null}
      <div className="mt-auto pt-6">
        <PhoneLink placement="promo-card" offerId={offer.id} value={offer.price?.amount ?? 0} className="btn btn-primary w-full" label="Call Now" />
        <FinePrint offer={offer} />
      </div>
    </article>
  );
}
