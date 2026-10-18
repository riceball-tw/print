import { expect, test, type Page } from "@playwright/test";

const categoriesNav = (page: Page) =>
  page.getByRole("main").getByRole("navigation", { name: /Categories|分类|分類/ });

// Post rows are the list items holding a link into `/{lang}/posts/…`; the
// category list links into `/{lang}/categories/…` instead.
const postRows = (page: Page) =>
  page.getByRole("main").locator("li").filter({ has: page.locator('a[href*="/posts/"]') });

test("home category headings link into that category's page", async ({ page }) => {
  await page.goto("/en/");

  const heading = page.getByRole("main").getByRole("heading", { level: 3 }).first();
  const link = heading.getByRole("link");
  await expect(link).toHaveAttribute("href", /^\/en\/categories\/.+\/$/);

  const name = (await link.textContent())?.trim();
  await link.click();
  await expect(page).toHaveURL(/\/en\/categories\/.+\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name!);
});

test("the category page marks the current category and lists only its posts", async ({ page }) => {
  await page.goto("/en/categories/css/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("CSS");

  // Every category is offered on the left; only the current one is active.
  const nav = categoriesNav(page);
  await expect(nav.getByRole("link")).not.toHaveCount(0);
  await expect(nav.getByRole("link", { name: "CSS", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(nav.getByRole("link", { name: "Astro", exact: true })).not.toHaveAttribute(
    "aria-current",
    "page",
  );

  // The stated count matches the rows actually listed.
  const countText = await page.getByRole("main").getByText(/^\d+ entries$/).textContent();
  const count = Number(countText?.match(/^\d+/)?.[0]);
  expect(count).toBeGreaterThan(0);
  await expect(postRows(page)).toHaveCount(count);
});

test("category pages exist per language with translated copy", async ({ page }) => {
  await page.goto("/zh-cn/categories/css/");

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("CSS");
  await expect(
    page.getByRole("main").getByRole("navigation", { name: "分类" }).getByRole("link", {
      name: "CSS",
      exact: true,
    }),
  ).toHaveAttribute("aria-current", "page");
});

test("the category list sits beside the sidebar instead of centered", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/en/categories/css/");

  const sidebarBox = (await page.getByTestId("sidebar").boundingBox())!;
  const navBox = (await categoriesNav(page).boundingBox())!;

  // The list starts just after the fixed sidebar (plus the page's own
  // padding), rather than being pushed to the middle by a centered column.
  expect(navBox.x).toBeGreaterThan(sidebarBox.x + sidebarBox.width);
  expect(navBox.x - (sidebarBox.x + sidebarBox.width)).toBeLessThan(48);
});

test("the category list stacks above the posts on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/en/categories/css/");

  const nav = categoriesNav(page);
  const firstPost = postRows(page).first();
  await expect(nav).toBeVisible();
  await expect(firstPost).toBeVisible();

  // The categories come first in the reading order, not beside the posts.
  const navY = (await nav.boundingBox())!.y;
  const postY = (await firstPost.boundingBox())!.y;
  expect(navY).toBeLessThan(postY);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
