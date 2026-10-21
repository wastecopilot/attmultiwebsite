import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { LandingTemplate } from "@/components/landing/LandingTemplate";
import { PromoCard } from "@/components/offers/OfferCard";

export const metadata = pageMetadata({
  title: "AT&T Fiber 1 GIG: $70/mo. for 12 Months",
  description: "AT&T Fiber Internet 1000 for $70/mo. for 12 months with AutoPay & Paperless bill, or $50/mo. with an eligible AT&T wireless plan. Full AT&T terms shown.",
  path: "/lp/fiber",
  noindex: true,
});

export default function FiberLanding() {
  const offer = getOffer("fiber-1000");
  return (
    <LandingTemplate
      offer={offer}
      path="/lp/fiber"
      eyebrow="AT&T Fiber · Independent authorized retailer"
      title="AT&T Fiber 1 GIG internet for $70/mo. for 12 months"
      intro="Equal upload and download speeds over AT&T's fiber network, with a lower price when you add an eligible AT&T wireless plan."
      interest="AT&T Fiber"
      benefits={[
        "Up to 1 GIG speed with equal upload and download speeds",
        "AT&T All-Fi Wi-Fi included; no data caps and no annual contract, per AT&T",
        "$50/mo. for 12 months with an eligible AT&T unlimited wireless plan",
        "AT&T internet backup included for unlimited wireless customers",
      ]}
      secondary={<PromoCard offer={getOffer("bundle-fiber-wireless")} />}
    />
  );
}
