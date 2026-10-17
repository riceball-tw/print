import { expect, test, type Page } from "@playwright/test";

const categoryHeadings = (page: Page) => page.getByRole("main").getByRole("heading", { level: 3 });

const headingPositions = (page: Page) =>
  categoryHeadings(page).evaluateAll((headings) =>
    headings.map((heading) => {
      const { x, y } = heading.getBoundingClientRect();
      return { x: Math.round(x), y: Math.round(y) };
    }),
  );

test("home page renders through the base layout", async ({ page }) => {
  await page.goto("/en/");

  await expect(page).toHaveTitle("Print");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    "width=device-width",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A minimal Astro site.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Print");
});

test("category lists expand into several columns on a wide screen", async ({ page }) => {
  // Two 600px columns plus the 32px gap and page padding need ~1256px, so use a
  // viewport comfortably wider than that.
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/en/");

  const positions = await headingPositions(page);
  expect(positions.length).toBeGreaterThan(1);

  // At least two categories share the first row, laid out side by side.
  const firstRow = positions.filter((position) => Math.abs(position.y - positions[0].y) < 2);
  expect(firstRow.length).toBeGreaterThan(1);
  expect(new Set(firstRow.map((position) => position.x)).size).toBeGreaterThan(1);
});

test("category lists stack into a single column on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/en/");

  const positions = await headingPositions(page);
  expect(new Set(positions.map((position) => position.x)).size).toBe(1);
});
