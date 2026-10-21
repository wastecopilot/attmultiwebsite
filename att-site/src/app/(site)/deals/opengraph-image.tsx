import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Current AT&T Deals: Every AT&T price and promotion, dated and with full terms";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("Current AT&T Deals", "Every AT&T price and promotion, dated and with full terms");
}
