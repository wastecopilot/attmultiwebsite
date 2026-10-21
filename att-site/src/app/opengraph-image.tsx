import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Fiber, Internet Air and wireless plans from an independent authorized retailer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Fiber, Internet Air & Wireless", "Current AT&T prices with full terms, from an independent authorized retailer");
}
