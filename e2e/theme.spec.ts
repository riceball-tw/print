import { expect, test } from "@playwright/test";

test("the theme toggle changes the palette and keeps the choice after reload", async ({ page }) => {
  await page.goto("/en/");

  const toggle = page.getByRole("button", { name: /theme/i });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveText("[light]");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const lightBackground = await page.locator("html").evaluate((element) =>
    getComputedStyle(element).backgroundColor,
  );

  await toggle.click();
  await expect(toggle).toHaveText("[dark]");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      page.locator("html").evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(lightBackground);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
