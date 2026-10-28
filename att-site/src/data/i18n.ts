/**
 * English / Spanish strings for the shared site chrome (header, footer, call bar, cookie banner) and for the
 * short price phrases on plan cards. Prices, plan names and AT&T's conditions and fine print are never
 * translated here: they come from offers.ts, and AT&T's terms stay in English (marked lang="en") because AT&T
 * publishes them in English on the pages they were copied from.
 */
import type { NavLink } from "./nav";
import { company } from "./site";

export type Locale = "en" | "es";

/** English page → Spanish page. Drives the language switch and hreflang alternates. */
export const SPANISH_PAGES: Record<string, string> = {
  "/": "/es",
  "/internet": "/es/internet",
  "/internet/fiber": "/es/internet/fiber",
  "/internet/internet-air": "/es/internet/internet-air",
  "/wireless": "/es/wireless",
  "/phone": "/es/phone",
  "/deals": "/es/deals",
  "/check-availability": "/es/check-availability",
  "/contact": "/es/contact",
};

export const ENGLISH_PAGES: Record<string, string> = Object.fromEntries(Object.entries(SPANISH_PAGES).map(([en, es]) => [es, en]));

/** The matching page in the other language, or that language's home page. */
export function counterpartPath(path: string, to: Locale): string {
  const clean = path.replace(/\/$/, "") || "/";
  return to === "es" ? (SPANISH_PAGES[clean] ?? "/es") : (ENGLISH_PAGES[clean] ?? "/");
}

export const primaryNavEs: NavLink[] = [
  { href: "/es/internet", label: "Internet" },
  { href: "/es/wireless", label: "Inalámbrico" },
  { href: "/es/phone", label: "Teléfono" },
  { href: "/es/deals", label: "Ofertas" },
  { href: "/es/check-availability", label: "Disponibilidad" },
];

export const mobileNavEs: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Internet",
    links: [
      { href: "/es/internet", label: "Internet para el hogar" },
      { href: "/es/internet/fiber", label: "AT&T Fiber" },
      { href: "/es/internet/internet-air", label: "AT&T Internet Air" },
    ],
  },
  {
    heading: "Inalámbrico y teléfono",
    links: [
      { href: "/es/wireless", label: "Planes inalámbricos" },
      { href: "/es/phone", label: "AT&T Phone (teléfono residencial)" },
    ],
  },
  {
    heading: "Más",
    links: [
      { href: "/es/deals", label: "Ofertas actuales" },
      { href: "/es/check-availability", label: "Verificar disponibilidad" },
      { href: "/es/contact", label: "Contacto" },
      { href: "/", label: "English" },
    ],
  },
];

export const footerNavEs: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Internet",
    links: [
      { href: "/es/internet", label: "Internet para el hogar" },
      { href: "/es/internet/fiber", label: "Planes de AT&T Fiber" },
      { href: "/es/internet/internet-air", label: "AT&T Internet Air" },
      { href: "/es/check-availability", label: "Verificar disponibilidad" },
    ],
  },
  {
    heading: "Inalámbrico y teléfono",
    links: [
      { href: "/es/wireless", label: "Planes inalámbricos" },
      { href: "/es/phone", label: "AT&T Phone (teléfono residencial)" },
      { href: "/es/deals", label: "Ofertas actuales" },
    ],
  },
  {
    heading: "Empresa",
    links: [
      { href: "/es/contact", label: "Contacto" },
      { href: "/about", label: "Acerca de nosotros (en inglés)" },
      { href: "/faq", label: "Preguntas frecuentes (en inglés)" },
    ],
  },
];

export const legalNavEs: NavLink[] = [
  { href: "/privacy", label: "Política de privacidad (en inglés)" },
  { href: "/terms", label: "Términos de uso (en inglés)" },
  { href: "/cookie-policy", label: "Política de cookies (en inglés)" },
  { href: "/do-not-sell-or-share", label: "No vender ni compartir mi información personal (en inglés)" },
  { href: "/accessibility", label: "Accesibilidad (en inglés)" },
  { href: "/disclaimer", label: "Aviso legal (en inglés)" },
];

