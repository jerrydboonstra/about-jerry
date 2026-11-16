# CONTEXT.md

Words this repo uses, and what each means here.

- **Concept**: one file in `docs/concepts/` about one thing (me, a project, a role, how to reach me). The current truth; edited in place.
- **Approved text**: the section of a concept the page uses word for word. Changed only in a reviewed commit to that concept.
- **Page outline**: `docs/notes/page-outline.md`, the page's headings in order and which concept fills each.
- **Decision (ADR)**: one dated file in `docs/adr/` recording a choice and why. Never edited; a reversal is a new record.
- **Ticket**: the Fredrin ticket a part was built from, kept unchanged as `TICKET.md` (the page) or `card/TICKET.md` (the card).
- **Checks**: the TypeScript scripts in `check/`, run in CI on every push: the link check fetches every link on the page, the HTML check validates the markup, and the metadata check compares the page's tags with `site-meta`.
- **Card**: the social preview image `og.png` and the favicon, made by the scripts in `card/`.
