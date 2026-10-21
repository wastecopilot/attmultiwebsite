// Milestone 4 / 8.4: SEO and structured-data audit of every route.
//  - title < 60 chars, meta description < 160 chars, both unique
//  - canonical = https://authorizedinternetretailer.net/att<route>; og:title/description/url/image; twitter card + image
//  - exactly one H1; no skipped heading levels; landmarks (header, nav, main, footer); skip link
//  - images have alt; no generic link text ("click here", "learn more", "read more", "here")
//  - JSON-LD: parses, @context schema.org, every @type and property exists in the schema.org vocabulary,
//    and Google's required properties are present for Organization, WebSite, BreadcrumbList, FAQPage, Product/Offer
// Usage: node scripts/audit/seo-check.mjs <baseUrl> <outDir>
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./routes.mjs";

const [base = "http://localhost:3100/att", out = "../audit/seo"] = process.argv.slice(2);
const SITE = "https://authorizedinternetretailer.net/att";
fs.mkdirSync(out, { recursive: true });

// ---- schema.org vocabulary
const vocabFile = path.resolve(out, "schemaorg-current-https.jsonld");
const vocab = JSON.parse(fs.readFileSync(vocabFile, "utf8"))["@graph"];
const types = new Set();
const props = new Set();
for (const n of vocab) {
  const id = (n["@id"] || "").replace("schema:", "");
  const t = [].concat(n["@type"] || []);
  if (t.includes("rdfs:Class")) types.add(id);
  if (t.includes("rdf:Property")) props.add(id);
}

function validateNode(node, where, errors, isRoot = false) {
  if (Array.isArray(node)) return node.forEach((n, i) => validateNode(n, `${where}[${i}]`, errors));
  if (!node || typeof node !== "object") return;
  if (isRoot && node["@context"] !== "https://schema.org") errors.push(`${where}: @context must be https://schema.org`);
  if (node["@type"] && !types.has(node["@type"])) errors.push(`${where}: unknown @type ${node["@type"]}`);
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("@")) continue;
    if (!props.has(k)) errors.push(`${where}: unknown property ${k}`);
    if (typeof v === "object") validateNode(v, `${where}.${k}`, errors);
  }
}

