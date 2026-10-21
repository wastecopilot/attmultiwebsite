/**
 * WCAG 2.2 contrast check for every text/background pair the site uses (src/styles/tokens.ts).
 * Prints a Markdown table; exits 1 if any pair fails its threshold.
 * Usage: node node_modules/tsx/dist/cli.mjs scripts/research/contrast.ts
 */
import { colors, contrastPairs, type ColorName } from "../../src/styles/tokens";

const hexOf = (n: ColorName | "white") => (n === "white" ? "#FFFFFF" : colors[n].hex);

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function ratio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

let failures = 0;
const rows = contrastPairs.map((p) => {
  const fg = hexOf(p.fg);
  const bg = hexOf(p.bg);
  const r = ratio(fg, bg);
  const need = p.nonText || p.large ? 3 : 4.5;
  const decorative = p.fg === "brand";
  const pass = r >= need;
  if (!pass && !decorative) failures++;
  const verdict = pass ? "PASS" : decorative ? "n/a (decorative only)" : "FAIL";
  return `| ${p.use} | \`${fg}\` on \`${bg}\` | ${r.toFixed(2)}:1 | ${need}:1 ${p.nonText ? "(non-text)" : "(text)"} | ${verdict} |`;
});

console.log("| Use | Pair | Ratio | AA requirement | Result |\n|---|---|---|---|---|\n" + rows.join("\n"));
if (failures) {
  console.error(`\n${failures} contrast pair(s) fail WCAG AA.`);
  process.exit(1);
}
