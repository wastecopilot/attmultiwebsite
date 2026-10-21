import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Questions Answered: Pricing, AutoPay, availability, installation and contracts";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Questions Answered", "Pricing, AutoPay, availability, installation and contracts");
}
