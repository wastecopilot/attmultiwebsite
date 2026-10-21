import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { faqs } from "@/data/faq";
import { company } from "@/data/site";
import { PhoneLink } from "@/components/PhoneLink";
import { CtaLink } from "@/components/ui/CtaLink";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { LeadForm } from "@/components/forms/LeadForm";
import { PromoCard } from "@/components/offers/OfferCard";
import { AsOf, Conditions, FinePrint, Price } from "@/components/offers/OfferBits";
import { CallBand, CheckList, FaqList, SectionHeading } from "@/components/ui/Sections";
import { AirIcon, FiberIcon, HomePhoneIcon, MapPinIcon, ShieldIcon, DocumentIcon, WirelessIcon, ClockIcon } from "@/components/ui/Icons";
import { HeroArt } from "@/components/ui/HeroArt";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Authorized Retailer: Fiber, Internet Air & Wireless",
  description: "Compare AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone plans with an independent authorized retailer. Prices verified on att.com.",
  path: "/",
});

const services = [
  { id: "fiber-300", href: "/internet/fiber", name: "AT&T Fiber", icon: FiberIcon, text: "Fiber-optic home internet with equal upload and download speeds, up to 5 GIG where available.", from: "From" },
  { id: "internet-air", href: "/internet/internet-air", name: "AT&T Internet Air", icon: AirIcon, text: "Home internet delivered over AT&T's 5G wireless network, with $0 self-setup.", from: "" },
  { id: "wireless-value-2", href: "/wireless/plans", name: "AT&T Wireless", icon: WirelessIcon, text: "Unlimited Your Way plans you can mix and match on every line.", from: "From" },
  { id: "phone-unlimited-north-america", href: "/phone", name: "AT&T Phone", icon: HomePhoneIcon, text: "Digital home phone service delivered over an AT&T internet connection.", from: "" },
] as const;

export default function HomePage() {
  const hero = getOffer("fiber-1000");
  const promos = [getOffer("bundle-fiber-wireless"), getOffer("wireless-switch-reward-800"), getOffer("wireless-byod-credit-360")];
  return (
    <>
      {/* Hero: offer, conditions and fine print above the fold */}
      <section className="hero relative overflow-hidden" aria-labelledby="hero-title">
        <HeroArt className="pointer-events-none absolute -right-24 -top-10 hidden w-[44rem] opacity-90 lg:block" />
        <div className="container-x relative grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Independent authorized retailer of AT&amp;T services</p>
            <h1 id="hero-title" className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              AT&amp;T Fiber, Internet Air and wireless plans, explained clearly
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Compare AT&amp;T&apos;s current prices with every condition stated, then speak with a specialist who can confirm the services available at your address.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PhoneLink placement="hero" offerId={hero.id} value={hero.price?.amount} className="btn btn-primary btn-lg" prefix="Call" />
              <CtaLink href="/check-availability" cta="hero-check-availability" offerId={hero.id} value={hero.price?.amount} variant="secondary" size="lg">
                Check availability
              </CtaLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
              <ClockIcon className="h-4 w-4" /> Specialists available {company.hoursShort}
            </p>
          </div>

          <div className="card card-featured p-6 md:p-8" aria-labelledby="hero-offer-title">
            <p className="badge">Featured AT&amp;T Fiber price</p>
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
                Check AT&amp;T service at your address
              </h2>
              <p className="mt-1 text-ink-muted">AT&amp;T confirms availability for each street address. Start with your ZIP code.</p>
            </div>
          </div>
          <ZipCheck placement="home-zip" />
        </div>
      </section>

      {/* Services */}
      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeading eyebrow="AT&T services" id="services-title" title="Home internet, wireless and home phone" intro="Each service page lists AT&T's current prices, what is included and the complete offer terms." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const o = getOffer(s.id);
              const Icon = s.icon;
              return (
                <article key={s.id} className="card flex flex-col p-6" data-reveal aria-labelledby={`svc-${s.id}`}>
                  <Icon className="h-9 w-9 text-brand-strong" />
                  <h3 id={`svc-${s.id}`} className="mt-4 text-xl font-bold text-ink">
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
                    Compare {s.name} plans
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
            <SectionHeading eyebrow="Current AT&T offers" id="deals-title" title="Promotions available now" intro="Offers are AT&T's and change often. Each one shows the date it was verified on att.com." />
            <Link href="/deals" className="link font-semibold">
              See all current AT&amp;T deals
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
            eyebrow="Why speak with us"
            id="why-title"
            title="One conversation for internet, wireless and home phone"
            intro={`${company.legalName} is an independent authorized retailer of AT&T services. Our specialists explain AT&T's plans and promotions and confirm what is available at your address.`}
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: DocumentIcon, title: "AT&T's published prices", text: "The prices on this site are AT&T's, verified on att.com and dated." },
              { icon: MapPinIcon, title: "Address-level availability", text: "Service is confirmed for your street address, not estimated from a ZIP code." },
              { icon: ShieldIcon, title: "Complete offer terms", text: "Every price is shown with its conditions and AT&T's full fine print." },
              { icon: WirelessIcon, title: "Bundle guidance", text: "See how an eligible AT&T wireless plan lowers the AT&T Fiber price." },
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
            <SectionHeading eyebrow="Questions" id="faq-title" title="Before you call" intro="Answers to the questions customers ask most often." />
            <Link href="/faq" className="link mt-6 inline-block font-semibold">
              Read all frequently asked questions
            </Link>
          </div>
          <FaqList items={faqs.slice(0, 5).map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      {/* Lead form */}
      <section className="section" aria-labelledby="lead-section-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Request a call back" id="lead-section-title" title="Prefer that we call you?" intro="Leave your details and a specialist will call you during business hours to review the AT&T services available at your address." />
            <CheckList className="mt-6 text-ink" items={["No obligation to purchase", "Your details are used only to respond to your enquiry", "Calls are made during business hours only"]} />
          </div>
          <LeadForm offerId={hero.id} value={hero.price?.amount} headingLevel="h3" />
        </div>
      </section>

      <CallBand placement="home-band" title="Ready to compare AT&T plans?" text="Speak with a specialist about AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone." offerId={hero.id} value={hero.price?.amount} />
      <JsonLd data={offersJsonLd([hero], "/")} />
    </>
  );
}
