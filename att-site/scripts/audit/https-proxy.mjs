// Local HTTPS front for the audit build so Lighthouse measures the site over HTTPS, as in production.
// Usage: node scripts/audit/https-proxy.mjs <certDir> [listenPort=3443] [targetPort=3100]
// The certificate is a throwaway self-signed one (Chrome is started with --ignore-certificate-errors).
import https from "node:https";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const [certDir, listen = "3443", target = "3100"] = process.argv.slice(2);
const server = https.createServer({ key: fs.readFileSync(path.join(certDir, "key.pem")), cert: fs.readFileSync(path.join(certDir, "cert.pem")) }, (req, res) => {
  const up = http.request({ host: "localhost", port: Number(target), path: req.url, method: req.method, headers: { ...req.headers, host: `localhost:${target}`, "x-forwarded-proto": "https" } }, (r) => {
    res.writeHead(r.statusCode ?? 502, r.headers);
    r.pipe(res);
  });
  up.on("error", () => {
    res.writeHead(502);
    res.end();
  });
  req.pipe(up);
});
server.listen(Number(listen), () => console.log(`https proxy https://localhost:${listen} -> http://localhost:${target}`));
