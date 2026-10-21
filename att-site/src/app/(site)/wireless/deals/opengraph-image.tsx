import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Phone Deals: Trade-in offers on new iPhone and Samsung Galaxy models";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Phone Deals", "Trade-in offers on new iPhone and Samsung Galaxy models");
}
