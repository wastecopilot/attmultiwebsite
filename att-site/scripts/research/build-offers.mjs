// One-time generator for src/data/offers.ts (Milestone 1d).
//
// Every fine-print paragraph is copied programmatically from the saved att.com evidence
// (research/raw/pages/*.json, research/raw/offer-details/*.json, research/raw/with-wireless.json),
// so nothing is retyped by hand. Prices are the figures att.com displays on the cited page.
// After generation, src/data/offers.ts is the maintained source of truth (see HANDOVER.md).
//
// Usage: node scripts/research/build-offers.mjs
import fs from "node:fs";
import path from "node:path";

const RAW = path.resolve("../research/raw");
const load = (p) => JSON.parse(fs.readFileSync(path.join(RAW, p), "utf8"));
const norm = (s) => s.replace(/[\u00a0\u202f\u2009\u2007]/g, " ").replace(/[\u200b\u200c\u200d\ufeff]/g, "").replace(/[ \t]+\n/g, "\n").trim();

const pages = Object.fromEntries(
  fs.readdirSync(path.join(RAW, "pages")).filter((f) => f.endsWith(".json") && !f.startsWith("_")).map((f) => [f.replace(".json", ""), load(`pages/${f}`)]),
);
const details = Object.fromEntries(
  fs.existsSync(path.join(RAW, "offer-details"))
    ? fs.readdirSync(path.join(RAW, "offer-details")).filter((f) => f.endsWith(".json")).map((f) => [f.replace(".json", ""), load(`offer-details/${f}`)])
    : [],
);
const withWireless = load("with-wireless.json");

/** All dialog texts captured for a slug (both passes). */
function dialogs(slug) {
  const a = (pages[slug]?.openedDialogs ?? []).map((d) => d.text);
  const b = (details[slug]?.dialogs ?? []).filter((d) => d.text).map((d) => d.text);
  return [...a, ...b].map(norm);
}

/** Paragraph (blank-line separated) from any dialog of `slug` that starts with `prefix`. */
function para(slug, prefix) {
  for (const t of dialogs(slug)) {
    for (const p of t.split(/\n\s*\n/)) {
      const q = p.trim();
      if (q.startsWith(prefix)) return q;
    }
  }
  throw new Error(`Paragraph "${prefix}" not found in dialogs of ${slug}`);
}

/** Exact sentence/line from a page's visible text that starts with `prefix` (up to `until`, inclusive). */
function line(slug, prefix, until) {
  const t = norm(pages[slug].mainText);
  const i = t.indexOf(prefix);
  if (i < 0) throw new Error(`Text "${prefix}" not found on ${slug}`);
  if (until) {
    const j = t.indexOf(until, i);
    if (j < 0) throw new Error(`End "${until}" not found after "${prefix}" on ${slug}`);
    return t.slice(i, j + until.length).replace(/\s+/g, " ").trim();
  }
  return t.slice(i).split("\n")[0].trim();
}

function wwLine(prefix, until) {
  const t = norm(withWireless[0].text);
  const i = t.indexOf(prefix);
  if (i < 0) throw new Error(`with-wireless: "${prefix}" not found`);
  const j = t.indexOf(until, i);
  return t.slice(i, j + until.length).replace(/\s+/g, " ").trim();
}

const at = (slug) => pages[slug].retrievedAt;
const offers = [];

// ------------------------------------------------------------------ AT&T Fiber
const fiberCard = line("internet-fiber", "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay", "Ltd. avail/areas.");
const fiberCardWireless = wwLine("Price plus taxes and fees after $10/mo. discount w/elig. wrls svc", "Ltd. avail/areas.");
const fiberSpeeds = line("internet-fiber", "Speeds based on wired connection. Actual customer speeds may vary.", "www.att.com/speed101.");
const fiberAutopay = dialogs("internet-fiber")
  .flatMap((t) => t.split(/\n\s*\n/).map((p) => p.trim()))
  .find((p) => p.startsWith("Autopay & Paperless Bill Discount:"));
const fiberUpTo15 = para("internet-fiber", "Up to $15 Off Fiber Offer:");
const fiberWireless = para("internet-fiber", "Internet w/ Wireless Savings Offer:");
const fiberClosing = para("internet-fiber", "Offers may be modified or discontinued");