export const ui = {
  en: {
    skip: "Skip to main content",
    callShort: "Call",
    callNow: "Call Now",
    checkAvailability: "Check Availability",
    checkAvailabilityHref: "/check-availability",
    disclosureLink: "Read our disclosure",
    wordmarkSub: "Independent retailer of AT&T services",
    switchLabel: "Español",
    switchLang: "es",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    pricingNote: "Prices and offers are set by AT&T, exclude taxes and fees unless otherwise stated, and are subject to change without notice. Service availability varies by address.",
    contact: "Contact",
    contactHref: "/contact",
    rights: "All rights reserved.",
    hours: company.hoursShort,
  },
  es: {
    skip: "Saltar al contenido principal",
    callShort: "Llamar",
    callNow: "Llamar ahora",
    checkAvailability: "Verificar disponibilidad",
    checkAvailabilityHref: "/es/check-availability",
    disclosureLink: "Lea nuestro aviso",
    wordmarkSub: "Distribuidor independiente de servicios de AT&T",
    switchLabel: "English",
    switchLang: "en",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    pricingNote:
      "Los precios y las ofertas los fija AT&T, no incluyen impuestos ni cargos salvo que se indique lo contrario y pueden cambiar sin previo aviso. La disponibilidad del servicio varía según la dirección.",
    contact: "Contacto",
    contactHref: "/es/contact",
    rights: "Todos los derechos reservados.",
    hours: "Lun–Vie 8 a. m.–9 p. m. ET · Sáb–Dom 9 a. m.–6 p. m. ET",
  },
} as const;

export const disclosureEs = {
  short: "Distribuidor autorizado independiente de servicios de AT&T. Este no es el sitio web oficial de AT&T.",
  full: `${company.legalName} es un distribuidor autorizado independiente de servicios de AT&T y no es AT&T Inc. Este sitio web es operado por ${company.legalName} y no es el sitio web oficial de AT&T.`,
  trademark:
    "AT&T, el logotipo de AT&T, AT&T Fiber, AT&T Internet Air, All-Fi y ActiveArmor son marcas comerciales de AT&T Intellectual Property o de compañías afiliadas de AT&T. Todas las demás marcas pertenecen a sus respectivos propietarios. Su uso en este sitio web no implica respaldo por parte de AT&T.",
};

/** Spanish versions of the short price phrases used in offers.ts (exact English keys). */
export const priceEs: Record<string, string> = {
  "/mo.": "/mes",
  "/mo. per line": "/mes por línea",
  "with AutoPay & Paperless bill": "con AutoPay y factura sin papel",
  "with eligible wireless, AutoPay & Paperless bill": "con servicio inalámbrico elegible, AutoPay y factura sin papel",
  "for 12 mos. with AutoPay & Paperless bill": "por 12 meses con AutoPay y factura sin papel",
  "for 12 mos. with eligible wireless, AutoPay & Paperless bill": "por 12 meses con servicio inalámbrico elegible, AutoPay y factura sin papel",
  "add-on, plus tax": "complemento, más impuestos",
  "for two unlimited lines and home internet": "por dos líneas ilimitadas e internet para el hogar",
  "for 12 mos.": "por 12 meses",
  "when you get 4 lines": "al contratar 4 líneas",
  "plus taxes and fees, before discounts": "más impuestos y cargos, antes de descuentos",
  "With an eligible AT&T wireless plan": "Con un plan inalámbrico elegible de AT&T",
  "Single line": "Una línea",
  "300Mbps speed": "Velocidad de 300 Mbps",
  "500Mbps speed": "Velocidad de 500 Mbps",
  "Up to 1 GIG speed": "Velocidad de hasta 1 GIG",
  "Up to 5 GIG speed": "Velocidad de hasta 5 GIG",
};

/** Translate a short phrase for Spanish pages; anything without a reviewed translation stays in English. */
export const tr = (text: string | undefined, locale: Locale) => (text && locale === "es" ? (priceEs[text] ?? text) : text);

/** Spanish card headlines for the promotions shown on Spanish pages (keyed by offer id). */
export const headlineEs: Record<string, string> = {
  "bundle-55-plus": "Dos líneas inalámbricas ilimitadas e internet para el hogar por $99/mes, exclusivo para clientes de 55 años o más",
  "bundle-fiber-wireless": "Ahorre hasta $420 al año al combinar AT&T Fiber con servicio inalámbrico",
  "wireless-switch-reward-800": "Cámbiese a AT&T y reciba hasta $800 por línea para ayudar a pagar su teléfono",
  "wireless-byod-credit-360": "Traiga su propio smartphone y ahorre hasta $360 por línea",
  "wireless-new-line-5-off": "$5/mes adicionales de descuento durante 12 meses por cada línea nueva, al tener 4 líneas o más",
  "phone-advanced": "Conserve su número y su teléfono residencial con AT&T Phone – Advanced",
};
