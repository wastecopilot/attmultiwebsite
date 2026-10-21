import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Contact Us: Call, email or request a call back";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("Contact Us", "Call, email or request a call back");
}