const fiberTiers = [
  { id: "fiber-300", title: "AT&T Internet 300", speed: "300Mbps speed", was: 60, now: 50, then: null, ww: 35, promo: false, features: ["Game, stream, and video chat with confidence.", "Support your smart home devices."], video: "0:49 (hero card), 0:52 (tier card), 0:86 (terms table)" },
  { id: "fiber-500", title: "AT&T Internet 500", speed: "500Mbps speed", was: 75, now: 60, then: 65, ww: 45, promo: true, features: ["Level up your gaming with low lag.", "Connect and control multiple smart devices with ease."], video: "0:52 (tier card), 0:86 (terms table)" },
  { id: "fiber-1000", title: "AT&T Internet 1000", speed: "Up to 1 GIG speed", was: 90, now: 70, then: 80, ww: 50, promo: true, features: ["The speed to succeed for work and pro-level gaming.", "Unleash the full potential of your smart home ecosystem."], video: "0:52 (tier card, POPULAR), 0:86 (terms table)" },
  { id: "fiber-5000", title: "AT&T Internet 5000", speed: "Up to 5 GIG speed", was: 135, now: 110, then: 125, ww: 85, promo: true, features: ["Experience cutting-edge technologies beyond the internet.", "Supports the latest gadgets with unmatched efficiency.", "Our maximum speed for truly immersive experiences."], video: "0:52 (tier card), 0:86 (terms table)" },
];
for (const t of fiberTiers) {
  // Every tier card also lists the internet backup benefit on att.com.
  t.features.push("AT&T internet backup included for unlimited wireless customers to help you stay connected at no additional cost—if internet goes down, your wireless data steps up.");
  offers.push({
    id: t.id,
    category: "fiber",
    title: t.title,
    headline: `${t.title}: ${t.speed}, ${t.promo ? `$${t.now}/mo. for 12 mos.` : `$${t.now}/mo.`}`,
    price: { amount: t.now, unit: "/mo.", qualifier: t.promo ? "for 12 mos. with AutoPay & Paperless bill" : "with AutoPay & Paperless bill", was: t.was, ...(t.then ? { thenAmount: t.then } : {}) },
    altPrice: { label: "With an eligible AT&T wireless plan", price: { amount: t.ww, unit: "/mo.", qualifier: t.promo ? "for 12 mos. with eligible wireless, AutoPay & Paperless bill" : "with eligible wireless, AutoPay & Paperless bill", was: t.was }, conditions: [fiberCardWireless] },
    conditions: ["Plus taxes & fees", "After $10/mo. AutoPay & Paperless bill discount (within 2 bills)", "Limited availability/areas"],
    finePrint: [fiberCard, `With wireless plan: ${fiberCardWireless}`, t.promo ? fiberUpTo15 : fiberAutopay, fiberWireless, fiberSpeeds, fiberClosing].join("\n\n"),
    features: t.features,
    speed: t.speed,
    sourceUrl: "https://www.att.com/internet/fiber/",
    retrievedAt: at("internet-fiber"),
    expiresAt: null,
    videoRef: t.video,
  });
}

// ------------------------------------------------------------------ AT&T Internet Air
const airCard = line("internet-plans", "Price plus taxes and fees. AutoPay & Paperless bill req’d. Not available in all areas.", "5G coverage not available in all areas.");
offers.push({
  id: "internet-air",
  category: "internet-air",
  title: "AT&T Internet Air",
  headline: "AT&T Internet Air 5G home internet starting at $55/mo.",
  price: { amount: 55, unit: "/mo.", qualifier: "with AutoPay & Paperless bill" },
  conditions: ["Plus taxes & fees", "AutoPay & Paperless bill required", "Not available in all areas"],
  finePrint: [
    airCard,
    para("internet-plans", "AutoPay & Paperless bill discount: $10/mo if enrolled in Autopay w/ your bank account."),
    para("internet-plans", "AT&T Internet Air limitations:"),
    para("internet-plans", "Offers may be modified or discontinued"),
  ].join("\n\n"),
  features: [
    "No overage fees, and no annual contract",
    "Complete Wi-Fi for enhanced coverage, speed, and security",
    "$0 self-startup—plug in your AT&T All-Fi™ Hub and connect in minutes",
  ],
  sourceUrl: "https://www.att.com/internet/internet-service-plans/",
  retrievedAt: at("internet-plans"),
  expiresAt: null,
  videoRef: "0:64–0:67 (standalone card)",
});

// ------------------------------------------------------------------ AT&T All-Fi Pro add-on
offers.push({
  id: "all-fi-pro",
  category: "add-on",
  title: "AT&T All-Fi Pro",
  headline: "Add AT&T All-Fi Pro with Wi-Fi 7 for $25/mo.",
  price: { amount: 25, unit: "/mo.", qualifier: "add-on, plus tax" },
  conditions: ["Plus tax", "Limited availability/areas"],
  finePrint: [
    line("all-fi", "All our fiber plans include All-Fi®. AT&T All-Fi Pro can be added for $25/mo. plus tax"),
    line("all-fi", "Must maintain All-Fi Pro, in good standing, for minimum of 12 months to be eligible for equipment upgrade.", "Limited to one upgrade every 36 months."),
    line("all-fi", "Number of extenders determined at the sole discretion of AT&T."),
    line("all-fi", "Ltd. avail/areas. Speeds based on wired connection", "www.att.com/speed101."),
  ].join("\n\n"),
  features: [
    "Wi-Fi 7 technology",
    "Equipment upgrade program",
    "AT&T ActiveArmor® advanced internet security",
    "AT&T Extended Wi-Fi® Coverage Service",
  ],
  sourceUrl: "https://www.att.com/wi-fi/",
  retrievedAt: at("all-fi"),
  expiresAt: null,
});

