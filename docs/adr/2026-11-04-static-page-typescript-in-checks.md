# A static page, with TypeScript only in the checks

Date: 2026-11-04

## Decision

The page is plain `index.html` and `style.css`: no framework, site generator, bundler or build step. TypeScript is used for the scripts around it (the link check, the preview card) and never in what the browser loads.

## Why

A one-page site needs no framework, and a page anyone can read as one file is easier to review. The TypeScript sits where a reviewer reads the diff and where it proves something: that the links work and the images are the right size.

## Concepts

- [this-page](../concepts/this-page.md)
