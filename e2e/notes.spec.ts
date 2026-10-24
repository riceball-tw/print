import { expect, test } from "@playwright/test";

test("opening a note positions its active entry in the viewport", async ({ page }) => {
  await page.goto("/en/notes/");

  const lastLink = page.getByRole("main").locator('a[href*="/notes/"]').last();
  const href = await lastLink.getAttribute("href");
  expect(href).toMatch(/^\/en\/notes\/.+\/#note-.+$/);

  await page.goto(href!);

  const hash = new URL(page.url()).hash.slice(1);
  const activeEntry = page.locator(`#${hash}`);
  await expect(activeEntry).toBeVisible();
  await expect(activeEntry).toBeInViewport();
});
