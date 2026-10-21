// Serves the audit build from .next-audit/ (npm run start:audit [-- -p 3100]).
import { spawnSync } from "node:child_process";
const env = { ...process.env, ALLOW_TEST_ENV: "1", NEXT_PUBLIC_BUILD_LABEL: "AUDIT" };
const r = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "start", ...process.argv.slice(2)], { stdio: "inherit", env });
process.exit(r.status ?? 0);
