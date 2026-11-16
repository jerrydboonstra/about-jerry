// Link check: every http and https link on the page must answer 200 after redirects.
// Usage: node check/links.ts [file]   (default: index.html)
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "index.html";
const html = readFileSync(file, "utf8");

// Only the page's own links (<a href>). The canonical, og:url and og:image tags
// name the live address, which does not exist until the host is connected.
const urls = [...new Set(
  [...html.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replaceAll("&amp;", "&")),
)];

// linkedin.com refuses automated requests (it answers 999 whatever the page), so it is skipped.
const skipped = (url: string): boolean => new URL(url).hostname.endsWith("linkedin.com");

async function status(url: string): Promise<number> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "about-jerry-link-check" },
    signal: AbortSignal.timeout(20_000),
  });
  return res.status;
}

let failed = 0;
for (const url of urls) {
  if (skipped(url)) {
    console.log(`skip  ${url}`);
    continue;
  }
  try {
    const code = await status(url);
    console.log(`${code === 200 ? "ok   " : "FAIL "} ${code} ${url}`);
    if (code !== 200) failed++;
  } catch (err) {
    console.log(`FAIL  ${url} (${err instanceof Error ? err.message : String(err)})`);
    failed++;
  }
}

console.log(`${urls.length} links, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
