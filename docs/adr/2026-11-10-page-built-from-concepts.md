# Build the page from a concept wiki

Date: 2026-11-10

## Decision

The page's words live in `docs/concepts/`, one small file per thing about me, and `docs/notes/page-outline.md` says which concept fills each heading. The page is assembled from them word for word. This replaces the earlier plan of a single copy file that the ticket pasted onto the page.

## Why

It is how I would set up any repo that agents work in: the knowledge lives in small files that a Worker reads before it starts and can propose changes to, and the page is one thing built from it. A change to my story is then one reviewed edit to one concept.

## Concepts

- [this-page](../concepts/this-page.md)
