import { pageMetadata } from "@/lib/seo";
import { offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Home Phone Service from $24.99/mo.",
  description: "AT&T Phone digital home phone service: Unlimited North America at $24.99/mo. for 12 months and International Plus II at $34.99/mo. See AT&T's full terms.",
  path: "/phone",
});

export default function PhonePage() {
  const plans = offersBy("phone");
  return (
    <>
      <PageHeader
        trail={[{ name: "Home Phone", path: "/phone" }]}
        image="homePhoneHero"
        eyebrow="AT&T Phone"
        title="AT&T Home Phone Service"
        intro="AT&T Phone is digital home phone service delivered over an AT&T internet connection. Keep your number and your home phone, with more calling features."
      >
        <CheckList
          className="mt-6 text-ink"
          items={[
            "25+ features including Voicemail, Caller ID, Call Waiting, Call Forwarding, Three-Way Calling, and Call Blocking",
            "Unlimited long-distance in the U.S., Mexico, Canada, and more",
            "Digital Phone Call Protect (requires opt-in and activation)",
            "E911 location detection",
            "Compatible with most alarm, medical monitoring, and teletypewriter devices",
          ]}
        />
      </PageHeader>

      <section className="section" aria-labelledby="phone-plans-title">
        <div className="container-x">
          <SectionHeading eyebrow="Plans and Pricing" id="phone-plans-title" title="AT&T Phone Plans" intro="12-month prices for new residential AT&T Phone customers. AT&T Phone may require an internet connection provided by AT&T for an additional cost." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
            {plans.map((p) => (
              <PlanCard key={p.id} offer={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="phone-power-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow="Important Information" id="phone-power-title" title="Power Outages and 911 Service" />
          <div className="card p-6" data-reveal>
            <p className="text-ink">
              AT&amp;T states that AT&amp;T Phone service is provided over an Internet Protocol connection and powered by electricity in your home. Unless you provide any necessary backup battery
              power, AT&amp;T Phone service, including 911 dialing, will not function during a power outage.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="phone-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="AT&T Phone" id="phone-faq-title" title="Frequently Asked Questions" />
          <FaqList items={faqsFor("phone").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="phone-band" title="Keep Your Home Phone Number" text="Call to review AT&T Phone plans and the AT&T internet service at your address." offerId={plans[0].id} value={plans[0].price!.amount} />
      <JsonLd data={offersJsonLd(plans, "/phone")} />
    </>
  );
}
