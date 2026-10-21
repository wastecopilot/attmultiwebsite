// Experiment helper (not part of the audit): Lighthouse with the PSI mobile config and optional blocked URL patterns.
// Usage: node scripts/audit/lh-experiment.mjs <url> [pattern ...]
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";
const [url, ...block] = process.argv.slice(2);
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });
const config = (await import("lighthouse/core/config/lr-mobile-config.js")).default;
const { lhr } = await lighthouse(url, { port: chrome.port, logLevel: "error", onlyCategories: ["performance"], blockedUrlPatterns: block }, config);
const a = lhr.audits;
console.log(`P${Math.round(lhr.categories.performance.score * 100)} FCP ${Math.round(a["first-contentful-paint"].numericValue)} LCP ${Math.round(a["largest-contentful-paint"].numericValue)} TBT ${Math.round(a["total-blocking-time"].numericValue)} SI ${Math.round(a["speed-index"].numericValue)} CLS ${a["cumulative-layout-shift"].numericValue.toFixed(3)} BI ${Math.round(lhr.environment.benchmarkIndex)}`);
await chrome.kill();
