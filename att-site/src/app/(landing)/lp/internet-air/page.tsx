import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { LandingTemplate } from "@/components/landing/LandingTemplate";

export const metadata = pageMetadata({
  title: "AT&T Internet Air: $55/mo. 5G Home Internet",
  description: "AT&T Internet Air 5G home internet for $55/mo. with AutoPay & Paperless bill. $0 self-setup and no annual contract. Not available in all areas.",
  path: "/lp/internet-air",
  canonicalPath: "/internet/internet-air",
});

export default function InternetAirLanding() {
  const offer = getOffer("internet-air");
  return (
    <LandingTemplate
      offer={offer}
      path="/lp/internet-air"
      image="airHero"
      eyebrow="AT&T Internet Air · Authorized Retailer"
      title="AT&T Internet Air 5G Home Internet for $55/mo."
      intro="Home internet delivered over the AT&T 5G network. Plug in the included AT&T All-Fi Hub and connect in minutes."
      benefits={[
        "$0 self-setup with the included AT&T All-Fi Hub",
        "No overage fees and no annual contract",
        "Complete Wi-Fi for enhanced coverage, speed, and security",
        "AT&T may temporarily slow data speeds if the network is busy",
      ]}
    />
  );
}
