"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, currentAttribution, decorateHref } from "@/lib/attribution";

/**
 * Keeps gclid / gbraid / wbraid / utm_* on the URL across internal navigation and (when consent allows)
 * in a 90-day first-party cookie. Renders nothing.
 */
export function AttributionKeeper() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    const onConsent = () => captureAttribution();
    window.addEventListener("att:consent", onConsent);
    // Plain <a> links (non-Next links, e.g. in policy text): add the parameters before navigation.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.href.startsWith("tel:") || a.href.startsWith("mailto:")) return;
      if (Object.keys(currentAttribution()).length) a.href = decorateHref(a.href);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("att:consent", onConsent);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // After each client-side navigation, put the preserved parameters back on the address bar.
  useEffect(() => {
    if (!Object.keys(currentAttribution()).length) return;
    const current = window.location.pathname + window.location.search + window.location.hash;
    const decorated = decorateHref(current);
    if (decorated !== current) window.history.replaceState(window.history.state, "", decorated);
  }, [pathname]);

  return null;
}
