// Milestone 8.3 + 8.7: link check (internal + external) and forbidden-text scan of the rendered pages.
// Usage: node scripts/audit/site-checks.mjs <baseUrl> <outDir>
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./routes.mjs";

const [base = "http://localhost:3100/att", out = "../audit"] = process.argv.slice(2);
const origin = new URL(base).origin;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

const pages = [];
for (const r of ROUTES) {
  const res = await fetch(base + (r.path === "/" ? "" : r.path));
  pages.push({ path: r.path, status: res.status, html: await res.text(), expect: r.expectStatus ?? 200 });
}

// ---------------------------------------------------------------- links
const links = new Map(); // href -> Set(pages)
for (const p of pages) {
  for (const m of p.html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(tel:|mailto:|#)/.test(href)) continue;
    const abs = new URL(href, origin + "/att/").href;
    if (!links.has(abs)) links.set(abs, new Set());
    links.get(abs).add(p.path);
  }
}
const linkRows = [];
for (const [url, from] of links) {
  let status = 0;
  let note = "";
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", headers: { "User-Agent": UA, Accept: "text/html" }, signal: AbortSignal.timeout(30000) });
    status = res.status;
    if (res.redirected) note = `redirected to ${res.url}`;
  } catch (e) {
    note = String(e).slice(0, 80);
  }
  const internal = url.startsWith(origin);
  const ok = status >= 200 && status < 400;
  linkRows.push({ url, internal, status, ok, note, from: [...from].slice(0, 5) });
  if (!internal) await new Promise((r) => setTimeout(r, 1500)); // polite to att.com
}
const broken = linkRows.filter((l) => !l.ok);
fs.mkdirSync(path.join(out, "links"), { recursive: true });
fs.writeFileSync(path.join(out, "links", "link-check.json"), JSON.stringify(linkRows, null, 2));
fs.writeFileSync(
  path.join(out, "links", "link-check.md"),
  ["| URL | Type | Status | Result | Linked from |", "|---|---|---|---|---|", ...linkRows.map((l) => `| ${l.url} | ${l.internal ? "internal" : "external"} | ${l.status} ${l.note} | ${l.ok ? "PASS" : "FAIL"} | ${l.from.join(", ")} |`)].join("\n") + "\n",
);
console.log(`links: ${linkRows.length} unique (${linkRows.filter((l) => l.internal).length} internal, ${linkRows.filter((l) => !l.internal).length} external), broken ${broken.length}`);
for (const b of broken) console.log("  BROKEN", b.status, b.url, b.note, b.from.join(","));

// ---------------------------------------------------------------- forbidden text (visible text only)
const visible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
const RULES = [
  { id: "placeholder", re: /\bX{3,}\b|\bTODO\b|\bTBD\b|lorem ipsum|placeholder|\bFIXME\b|\(555\)/i, why: "placeholder text (the labelled dev phone number is reported under dev-values)" },
  { id: "dev-values", re: /DEV-TEST|G-DEV0|AW-0000000000|202\) 555-0147/, why: "development test values (allowed only in dev/audit builds, reported for awareness)" },
  { id: "contact-att", re: /contact AT&T|call AT&T|reach AT&T|AT&T directly|1-800-288-2020|800\.331\.0500/i, why: "telling customers to contact AT&T" },
  { id: "order-mechanics", re: /places? (the |your )?orders?|place your order with|submit(s|ted)? (the |your )?order|order (is|will be) (placed|submitted)|we (will )?order|AT&T installs and bills|order steps/i, why: "describing order-placement mechanics" },
  { id: "informal", re: /\b(gonna|wanna|awesome|super easy|no-brainer|hey there|yay|cool deal|kinda|stuff)\b|!{2,}/i, why: "informal phrasing" },
];
const textRows = [];
for (const p of pages) {
  const t = visible(p.html);
  for (const rule of RULES) {
    const m = t.match(new RegExp(rule.re.source, rule.re.flags.includes("g") ? rule.re.flags : rule.re.flags + "g"));
    if (m) textRows.push({ page: p.path, rule: rule.id, why: rule.why, matches: [...new Set(m)].slice(0, 5) });
  }
}
fs.mkdirSync(path.join(out, "text-scan"), { recursive: true });
fs.writeFileSync(path.join(out, "text-scan", "forbidden-text.json"), JSON.stringify(textRows, null, 2));
const blocking = textRows.filter((r) => r.rule !== "dev-values");
console.log(`forbidden text: ${blocking.length} blocking findings, ${textRows.length - blocking.length} dev-value findings (expected in the audit build)`);
for (const r of textRows) console.log(`  ${r.rule === "dev-values" ? "info" : "FAIL"} ${r.page} [${r.rule}] ${r.matches.join(" | ")}`);
process.exit(broken.length || blocking.length ? 1 : 0);
