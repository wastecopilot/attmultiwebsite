import { SITE_URL, company } from "@/data/site";
import { env } from "@/lib/env";
import type { Offer } from "@/data/offer-types";

type Json = Record<string, unknown>;

/** Renders schema.org JSON-LD. `<` is escaped so content can never close the script element. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.legalName,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon.svg`,
    email: company.email,
    description: `${company.legalName} is an independent authorized retailer of AT&T services. It is not AT&T Inc.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.streetAddress,
      addressLocality: company.locality,
      addressRegion: company.region,
      postalCode: company.postalCode,
      addressCountry: company.country,
    },
    ...(env.phoneTel
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: env.phoneTel,
            contactType: "sales",
            areaServed: "US",
            availableLanguage: "English",
            hoursAvailable: company.openingHours.map((h) => ({ "@type": "OpeningHoursSpecification", ...h })),
          },
        }
      : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Authorized Internet Retailer — AT&T services",
    url: `${SITE_URL}/`,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "/" : t.path}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

/**
 * Product + Offer markup, only for offers with a verified att.com price (src/data/offers.ts).
 * The seller is the retailer; the brand is AT&T. priceValidUntil is omitted because att.com publishes no end date.
 */
export function offersJsonLd(list: Offer[], pagePath: string): Json {
  const priced = list.filter((o) => o.price);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: priced.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: o.title.replace(/[℠™®]/g, ""),
        description: o.headline,
        brand: { "@type": "Brand", name: "AT&T" },
        offers: {
          "@type": "Offer",
          price: o.price!.amount.toFixed(2),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: o.price!.amount.toFixed(2),
            priceCurrency: "USD",
            unitText: o.price!.unit === "/mo. per line" ? "month per line" : "month",
            referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
          },
          availability: "https://schema.org/LimitedAvailability",
          url: `${SITE_URL}${pagePath}`,
          seller: { "@id": ORG_ID },
          validFrom: o.retrievedAt,
        },
      },
    })),
  };
}
