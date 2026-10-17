---
name: feature-tests
description: Use whenever you add or change a feature. Requires every feature to ship with a Playwright browser test AND a Vitest unit test that verify the behavior, and both suites must pass before the work is done. Covers Astro pages, routes, content collections, and client-side interactivity.
compatibility: Requires Node 22+, pnpm, and Playwright browsers (pnpm exec playwright install).
---

# Feature Tests

Every new or changed feature in this project must ship with **two tests** that
verify its behavior:

1. a **browser test** (Playwright) that exercises the feature as a user would
2. a **unit test** (Vitest) that pins the logic the feature depends on

Do not report a feature as done, and do not stage/commit it, until both the
unit and browser test exist and pass. A feature without tests is unfinished.

## Hard rules

- **One feature, one pair of tests.** Add at least one `*.test.ts` (unit) and
  one browser assertion in `e2e/*.spec.ts` that fail if the feature breaks.
- **Verify behavior, not implementation.** Assert what the user observes
  (rendered output, navigation, computed data). Do not assert on private
  helpers, CSS class names, or exact markup that is free to change.
- **A test must fail before it passes.** Write it against the old/absent
  behavior first, watch it fail for the right reason, then implement.
- **Both commands must be green:** `pnpm test` and `pnpm test:e2e`.
- If a test genuinely cannot be written, stop and explain why to the user
  instead of silently skipping it. Never delete or weaken an existing test to
  make a change fit.

## Workflow

1. **State the behavior.** In one sentence, write what the feature does and how
   a user (or caller) would notice it working. That sentence is the test.
2. **Unit test.** Put it next to the code as `src/**/*.test.ts` (Vitest picks up
   `src/**/*.test.ts` only). Import through the `@/` alias, not relative paths.
   Cover the happy path plus at least one edge case or branch.
3. **Browser test.** Add or extend a spec in `e2e/*.spec.ts`. Start from
   `page.goto("/")`, then locate elements by role or text and assert the
   observable outcome of the feature.
4. **Run the unit suite:** `pnpm test`. Fix failures.
5. **Run the browser suite:** `pnpm test:e2e` (this builds, then runs Playwright
   against the preview server). Fix failures.
6. **Also run** `pnpm lint` so the new files pass the repo's linting.
7. Only then consider the feature complete.

See `references/templates.md` for copy-paste scaffolds and worked examples.

## Commands

| Command           | What it does                                                 |
| ----------------- | ------------------------------------------------------------ |
| `pnpm test`       | Run Vitest once (unit tests)                                 |
| `pnpm test:watch` | Run Vitest in watch mode while developing                    |
| `pnpm test:e2e`   | `pnpm build` then Playwright against `http://127.0.0.1:4322` |
| `pnpm lint`       | oxlint                                                       |

If Playwright reports missing browsers, run `pnpm exec playwright install`.

## Where tests live

```text
src/**/*.test.ts     # Vitest unit tests, colocated with the code
e2e/*.spec.ts        # Playwright browser tests
```

`playwright.config.ts` sets `baseURL` to `http://127.0.0.1:4322` and boots
`pnpm preview` automatically, so browser tests use paths like `page.goto("/posts/")`
with no host.

## What belongs where

| Change type                                  | Unit test                        | Browser test                          |
| -------------------------------------------- | -------------------------------- | ------------------------------------- |
| Pure logic / data helpers                    | Required: inputs -> outputs      | Optional, only if surfaced on a page  |
| Page, route, or rendered markup              | Only if logic is extracted       | Required: assert the rendered result  |
| Content collection / schema                  | Required: schema accepts/rejects | Required: the entry renders on a page |
| Interactive behavior (forms, client scripts) | Extract logic, unit test it      | Required: drive it and assert result  |

The default is **both**. Most features need the pair; the "Optional" cells above
apply only when a browser test would add no new coverage.

## Definition of done

- [ ] Behavior stated as a testable sentence
- [ ] Unit test added/updated under `src/**/*.test.ts`, covers happy path + edge
- [ ] Browser test added/updated under `e2e/*.spec.ts`, asserts the outcome
- [ ] New test failed before the feature and passes after
- [ ] `pnpm test` green
- [ ] `pnpm test:e2e` green
- [ ] `pnpm lint` green

## Anti-patterns

- Adding a feature with no tests, or "tests later".
- Asserting on CSS class names, `data-astro-cid-*`, or full-page snapshots.
- A browser test that only checks the page returns 200 without asserting the
  feature's effect.
- A unit test that just re-implements the function inline and compares it to
  itself.
- Marking the checkbox above without actually running the command.
