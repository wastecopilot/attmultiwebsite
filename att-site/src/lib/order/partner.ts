/**
 * The AT&T partner order link (attspoc.com, with Urban Wireless's partner key). When ATTSPOC_PARTNER_URL is set,
 * /att/order sends every visitor straight there and they order on AT&T's partner page themselves. Server-side
 * only (never NEXT_PUBLIC_*), so the link is not in any page's code: it appears only when someone clicks Order Now.
 */
export function partnerOrderUrl(): string | null {
  const raw = (process.env.ATTSPOC_PARTNER_URL ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Only an https link on attspoc.com is followed, so a mistyped setting can never send visitors elsewhere.
    return url.protocol === "https:" && (url.hostname === "attspoc.com" || url.hostname.endsWith(".attspoc.com")) ? url.href : null;
  } catch {
    return null;
  }
}
