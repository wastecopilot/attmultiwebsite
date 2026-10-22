import type { ReactNode } from "react";
import { RootDocument, rootMetadata, rootViewport } from "@/components/layout/RootDocument";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = rootMetadata;
export const viewport = rootViewport;

/** Distraction-free landing template for paid traffic: no navigation menu, one offer, one action. */
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument>
      <div className="flex min-h-screen flex-col">
        <SiteHeader minimal />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter minimal />
      </div>
    </RootDocument>
  );
}
