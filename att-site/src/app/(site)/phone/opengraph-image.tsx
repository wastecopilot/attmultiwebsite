import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Phone Home Service: Digital home phone service from $24.99/mo. for 12 months";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Phone Home Service", "Digital home phone service from $24.99/mo. for 12 months");
}
