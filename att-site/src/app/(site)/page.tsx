import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { faqs } from "@/data/faq";
import { company } from "@/data/site";
import type { ImageKey } from "@/data/images";
import { PhoneLink } from "@/components/PhoneLink";
import { CtaLink } from "@/components/ui/CtaLink";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { PromoCard } from "@/components/offers/OfferCard";
import { AsOf, Conditions, FinePrint, Price } from "@/components/offers/OfferBits";
import { CallPanel, CheckList, FaqList, SectionHeading } from "@/components/ui/Sections";
import { AirIcon, FiberIcon, HomePhoneIcon, MapPinIcon, ShieldIcon, DocumentIcon, WirelessIcon, ClockIcon } from "@/components/ui/Icons";
import { HeroArt } from "@/components/ui/HeroArt";
import { SiteImage, imageSrc } from "@/components/ui/SiteImage";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Authorized Retailer: Fiber, Internet Air & Wireless",
  description: "Compare AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone plans with an independent authorized retailer of AT&T services.",
  path: "/",
});

const services: { id: string; href: string; name: string; icon: typeof FiberIcon; image: ImageKey; text: string; from: string; link: string }[] = [
  { id: "fiber-300", href: "/internet/fiber", name: "AT&T Fiber", icon: FiberIcon, image: "cardFiber", text: "Fiber-optic home internet with equal upload and download speeds, up to 5 GIG where available.", from: "From", link: "View AT&T Fiber Plans" },
  { id: "internet-air", href: "/internet/internet-air", name: "AT&T Internet Air", icon: AirIcon, image: "cardAir", text: "Home internet delivered over the AT&T 5G network, with self-setup and no annual contract.", from: "", link: "View AT&T Internet Air" },
  { id: "wireless-value-2", href: "/wireless/plans", name: "AT&T Wireless", icon: WirelessIcon, image: "cardWireless", text: "Unlimited Your Way plans that can be combined across every line on one account.", from: "From", link: "View Unlimited Plans" },
  { id: "phone-unlimited-north-america", href: "/phone", name: "AT&T Phone", icon: HomePhoneIcon, image: "cardPhone", text: "Digital home phone service delivered over an AT&T internet connection.", from: "", link: "View AT&T Phone Plans" },
];

