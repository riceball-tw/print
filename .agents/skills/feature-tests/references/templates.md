# Test templates

Copy-paste starting points. Adjust names to the feature under test.

## Unit test (Vitest)

Colocate as `src/**/*.test.ts`. Import through `@/`, never `../`.

```ts
// src/utils/<feature>.test.ts
import { describe, expect, it } from "vitest";
import { <helper> } from "@/utils/<feature>";

describe("<helper>", () => {
  it("does the expected thing for the happy path", () => {
    expect(<helper>(input)).toEqual(expected);
  });

  it("handles the edge case", () => {
    expect(<helper>(edgeInput)).toEqual(edgeExpected);
  });
});
```

Guidelines:

- One `describe` per unit; an `it` per behavior, named as a sentence.
- Use `toEqual` for structures, `toBe` for primitives, `toThrow` for errors.
- Prefer table-free, explicit cases over clever loops.
- If the logic you want to cover is tangled into a page/component, extract a
  pure helper into `src/utils/` and unit test that.

## Browser test (Playwright)

Add a spec under `e2e/`. `baseURL` is `http://127.0.0.1:4322`, so use paths.

```ts
// e2e/<feature>.spec.ts
import { expect, test } from "@playwright/test";

test("<feature> works for a visitor", async ({ page }) => {
  await page.goto("/<route>/");

  // Assert the feature's observable outcome.
  await expect(page.getByRole("heading", { name: "..." })).toBeVisible();
  await expect(page.getByRole("link", { name: "..." })).toHaveAttribute("href", "/expected/");
});
```

Guidelines:

- Locate by role, accessible name, or visible text — not CSS classes.
- Navigate through the UI when the test is about flow; jump with `page.goto`
  when it is about a single page.
- Assert the thing that would break if the feature regressed (a row appears, a
  count changes, a link points somewhere).
- Keep each spec to the feature it names; don't piggyback unrelated checks.

## Testing Astro pages and content

Pages that read content collections are easiest to verify in the browser: build,
then assert the rendered entry.

```ts
test("a published post renders its body", async ({ page }) => {
  await page.goto("/posts/<slug>/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("<headline>");
  await expect(page.getByRole("main")).toContainText("<a phrase from the body>");
});
```

For a collection schema, unit-test the schema's own rules if it exposes pure
validation, otherwise rely on the build plus a browser assertion that a valid
entry renders and an invalid one is rejected by `astro build`.
