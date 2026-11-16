# The page looks like jerryboonstra.com, with its fonts served from here

Date: 2026-11-14

## Decision

The page takes jerryboonstra.com's look: paper `#F3F1EB` background, ink `#2E231C` text, Blushed Brick `#BC4749` as the one accent, Deep Space Blue `#003049` for headings, square corners, Manrope for text and DM Mono for code and small labels, and the same two-line footer. The CSS is written by hand into one `style.css`; the page has no site generator (chosen over building it with Hugo). Both fonts (SIL Open Font License) are copied into `fonts/` as woff2 files with their licence, and the page loads them from its own address. The page sends no request to any other host.

## Why

The page links to jerryboonstra.com, so the two should read as one person's work. Serving the fonts from here keeps the look without a request to Google Fonts.

## Concepts

- [this-page](../concepts/this-page.md)
