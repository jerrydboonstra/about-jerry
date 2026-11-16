# Build the About Me page

## Description

Build a one-page static site at the repo root, `index.html` and `style.css`, from `docs/notes/page-outline.md`: its headings in order, then the footer, each filled with the named concept's approved text from `docs/concepts/`, word for word. No JavaScript, and no network requests beyond its own fonts and favicon and the links a visitor clicks; `AGENTS.md` has the house rules and the look (jerryboonstra.com's colours, Manrope and DM Mono served from `fonts/`, square corners). Add a small TypeScript link check that runs in CI on every push. Its first run will fail on the page's link to this repo, because the repo is still private: that is expected. When it does, stop and ask me to make the repo public, then re-run CI with no code change. The red run and the green re-run together prove the check works. The acceptance checks below say what done means.

## Outcome

A one-page static site about me at the root of this repository: `index.html` and `style.css`, served as plain files by any static host. The page's text is the approved text of the concepts in `docs/concepts/`, placed under the headings of `docs/notes/page-outline.md`, word for word, in the look `AGENTS.md` describes. A TypeScript link check runs in CI on every push, and it has been seen to fail before it went green.

## Acceptance checks

- The repository root holds `index.html` and `style.css`, and the page renders with no JavaScript sent to the browser.
- The page's visible text is, in order, each heading of `docs/notes/page-outline.md` followed by the named concepts' approved text, word for word: nothing added, nothing dropped, nothing reworded.
- Every sentence on the page appears in some concept's approved text under `docs/concepts/`.
- Every Markdown link in that approved text is an anchor on the page with the same URL, and the email line is a `mailto:` link.
- `<title>` is "Jerry Boonstra", and `<head>` carries `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<link rel="icon" href="/favicon.svg">`, and `og:title` ("Jerry Boonstra"), `og:description` (the `jerry` concept's approved text) and `og:image` (`https://about.jerryboonstra.com/og.png`, absolute, since social crawlers need a full URL) meta tags. The icon and image files are another ticket's; this ticket only references them by those paths.
- `<html lang="en">`, and `<head>` also carries: `<meta name="description">` (the `jerry` concept's approved text), `<link rel="canonical">`, `og:url` and `og:type` ("profile"), `twitter:card` ("summary_large_image") with `twitter:title`, `twitter:description` and `twitter:image`, and `<meta name="theme-color">`, all with the values in the `site-meta` concept.
- `<head>` holds one `<script type="application/ld+json">` block, a schema.org `Person` with name, job title, location, email and `sameAs` links, every value from the `site-meta`, `jerry` and `contact` concepts. It is data, not a script: the page still runs no JavaScript.
- A print style (`@media print`) prints the page as a clean one-pager: ink on white, no background colour, link URLs shown after their text.
- `npm run check` also checks the metadata: each tag above is present with its `site-meta` value, and the JSON-LD block parses as JSON with `@type` "Person". Seen to fail once (a tag removed on a scratch copy) before it is trusted, and the README says how.
- No horizontal scroll at 320px wide, and body text is at least 16px.
- The page makes no network request to any other host: only its own favicon and the woff2 files in `fonts/`, plus the links a visitor clicks. No Google Fonts link, no analytics, no scripts, no images.
- The page uses only the colours, fonts and corner style in `AGENTS.md` under "Look and feel", and ends with a `<footer>` holding the `footer` concept's two lines.
- `fonts/` holds Manrope and DM Mono as woff2 (only the weights the page uses) and their SIL Open Font License text as `fonts/OFL.txt`.
- Link checking and HTML validation are two separate npm scripts, `npm run check:links` and `npm run check:html`, each runnable alone; `npm run check` runs both (and `check:meta`) and exits 0 on the finished branch. The two checks: every `http` and `https` URL in `index.html` returns a final status of 200 after redirects, except `linkedin.com`, skipped with a comment saying why (it refuses automated requests), and an HTML validator reports zero errors on `index.html`.
- The link check is written in TypeScript under `check/`, compiled or run with strict mode on, and `npx tsc --noEmit` passes on it.
- The check runs in GitHub Actions on every push and pull request, and the pull request shows it green.
- The pull request shows a red run of the check that failed only on the repo's own GitHub URL while the repo was private, then a green re-run of the same commit after I made it public, with no code change between them.
- `TICKET.md` at the repository root holds this ticket's text unchanged.
- The page contains no email address other than jerry@jerryboonstra.com, no phone number, no street address, no salary figure and no family member's name.
- `README.md` says in a few lines what the repo is, how to run the check locally, and that the page was built from `TICKET.md` with Fredrin.
- A later Worker can verify the page by loading the `verify-app` skill alone: it names both commands and what a good result looks like.
- `README.md` and the skill describe the finished, public repo: no notes about the repo being private or the host not yet connected.

## Touchpoints

- `index.html`, `style.css`: new, the whole page.
- `check/links.ts`: new, the link check. `check/meta.ts`: new, the metadata check. `check/` may hold a second small file for the HTML validation if that reads better than one file.
- `package.json` (with a `shots` script that runs `bash tools/shots.sh`), `package-lock.json`, `tsconfig.json`: new, at the root. `.gitignore`: add `node_modules/` (it already ignores `shots/`).
- `tools/shots.sh`: exists; use it to see the page (AGENTS.md), don't change it.
- `.claude/skills/verify-app/SKILL.md`: new. A skill that says how to check the page works: run `npm run check`, run `npm run shots` and read `shots/page-320.png`, `shots/page-1280.png` and `shots/page.pdf`, and what each should show.
- `.github/workflows/check.yml`: new, runs `npm ci` and `npm run check`, on `actions/checkout@v5` and `actions/setup-node@v5` (v4 runs on deprecated Node 20 and shows a warning).
- `TICKET.md`, `README.md`: new.
- `fonts/`: new, the two fonts and `OFL.txt`.
- `AGENTS.md`, `CONTEXT.md`, `docs/concepts/`, `docs/adr/`, `docs/notes/`: already on `main`; read them, never edit them in this ticket.

## Constraints

- The TypeScript lives in the check, not the page, so the page stays one file anyone can read and the TypeScript sits where a reviewer reads the diff.
- At most three dev dependencies: `typescript`, an HTML validator, and one runner such as `tsx` if Node's own type stripping is not used.
- Do not touch `favicon.svg`, `og.png` or anything under `card/`; another ticket owns them and runs in parallel.

## Open questions

- None that block the build. The copy, the paths and the checks are settled.
