---
isDraft: false
headline: A Content Collection, Barely
subHeadline: Notes live as markdown, nothing else
excerpt: Posts are markdown files with a little frontmatter. The collection adds a schema, sorts them by date, and calls it done.
category: Astro
publishDate: 2026-03-19
---

## Files, not a CMS

A post is a markdown file in `src/content/post/`. The frontmatter holds the
title, the excerpt, a category, and a date. Everything after the second `---`
is the body.

## A schema, not a framework

The collection's schema checks the frontmatter and fills in defaults. Drafts
are flagged with `isDraft`, which the listing page filters out.

## The whole feature

There is no editor, no preview, no publishing pipeline. You write a file,
save it, and it appears.
