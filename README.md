# About Jerry

My About Me page: one static page, `index.html` and `style.css`, served as plain files. Its words come from the concepts in `docs/concepts/`, placed under the headings in `docs/notes/page-outline.md`. `AGENTS.md` has the house rules and the look.

I built it from [`TICKET.md`](TICKET.md) with Fredrin. The preview card and favicon came from a second ticket, [`card/TICKET.md`](card/TICKET.md).

## Check it

You need Node 22.18 or later.

```sh
npm ci
npm run check
```

`npm run check` runs three checks, and each runs alone:

- `npm run check:html` validates `index.html` with html-validate. It must report no errors.
- `npm run check:meta` compares the page's head tags and its JSON-LD block with `docs/concepts/site-meta.md`, `jerry.md` and `contact.md`.
- `npm run check:links` fetches every link on the page. Each must return 200 after redirects. LinkedIn is skipped because it refuses automated requests.

The checks run in GitHub Actions on every push and pull request.

To see the metadata check fail, copy the page, remove a tag and point the check at the copy:

```sh
grep -v 'og:image' index.html > /tmp/broken.html
node check/meta.ts /tmp/broken.html   # prints FAIL og:image and exits 1
```

To see the page, run `npm run shots` and open the PNGs and the PDF in `shots/`.
