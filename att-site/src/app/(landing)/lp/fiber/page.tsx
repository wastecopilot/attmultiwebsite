import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { LandingTemplate } from "@/components/landing/LandingTemplate";
import { PromoCard } from "@/components/offers/OfferCard";

export const metadata = pageMetadata({
  title: "AT&T Fiber 1 GIG: $70/mo. for 12 Months",
  description: "AT&T Fiber Internet 1000 for $70/mo. for 12 months with AutoPay & Paperless bill, or $50/mo. with an eligible AT&T wireless plan.",
  path: "/lp/fiber",
  canonicalPath: "/internet/fiber",
});

export default function FiberLanding() {
  const offer = getOffer("fiber-1000");
  return (
    <LandingTemplate
      offer={offer}
      path="/lp/fiber"
      image="fiberHero"
      eyebrow="AT&T Fiber · Authorized Retailer"
      title="AT&T Fiber 1 GIG Internet for $70/mo. for 12 Months"
      intro="Equal upload and download speeds on the AT&T Fiber network, with reduced pricing when combined with an eligible AT&T wireless plan."
      benefits={[
        "Up to 1 GIG speed with equal upload and download speeds",
        "AT&T All-Fi Wi-Fi included, with no data caps and no annual contract",
        "$50/mo. for 12 months with an eligible AT&T unlimited wireless plan",
        "AT&T internet backup included for unlimited wireless customers",
      ]}
      secondary={<PromoCard offer={getOffer("bundle-fiber-wireless")} />}
    />
  );
}
