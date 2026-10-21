"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  /** Identifies the CTA in the cta_click event, e.g. "hero-check-availability". */
  cta: string;
  offerId?: string;
  value?: number;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "md" | "lg" | "sm";
  className?: string;
}

/** Internal call-to-action link that records a `cta_click` event. */
export function CtaLink({ href, children, cta, offerId, value = 0, variant = "primary", size = "md", className = "" }: CtaLinkProps) {
  const sizeClass = size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "";
  return (
    <Link
      href={href}
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={() => track("cta_click", { offer_id: offerId, value, cta, destination: href })}
    >
      {children}
    </Link>
  );
}
