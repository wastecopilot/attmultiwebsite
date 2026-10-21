import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Contact Us: Speak with an AT&T sales specialist";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("Contact Us", "Speak with an AT&T sales specialist");
}
