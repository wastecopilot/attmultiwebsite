import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Fiber 1 GIG: $70/mo. for 12 months with AutoPay & Paperless bill";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Fiber 1 GIG", "$70/mo. for 12 months with AutoPay & Paperless bill");
}
