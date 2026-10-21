// Records a Chrome trace (4x CPU) for a URL and prints the longest main-thread events.
import { chromium } from "@playwright/test";
import fs from "node:fs";
const [url, block = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412, height: 823 } });
if (block) await page.route(new RegExp(block), (r) => r.abort());
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(process.env.CPU || 4) });
await browser.startTracing(page, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "blink", "loading"] });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const buf = await browser.stopTracing();
const { traceEvents } = JSON.parse(buf.toString());
const ev = traceEvents.filter((e) => e.ph === "X" && e.dur > 8000 && /Layout|UpdateLayoutTree|EvaluateScript|FunctionCall|ParseHTML|Paint|v8.compile|RunTask|ParseAuthorStyleSheet|ScheduleStyleRecalculation|HitTest|PrePaint|Layerize|Commit/.test(e.name));
const t0 = traceEvents.find((e) => e.name === "navigationStart")?.ts ?? ev[0]?.ts;
for (const e of ev.sort((a, b) => a.ts - b.ts)) console.log(`${String(Math.round((e.ts - t0) / 1000)).padStart(6)}ms ${String(Math.round(e.dur / 1000)).padStart(5)}ms ${e.name} ${e.args?.data?.url?.split("/").pop()?.slice(0, 40) || ""} ${e.args?.beginData?.dirtyObjects ? "dirty=" + e.args.beginData.dirtyObjects + "/" + e.args.beginData.totalObjects : ""}`);
await browser.close();
