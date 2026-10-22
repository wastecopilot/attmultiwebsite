import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { BroadbandFacts, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { CallBand, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { AirIcon, FiberIcon } from "@/components/ui/Icons";
import { SiteImage, imageSrc } from "@/components/ui/SiteImage";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Home Internet: Fiber & Internet Air Plans",
  description: "Compare AT&T home internet: AT&T Fiber from $50/mo. and AT&T Internet Air 5G home internet at $55/mo., with plan details and offer terms.",
  path: "/internet",
});

export default function InternetPage() {
  const fiber = offersBy("fiber");
  const air = getOffer("internet-air");
  const fiber300 = getOffer("fiber-300");
  const bundle = getOffer("bundle-fiber-wireless");
  const bundlePhoto = Boolean(imageSrc("bundle"));
  return (
    <>
      <PageHeader
        trail={[{ name: "Internet", path: "/internet" }]}
        image="internetHero"
        eyebrow="AT&T Home Internet"
        title="AT&T Home Internet Plans"
        intro="AT&T offers two home internet services: AT&T Fiber over fiber-optic cable and AT&T Internet Air over the AT&T 5G network. The service available to you depends on your address."
        aside={
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">Check Service Availability</h2>
            <p className="mt-1 text-sm text-ink-muted">AT&amp;T service is confirmed by street address.</p>
            <div className="mt-4">
              <ZipCheck placement="internet-header" offerId={fiber300.id} value={fiber300.price!.amount} />
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="compare-title">
        <div className="container-x">
          <SectionHeading eyebrow="Compare" id="compare-title" title="AT&T Fiber and AT&T Internet Air" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="card p-6 md:p-8" data-reveal aria-labelledby="cmp-fiber">
              <FiberIcon className="h-9 w-9 text-brand-strong" />
              <h3 id="cmp-fiber" className="mt-4 text-2xl font-bold text-ink">
                AT&amp;T Fiber
              </h3>
              <p className="mt-2 text-ink-muted">Delivered by fiber-optic cable, with speeds up to 5 GIG where available and equal upload and download speeds.</p>
              <p className="mt-4 text-ink">
                From <span className="text-3xl font-extrabold">{formatMoney(fiber300.price!.amount)}</span>
                <span className="font-semibold text-ink-muted">/mo.</span> with AutoPay &amp; Paperless bill, plus taxes &amp; fees
              </p>
              <BroadbandFacts offer={fiber300} />
              <FinePrint offer={fiber300} />
              <Link href="/internet/fiber" className="btn btn-primary mt-6">
                View AT&amp;T Fiber Plans
              </Link>
            </article>
            <article className="card p-6 md:p-8" data-reveal aria-labelledby="cmp-air">
              <AirIcon className="h-9 w-9 text-brand-strong" />
              <h3 id="cmp-air" className="mt-4 text-2xl font-bold text-ink">
                AT&amp;T Internet Air
              </h3>
              <p className="mt-2 text-ink-muted">Home internet over the AT&amp;T 5G network, set up with the included AT&amp;T All-Fi Hub, with no annual contract.</p>
              <p className="mt-4 text-ink">
                <span className="text-3xl font-extrabold">{formatMoney(air.price!.amount)}</span>
                <span className="font-semibold text-ink-muted">/mo.</span> with AutoPay &amp; Paperless bill, plus taxes &amp; fees
              </p>
              <BroadbandFacts offer={air} />
              <FinePrint offer={air} />
              <Link href="/internet/internet-air" className="btn btn-primary mt-6">
                View AT&amp;T Internet Air
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="all-plans-title">
        <div className="container-x">
          <SectionHeading eyebrow="Plans and Pricing" id="all-plans-title" title="All AT&T Home Internet Plans" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {[...fiber, air].map((o) => (
              <PlanCard key={o.id} offer={o} showAlt />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="bundle-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Bundle Savings"
              id="bundle-title"
              title="AT&T Fiber With AT&T Wireless"
              intro="With an eligible AT&T unlimited wireless plan, the monthly AT&T Fiber price is reduced by $15 to $25, depending on the speed tier."
            />
            {bundlePhoto ? (
              <div className="mt-8 overflow-hidden rounded-2xl">
                <SiteImage slot="bundle" sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
              </div>
            ) : null}
          </div>
          <PromoCard offer={bundle} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="internet-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Home Internet" id="internet-faq-title" title="Frequently Asked Questions" />
          <FaqList items={faqsFor("internet").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="internet-band" title="Find the Right AT&T Internet Service" text="Call to confirm whether AT&T Fiber or AT&T Internet Air is available at your address." offerId={fiber300.id} value={fiber300.price!.amount} />
      <JsonLd data={offersJsonLd([...fiber, air], "/internet")} />
    </>
  );
}
