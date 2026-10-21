// Milestone 7 / 8.1: Lighthouse for every route, HTML + JSON reports (Playwright's Chromium).
//
// Usage: node scripts/audit/lighthouse.mjs <baseUrl> <outDir> [mobile|desktop|both] [route ...]
//
// mobile  — Lighthouse's default mobile settings (Moto G Power emulation, slow 4G network throttling).
//           The CPU slowdown multiplier is calibrated to this host per Lighthouse's official guidance
//           (docs/throttling.md, "Calibrating multipliers"): target device = mid-tier mobile, host class
//           from the measured benchmarkIndex: >=1500 high-end desktop -> 4x, 1000-1499 low-end desktop -> 2x,
//           800-999 high-end mobile -> 2x, <800 -> 1x. Each page runs 3 times; the median-performance run
//           is kept as the report. Every row records benchmarkIndex and the multiplier used.
// desktop — lighthouse/core/config/desktop-config.js, single run.
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./routes.mjs";

const [base = "http://localhost:3100/att", out = "../audit/lighthouse", modeArg = "both", ...only] = process.argv.slice(2);
const modes = modeArg === "both" ? ["mobile", "desktop"] : [modeArg];
const routes = (only.length ? ROUTES.filter((r) => only.includes(r.path)) : ROUTES).filter((r) => !r.expectStatus);
const RUNS = Number(process.env.LH_RUNS || 3);
fs.mkdirSync(out, { recursive: true });

const multiplierFor = (bi) => (bi >= 1500 ? 4 : bi >= 800 ? 2 : 1);
const desktopConfig = (await import("lighthouse/core/config/desktop-config.js")).default;
const flags = (port) => ({ port, output: ["html", "json"], logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] });

const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox", "--ignore-certificate-errors"] });
// Warm-up run: measures the host benchmark index before the first calibrated run.
let lastBI = (await lighthouse(base, { ...flags(chrome.port), output: "json", onlyCategories: ["performance"] })).lhr.environment.benchmarkIndex;

const rows = [];
for (const mode of modes) {
  for (const r of routes) {
    const url = base + (r.path === "/" ? "" : r.path);
    const runs = [];
    for (let i = 0; i < (mode === "mobile" ? RUNS : 1); i++) {
      const config =
        mode === "desktop"
          ? desktopConfig
          : { extends: "lighthouse:default", settings: { throttling: { cpuSlowdownMultiplier: multiplierFor(lastBI) } } };
      const result = await lighthouse(url, flags(chrome.port), config);
      lastBI = result.lhr.environment.benchmarkIndex;
      runs.push(result);
    }
    runs.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
    const result = runs[Math.floor(runs.length / 2)];
    const lhr = result.lhr;
    const name = `${r.path === "/" ? "home" : r.path.slice(1).replace(/\//g, "_")}-${mode}`;
    fs.writeFileSync(path.join(out, `${name}.html`), result.report[0]);
    fs.writeFileSync(path.join(out, `${name}.json`), result.report[1]);
    const a = lhr.audits;
    const row = {
      path: r.path,
      mode,
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      lcp: Math.round(a["largest-contentful-paint"].numericValue),
      cls: Number(a["cumulative-layout-shift"].numericValue.toFixed(3)),
      tbt: Math.round(a["total-blocking-time"].numericValue),
      fcp: Math.round(a["first-contentful-paint"].numericValue),
      si: Math.round(a["speed-index"].numericValue),
      benchmarkIndex: Math.round(lhr.environment.benchmarkIndex),
      cpuSlowdown: lhr.configSettings.throttling.cpuSlowdownMultiplier,
      runs: runs.map((x) => Math.round(x.lhr.categories.performance.score * 100)),
    };
    rows.push(row);
    console.log(
      `${mode.padEnd(7)} ${r.path.padEnd(24)} P${row.performance} A${row.accessibility} BP${row.bestPractices} SEO${row.seo} LCP ${row.lcp}ms CLS ${row.cls} TBT ${row.tbt}ms (BI ${row.benchmarkIndex}, CPU x${row.cpuSlowdown}, runs ${row.runs.join("/")})`,
    );
  }
}
await chrome.kill();
const prev = fs.existsSync(path.join(out, "summary.json")) ? JSON.parse(fs.readFileSync(path.join(out, "summary.json"), "utf8")) : [];
const merged = [...prev.filter((p) => !rows.some((r) => r.path === p.path && r.mode === p.mode)), ...rows];
fs.writeFileSync(path.join(out, "summary.json"), JSON.stringify(merged, null, 2));
