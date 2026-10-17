import { expect, test } from "@playwright/test";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

test("home lists posts with a link to each post and its date", async ({ page }) => {
  await page.goto("/en/");

  const rows = page.getByRole("main").getByRole("listitem");
  await expect(rows).not.toHaveCount(0);
  await expect(rows.first().getByRole("link")).toHaveAttribute("href", /^\/en\/posts\/.+\/$/);
  await expect(rows.first().getByText(datePattern)).toBeVisible();
});

test("the posts index lists posts with a link and a date", async ({ page }) => {
  await page.goto("/en/posts/");

  const rows = page.getByRole("main").getByRole("listitem");
  await expect(rows).not.toHaveCount(0);
  await expect(rows.first().getByRole("link")).toHaveAttribute("href", /^\/en\/posts\/.+\/$/);
  await expect(rows.first().getByText(datePattern)).toBeVisible();
});

test("the more link is an item in the same list as the post rows", async ({ page }) => {
  await page.goto("/en/");

  const moreLink = page.getByRole("main").getByRole("link", { name: /more$/ }).first();
  await expect(moreLink).toHaveAttribute("href", "/en/posts/");

  // The more link is a list item, in the same list that holds the post rows.
  const moreItem = moreLink.locator("xpath=ancestor::li[1]");
  await expect(moreItem).toHaveCount(1);
  await expect(moreItem.locator("xpath=..").getByText(datePattern).first()).toBeVisible();
});

test("long titles do not make the page scroll sideways on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/en/posts/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
