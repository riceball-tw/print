import { expect, test } from "@playwright/test";

// The sub-path the site is deployed to, mirroring a GitHub Pages project site.
const BASE = "/print";

// The host serves the single `404.html` from the deployment root while keeping
// the broken URL, so the page has to strip the sub-path before it reads the
// language prefix.
test("the 404 page handles the deployment sub-path", async ({ page }) => {
  await page.goto(`${BASE}/zh-cn/never-printed/`);

  await expect(page.locator('[data-404="title"]')).toHaveText("这一页从未被印出。");
  await expect(page.locator('[data-404="path"]')).toHaveText(`${BASE}/zh-cn/never-printed/`);
  await expect(page.locator('[data-404="back"]')).toHaveAttribute("href", `${BASE}/zh-cn/`);
  await expect(page.locator('[data-404="posts"]')).toHaveAttribute("href", `${BASE}/zh-cn/posts/`);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
});
