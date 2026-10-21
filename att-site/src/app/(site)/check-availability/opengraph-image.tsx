import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Check AT&T Availability: Confirm the AT&T services available at your address";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("Check AT&T Availability", "Confirm the AT&T services available at your address");
}
