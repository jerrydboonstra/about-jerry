// Writes ../og.png and ../favicon.svg. Run: npm run make.
// The card's words come from docs/concepts/card.md, never typed here.
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const root = new URL("../", import.meta.url);
const BG = "#F3F1EB";
const INK = "#2E231C";
const FONT = "Helvetica Neue, Helvetica, Arial, Liberation Sans, DejaVu Sans, sans-serif";

function approvedLines(): { name: string; tagline: string; domain: string } {
  const md = readFileSync(new URL("docs/concepts/card.md", root), "utf8");
  const body = md.split("## Approved text")[1]?.split("## Related")[0] ?? "";
  const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
  const [, name, tagline, domain] = lines; // lines[0] is the instruction sentence
  if (!name || !tagline || !domain) throw new Error("docs/concepts/card.md: approved text not found");
  return { name, tagline, domain };
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cardSvg(): string {
  const { name, tagline, domain } = approvedLines();
  // Break the tagline after its first sentence so both lines fit the card.
  const cut = tagline.indexOf(". ") + 1;
  const parts = cut > 0 ? [tagline.slice(0, cut), tagline.slice(cut + 1)] : [tagline];
  const tspans = parts
    .map((p, i) => `<tspan x="80" dy="${i === 0 ? 0 : 52}">${esc(p)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${BG}"/>
<g font-family="${FONT}" fill="${INK}">
<text x="80" y="250" font-size="84" font-weight="700">${esc(name)}</text>
<text x="80" y="340" font-size="38">${tspans}</text>
<text x="80" y="540" font-size="32">${esc(domain)}</text>
</g>
</svg>
`;
}

// Hand-written favicon: JB in a square, solid background, drawn large so it reads at 16px.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" fill="${INK}"/>
<text x="32" y="45" font-family="${FONT}" font-size="34" font-weight="700" text-anchor="middle" fill="${BG}">JB</text>
</svg>
`;

const png = new Resvg(cardSvg(), {
  fitTo: { mode: "original" },
  font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
}).render().asPng();

writeFileSync(new URL("og.png", root), png);
writeFileSync(new URL("favicon.svg", root), favicon);
console.log(`wrote og.png (${png.length} bytes) and favicon.svg`);
