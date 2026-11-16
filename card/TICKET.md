# Add the preview card, favicon and their check

## Description

Make the two files the page already references: `og.png` (1200 by 630, my name, one line, the domain, plain background) and `favicon.svg` (JB in a square). Generate both from a TypeScript script in `card/` so they can be rebuilt identically, and add a check that fails in CI when the PNG is missing, wrong format or wrong size. The page ticket is running in parallel, so change nothing outside `card/`, the two outputs and `assets.yml`. The acceptance checks below are the spec.

## Outcome

A social preview image and a favicon for the About Me page, generated from a small TypeScript script so they can be regenerated, with a check that proves their size and format in CI. This ticket owns only its own files and runs in parallel with the page ticket; the page already references `/og.png` and `/favicon.svg` by path.

## Acceptance checks

- `og.png` exists at the repository root, is a PNG, and is exactly 1200 by 630 pixels.
- `og.png` shows the approved text of `docs/concepts/card.md`, on a plain background: the text "Jerry Boonstra", below it "Three-time CTO. I put teams of coding agents to work on real codebases.", and below that "jerryboonstra.com", in a system or embedded sans-serif font, with nothing else on the image.
- `favicon.svg` exists at the repository root, is valid SVG with a `viewBox`, and shows the letters "JB" in a square on a solid background, legible at 16 by 16 pixels.
- `card/make-card.ts` writes both files from the text above. Running it twice produces byte-identical output.
- `card/check.ts` exits non-zero if `og.png` is missing, is not a PNG, or is not 1200 by 630, and exits 0 on the generated files.
- `card/` has its own `package.json` and `tsconfig.json`; the scripts are `strict: true` and `npx tsc --noEmit` passes inside `card/`.
- `.github/workflows/assets.yml` runs the card check on every push and pull request, and the pull request shows it green.
- `card/TICKET.md` holds this ticket's text unchanged.
- Nothing outside `card/`, `og.png`, `favicon.svg` and `.github/workflows/assets.yml` is created or changed by this ticket.

## Touchpoints

- `card/make-card.ts`, `card/check.ts`: new.
- `card/package.json`, `card/package-lock.json`, `card/tsconfig.json`, `card/.gitignore`, `card/TICKET.md`: new, separate from any root `package.json`.
- `og.png`, `favicon.svg`: new, at the repository root.
- `.github/workflows/assets.yml`: new, on `actions/checkout@v5` and `actions/setup-node@v5` (v4 runs on deprecated Node 20 and shows a warning), with `permissions: contents: read`.

## Constraints

- One dependency at most for rasterizing the SVG to PNG (a resvg or sharp binding); none for the favicon, which is written by hand as SVG text in the script.
- No root `package.json`, no root `tsconfig.json`, no edit to `index.html`, `README.md` or any workflow but `assets.yml`. The page ticket owns those and is running at the same time.
- Colors: text #2E231C on background #F3F1EB, the page's own pair, so the preview matches the page. No gradients, no logo, no photo.

## Open questions

- None. If the chosen rasterizer cannot embed a font and the system font differs between CI and a laptop, make the check compare dimensions and format only, not pixels, and say so in a comment at the top of `card/check.ts`.
