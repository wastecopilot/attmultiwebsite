import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Unlimited Plans Compared: Elite 2.0, Premium 2.0, Extra 2.0 and Value 2.0";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Unlimited Plans Compared", "Elite 2.0, Premium 2.0, Extra 2.0 and Value 2.0");
}
