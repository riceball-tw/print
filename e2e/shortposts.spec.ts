import { expect, test } from "@playwright/test";

test("opening a shortpost positions its active entry in the viewport", async ({ page }) => {
  await page.goto("/en/shortposts/");

  const lastLink = page.getByRole("main").locator('a[href*="/shortposts/"]').last();
  const href = await lastLink.getAttribute("href");
  expect(href).toMatch(/^\/en\/shortposts\/.+\/#shortpost-.+$/);

  await page.goto(href!);

  const hash = new URL(page.url()).hash.slice(1);
  const activeEntry = page.locator(`#${hash}`);
  await expect(activeEntry).toBeVisible();
  await expect(activeEntry).toBeInViewport();
});
