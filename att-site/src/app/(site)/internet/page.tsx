import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { AsOf, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { CallBand, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { AirIcon, FiberIcon } from "@/components/ui/Icons";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Home Internet: Fiber & Internet Air Plans",
  description: "Compare AT&T home internet: AT&T Fiber from $50/mo. and AT&T Internet Air 5G home internet at $55/mo., with AT&T's full offer terms and dates.",
  path: "/internet",
});

export default function InternetPage() {
  const fiber = offersBy("fiber");
  const air = getOffer("internet-air");
  const fiber300 = getOffer("fiber-300");
  const bundle = getOffer("bundle-fiber-wireless");
  return (
    <>
      <PageHeader
        trail={[{ name: "Internet", path: "/internet" }]}
        eyebrow="AT&T home internet"
        title="AT&T home internet plans"
        intro="AT&T offers two kinds of home internet: AT&T Fiber over fiber-optic cable, and AT&T Internet Air over AT&T's 5G wireless network. Which one is available depends on your address."
        aside={
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">Check service at your address</h2>
            <p className="mt-1 text-sm text-ink-muted">AT&amp;T confirms availability for each street address.</p>
            <div className="mt-4">
              <ZipCheck placement="internet-header" offerId={fiber300.id} value={fiber300.price!.amount} />
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="compare-title">
        <div className="container-x">
          <SectionHeading eyebrow="Compare" id="compare-title" title="AT&T Fiber or AT&T Internet Air?" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="card p-6 md:p-8" data-reveal aria-labelledby="cmp-fiber">
              <FiberIcon className="h-9 w-9 text-brand-strong" />
              <h3 id="cmp-fiber" className="mt-4 text-2xl font-bold text-ink">
                AT&amp;T Fiber
              </h3>
              <p className="mt-2 text-ink-muted">Delivered to your home by fiber-optic cable, with speeds up to 5 GIG where available and equal upload and download speeds.</p>
              <p className="mt-4 text-ink">
                From <span className="text-3xl font-extrabold">{formatMoney(fiber300.price!.amount)}</span>
                <span className="font-semibold text-ink-muted">/mo.</span> with AutoPay &amp; Paperless bill, plus taxes &amp; fees
              </p>
              <AsOf offer={fiber300} />
              <FinePrint offer={fiber300} />
              <Link href="/internet/fiber" className="btn btn-primary mt-6">
                Compare AT&amp;T Fiber plans
              </Link>
            </article>
            <article className="card p-6 md:p-8" data-reveal aria-labelledby="cmp-air">
              <AirIcon className="h-9 w-9 text-brand-strong" />
              <h3 id="cmp-air" className="mt-4 text-2xl font-bold text-ink">
                AT&amp;T Internet Air
              </h3>
              <p className="mt-2 text-ink-muted">Home internet over AT&amp;T&apos;s 5G wireless network. Plug in the included AT&amp;T All-Fi Hub and connect; no annual contract.</p>
              <p className="mt-4 text-ink">
                <span className="text-3xl font-extrabold">{formatMoney(air.price!.amount)}</span>
                <span className="font-semibold text-ink-muted">/mo.</span> with AutoPay &amp; Paperless bill, plus taxes &amp; fees
              </p>
              <AsOf offer={air} />
              <FinePrint offer={air} />
              <Link href="/internet/internet-air" className="btn btn-primary mt-6">
                See AT&amp;T Internet Air details
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="all-plans-title">
        <div className="container-x">
          <SectionHeading eyebrow="All home internet plans" id="all-plans-title" title="Every AT&T home internet price, with its terms" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {[...fiber, air].map((o) => (
              <PlanCard key={o.id} offer={o} showAlt />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="bundle-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Bundle"
            id="bundle-title"
            title="Pair AT&T Fiber with AT&T wireless"
            intro="With an eligible AT&T unlimited wireless plan, AT&T lowers the monthly AT&T Fiber price by $15 to $25, depending on the speed."
          />
          <PromoCard offer={bundle} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="internet-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Questions" id="internet-faq-title" title="Home internet FAQ" />
          <FaqList items={faqsFor("internet").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="internet-band" title="Not sure which AT&T internet service you can get?" text="A specialist can confirm whether AT&T Fiber or AT&T Internet Air is available at your address." offerId={fiber300.id} value={fiber300.price!.amount} />
      <JsonLd data={offersJsonLd([...fiber, air], "/internet")} />
    </>
  );
}
