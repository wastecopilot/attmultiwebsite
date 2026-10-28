import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PromoCard } from "@/components/offers/OfferCard";
import { BroadbandFacts, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { CallBand, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";
import { GuaranteeSection } from "@/components/ui/GuaranteeSection";
import { SwapIcon, TagIcon, WirelessIcon } from "@/components/ui/Icons";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Wireless Plans, Deals & Switching Offers",
  description: "AT&T Unlimited Your Way plans from $30/mo. per line with 4 lines, plus current switching offers and smartphone promotions.",
  path: "/wireless",
});

export default function WirelessPage() {
  const plans = offersBy("wireless-plan");
  const value = getOffer("wireless-value-2");
  const promos = [getOffer("wireless-switch-reward-800"), getOffer("wireless-byod-credit-360"), getOffer("wireless-new-line-5-off")];
  return (
    <>
      <PageHeader
        trail={[{ name: "Wireless", path: "/wireless" }]}
        image="wirelessHero"
        eyebrow="AT&T Wireless"
        title="AT&T Wireless Plans and Offers"
        intro="AT&T Unlimited Your Way allows a different unlimited plan on each line of one account. Compare the four plans, current switching offers and smartphone promotions."
        aside={
          <div className="card card-featured p-6">
            <p className="text-lg font-bold text-ink">AT&amp;T Unlimited Your Way</p>
            <p className="mt-2 text-ink">
              From <span className="text-4xl font-extrabold tracking-tight">{formatMoney(value.price!.amount)}</span>
              <span className="font-semibold text-ink-muted">/mo. per line</span>
            </p>
            <p className="text-sm font-semibold text-ink">{value.title} {value.price!.qualifier}</p>
            <p className="mt-1 text-sm text-ink-muted">{value.conditions.join(" · ")}</p>
            <BroadbandFacts offer={value} />
            <FinePrint offer={value} />
            <div className="cta-pair mt-4">
              <PhoneLink placement="wireless-header" offerId={value.id} value={value.price!.amount} className="btn btn-primary" label="Call Now" />
              <OrderButton placement="wireless-header" offerId={value.id} value={value.price!.amount} planName={value.title} className="btn btn-secondary" />
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="w-plans-title">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Unlimited Plans" id="w-plans-title" title="Four Plans That Can Be Combined on One Account" intro="Prices per line with 4 lines, after AT&T's $10/mo. per line AutoPay & paperless bill discount." />
            <Link href="/wireless/plans" className="link font-semibold">
              Compare Plan Details
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <article key={p.id} className="card flex flex-col p-6" data-reveal aria-labelledby={`w-${p.id}`}>
                <h3 id={`w-${p.id}`} className="text-lg font-bold text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-ink">
                  <span className="text-3xl font-extrabold">{formatMoney(p.price!.amount)}</span>
                  <span className="text-sm font-semibold text-ink-muted">/mo. per line</span>
                </p>
                <p className="text-sm text-ink-muted">{p.price!.qualifier}</p>
                <BroadbandFacts offer={p} />
                <FinePrint offer={p} />
                <Link href="/wireless/plans" className="link mt-auto pt-4 text-sm font-semibold">
                  {p.title.replace("℠", "")} plan details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="w-promos-title">
        <div className="container-x">
          <SectionHeading eyebrow="Current Offers" id="w-promos-title" title="AT&T Wireless Promotions" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {promos.map((p) => (
              <PromoCard key={p.id} offer={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="w-next-title">
        <div className="container-x">
          <SectionHeading eyebrow="Explore" id="w-next-title" title="More AT&T Wireless Options" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { href: "/wireless/plans", icon: WirelessIcon, t: "Unlimited Plan Comparison", d: "Hotspot data, streaming quality and international features by plan." },
              { href: "/wireless/deals", icon: TagIcon, t: "Smartphone Offers", d: "Current AT&T trade-in offers on new iPhone and Samsung Galaxy models." },
              { href: "/wireless/switch", icon: SwapIcon, t: "Switch to AT&T", d: "Keep your number and review current offers for customers who switch." },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="card group block p-6 transition-colors hover:border-brand-strong" data-reveal>
                <c.icon className="h-8 w-8 text-brand-strong" />
                <p className="mt-4 text-lg font-bold text-ink group-hover:underline">{c.t}</p>
                <p className="mt-1 text-ink-muted">{c.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GuaranteeSection id="w-guarantee-title" items={["wireless", "backup"]} alt />

      <section className="section" aria-labelledby="w-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="AT&T Wireless" id="w-faq-title" title="Frequently Asked Questions" />
          <FaqList items={faqsFor("wireless").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="wireless-band" title="Speak With an AT&T Wireless Specialist" text="Call to compare plans for each line and confirm which current AT&T offers apply to you." offerId={value.id} value={value.price!.amount} />
      <JsonLd data={offersJsonLd(plans, "/wireless")} />
    </>
  );
}
