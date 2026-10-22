import type { ReactNode } from "react";
import { RootDocument, rootMetadata, rootViewport } from "@/components/layout/RootDocument";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = rootMetadata;
export const viewport = rootViewport;

/** Spanish pages under /es: same design, Spanish header, footer, call bar and cookie banner. */
export default function SpanishLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument locale="es">
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale="es" />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter locale="es" />
      </div>
    </RootDocument>
  );
}