function required(node, errors, where) {
  const need = (cond, msg) => {
    if (!cond) errors.push(`${where}: ${msg}`);
  };
  switch (node["@type"]) {
    case "Organization":
      need(node.name && node.url, "Organization needs name and url");
      break;
    case "WebSite":
      need(node.name && node.url, "WebSite needs name and url");
      break;
    case "BreadcrumbList":
      need(Array.isArray(node.itemListElement) && node.itemListElement.length >= 2, "BreadcrumbList needs ≥2 items");
      (node.itemListElement || []).forEach((li, i) => need(li.position === i + 1 && li.name && li.item?.startsWith(SITE), `breadcrumb item ${i + 1} needs position, name and an absolute /att item URL`));
      break;
    case "FAQPage":
      need(Array.isArray(node.mainEntity) && node.mainEntity.length > 0, "FAQPage needs mainEntity");
      (node.mainEntity || []).forEach((q, i) => need(q["@type"] === "Question" && q.name && q.acceptedAnswer?.text, `question ${i + 1} needs name and acceptedAnswer.text`));
      break;
    case "ItemList":
      (node.itemListElement || []).forEach((li, i) => {
        const p = li.item;
        need(p?.["@type"] === "Product" && p.name, `item ${i + 1} must be a Product with name`);
        need(p?.offers?.price && p.offers.priceCurrency === "USD", `item ${i + 1} offer needs price and priceCurrency`);
      });
      break;
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const results = [];
for (const r of ROUTES) {
  const url = base + (r.path === "/" ? "" : r.path);
  const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
  const d = await page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({ level: +h.tagName[1], text: h.textContent.trim().slice(0, 80) }));
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      robots: meta('meta[name="robots"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      og: { title: meta('meta[property="og:title"]'), description: meta('meta[property="og:description"]'), url: meta('meta[property="og:url"]'), image: meta('meta[property="og:image"]') },
      twitter: { card: meta('meta[name="twitter:card"]'), image: meta('meta[name="twitter:image"]') },
      headings,
      landmarks: { header: !!document.querySelector("header"), nav: !!document.querySelector("nav"), main: document.querySelectorAll("main").length, footer: !!document.querySelector("footer") },
      skipLink: !!document.querySelector('a.skip-link[href="#main"]'),
      imgsWithoutAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      genericLinks: [...document.querySelectorAll("a")].map((a) => a.textContent.trim().toLowerCase()).filter((t) => ["click here", "here", "learn more", "read more", "more"].includes(t)),
      jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
      lang: document.documentElement.lang,
    };
  });
  const errors = [];
  const status = resp?.status();
  const expect = r.expectStatus ?? 200;
  if (status !== expect) errors.push(`HTTP ${status}, expected ${expect}`);
  if (!d.title || d.title.length >= 60) errors.push(`title length ${d.title?.length} (must be < 60): "${d.title}"`);
  if (!d.description || d.description.length >= 160) errors.push(`description length ${d.description?.length} (must be < 160)`);
  const h1 = d.headings.filter((h) => h.level === 1).length;
  if (h1 !== 1) errors.push(`${h1} H1 elements`);
  for (let i = 1; i < d.headings.length; i++) if (d.headings[i].level > d.headings[i - 1].level + 1) errors.push(`heading skips from h${d.headings[i - 1].level} to h${d.headings[i].level} at "${d.headings[i].text}"`);
  if (d.headings[0]?.level !== 1) errors.push(`first heading is h${d.headings[0]?.level}, not h1`);
  if (!d.landmarks.header || !d.landmarks.nav || d.landmarks.main !== 1 || !d.landmarks.footer) errors.push(`landmarks ${JSON.stringify(d.landmarks)}`);
  if (!d.skipLink) errors.push("no skip link");
  if (d.lang !== "en-US") errors.push(`html lang=${d.lang}`);
  if (d.imgsWithoutAlt) errors.push(`${d.imgsWithoutAlt} img without alt`);
  if (d.genericLinks.length) errors.push(`generic link text: ${d.genericLinks.join(", ")}`);
  if (expect === 200) {
    const LP_CANONICAL = { "/lp/fiber": "/internet/fiber", "/lp/internet-air": "/internet/internet-air", "/lp/wireless": "/wireless/plans" };
    const want = SITE + (r.path === "/" ? "/" : LP_CANONICAL[r.path] ?? r.path);
    if (d.canonical !== want) errors.push(`canonical ${d.canonical} ≠ ${want}`);
    if (d.og.url !== want) errors.push(`og:url ${d.og.url} ≠ ${want}`); // og:url follows the canonical
    if (!d.og.title || !d.og.description) errors.push("missing og:title/description");
    if (!d.og.image?.startsWith(SITE + "/")) errors.push(`og:image not under /att: ${d.og.image}`);
    if (d.twitter.card !== "summary_large_image" || !d.twitter.image?.startsWith(SITE + "/")) errors.push(`twitter card/image: ${d.twitter.card} ${d.twitter.image}`);
    if (/noindex/.test(d.robots || "")) errors.push(`robots meta "${d.robots}"`);
  }
  // JSON-LD
  const ldTypes = [];
  for (const [i, raw] of d.jsonld.entries()) {
    let node;
    try {
      node = JSON.parse(raw);
    } catch (e) {
      errors.push(`JSON-LD #${i} does not parse: ${e.message}`);
      continue;
    }
    ldTypes.push(node["@type"]);
    validateNode(node, `jsonld#${i}`, errors, true);
    required(node, errors, `jsonld#${i}(${node["@type"]})`);
  }
  for (const t of ["Organization", "WebSite"]) if (!ldTypes.includes(t)) errors.push(`missing ${t} JSON-LD`);
  const inner = r.path !== "/" && !r.path.startsWith("/lp/") && expect === 200;
  if (inner && !ldTypes.includes("BreadcrumbList")) errors.push("missing BreadcrumbList JSON-LD");
  if (r.path === "/faq" && !ldTypes.includes("FAQPage")) errors.push("missing FAQPage JSON-LD");
  if (r.path !== "/faq" && ldTypes.includes("FAQPage")) errors.push("FAQPage JSON-LD outside /faq");
  results.push({ path: r.path, status, title: d.title, titleLength: d.title.length, description: d.description, descriptionLength: d.description?.length ?? 0, canonical: d.canonical, ogImage: d.og.image, h1, headings: d.headings.length, jsonld: ldTypes, errors });
  console.log(`${errors.length ? "FAIL" : "PASS"} ${r.path} ${errors.length ? errors.join(" | ") : ""}`);
}
await browser.close();

// uniqueness
const dup = (key) => {
  const seen = new Map();
  for (const r of results.filter((x) => x.status === 200)) {
    const v = r[key];
    if (seen.has(v)) {
      r.errors.push(`duplicate ${key} with ${seen.get(v)}`);
      console.log(`FAIL ${r.path} duplicate ${key} with ${seen.get(v)}`);
    } else seen.set(v, r.path);
  }
};
dup("title");
dup("description");

fs.writeFileSync(path.join(out, "seo-report.json"), JSON.stringify(results, null, 2));
const md = [
  "| Route | Status | Title (chars) | Description (chars) | H1 | JSON-LD types | Result |",
  "|---|---|---|---|---|---|---|",
  ...results.map((r) => `| \`${r.path}\` | ${r.status} | ${r.title.replace(/\|/g, "\\|")} (${r.titleLength}) | ${r.descriptionLength} | ${r.h1} | ${r.jsonld.join(", ")} | ${r.errors.length ? "FAIL: " + r.errors.join("; ").replace(/\|/g, "\\|") : "PASS"} |`),
].join("\n");
fs.writeFileSync(path.join(out, "seo-report.md"), md + "\n");
const failed = results.filter((r) => r.errors.length).length;
console.log(`\n${results.length - failed}/${results.length} routes pass`);
process.exit(failed ? 1 : 0);
