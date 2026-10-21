import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PromoCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { LeadForm } from "@/components/forms/LeadForm";
import { PhoneLink } from "@/components/PhoneLink";

export const metadata = pageMetadata({
  title: "Switch to AT&T: Up to $800 per Line, Keep Your Number",
  description: "Switch to AT&T and keep your number. Current AT&T offers: up to $800 per line via reward card, or up to $360 in credits when you bring your own phone.",
  path: "/wireless/switch",
});

export default function SwitchPage() {
  const reward = getOffer("wireless-switch-reward-800");
  const byod = getOffer("wireless-byod-credit-360");
  const newLine = getOffer("wireless-new-line-5-off");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Wireless", path: "/wireless" },
          { name: "Switch to AT&T", path: "/wireless/switch" },
        ]}
        eyebrow="Switch to AT&T"
        title="Switch to AT&T and keep your number"
        intro="AT&T's switching offers help with the balance left on your current phone or reward you for bringing your own unlocked phone. Both require transferring your number to a new AT&T line."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PhoneLink placement="switch-header" offerId={reward.id} className="btn btn-primary btn-lg" prefix="Call" />
          <a href="#switch-offers" className="btn btn-secondary btn-lg">
            See switching offers
          </a>
        </div>
      </PageHeader>

      <section id="switch-offers" className="section scroll-mt-28" aria-labelledby="switch-offers-title">
        <div className="container-x">
          <SectionHeading eyebrow="Current offers" id="switch-offers-title" title="AT&T offers for customers who switch" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PromoCard offer={reward} />
            <PromoCard offer={byod} />
            <PromoCard offer={newLine} />
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="switch-prepare-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Before you switch"
            id="switch-prepare-title"
            title="What to have ready"
            intro="Having these details to hand makes it quicker to confirm which AT&T offers apply to you."
          />
          <div className="card p-6" data-reveal>
            <CheckList
              className="text-ink"
              items={[
                "The phone numbers you want to keep, and the account details from your current carrier",
                "Your most recent bill, if you have a phone payoff balance or early termination fee",
                "Whether each phone is unlocked and compatible, if you plan to bring your own",
                "How many lines you need and which AT&T plan suits each line",
              ]}
            />
            <p className="mt-5 text-sm text-ink-muted">
              Compare the plans first: <Link href="/wireless/plans" className="link">AT&amp;T unlimited plans</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="switch-lead-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <SectionHeading eyebrow="Call back" id="switch-lead-title" title="Ask a specialist about switching" intro="Leave your details and a specialist will explain which AT&T switching offers apply to your lines." />
          <LeadForm offerId={reward.id} defaultInterest="AT&T Wireless" headingLevel="h3" />
        </div>
      </section>

      <CallBand placement="switch-band" title="Thinking about switching to AT&T?" text="A specialist can review your lines, your current phones and AT&T's switching offers with you." offerId={reward.id} />
    </>
  );
}
