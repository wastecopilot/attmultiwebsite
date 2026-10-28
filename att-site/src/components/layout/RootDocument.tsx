import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { rootCss } from "@/styles/tokens";
import { buildTagSnippet, gtagSrc, gtmSrc } from "@/lib/tag-snippet";
import { env } from "@/lib/env";
import { siteIndexable } from "@/lib/seo";
import { SITE_URL, company, disclosure } from "@/data/site";
import { ui, type Locale } from "@/data/i18n";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { AttributionKeeper } from "@/components/AttributionKeeper";
import { RevealObserver } from "@/components/RevealObserver";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

/** Metadata shared by every root layout ((site), (landing), (es)). */
export const rootMetadata: Metadata = {
  // metadataBase includes /att so relative canonicals and file-based OG image URLs resolve under the base path.
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "AT&T Fiber, Internet Air & Wireless | Authorized Retailer", template: "%s | Authorized Retailer" },
  description: disclosure.short,
  applicationName: "Authorized Internet Retailer",
  publisher: company.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  robots: { index: siteIndexable, follow: true },
};

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

const showBuildBadge = env.isDev || env.buildLabel === "AUDIT";

/**
 * The <html> document for every page. The app has one root layout per route group so the Spanish pages can
 * declare lang="es"; all of them render through this component.
 */
export function RootDocument({ locale = "en", children }: { locale?: Locale; children: ReactNode }) {
  return (
    <html lang={locale === "es" ? "es-US" : "en-US"} className={inter.variable} suppressHydrationWarning>
      {/* Rendered by the root layouts; the rule only recognises <head> inside layout files (next/head is Pages Router). */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Consent Mode v2 defaults + gtag(), then loads gtag.js/GTM. Must stay the first script we add to <head>. */}
        <script id="consent-and-tags" dangerouslySetInnerHTML={{ __html: buildTagSnippet() }} />
        <style dangerouslySetInnerHTML={{ __html: rootCss() }} />
        {gtagSrc() || gtmSrc() ? <link rel="preconnect" href="https://www.googletagmanager.com" /> : null}
      </head>
      <body>
        <a href="#main" className="skip-link">
          {ui[locale].skip}
        </a>
        {children}
        <CookieBanner locale={locale} />
        <AttributionKeeper />
        <RevealObserver />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {showBuildBadge ? (
          <div className="build-badge" aria-hidden="true">
            {env.isDev ? "DEV PREVIEW" : "AUDIT BUILD — NOT FOR DEPLOYMENT"}
          </div>
        ) : null}
      </body>
    </html>
  );
}
