import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Switch to AT&T: Keep your number: current AT&T switching offers";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("Switch to AT&T", "Keep your number — current AT&T switching offers");
}