// ------------------------------------------------------------------ Fiber + wireless bundle
offers.push({
  id: "bundle-fiber-wireless",
  category: "bundle",
  title: "AT&T Fiber + AT&T Wireless bundle savings",
  headline: "Save up to $420/year when you bundle AT&T Fiber and wireless",
  price: null,
  conditions: ["Discount of $15–$25/mo. on AT&T Fiber with an eligible AT&T unlimited wireless plan", "Limited availability/areas"],
  finePrint: [
    line("bundles", "$420 savings for new customers based on combined discounts of $35/mo.", "Ltd. Avail/areas."),
    para("bundles", "Internet Savings Offer: Subj to change. New residential customers"),
    para("bundles", "Autopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & paperless billing"),
  ].join("\n\n"),
  features: [
    "Get AT&T internet backup included when you have AT&T Fiber® and an AT&T Wireless plan at no extra cost.",
    "Choose the wireless plan option that works best for you and your family.",
    "Wi-Fi personalization that adapts to your in-home Wi-Fi activities, regardless of device.",
  ],
  sourceUrl: "https://www.att.com/bundles/",
  retrievedAt: at("bundles"),
  expiresAt: null,
  videoRef: "0:72–0:75 (bundle section; video headline \"20% off\" not confirmed on att.com)",
});

// ------------------------------------------------------------------ AT&T Phone (home phone)
const stripCopyright = (t) => t.split(/\n\s*\n/).filter((p) => !p.trim().startsWith("©")).join("\n\n");
const phoneDialog = (prefix) => stripCopyright(norm(details["home-phone"].dialogs.find((d) => d.text && d.text.includes(prefix)).text));
offers.push({
  id: "phone-unlimited-north-america",
  category: "phone",
  title: "AT&T Phone Unlimited North America",
  headline: "AT&T Phone Unlimited North America for $24.99/mo. for 12 mos.",
  price: { amount: 24.99, unit: "/mo.", qualifier: "for 12 mos.", thenAmount: 34.99 },
  conditions: ["Plus taxes & fees", "New residential AT&T Phone customers", "Restrictions apply"],
  finePrint: phoneDialog("Unlimited North America Plan: Pricing ($24.99/mo per line; maximum of two)"),
  features: [
    "Unlimited nationwide calling within the U.S. and to Canada, Mexico, Puerto Rico, the U.S. Virgin Islands, Guam, and the Northern Marianas",
    "Calls to other countries at additional cost per-minute",
  ],
  sourceUrl: "https://www.att.com/home-phone/",
  retrievedAt: details["home-phone"].retrievedAt,
  expiresAt: null,
});
offers.push({
  id: "phone-international-plus-ii",
  category: "phone",
  title: "AT&T Phone International Plus II",
  headline: "AT&T Phone International Plus II for $34.99/mo. for 12 mos.",
  price: { amount: 34.99, unit: "/mo.", qualifier: "for 12 mos.", thenAmount: 44.99 },
  conditions: ["Plus taxes & fees", "New residential AT&T Phone customers", "Restrictions apply"],
  finePrint: phoneDialog("International Plus II Plan: Pricing ($34.99/mo)"),
  features: [
    "Unlimited calling to over 50 countries including Canada and Mexico; unlimited nationwide calling within the United States, Puerto Rico, U.S. Virgin Islands, Guam, and the Northern Marianas.",
    "Low international rates to many other countries",
  ],
  sourceUrl: "https://www.att.com/home-phone/",
  retrievedAt: details["home-phone"].retrievedAt,
  expiresAt: null,
});

