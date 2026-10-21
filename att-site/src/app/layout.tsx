import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { rootCss } from "@/styles/tokens";
import { buildTagSnippet, gtagSrc, gtmSrc } from "@/lib/tag-snippet";
import { env } from "@/lib/env";
import { SITE_URL, company, disclosure } from "@/data/site";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { AttributionKeeper } from "@/components/AttributionKeeper";
import { RevealObserver } from "@/components/RevealObserver";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  // metadataBase includes /att so relative canonicals and file-based OG image URLs resolve under the base path.
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "AT&T Fiber, Internet Air & Wireless | Authorized Retailer", template: "%s | Authorized Retailer" },
  description: disclosure.short,
  applicationName: "Authorized Internet Retailer",
  publisher: company.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

const showBuildBadge = env.isDev || env.buildLabel === "AUDIT";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Consent Mode v2 defaults + gtag(), then loads gtag.js/GTM. Must stay the first script we add to <head>. */}
        <script id="consent-and-tags" dangerouslySetInnerHTML={{ __html: buildTagSnippet() }} />
        <style dangerouslySetInnerHTML={{ __html: rootCss() }} />
        {gtagSrc() || gtmSrc() ? <link rel="preconnect" href="https://www.googletagmanager.com" /> : null}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <MobileCallBar />
        <CookieBanner />
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
