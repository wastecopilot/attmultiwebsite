// Local audit build: production-optimised output using the labelled TEST values in .env.local.
// Output goes to .next-audit/ and every page shows "AUDIT BUILD — NOT FOR DEPLOYMENT".
// Refused on Vercel/CI (see scripts/prebuild-check.ts). Usage: npm run build:audit
import { spawnSync } from "node:child_process";

const env = { ...process.env, ALLOW_TEST_ENV: "1", NEXT_PUBLIC_BUILD_LABEL: "AUDIT" };
const run = (args) => {
  const r = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
run(["node_modules/tsx/dist/cli.mjs", "scripts/prebuild-check.ts"]);
run(["node_modules/next/dist/bin/next", "build"]);
