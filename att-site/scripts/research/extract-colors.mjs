// Milestone 1e / 8.6: extract brand colors from live att.com with getComputedStyle + CSS custom properties.
// Writes a JSON evidence file with every sampled element (selector, property, computed value) and the
// :root custom properties that hold colors.
//
// Usage: node scripts/research/extract-colors.mjs <out.json>
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] || "../research/raw/colors.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const URLS = ["https://www.att.com/", "https://www.att.com/internet/fiber/", "https://www.att.com/plans/unlimited-data-plans/"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sample(page) {
  return page.evaluate(() => {
    const rgbToHex = (c) => {
      const m = c && c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a] = m[1].split(",").map((v) => parseFloat(v.trim()));
      if (a === 0) return "transparent";
      const hex = "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
      return a !== undefined && a < 1 ? `${hex} @ alpha ${a}` : hex;
    };
    const cssPath = (el) => {
      const parts = [];
      let n = el;
      while (n && n.nodeType === 1 && parts.length < 5) {
        let s = n.tagName.toLowerCase();
        if (n.id) {
          s += "#" + n.id;
          parts.unshift(s);
          break;
        }
        const cls = [...n.classList].filter((c) => !/^\d/.test(c)).slice(0, 2);
        if (cls.length) s += "." + cls.join(".");
        parts.unshift(s);
        n = n.parentElement;
      }
      return parts.join(" > ");
    };
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const out = [];
    const take = (role, selector, props, limit = 6) => {
      const els = [...document.querySelectorAll(selector)].filter(visible).slice(0, limit);
      for (const el of els) {
        const cs = getComputedStyle(el);
        const rec = { role, query: selector, selector: cssPath(el), text: (el.innerText || "").trim().slice(0, 60) };
        for (const p of props) rec[p] = rgbToHex(cs[p]) || cs[p];
        rec.fontFamily = cs.fontFamily;
        rec.fontWeight = cs.fontWeight;
        rec.fontSize = cs.fontSize;
        out.push(rec);
      }
    };
    take("body", "body", ["color", "backgroundColor"], 1);
    take("header", "header, [class*='global-nav' i], [id*='header' i]", ["color", "backgroundColor", "borderBottomColor"], 4);
    take("nav-link", "header a, nav a", ["color"], 10);
    take("h1", "h1", ["color"], 3);
    take("h2", "main h2, h2", ["color"], 8);
    take("body-text", "p", ["color"], 10);
    take("link", "p a, [class*='legal' i] a, a[class*='link' i]", ["color", "textDecorationColor"], 12);
    take("button", "a[class*='btn' i], button[class*='btn' i], a[role='button'], [class*='button' i]", ["color", "backgroundColor", "borderTopColor"], 30);
    take("hero", "[class*='hero' i], [class*='banner' i], [class*='bgcolor' i], [class*='theme-' i]", ["color", "backgroundColor"], 12);
    take("card", "[class*='card' i]", ["color", "backgroundColor", "borderTopColor"], 10);
    take("legal", "[class*='legal' i], [class*='disclaimer' i], small", ["color"], 8);
    take("footer", "footer, [id*='footer' i], [class*='footer' i]", ["color", "backgroundColor"], 10);
    take("footer-link", "footer a, [id*='footer' i] a, [class*='footer' i] a", ["color"], 12);
    take("badge", "[class*='badge' i], [class*='flag' i], [class*='eyebrow' i]", ["color", "backgroundColor"], 10);

    // Color-valued CSS custom properties on :root / html / body.
    const vars = {};
    for (const sheet of [...document.styleSheets]) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet
      }
      for (const r of [...rules]) {
        if (!r.style || !/^(:root|html|body)/.test(r.selectorText || "")) continue;
        for (const name of [...r.style]) {
          if (!name.startsWith("--")) continue;
          const v = r.style.getPropertyValue(name).trim();
          if (/^#|^rgb|^hsl/i.test(v)) vars[name] = v;
        }
      }
    }
    const rootCs = getComputedStyle(document.documentElement);
    const computedVars = {};
    for (const name of Object.keys(vars)) computedVars[name] = rootCs.getPropertyValue(name).trim();
    const census = {};
    for (const el of document.querySelectorAll("body *")) {
      if (!visible(el)) continue;
      const cs = getComputedStyle(el);
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const add = (prop, val) => {
        const hex = rgbToHex(val);
        if (!hex || hex === "transparent") return;
        const k = prop + " " + hex;
        census[k] = census[k] || { prop, hex, count: 0, examples: [] };
        census[k].count++;
        if (census[k].examples.length < 3) census[k].examples.push({ selector: cssPath(el), text: (el.innerText || "").trim().slice(0, 40) });
      };
      if (hasText) add("color", cs.color);
      add("background-color", cs.backgroundColor);
      if (parseFloat(cs.borderTopWidth) > 0) add("border-color", cs.borderTopColor);
    }
    return { samples: out, census: Object.values(census).sort((a, b) => b.count - a.count), cssVariables: vars, computedVariables: computedVars };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
  const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, locale: "en-US" });
  const results = [];
  for (const url of URLS) {
    const page = await context.newPage();
    const retrievedAt = new Date().toISOString();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    await sleep(2000);
    const data = await sample(page);
    results.push({ url, retrievedAt, ...data });
    console.log(url, data.samples.length, "samples", Object.keys(data.cssVariables).length, "color vars");
    await page.close();
    await sleep(6000);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
