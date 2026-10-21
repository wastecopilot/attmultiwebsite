import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Internet Air: 5G home internet for $55/mo.";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogImage("AT&T Internet Air", "5G home internet for $55/mo.");
}
