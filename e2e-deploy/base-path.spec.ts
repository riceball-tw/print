import { expect, test } from "@playwright/test";

// The sub-path the site is deployed to, mirroring a GitHub Pages project site.
const BASE = "/print";

test("the site renders from its deployment sub-path", async ({ page }) => {
  const response = await page.goto(`${BASE}/en/`);

  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Print");
});

test("every internal link and the language detection account for the sub-path", async ({
  page,
}) => {
  await page.goto(`${BASE}/zh-tw/posts/`);

  // The base is stripped before routes are parsed, so the page still knows it
  // is the Chinese page rather than falling back to the default language.
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant-TW");

  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.filter((href) => !href.startsWith(`${BASE}/`))).toEqual([]);
});

test("assets are served from the deployment sub-path", async ({ page }) => {
  await page.goto(`${BASE}/en/`);

  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute(
    "href",
    `${BASE}/favicon.svg`,
  );
  expect((await page.request.get(`${BASE}/favicon.svg`)).status()).toBe(200);
});

test("the bare sub-path redirects to the default language under it", async ({ page }) => {
  await page.goto(`${BASE}/`);

  await page.waitForURL(new RegExp(`${BASE}/en/$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Print");
});

test("following an internal link keeps the visitor inside the sub-path", async ({ page }) => {
  await page.goto(`${BASE}/en/`);

  await page.getByRole("main").getByRole("link", { name: /more$/ }).first().click();

  await expect(page).toHaveURL(new RegExp(`${BASE}/en/posts/$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Posts");
});

test("switching language stays inside the sub-path", async ({ page }) => {
  await page.goto(`${BASE}/en/posts/categories/css/`);

  await page
    .getByRole("navigation", { name: "Please select language" })
    .getByRole("link", { name: "繁體中文" })
    .click();

  await expect(page).toHaveURL(new RegExp(`${BASE}/zh-tw/posts/categories/css/$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("CSS");
});
