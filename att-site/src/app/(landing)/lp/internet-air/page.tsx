import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { LandingTemplate } from "@/components/landing/LandingTemplate";

export const metadata = pageMetadata({
  title: "AT&T Internet Air 5G Home Internet: $55/mo.",
  description: "AT&T Internet Air 5G home internet for $55/mo. with AutoPay & Paperless bill. $0 self-setup, no annual contract. Not available in all areas. Full terms shown.",
  path: "/lp/internet-air",
  noindex: true,
});

export default function InternetAirLanding() {
  const offer = getOffer("internet-air");
  return (
    <LandingTemplate
      offer={offer}
      path="/lp/internet-air"
      eyebrow="AT&T Internet Air · Independent authorized retailer"
      title="AT&T Internet Air 5G home internet for $55/mo."
      intro="Home internet delivered over AT&T's 5G wireless network. Plug in the included AT&T All-Fi Hub and connect in minutes."
      interest="AT&T Internet Air"
      benefits={[
        "$0 self-setup with the included AT&T All-Fi Hub",
        "No overage fees and no annual contract",
        "Complete Wi-Fi for enhanced coverage, speed, and security",
        "AT&T may temporarily slow data speeds if the network is busy",
      ]}
    />
  );
}
