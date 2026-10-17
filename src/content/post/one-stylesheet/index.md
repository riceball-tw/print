---
isDraft: false
headline: One Stylesheet Is Enough
subHeadline: Restoring browser defaults, then stopping
excerpt: Tailwind's preflight strips the ugly-but-useful defaults. This post puts the important ones back and then stops typing.
category: CSS
publishDate: 2026-02-03
---

## Preflight takes, we give back

Tailwind resets margins, headings, and list styles. That reset is useful when
you are building a design system, and annoying when you are not.

So `global.css` restores the parts that make raw HTML readable:

- heading sizes that step down from `h1` to `h6`
- `1em` margins around paragraphs, lists, and tables
- visible table borders
- the classic link colors

## Then stop

That is the whole file. When you find yourself adding a utility class to make
something "look better", ask whether it already looks fine.
