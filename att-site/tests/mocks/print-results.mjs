// Prints the order test results as a pass/fail table (rows: tests, columns: 1440 px / 390 px).
import fs from "node:fs";

const report = JSON.parse(fs.readFileSync(process.argv[2] || "test-results/order-results.json", "utf8"));
const rows = new Map();
const walk = (suite, trail) => {
  for (const s of suite.suites ?? []) walk(s, s.title && !s.title.endsWith(".ts") ? [...trail, s.title] : trail);
  for (const spec of suite.specs ?? []) {
    const name = [...trail, spec.title].join(" › ");
    for (const t of spec.tests) {
      const status = t.results.at(-1)?.status ?? "skipped";
      const cell = t.status === "skipped" || status === "skipped" ? "–" : status === "passed" ? "PASS" : "FAIL";
      rows.set(name, { ...(rows.get(name) ?? {}), [t.projectName]: cell });
    }
  }
};
for (const s of report.suites) walk(s, []);
const width = Math.max(...[...rows.keys()].map((k) => k.length), 10);
const line = (a, b, c) => `| ${a.padEnd(width)} | ${b.padEnd(6)} | ${c.padEnd(6)} |`;
console.log(line("Test", "1440", "390"));
console.log(`|${"-".repeat(width + 2)}|--------|--------|`);
let pass = 0, fail = 0;
for (const [name, r] of rows) {
  console.log(line(name, r["1440"] ?? "–", r["390"] ?? "–"));
  for (const v of Object.values(r)) {
    if (v === "PASS") pass++;
    if (v === "FAIL") fail++;
  }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
