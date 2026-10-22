import type { ReactNode } from "react";
import type { Offer } from "@/data/offer-types";
import type { ImageKey } from "@/data/images";
import { company } from "@/data/site";
import { PhoneLink } from "@/components/PhoneLink";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { BroadbandFacts, Conditions, FinePrint, Price } from "@/components/offers/OfferBits";
import { CallPanel, CheckList } from "@/components/ui/Sections";
import { ClockIcon } from "@/components/ui/Icons";
import { SiteImage, imageSrc } from "@/components/ui/SiteImage";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

interface LandingProps {
  offer: Offer;
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  benefits: string[];
  image?: ImageKey;
  secondary?: ReactNode;
}

/**
 * Distraction-free landing template for paid search: one offer with its conditions and offer details
 * visible without scrolling, a single primary action (Call Now), and no navigation menu.
 */
export function LandingTemplate({ offer, path, eyebrow, title, intro, benefits, image, secondary }: LandingProps) {
  const value = offer.price?.amount ?? 0;
  const photo = image && imageSrc(image) ? image : null;
  return (
    <>
      <section className={`relative overflow-hidden ${photo ? "hero-photo" : "hero"}`} aria-labelledby="lp-title">
        {photo ? (
          <>
            <SiteImage slot={photo} fill preload sizes="100vw" className="hero-photo-img" />
            <div className="hero-photo-overlay" aria-hidden="true" />
          </>
        ) : null}
        <div className="container-x relative grid gap-8 py-8 md:py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-16">
          <div className={photo ? "hero-copy" : undefined}>
            <p className="eyebrow">{eyebrow}</p>
            <h1 id="lp-title" className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-muted">{intro}</p>
            <div className="mt-6 hidden lg:block">
              <PhoneLink placement="lp-hero" offerId={offer.id} value={value} className="btn btn-primary btn-lg" label="Call Now" />
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                <ClockIcon className="h-4 w-4" /> {company.hoursShort}
              </p>
            </div>
          </div>

          <div className="card card-featured p-5 md:p-7" aria-labelledby="lp-offer-title">
            <h2 id="lp-offer-title" className="text-xl font-bold text-ink">
              {offer.title}
              {offer.speed ? ` · ${offer.speed}` : ""}
            </h2>
            {offer.price ? (
              <div className="mt-3">
                <Price price={offer.price} />
                <Conditions items={offer.conditions} />
              </div>
            ) : null}
            {offer.altPrice ? (
              <p className="mt-3 text-sm font-semibold text-ink">
                {offer.altPrice.label}: ${offer.altPrice.price.amount}/mo. {offer.altPrice.price.qualifier}.
              </p>
            ) : null}
            <BroadbandFacts offer={offer} />
            <PhoneLink placement="lp-offer" offerId={offer.id} value={value} className="btn btn-primary mt-4 w-full lg:hidden" label="Call Now" />
            <FinePrint offer={offer} />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface" aria-labelledby="lp-zip-title">
        <div className="container-x grid gap-6 py-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <h2 id="lp-zip-title" className="text-xl font-bold text-ink">
              Check Service Availability
            </h2>
            <p className="mt-1 text-ink-muted">AT&amp;T service is confirmed by street address.</p>
          </div>
          <ZipCheck placement="lp-zip" offerId={offer.id} value={value} />
        </div>
      </section>

      <section className="section" aria-labelledby="lp-more-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <h2 id="lp-more-title" className="text-2xl font-bold text-ink md:text-3xl">
              What Is Included
            </h2>
            <CheckList className="mt-5 text-ink" items={benefits} />
          </div>
          {secondary ? <div>{secondary}</div> : null}
        </div>
        <div className="container-x mt-12">
          <CallPanel
            id="lp-call-panel"
            title="Confirm Pricing for Your Address"
            text="Call to confirm availability, pricing and any promotions that apply at your address."
            placement="lp-call-panel"
            offerId={offer.id}
            value={value}
          />
        </div>
      </section>
      <JsonLd data={offersJsonLd([offer], path)} />
    </>
  );
}
