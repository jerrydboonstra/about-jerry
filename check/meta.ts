// Metadata check: the page's head tags must carry the values in docs/concepts/site-meta.md,
// jerry.md and contact.md, and the JSON-LD block must parse as a schema.org Person.
// Usage: node check/meta.ts [file]   (default: index.html)
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "index.html";
const html = readFileSync(file, "utf8");
const concept = (name: string): string => readFileSync(`docs/concepts/${name}.md`, "utf8");

// Values from the concepts.
const siteMeta = concept("site-meta");
const bullet = (label: string): string => {
  const m = siteMeta.match(new RegExp(`^- ${label}: \`?([^\`\\n]+)\`?\\s*$`, "m"));
  if (!m) throw new Error(`site-meta has no "${label}" line`);
  return m[1];
};
const address = bullet("Address");
const themeColour = bullet("Theme colour");
const jobTitle = bullet("Job title");
const location = bullet("Location");
const description = concept("jerry").split("## Approved text")[1].split("\n\n")[2].trim();
const email = concept("contact").match(/\(mailto:([^)]+)\)/)?.[1] ?? "";
const profiles = [...concept("contact").matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);

const image = `${address}og.png`;

// Helpers that read the page.
const attr = (tag: string, name: string): string | undefined =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]?.replaceAll("&amp;", "&");
const tags = (name: string): string[] => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map((m) => m[0]);
const meta = (key: "name" | "property", value: string): string | undefined =>
  tags("meta").map((t) => (attr(t, key) === value ? attr(t, "content") : undefined)).find((v) => v !== undefined);
const link = (rel: string): string | undefined =>
  tags("link").map((t) => (attr(t, "rel") === rel ? attr(t, "href") : undefined)).find((v) => v !== undefined);

const problems: string[] = [];
const expect = (what: string, actual: string | undefined, wanted: string) => {
  if (actual !== wanted) problems.push(`${what}: wanted ${JSON.stringify(wanted)}, found ${JSON.stringify(actual)}`);
};

expect("<html lang>", html.match(/<html\b[^>]*\slang="([^"]*)"/)?.[1], "en");
expect("<title>", html.match(/<title>([^<]*)<\/title>/)?.[1], "Jerry Boonstra");
expect("viewport", meta("name", "viewport"), "width=device-width, initial-scale=1");
expect("icon", link("icon"), "/favicon.svg");
expect("canonical", link("canonical"), address);
expect("description", meta("name", "description"), description);
expect("theme-color", meta("name", "theme-color"), themeColour);
expect("og:title", meta("property", "og:title"), "Jerry Boonstra");
expect("og:description", meta("property", "og:description"), description);
expect("og:image", meta("property", "og:image"), image);
expect("og:url", meta("property", "og:url"), address);
expect("og:type", meta("property", "og:type"), "profile");
expect("twitter:card", meta("name", "twitter:card"), "summary_large_image");
expect("twitter:title", meta("name", "twitter:title"), "Jerry Boonstra");
expect("twitter:description", meta("name", "twitter:description"), description);
expect("twitter:image", meta("name", "twitter:image"), image);

// JSON-LD: exactly one block, valid JSON, a Person with values from the concepts.
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
if (blocks.length !== 1) {
  problems.push(`JSON-LD: wanted one block, found ${blocks.length}`);
} else {
  try {
    const data = JSON.parse(blocks[0][1]);
    expect("JSON-LD @type", data["@type"], "Person");
    expect("JSON-LD name", data.name, "Jerry Boonstra");
    expect("JSON-LD jobTitle", data.jobTitle, jobTitle);
    expect("JSON-LD location", data.address?.addressLocality, location);
    expect("JSON-LD email", data.email, `mailto:${email}`);
    expect("JSON-LD sameAs", JSON.stringify(data.sameAs), JSON.stringify(profiles));
  } catch (err) {
    problems.push(`JSON-LD does not parse: ${err instanceof Error ? err.message : String(err)}`);
  }
}

if (problems.length > 0) {
  for (const p of problems) console.log(`FAIL ${p}`);
  process.exit(1);
}
console.log(`${file}: metadata matches the concepts`);
