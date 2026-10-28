// npm run test:order: runs tests/order.spec.ts (both widths), then prints the pass/fail table.
import { spawnSync } from "node:child_process";

const pw = spawnSync(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "-c", "playwright.order.config.ts", ...process.argv.slice(2)], { stdio: "inherit" });
const table = spawnSync(process.execPath, ["tests/mocks/print-results.mjs"], { stdio: "inherit" });
process.exit(pw.status || table.status || 0);
