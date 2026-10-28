// Serves the local audit build (.next-audit, labelled test values) for tests/order.spec.ts, pointed at the
// SPOC mock. Server output is copied to test-results/order-server.log so the tests can check that no
// personal data is ever logged. Build first: npm run build:audit
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = process.env.ORDER_TEST_PORT || "3200";
const logFile = path.resolve("test-results/order-server.log");
fs.mkdirSync(path.dirname(logFile), { recursive: true });
const log = fs.createWriteStream(logFile, { flags: "w" });
const env = {
  ...process.env,
  ALLOW_TEST_ENV: "1",
  NEXT_PUBLIC_BUILD_LABEL: "AUDIT",
  ATTSPOC_SERVICE_URL: `http://127.0.0.1:${process.env.MOCK_PORT || 4010}`,
  ATTSPOC_SERVICE_KEY: process.env.MOCK_KEY || "test-order-service-key-0123456789abcdef",
  ATTSPOC_QUOTE_TIMEOUT_S: process.env.ATTSPOC_QUOTE_TIMEOUT_S || "12",
  ATTSPOC_HANDOFF_TIMEOUT_S: process.env.ATTSPOC_HANDOFF_TIMEOUT_S || "12",
};
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", PORT], { env, stdio: ["ignore", "pipe", "pipe"] });
for (const stream of [child.stdout, child.stderr]) {
  stream.on("data", (d) => {
    process.stdout.write(d);
    log.write(d);
  });
}
const stop = () => child.kill();
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", (code) => process.exit(code ?? 0));
