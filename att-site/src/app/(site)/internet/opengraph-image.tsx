import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Home Internet Plans: AT&T Fiber from $50/mo. and AT&T Internet Air at $55/mo., with full terms";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Home Internet Plans", "AT&T Fiber from $50/mo. and AT&T Internet Air at $55/mo., with full terms");
}
