import { defineConfig } from "@playwright/test";

/**
 * Tag tests run against the local audit build (production-optimised, labelled test IDs):
 *   npm run build:audit && npm run test:tags
 * The web server below is started automatically if nothing is listening on port 3100.
 */
const PORT = Number(process.env.AUDIT_PORT || 3100);

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "../audit/tags/test-results.json" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "en-US",
  },
  webServer: {
    command: `node scripts/start-audit.mjs -p ${PORT}`,
    url: `http://localhost:${PORT}/att`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
