// Milestone 8.5 + 8.6: content verification and color audit.
//  - Re-fetches the att.com pages cited by src/data/offers.ts (one final time) and checks that each
//    displayed price and each fine-print paragraph still appears there (or in the saved dialog evidence).
//  - Compares every color token with att.com's live computed values / stylesheet.
// Usage: node scripts/audit/content-verify.mjs <outDir>
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const out = path.resolve(process.argv[2] || "../audit/content");
fs.mkdirSync(out, { recursive: true });
const require = createRequire(import.meta.url);
const tsx = require.resolve("tsx/esm/api");
const { tsImport } = await import("file://" + tsx.replace(/\\/g, "/"));
const { offers } = await tsImport("../../src/data/offers.ts", import.meta.url);
const { colors } = await tsImport("../../src/styles/tokens.ts", import.meta.url);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const norm = (s) => s.replace(/[    ]/g, " ").replace(/[​-‍﻿]/g, "").replace(/\s+/g, " ").trim();
const money = (n) => (Number.isInteger(n) ? `${n}.00` : n.toFixed(2));

// Saved dialog evidence (dialogs only render on click, so the re-fetch checks page text and the
// fine print is matched against the evidence captured earlier today).
const RAW = path.resolve("../research/raw");
const evidence = [];
for (const dir of ["pages", "offer-details"]) {
  for (const f of fs.readdirSync(path.join(RAW, dir)).filter((x) => x.endsWith(".json") && !x.startsWith("_"))) {
    const j = JSON.parse(fs.readFileSync(path.join(RAW, dir, f), "utf8"));
    evidence.push(norm(j.mainText || ""), ...(j.openedDialogs || []).map((d) => norm(d.text)), ...(j.dialogs || []).filter((d) => d.text).map((d) => norm(d.text)));
  }
}
evidence.push(norm(JSON.parse(fs.readFileSync(path.join(RAW, "with-wireless.json"), "utf8"))[0].text));
const evidenceText = evidence.join("\n");

const browser = await chromium.launch();
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, locale: "en-US" });
const live = {};
const urls = [...new Set(offers.map((o) => o.sourceUrl))];
for (const url of urls) {
  const page = await ctx.newPage();
  const fetchedAt = new Date().toISOString();
  let text = "";
  let status = 0;
  try {
    const r = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    status = r?.status() ?? 0;
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    text = norm(await page.evaluate(() => document.body.innerText));
    // Fiber pages: also read the "With wireless plan" toggle.
    const toggle = page.getByText("With wireless plan", { exact: true }).first();
    if (await toggle.count()) {
      await toggle.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);
      text += "\n" + norm(await page.evaluate(() => document.body.innerText));
    }
  } catch (e) {
    text = "";
  }
  live[url] = { status, fetchedAt, text };
  console.log("fetched", status, url);
  await page.close();
  await new Promise((r) => setTimeout(r, 5000));
}

const rows = [];
for (const o of offers) {
  const L = live[o.sourceUrl];
  const checks = [];
  if (o.price) {
    const p = `$${money(o.price.amount)}`;
    const alt = `${o.price.amount}`;
    const onLive = L.text.includes(p) || L.text.includes(`$${alt}/mo`) || L.text.includes(`$${alt} /mo`) || L.text.includes(`${money(o.price.amount)}/mo`);
    checks.push({ item: `price ${p}${o.price.unit}`, live: onLive });
    if (o.altPrice) checks.push({ item: `with-wireless price $${money(o.altPrice.price.amount)}`, live: L.text.includes(`$${money(o.altPrice.price.amount)}`) || L.text.includes(`${money(o.altPrice.price.amount)}/mo`) });
    if (o.price.was) checks.push({ item: `was price $${money(o.price.was)}`, live: L.text.includes(`$${money(o.price.was)}`) });
  }
  const paras = o.finePrint.split(/\n\s*\n/).map(norm).filter(Boolean);
  const fpLive = paras.filter((p) => L.text.includes(p.replace(/^With wireless plan: /, "")) || L.text.includes(p.slice(0, 120))).length;
  const fpEvidence = paras.filter((p) => evidenceText.includes(p.replace(/^With wireless plan: /, "")) || evidenceText.includes(p.slice(0, 160))).length;
  checks.push({ item: `fine print paragraphs verbatim in att.com evidence (${fpEvidence}/${paras.length})`, live: fpEvidence === paras.length });
  const pass = L.status === 200 && checks.every((c) => c.live);
  rows.push({ id: o.id, title: o.title, price: o.price ? `$${money(o.price.amount)}${o.price.unit}${o.price.qualifier ? " " + o.price.qualifier : ""}` : "—", sourceUrl: o.sourceUrl, retrievedAt: o.retrievedAt, refetchedAt: L.fetchedAt, refetchStatus: L.status, videoRef: o.videoRef ?? "", checks, finePrintParagraphsOnLivePage: `${fpLive}/${paras.length}`, result: pass ? "PASS" : "FAIL" });
}

// ---------------------------------------------------------------- colors
const colorsLive = [];
{
  const page = await ctx.newPage();
  await page.goto("https://www.att.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  const css = await (await ctx.request.get("https://www.att.com/ui/frameworks/css/v2.1.0/core-global-styles-fonts.min.css")).text();
  const computed = await page.evaluate(() => {
    const hex = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b] = m[1].split(",").map((v) => parseInt(v));
      return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
    };
    const set = new Set();
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      for (const v of [cs.color, cs.backgroundColor, cs.borderTopColor]) {
        const h = hex(v);
        if (h) set.add(h);
      }
    }
    return [...set];
  });
  for (const [name, t] of Object.entries(colors)) {
    const inCss = css.toLowerCase().includes(t.hex.toLowerCase());
    const inComputed = computed.includes(t.hex.toUpperCase());
    colorsLive.push({ token: name, hex: t.hex, attName: t.attName, liveComputed: inComputed, liveStylesheet: inCss, result: inComputed || inCss ? "PASS" : "FAIL" });
  }
  await page.close();
}
await browser.close();

fs.writeFileSync(path.join(out, "content-verification.json"), JSON.stringify(rows, null, 2));
fs.writeFileSync(path.join(out, "color-audit.json"), JSON.stringify(colorsLive, null, 2));
for (const r of rows) console.log(`${r.result} ${r.id} ${r.price} ${r.checks.filter((c) => !c.live).map((c) => "missing: " + c.item).join("; ")}`);
for (const c of colorsLive) console.log(`${c.result} color ${c.token} ${c.hex} computed=${c.liveComputed} stylesheet=${c.liveStylesheet}`);
