// Checks ../og.png and ../favicon.svg. Run: npm run check.
// It compares format and size only, not pixels: the system font differs between
// a laptop and CI, so the pixels do too.
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const problems: string[] = [];

const pngPath = new URL("og.png", root);
if (!existsSync(pngPath)) {
  problems.push("og.png is missing");
} else {
  const b = readFileSync(pngPath);
  const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (b.length < 24 || !b.subarray(0, 8).equals(magic) || b.toString("ascii", 12, 16) !== "IHDR") {
    problems.push("og.png is not a PNG");
  } else {
    const w = b.readUInt32BE(16);
    const h = b.readUInt32BE(20);
    if (w !== 1200 || h !== 630) problems.push(`og.png is ${w} by ${h}, not 1200 by 630`);
  }
}

const svgPath = new URL("favicon.svg", root);
if (!existsSync(svgPath)) {
  problems.push("favicon.svg is missing");
} else {
  const s = readFileSync(svgPath, "utf8");
  if (!/<svg[^>]*\sviewBox="/.test(s)) problems.push("favicon.svg has no viewBox");
  if (!s.includes(">JB<")) problems.push("favicon.svg does not show JB");
}

if (problems.length > 0) {
  for (const p of problems) console.error(`FAIL ${p}`);
  process.exit(1);
}
console.log("og.png is a 1200 by 630 PNG; favicon.svg has a viewBox and JB");
