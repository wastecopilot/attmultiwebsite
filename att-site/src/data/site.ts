/**
 * Retailer identity and site-wide settings.
 *
 * Company details come from the retailer's existing page as shown in the reference recording
 * (reference/att-recording.mp4, footer at 1:39–1:41). They are listed in OPEN_ITEMS.md (O-07) for
 * confirmation. Phone numbers and tag IDs are never hard-coded: they come from environment variables
 * (see src/lib/env.ts and HANDOVER.md).
 */
export const SITE_ORIGIN = "https://authorizedinternetretailer.net";
export const BASE_PATH = "/att";
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const company = {
  // Operator name and address: Urban Wireless (https://urbanwirelessusa.com), owner direction 2026-10-21.
  legalName: "Urban Wireless",
  wordmark: "Authorized Retailer",
  descriptor: "Independent authorized retailer of AT&T services",
  // Address as published on https://urbanwirelessusa.com/disclaimer.
  streetAddress: "84 East Old Country Road",
  locality: "Hicksville",
  region: "NY",
  postalCode: "11801",
  country: "US",
  // Email as published on https://urbanwirelessusa.com/disclaimer.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Backoffice@urbanwirelessusa.com",
  hours: [
    { days: "Monday–Friday", open: "8:00 AM", close: "9:00 PM", tz: "ET" },
    { days: "Saturday–Sunday", open: "9:00 AM", close: "6:00 PM", tz: "ET" },
  ],
  hoursShort: "Mon–Fri 8 AM–9 PM ET · Sat–Sun 9 AM–6 PM ET",
  // schema.org openingHoursSpecification
  openingHours: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "21:00" },
    { dayOfWeek: ["Saturday", "Sunday"], opens: "09:00", closes: "18:00" },
  ],
} as const;

/** Wording required on every page (header strip, footer, /disclaimer). */
export const disclosure = {
  short: `Independent authorized retailer of AT&T services. This is not AT&T's official website.`,
  full: `${company.legalName} is an independent authorized retailer of AT&T services and is not AT&T Inc. This website is operated by ${company.legalName} and is not the official AT&T website.`,
  trademark:
    "AT&T, the AT&T logo, AT&T Fiber, AT&T Internet Air, All-Fi and ActiveArmor are trademarks of AT&T Intellectual Property and/or AT&T affiliated companies. All other marks are the property of their respective owners. Their use on this website does not imply endorsement by AT&T.",
} as const;

/** Policy dates shown on the legal pages. Update when the text changes. */
export const LEGAL_EFFECTIVE_DATE = "October 21, 2026";
