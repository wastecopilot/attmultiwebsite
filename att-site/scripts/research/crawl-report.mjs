// Builds the mechanical part of research/att-crawl.md from research/raw/pages/*.json:
// URL, HTTP status, retrieval time, title, and the H1/H2/H3 outline of the page content
// (att.com's global mega-menu and footer headings are excluded).
// Usage: node scripts/research/crawl-report.mjs > ../research/raw/crawl-outline.md
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("../research/raw/pages");
const ORDER = ["home", "internet-hub", "internet-fiber", "internet-air", "internet-plans", "wireless-hub", "wireless-plans", "phone-deals", "switch", "byod", "home-phone", "bundles", "deals", "autopay-discount", "all-fi", "legal", "terms-of-use", "privacy", "privacy-choices", "accessibility", "broadband-details"];
const FOOTER_START = new Set(["Looking for more?", "Shop", "Explore our best wireless options", "More Reasons to love AT&T Fiber internet"]);

for (const slug of ORDER) {
  const f = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(f)) continue;
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  console.log(`### ${slug}\n`);
  console.log(`- URL: ${d.url}${d.finalUrl && d.finalUrl !== d.url ? ` (final: ${d.finalUrl})` : ""}`);
  console.log(`- HTTP status: ${d.status}`);
  console.log(`- Retrieved: ${d.retrievedAt}`);
  console.log(`- Title: ${d.title}`);
  if (d.metaDescription) console.log(`- Meta description: ${d.metaDescription}`);
  const h1Index = d.outline.findIndex((h) => h.tag === "h1");
  const body = [];
  for (const h of d.outline.slice(Math.max(0, h1Index))) {
    if (FOOTER_START.has(h.text) && body.length) break;
    if (!h.visible && h.tag !== "h1") continue;
    body.push(h);
  }
  console.log(`- Heading outline (content area, in document order):`);
  for (const h of body) console.log(`${h.tag === "h1" ? "  - " : h.tag === "h2" ? "    - " : "      - "}${h.tag.toUpperCase()}: ${h.text}`);
  console.log("");
}