// ------------------------------------------------------------------ AT&T Unlimited Your Way plans
const wpText = norm(pages["wireless-plans"].mainText);
const legalBlock = (start) => {
  const i = wpText.indexOf(start);
  if (i < 0) throw new Error(`wireless legal "${start}" not found`);
  return wpText.slice(i).split(/\n\s*\n/)[0].trim();
};
const uywAll = legalBlock("ALL PLANS UNLIMITED YOUR WAY:");
const uywFees = legalBlock("ADDITIONAL AT&T FEES & GOVT. TAXES:");
const uywClosing = legalBlock("All offers, programming, promotions, pricing, terms, restrictions & conditions subject to change");
const plans = [
  {
    id: "wireless-elite-2", title: "AT&T Elite 2.0℠", amount: 70, legal: "AT&T ELITE 2.0:",
    features: [
      "Unlimited talk, text, & high-speed data that can’t slow down based on how much you use",
      "AT&T 5G℠ with 4K ultra high definition (UHD) streaming available",
      "Unlimited talk, text & high-speed data in 20 Latin American countries",
      "AT&T ActiveArmor® mobile security",
      "250GB hotspot data per line per month",
      "Includes connectivity for one tablet and watch per phone line at no extra cost",
      "Unlimited international talk, text, and 20GB of data per month to keep you connected in over 210 destinations",
    ],
  },
  {
    id: "wireless-premium-2", title: "AT&T Premium 2.0℠", amount: 50, legal: "AT&T PREMIUM 2.0:", video: "0:68–0:70 (\"$50.00/line/mo\" for 4 lines)",
    features: [
      "Unlimited talk, text, & high-speed data that can’t slow down based on how much you use",
      "AT&T 5G℠ with 4K ultra high definition (UHD) streaming available",
      "Unlimited talk, text & high-speed data in 20 Latin American countries",
      "AT&T ActiveArmor® mobile security",
      "100GB hotspot data per line per month",
      "Get 50% off connectivity for one tablet or watch per phone line",
    ],
  },
  {
    id: "wireless-extra-2", title: "AT&T Extra 2.0℠", amount: 40, legal: "AT&T EXTRA 2.0:", video: "0:68–0:70 (\"$40.00/line/mo\" for 4 lines)",
    features: [
      "Unlimited talk, text, data + 100GB of high-speed data",
      "After 100GB, AT&T may temporarily slow data speeds if the network is busy.",
      "AT&T 5G℠",
      "Unlimited talk, text, and data between the U.S., Canada & Mexico",
      "AT&T ActiveArmor® mobile security",
      "50GB hotspot data per line per month",
    ],
  },
  {
    id: "wireless-value-2", title: "AT&T Value 2.0℠", amount: 30, legal: "AT&T VALUE 2.0:", video: "0:68–0:70 (\"$30.00/line/mo\" for 4 lines)",
    features: [
      "Unlimited talk, text & data + 5GB of high-speed data",
      "After 5GB, AT&T may temporarily slow data speeds if the network is busy.",
      "AT&T 5G℠",
      "Unlimited talk, text, and data between the U.S., Canada & Mexico",
      "AT&T ActiveArmor® mobile security",
      "3GB Hotspot data per line per month",
    ],
  },
];
for (const p of plans) {
  offers.push({
    id: p.id,
    category: "wireless-plan",
    title: p.title,
    headline: `${p.title}: $${p.amount}/mo. per line when you get 4 lines`,
    price: { amount: p.amount, unit: "/mo. per line", qualifier: "when you get 4 lines" },
    conditions: ["Price per line with 4 lines", "After $10/mo. per line AutoPay & paperless bill discount (starts within 2 bills)", "Taxes & fees extra"],
    finePrint: [legalBlock(p.legal), uywAll, uywFees, uywClosing].join("\n\n"),
    features: p.features,
    sourceUrl: "https://www.att.com/plans/unlimited-data-plans/",
    retrievedAt: at("wireless-plans"),
    expiresAt: null,
    ...(p.video ? { videoRef: p.video } : {}),
  });
}

// ------------------------------------------------------------------ wireless promotions
await import("./build-offers-promos.mjs").then((m) => m.default({ offers, pages, details, dialogs, para, line, norm, at }));

// ------------------------------------------------------------------ write
const header = `/**
 * SINGLE SOURCE OF TRUTH for every plan, price and promotion shown on the site.
 *
 * Generated on ${new Date().toISOString()} by scripts/research/build-offers.mjs from the att.com evidence
 * saved in research/raw/ (fine print is copied verbatim, never retyped). Maintain this file by hand from
 * now on: re-check the sourceUrl, update price / finePrint / retrievedAt, and run \`npm run build\`.
 * The production build fails if any offer lacks a sourceUrl or was verified more than
 * OFFER_MAX_AGE_DAYS days ago (scripts/prebuild-check.ts).
 */
import type { Offer, OfferCategory } from "./offer-types";

export const OFFER_MAX_AGE_DAYS = 14;

export const offers: Offer[] = ${JSON.stringify(offers, null, 2)};

export function getOffer(id: string): Offer {
  const o = offers.find((x) => x.id === id);
  if (!o) throw new Error(\`Unknown offer id: \${id}\`);
  return o;
}

export function offersBy(category: OfferCategory): Offer[] {
  return offers.filter((o) => o.category === category);
}

/** Most recent verification date across all offers (shown in the footer). */
export const offersVerifiedAt = offers.map((o) => o.retrievedAt).sort().at(-1) as string;
`;
fs.writeFileSync(path.resolve("src/data/offers.ts"), header);
console.log(`wrote ${offers.length} offers`);
