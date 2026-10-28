import { defineConfig } from "@playwright/test";

/**
 * Order flow tests (tests/order.spec.ts) against the local audit build and the SPOC mock:
 *   npm run build:audit && npm run test:order
 * Two projects run every test at 1440 px and 390 px. The mock and the site are started automatically.
 */
const PORT = Number(process.env.ORDER_TEST_PORT || 3200);
const MOCK_PORT = Number(process.env.MOCK_PORT || 4010);

export default defineConfig({
  testDir: "./tests",
  testMatch: "order.spec.ts",
  timeout: 120_000,
  retries: 0,
  workers: 4,
  fullyParallel: true,
  reporter: [["list"], ["json", { outputFile: "test-results/order-results.json" }]],
  use: { baseURL: `http://localhost:${PORT}`, locale: "en-US" },
  projects: [
    { name: "1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "390", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: "node tests/mocks/spoc-mock.mjs", url: `http://127.0.0.1:${MOCK_PORT}/healthz`, reuseExistingServer: false, timeout: 30_000 },
    { command: "node tests/mocks/start-order-server.mjs", url: `http://localhost:${PORT}/att`, reuseExistingServer: false, timeout: 180_000 },
  ],
});
