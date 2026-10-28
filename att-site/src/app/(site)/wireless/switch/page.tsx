import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PromoCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";

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
        image="switchHero"
        eyebrow="Switch to AT&T"
        title="Switch to AT&T and Keep Your Number"
        intro="AT&T's switching offers help with the remaining balance on a current phone or provide credits for bringing an unlocked phone. Both require transferring a number to a new AT&T line."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PhoneLink placement="switch-header" offerId={reward.id} className="btn btn-primary btn-lg" label="Call Now" />
          <OrderButton placement="switch-header" offerId={reward.id} planName={reward.title} className="btn btn-secondary btn-lg" />
          <a href="#switch-offers" className="btn btn-ghost btn-lg">
            View Switching Offers
          </a>
        </div>
      </PageHeader>

      <section id="switch-offers" className="section scroll-mt-28" aria-labelledby="switch-offers-title">
        <div className="container-x">
          <SectionHeading eyebrow="Current Offers" id="switch-offers-title" title="Offers for Customers Who Switch" />
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
            eyebrow="Before You Switch"
            id="switch-prepare-title"
            title="Information to Have Ready"
            intro="Having these details available makes it quicker to confirm which AT&T offers apply."
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
              <Link href="/wireless/plans" className="link">Compare AT&amp;T unlimited plans</Link>.
            </p>
          </div>
        </div>
      </section>

      <CallBand placement="switch-band" title="Speak With a Switching Specialist" text="Call to review your lines, current devices and the AT&T switching offers available to you." offerId={reward.id} />
    </>
  );
}
