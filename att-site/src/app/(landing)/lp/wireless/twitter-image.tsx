import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Unlimited Plans: From $30/mo. per line with 4 lines and AutoPay";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Unlimited Plans", "From $30/mo. per line with 4 lines and AutoPay");
}