export default function HomePage() {
  const hero = getOffer("fiber-1000");
  const promos = [getOffer("bundle-fiber-wireless"), getOffer("wireless-switch-reward-800"), getOffer("wireless-byod-credit-360")];
  const photo = Boolean(imageSrc("homeHero"));
  const specialistPhoto = Boolean(imageSrc("specialist"));
  return (
    <>
      {/* Hero: featured offer with its conditions and offer details above the fold */}
      <section className={`relative overflow-hidden ${photo ? "hero-photo" : "hero"}`} aria-labelledby="hero-title">
        {photo ? (
          <>
            <SiteImage slot="homeHero" fill preload sizes="100vw" className="hero-photo-img" />
            <div className="hero-photo-overlay" aria-hidden="true" />
          </>
        ) : (
          <HeroArt className="pointer-events-none absolute -right-24 -top-10 hidden w-[44rem] opacity-90 lg:block" />
        )}
        <div className="container-x relative grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div className={photo ? "hero-copy" : undefined}>
            <p className="eyebrow">Authorized Retailer of AT&amp;T Services</p>
            <h1 id="hero-title" className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              AT&amp;T Fiber, Internet Air and Wireless Plans
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Compare AT&amp;T home internet, wireless and home phone plans, and speak with a specialist about the services and pricing available at your address.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PhoneLink placement="hero" offerId={hero.id} value={hero.price?.amount} className="btn btn-primary btn-lg" label="Call Now" />
              <CtaLink href="/check-availability" cta="hero-check-availability" offerId={hero.id} value={hero.price?.amount} variant="secondary" size="lg">
                Check Availability
              </CtaLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
              <ClockIcon className="h-4 w-4" /> {company.hoursShort}
            </p>
          </div>

          <div className="card card-featured p-6 md:p-8" aria-labelledby="hero-offer-title">
            <p className="badge">Featured Offer</p>
            <h2 id="hero-offer-title" className="mt-3 text-2xl font-bold text-ink">
              {hero.title} · {hero.speed}
            </h2>
            <div className="mt-4">
              {hero.price ? <Price price={hero.price} /> : null}
              <Conditions items={hero.conditions} />
            </div>
            {hero.altPrice ? (
              <p className="mt-3 text-sm font-semibold text-ink">
                {hero.altPrice.label}: ${hero.altPrice.price.amount}/mo. {hero.altPrice.price.qualifier}.
              </p>
            ) : null}
            <AsOf offer={hero} />
            <FinePrint offer={hero} />
          </div>
        </div>
      </section>

      {/* ZIP check */}
      <section className="border-y border-border bg-surface" aria-labelledby="zip-title">
        <div className="container-x grid gap-6 py-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="flex items-start gap-4">
            <MapPinIcon className="mt-1 h-7 w-7 shrink-0 text-brand-strong" />
            <div>
              <h2 id="zip-title" className="text-xl font-bold text-ink">
                Check Service Availability
              </h2>
              <p className="mt-1 text-ink-muted">AT&amp;T service is confirmed by street address. Enter your ZIP code to begin.</p>
            </div>
          </div>
          <ZipCheck placement="home-zip" />
        </div>
      </section>

      {/* Services */}
      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeading eyebrow="AT&T Services" id="services-title" title="Home Internet, Wireless and Home Phone" intro="Compare current plans, included features and offer terms for each AT&T service." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const o = getOffer(s.id);
              const Icon = s.icon;
              const hasImage = Boolean(imageSrc(s.image));
              return (
                <article key={s.id} className="card flex flex-col p-6" data-reveal aria-labelledby={`svc-${s.id}`}>
                  {hasImage ? (
                    <div className="card-media">
                      <SiteImage slot={s.image} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                    </div>
                  ) : (
                    <Icon className="h-9 w-9 text-brand-strong" />
                  )}
                  <h3 id={`svc-${s.id}`} className={`${hasImage ? "" : "mt-4 "}text-xl font-bold text-ink`}>
                    {s.name}
                  </h3>
                  <p className="mt-2 text-ink-muted">{s.text}</p>
                  {o.price ? (
                    <p className="mt-4 text-ink">
                      <span className="text-sm">{s.from ? `${s.from} ` : ""}</span>
                      <span className="text-3xl font-extrabold tracking-tight">${o.price.amount % 1 ? o.price.amount.toFixed(2) : o.price.amount}</span>
                      <span className="text-sm font-semibold text-ink-muted">{o.price.unit}</span>
                      {o.price.qualifier ? <span className="block text-sm text-ink-muted">{o.price.qualifier}</span> : null}
                    </p>
                  ) : null}
                  <AsOf offer={o} />
                  <FinePrint offer={o} />
                  <Link href={s.href} className="link mt-auto pt-5 font-semibold">
                    {s.link}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured promotions */}
      <section className="section section-alt" aria-labelledby="deals-title">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Current Offers" id="deals-title" title="Current AT&T Promotions" intro="Promotional pricing and eligibility requirements are set by AT&T." />
            <Link href="/deals" className="link font-semibold">
              View All Deals
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {promos.map((p) => (
              <PromoCard key={p.id} offer={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why an authorized retailer */}
      <section className="section" aria-labelledby="why-title">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Why Choose Us"
            id="why-title"
            title="One Specialist for Internet, Wireless and Home Phone"
            intro={`${company.legalName} is an independent authorized retailer of AT&T services. Our specialists review AT&T plans and promotions with you and confirm the services available at your address.`}
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: DocumentIcon, title: "Published AT&T Pricing", text: "Plans and promotions are presented as AT&T publishes them." },
              { icon: MapPinIcon, title: "Address-Level Availability", text: "Service availability is confirmed for your street address." },
              { icon: ShieldIcon, title: "Complete Offer Terms", text: "Every price is shown with its conditions and offer details." },
              { icon: WirelessIcon, title: "Bundle Savings", text: "An eligible AT&T wireless plan reduces the price of AT&T Fiber." },
            ].map((b) => (
              <li key={b.title} className="card p-5" data-reveal>
                <b.icon className="h-7 w-7 text-brand-strong" />
                <h3 className="mt-3 font-bold text-ink">{b.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="section section-alt" aria-labelledby="faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading eyebrow="Questions" id="faq-title" title="Frequently Asked Questions" intro="Answers to common questions about AT&T plans, pricing and availability." />
            <Link href="/faq" className="link mt-6 inline-block font-semibold">
              View All FAQs
            </Link>
          </div>
          <FaqList items={faqs.slice(0, 5).map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      {/* Speak with a specialist */}
      <section className="section" aria-labelledby="specialist-title">
        <div className={`container-x grid gap-10 ${specialistPhoto ? "lg:grid-cols-2 lg:items-center" : ""}`}>
          <div>
            <SectionHeading
              eyebrow="Speak With a Specialist"
              id="specialist-title"
              title="Pricing and Availability for Your Address"
              intro="A specialist can confirm the AT&T services available at your address, the price of each plan and any promotions you qualify for."
            />
            <CheckList className="mt-6 text-ink" items={["No obligation to purchase", "Fiber, Internet Air, wireless and home phone in one conversation", `Available ${company.hoursShort}`]} />
          </div>
          {specialistPhoto ? (
            <div className="overflow-hidden rounded-2xl">
              <SiteImage slot="specialist" sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full rounded-2xl" />
            </div>
          ) : null}
        </div>
        <div className="container-x mt-10">
          <CallPanel id="home-call-panel" title="Ready to Review Your Options?" text="Call to confirm availability, pricing and current promotions for your address." placement="home-call-panel" offerId={hero.id} value={hero.price?.amount} />
        </div>
      </section>
      <JsonLd data={offersJsonLd([hero], "/")} />
    </>
  );
}
