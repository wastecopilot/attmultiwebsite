import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "AT&T Fiber Internet Plans: Internet 300, 500, 1000 and 5000: prices with and without AT&T wireless";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("AT&T Fiber Internet Plans", "Internet 300, 500, 1000 and 5000 — prices with and without AT&T wireless");
}
