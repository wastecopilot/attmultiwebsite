import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "About Us: An independent authorized retailer of AT&T services";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("About Us", "An independent authorized retailer of AT&T services");
}
