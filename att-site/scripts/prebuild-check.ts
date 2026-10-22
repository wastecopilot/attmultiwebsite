/**
 * Runs automatically before `npm run build` (npm "prebuild" hook) and before `npm run build:audit`.
 *
 * Fails the build when:
 *   1. the phone number is missing, or any environment variable that is set is malformed or looks like a
 *      placeholder (production builds only; audit builds accept the labelled test values from .env.local), or
 *   2. any offer in src/data/offers.ts has no att.com sourceUrl, was retrieved more than 14 days ago,
 *      or has already expired.
 */
import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { offers, OFFER_MAX_AGE_DAYS } from "../src/data/offers";

const projectDir = path.resolve(__dirname, "..");
const { loadedEnvFiles } = loadEnvConfig(projectDir, false);

const auditMode = process.env.ALLOW_TEST_ENV === "1";
const errors: string[] = [];
const notes: string[] = [];

// ---------------------------------------------------------------- environment
const REQUIRED = ["NEXT_PUBLIC_PHONE_DISPLAY", "NEXT_PUBLIC_PHONE_TEL"] as const;
// Google tag IDs may be left unset until the accounts exist: the site then loads no Google tags and sends
// no conversions. When set, they must be real values in the right format.
const TAG_IDS = ["NEXT_PUBLIC_GTM_ID", "NEXT_PUBLIC_GADS_ID", "NEXT_PUBLIC_GADS_CALL_LABEL"] as const;

const PLACEHOLDER = [
  /x{3,}/i,
  /\b(todo|tbd|placeholder|changeme|example|dummy|sample|lorem|test|dev)\b/i,
  /555-?01\d\d/,
  /0{6,}/,
  /123456/,
  /your[-_ ]/i,
];

const FORMAT: Record<(typeof REQUIRED)[number] | (typeof TAG_IDS)[number], RegExp> = {
  NEXT_PUBLIC_PHONE_DISPLAY: /^\(\d{3}\) \d{3}-\d{4}$/,
  NEXT_PUBLIC_PHONE_TEL: /^\+1\d{10}$/,
  NEXT_PUBLIC_GTM_ID: /^(GTM-[A-Z0-9]{4,}|G-[A-Z0-9]{6,})$/,
  NEXT_PUBLIC_GADS_ID: /^AW-\d{8,12}$/,
  NEXT_PUBLIC_GADS_CALL_LABEL: /^[A-Za-z0-9_-]{6,}$/,
};

const sourceOf = (name: string) =>
  loadedEnvFiles.find((f) => Object.prototype.hasOwnProperty.call(f.contents, name))?.path ?? "process environment";

for (const name of [...REQUIRED, ...TAG_IDS]) {
  const value = (process.env[name] ?? "").trim();
  if (!value) {
    if ((REQUIRED as readonly string[]).includes(name)) {
      errors.push(`${name} is missing. Set it in .env.production (or the hosting provider's environment settings).`);
    } else {
      notes.push(`${name} is not set; the matching Google tracking is off until it is added and the site is rebuilt.`);
    }
    continue;
  }
  const looksPlaceholder = PLACEHOLDER.some((re) => re.test(value)) || (process.env[`${name}_IS_TEST`] ?? "") === "1";
  if (looksPlaceholder && !auditMode) {
    errors.push(`${name}="${value}" looks like a placeholder/test value (from ${sourceOf(name)}). Real values are required for a production build.`);
  } else if (!looksPlaceholder && !FORMAT[name].test(value)) {
    errors.push(`${name}="${value}" has an unexpected format (expected ${FORMAT[name]}).`);
  }
}

const tel = (process.env.NEXT_PUBLIC_PHONE_TEL ?? "").replace(/\D/g, "");
const display = (process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "").replace(/\D/g, "");
if (tel && display && tel !== display && tel !== `1${display}`) {
  errors.push(`NEXT_PUBLIC_PHONE_DISPLAY and NEXT_PUBLIC_PHONE_TEL are different numbers (${display} vs ${tel}).`);
}

// Mirrors siteIndexable in src/lib/seo.ts so the build log shows the indexing state.
const forcedIndexing = process.env.NEXT_PUBLIC_SITE_INDEXABLE;
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "";
if (forcedIndexing === "0" || (forcedIndexing !== "1" && productionUrl.endsWith(".vercel.app"))) {
  notes.push(
    `Search indexing is OFF for this build (production address: ${productionUrl || "n/a"}). It turns on when a custom domain is attached; set NEXT_PUBLIC_SITE_INDEXABLE=1 if the live domain reaches this project through a rewrite.`,
  );
}

if (auditMode) {
  if (process.env.VERCEL || process.env.CI) {
    errors.push("ALLOW_TEST_ENV=1 (audit build) is not permitted on Vercel/CI. Audit builds are for local testing only.");
  }
  notes.push("AUDIT BUILD: test values accepted; output goes to .next-audit and the page shows an 'AUDIT BUILD' badge. Never deploy it.");
}

// ---------------------------------------------------------------- offers
const now = Date.now();
const DAY = 86_400_000;
const ids = new Set<string>();
for (const o of offers) {
  if (ids.has(o.id)) errors.push(`Offer id "${o.id}" is duplicated.`);
  ids.add(o.id);
  if (!o.sourceUrl || !/^https:\/\/(www\.att\.com|about\.att\.com)\//.test(o.sourceUrl)) {
    errors.push(`Offer "${o.id}" has no att.com sourceUrl.`);
  }
  const retrieved = Date.parse(o.retrievedAt);
  if (Number.isNaN(retrieved)) {
    errors.push(`Offer "${o.id}" has an invalid retrievedAt ("${o.retrievedAt}").`);
  } else {
    const ageDays = (now - retrieved) / DAY;
    if (ageDays > OFFER_MAX_AGE_DAYS) {
      errors.push(
        `Offer "${o.id}" was verified ${ageDays.toFixed(1)} days ago (limit ${OFFER_MAX_AGE_DAYS}). Re-check ${o.sourceUrl} and update retrievedAt in src/data/offers.ts.`,
      );
    }
  }
  if (o.expiresAt && Date.parse(o.expiresAt) < now) {
    errors.push(`Offer "${o.id}" expired on ${o.expiresAt}. Remove it or replace it with the current att.com offer.`);
  }
  if (!o.finePrint || o.finePrint.length < 20) errors.push(`Offer "${o.id}" has no fine print.`);
}

// ---------------------------------------------------------------- result
for (const n of notes) console.log(`prebuild-check: ${n}`);
if (errors.length) {
  console.error(`\nprebuild-check FAILED (${errors.length} problem${errors.length > 1 ? "s" : ""}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nSee HANDOVER.md, sections 'Environment settings' and 'Updating offers'.\n");
  process.exit(1);
}
console.log(`prebuild-check passed: ${offers.length} offers verified within ${OFFER_MAX_AGE_DAYS} days; environment OK.`);
