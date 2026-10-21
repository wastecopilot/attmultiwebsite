import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Wireless Plans & Deals: Unlimited Your Way plans, switching offers and phone deals";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Wireless Plans & Deals", "Unlimited Your Way plans, switching offers and phone deals");
}
