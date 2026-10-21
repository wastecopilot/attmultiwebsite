import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { LandingTemplate } from "@/components/landing/LandingTemplate";
import { PromoCard } from "@/components/offers/OfferCard";

export const metadata = pageMetadata({
  title: "AT&T Unlimited Plans from $30/mo. per Line",
  description: "AT&T Value 2.0 from $30/mo. per line with 4 lines and AutoPay, plus AT&T Extra, Premium and Elite 2.0. Switching offers available.",
  path: "/lp/wireless",
  canonicalPath: "/wireless/plans",
});

export default function WirelessLanding() {
  const offer = getOffer("wireless-value-2");
  return (
    <LandingTemplate
      offer={offer}
      path="/lp/wireless"
      image="wirelessHero"
      eyebrow="AT&T Wireless · Authorized Retailer"
      title="AT&T Unlimited Plans From $30/mo. per Line"
      intro="Combine AT&T Value 2.0, Extra 2.0, Premium 2.0 and Elite 2.0 on one account. Price shown is per line with 4 lines and AutoPay."
      benefits={[
        "Four plans to mix and match on one account: Value 2.0, Extra 2.0, Premium 2.0 and Elite 2.0",
        "Unlimited talk, text, and data in and between the U.S., Canada, and Mexico",
        "Keep your number when you switch",
        "AT&T ActiveArmor mobile security app",
      ]}
      secondary={<PromoCard offer={getOffer("wireless-switch-reward-800")} />}
    />
  );
}
