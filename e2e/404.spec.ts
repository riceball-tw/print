import { expect, test } from "@playwright/test";

test("the 404 page is stamped in the language prefix of the missing URL", async ({ page }) => {
  await page.goto("/zh-tw/never-printed/");

  await expect(page.locator('[data-404="kicker"]')).toHaveText("錯誤 404 · 不在此次印刷中");
  await expect(page.locator('[data-404="title"]')).toHaveText("這一頁從未被印出。");
  await expect(page.locator('[data-404="path"]')).toHaveText("/zh-tw/never-printed/");

  // The exit links are retargeted to the detected language, too.
  await expect(page.locator('[data-404="back"]')).toHaveAttribute("href", "/zh-tw/");
  await expect(page.locator('[data-404="posts"]')).toHaveAttribute("href", "/zh-tw/posts/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant-TW");
});

test("the 404 page falls back to the default language without a prefix", async ({ page }) => {
  await page.goto("/never-printed/");

  await expect(page.locator('[data-404="kicker"]')).toHaveText("Error 404 · Not in this print run");
  await expect(page.locator('[data-404="title"]')).toHaveText("That page was never printed.");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
