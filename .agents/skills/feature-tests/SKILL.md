---
name: feature-tests
description: Add proportionate behavioral tests for meaningful feature changes. Use Vitest and Playwright when they provide distinct confidence; avoid style-only, redundant, or brittle tests.
compatibility: Requires Node 22+, pnpm, and Playwright browsers (pnpm exec playwright install).
---

# Feature Tests

Add tests when a change introduces or materially changes observable behavior,
decision logic, validation, data transformation, or a regression risk. Choose
the smallest set of tests that gives useful confidence:

1. a **browser test** (Playwright) that exercises the feature as a user would
2. a **unit test** (Vitest) that pins the logic the feature depends on

Use both tests when they cover different risks. Do not add a test merely to
satisfy a quota; documentation, copy, visual styling, formatting, refactors
that preserve behavior, and other non-behavioral changes normally do not need
new tests. Run every relevant test suite after changing tests or behavior.

## Hard rules

- **Test the risk, not the diff.** Add a `*.test.ts`, a browser assertion in
  `e2e/*.spec.ts`, or both only when it would catch a meaningful regression.
  Prefer one focused test over several overlapping checks.
- **Verify behavior, not implementation.** Assert what the user observes
  (rendered output, navigation, computed data). Do not assert on private
  helpers, CSS class names, or exact markup that is free to change.
- **Keep tests durable.** Assert stable, user-meaningful outcomes and avoid
  unnecessary edge cases, timing assumptions, exact copy, visual styling, or
  markup details that are not part of the requirement.
- **Run relevant commands:** `pnpm test` for unit-test or logic changes,
  `pnpm test:e2e` for browser-covered behavior, and `pnpm lint` for changed
  source or test files. Run both suites when both test types are relevant.
- Do not delete or weaken an existing behavioral test merely to make a change
  fit. Update it when the intended behavior has genuinely changed.

## Workflow

1. **Identify the regression risk.** State the behavior that could break and
   how a user or caller would notice it. If there is no meaningful behavioral
   risk, do not invent a test.
2. **Choose the lowest-cost useful level.** Use a unit test for logic and data
   decisions; use a browser test for an important user flow or rendering
   outcome; use both only when each catches a distinct failure mode.
3. **Write a focused test.** Put unit tests next to code as `src/**/*.test.ts`
   (import through `@/`), or extend `e2e/*.spec.ts` with a role/text-based
   assertion of the meaningful outcome. Include an edge case only when it
   represents a realistic branch or prior failure.
4. **Run the relevant suite(s)** and `pnpm lint`. Fix failures before reporting
   the behavioral change complete.

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
| Pure logic / data helpers                    | Usually: inputs -> outputs       | Only if an important UI path needs it |
| Page, route, or rendered markup              | If it contains nontrivial logic  | For meaningful user-facing behavior   |
| Content collection / schema                  | For validation or transformations| If the rendered behavior is at risk   |
| Interactive behavior (forms, client scripts) | For nontrivial extracted logic   | Usually: drive and assert the outcome |

Use the table as a guide, not a quota. Skip tests that only restate styling,
static copy, framework output, or already-covered behavior.

## Definition of done

- [ ] Meaningful behavioral risk assessed
- [ ] Focused unit and/or browser coverage added when it would catch a regression
- [ ] No style-only, redundant, or brittle assertions added
- [ ] Relevant test suite(s) green
- [ ] `pnpm lint` green when source or test files changed

## Anti-patterns

- Adding a feature with no tests, or "tests later".
- Asserting on CSS class names, `data-astro-cid-*`, or full-page snapshots.
- A browser test that only checks the page returns 200 without asserting the
  feature's effect.
- A unit test that just re-implements the function inline and compares it to
  itself.
- Testing CSS, whitespace, static wording, or incidental DOM structure unless
  it is explicitly part of the product requirement.
- Adding edge cases only to inflate coverage, or duplicating the same assertion
  across unit and browser tests without distinct value.
- Marking the checklist complete without actually running the relevant command.
