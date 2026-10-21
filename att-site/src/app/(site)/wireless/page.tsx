import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PromoCard } from "@/components/offers/OfferCard";
import { AsOf, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { CallBand, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { SwapIcon, TagIcon, WirelessIcon } from "@/components/ui/Icons";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Wireless Plans, Deals & Switching Offers",
  description: "AT&T Unlimited Your Way plans from $30/mo. per line with 4 lines, switching offers and phone deals, each with AT&T's full terms and the date verified.",
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
        eyebrow="AT&T Wireless"
        title="AT&T wireless plans and deals"
        intro="AT&T Unlimited Your Way lets you choose a different unlimited plan for each line on one account. Compare the four plans, AT&T's current switching offers and phone deals."
        aside={
          <div className="card card-featured p-6">
            <p className="text-lg font-bold text-ink">AT&amp;T Unlimited Your Way</p>
            <p className="mt-2 text-ink">
              From <span className="text-4xl font-extrabold tracking-tight">{formatMoney(value.price!.amount)}</span>
              <span className="font-semibold text-ink-muted">/mo. per line</span>
            </p>
            <p className="text-sm font-semibold text-ink">{value.title} {value.price!.qualifier}</p>
            <p className="mt-1 text-sm text-ink-muted">{value.conditions.join(" · ")}</p>
            <AsOf offer={value} />
            <FinePrint offer={value} />
            <PhoneLink placement="wireless-header" offerId={value.id} value={value.price!.amount} className="btn btn-primary mt-4 w-full" prefix="Call" />
          </div>
        }
      />

      <section className="section" aria-labelledby="w-plans-title">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Unlimited plans" id="w-plans-title" title="Four plans to mix and match" intro="Prices per line with 4 lines, after AT&T's $10/mo. per line AutoPay & paperless bill discount." />
            <Link href="/wireless/plans" className="link font-semibold">
              Compare plan details
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
                <AsOf offer={p} />
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
          <SectionHeading eyebrow="Current offers" id="w-promos-title" title="AT&T wireless promotions" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {promos.map((p) => (
              <PromoCard key={p.id} offer={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="w-next-title">
        <div className="container-x">
          <SectionHeading eyebrow="Explore" id="w-next-title" title="More about AT&T wireless" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { href: "/wireless/plans", icon: WirelessIcon, t: "Unlimited plans compared", d: "Hotspot data, streaming quality and international features for each plan." },
              { href: "/wireless/deals", icon: TagIcon, t: "Phone deals", d: "AT&T trade-in offers on new iPhone and Samsung Galaxy models." },
              { href: "/wireless/switch", icon: SwapIcon, t: "Switch to AT&T", d: "Keep your number and see AT&T's current offers for customers who switch." },
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

      <section className="section section-alt" aria-labelledby="w-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Questions" id="w-faq-title" title="AT&T wireless FAQ" />
          <FaqList items={faqsFor("wireless").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="wireless-band" title="Compare AT&T wireless plans with a specialist" text="Get help choosing plans for each line and checking which AT&T offers apply to you." offerId={value.id} value={value.price!.amount} />
      <JsonLd data={offersJsonLd(plans, "/wireless")} />
    </>
  );
}
