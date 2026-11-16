---
name: verify-app
description: Check that the About Me page works. Use after any change to index.html, style.css, fonts/ or check/.
---

# Verify the page

Run these from the repo root. You need Node 22.18 or later and `npm ci` done once.

1. `npm run check`. It runs `check:html`, `check:meta` and `check:links` in turn, and each also runs alone.
   A good result: exit 0, with `no HTML errors`, `metadata matches the concepts`, and `0 failed` on the last line of the link check. LinkedIn shows as `skip`.
2. `npx tsc --noEmit`. A good result: no output, exit 0.
3. `npm run shots`, then read the three files it writes in `shots/`:
   - `page-320.png`: phone width. One column, no sideways scroll, text not clipped, body text easy to read.
   - `page-1280.png`: desktop. A centred column of text on a warm paper background, navy headings above red rules, red links.
   - `page.pdf`: the print style. Black ink on white, no background colour, each link's URL printed after its text.

The page sends no script and no request to another host. Its words must match the concepts in `docs/concepts/`; to change them, change the concept first.
