# AGENTS.md

This repository is my About Me page: one static HTML page built from a small concept wiki, plus TypeScript scripts that check it and make its preview image. `CLAUDE.md` is a symlink to this file. `CONTEXT.md` is the glossary.

## How to run things

- Node 22.18 or later. Every `package.json` (`engines`) and workflow names that same minimum.
- `npm ci`, then `npm run check` at the root: the link check and HTML validation for `index.html`.
- In `card/`: `npm ci`, then the scripts in its `package.json` rebuild `og.png` and `favicon.svg` and check them.
- No dev server. To see the page, run `npm run shots` and read the PNGs; never use a signed-in browser (no Claude in Chrome, no extension). It renders `index.html` with headless Chrome under a throwaway profile into `shots/`: `page-320.png` (phone width), `page-1280.png` (desktop) and `page.pdf` (the print style). `package.json` maps `shots` to `bash tools/shots.sh`.

## Where things live

- `index.html`, `style.css`, `fonts/`: the page, its stylesheet, and its two fonts with their licence.
- `docs/` holds this repo's memory and nothing else:
  - `docs/concepts/`: one file per thing about me (a project, a role, how to reach me). Each holds the approved text the page uses. This is how it is now; edit in place.
  - `docs/adr/`: one file per decision, named by date, never edited. A reversal is a new record that names what it replaces.
  - `docs/notes/page-outline.md`: the page's headings, in order, and which concept fills each.
- `check/`: the page's checks (links, HTML, metadata). `card/`: the preview card and favicon scripts, a separate package.
- `.github/workflows/`: `check.yml` for the page, `assets.yml` for the card.
- `TICKET.md`, `card/TICKET.md`: the ticket each part was built from, unchanged.

## House rules for anything written here

- Every claim on the page comes from a concept's approved text. Never add a fact, figure, date or name that no concept holds; if one is missing, stop and ask.
- Plain English: short words, active voice, no stock phrases. No em dashes in prose.
- Name an AI model with its version at first mention.
- Nothing private: no family, no money, no street address, no phone number. The page shows no email but the one in `contact`.

## Look and feel

The page looks like jerryboonstra.com (decision `2026-11-14-site-design`):

- Colours: background `#F3F1EB`, text `#2E231C`, headings `#003049`, one accent `#BC4749` for links and rules. No other colours.
- Type: Manrope for text, DM Mono for code and small labels, both from `fonts/` with `font-display: swap`. Body text at least 16px.
- Square corners, borders rather than drop shadows, generous whitespace, one column.
- A footer like jerryboonstra.com's: the `footer` concept's two lines side by side in small DM Mono, above a thin border.
- The page sends no request to any other host: no Google Fonts link, no analytics, no scripts.

## Code conventions

- TypeScript with `strict: true`; `npx tsc --noEmit` passes wherever a `tsconfig.json` sits.
- No runtime dependencies. Dev dependencies only where a ticket allows them.
- The page has no framework, site generator, bundler or build step. TypeScript lives in the scripts, never in what the browser loads.
- One stylesheet, light only: no dark mode.
- Commit messages and pull request titles are plain sentences that say what changed, with no `feat:`-style prefixes.
- No CNAME, host config or deploy step. I connect the host after merge.

## Traps

- Never reword a concept's approved text on the page. To change the page's words, change the concept in its own reviewed commit.
- `card/` has its own `package.json` and `tsconfig.json`. Don't merge it into the root ones.
- Tickets run in parallel. Touch only the files your ticket's Touchpoints name.
- If you learn something lasting while building, propose it as a concept edit or a new decision record in separate commits, not mixed into code.
- Never read another process's environment or drive the Fredrin app. If the Fredrin CLI can't reach its API, stop and report it with `ticket error`.
