import { expect, test } from "@playwright/test";
import { languageShortNames, languages } from "../src/i18n/ui";

test("the root path redirects to the default language", async ({ page }) => {
  await page.goto("/");

  await page.waitForURL(/\/en\/$/);
  await expect(page).toHaveURL(/\/en\/$/);
});

test("each language renders with its own lang attribute", async ({ page }) => {
  const cases = [
    { path: "/en/", lang: "en" },
    { path: "/zh-cn/", lang: "zh-Hans" },
    { path: "/zh-tw/", lang: "zh-Hant-TW" },
  ];

  for (const { path, lang } of cases) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
  }
});

test("navigation and page copy are translated per language", async ({ page }) => {
  await page.goto("/zh-cn/");

  // `exact` keeps post titles that happen to contain these words from
  // matching the navigation links.
  await expect(page.getByRole("link", { name: "首页", exact: true })).toHaveAttribute(
    "href",
    "/zh-cn/",
  );
  await expect(page.getByRole("link", { name: "文章", exact: true })).toHaveAttribute(
    "href",
    "/zh-cn/posts",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Print");
  await expect(page.getByText("按分类浏览文章")).toBeAttached();
});

test("the language picker lists every language and marks the current one", async ({ page }) => {
  await page.goto("/zh-tw/");

  const picker = page.getByRole("navigation", { name: "請選擇語言" });
  await expect(picker).toBeVisible();

  for (const name of Object.values(languages)) {
    await expect(picker.getByText(name, { exact: true })).toBeVisible();
  }

  // Holds both the compact and the full label, hence "contain".
  await expect(picker.locator('[aria-current="true"]')).toContainText("繁體中文");
});

test("the language picker lives in the sidebar", async ({ page }) => {
  for (const path of ["/en/", "/en/posts/"]) {
    await page.goto(path);

    const sidebar = page.getByTestId("sidebar");
    await expect(sidebar.getByRole("navigation", { name: "Please select language" })).toBeVisible();
    await expect(sidebar).toBeVisible();
  }
});

test("the language picker stays compact in the top bar on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/zh-tw/");

  const picker = page.getByTestId("sidebar").getByRole("navigation", { name: "請選擇語言" });
  await expect(picker).toBeVisible();

  // The full names do not fit beside the navigation, so the picker falls back
  // to the compact labels.
  for (const short of Object.values(languageShortNames)) {
    await expect(picker.getByText(short, { exact: true })).toBeVisible();
  }
  await expect(picker.getByText("繁體中文", { exact: true })).toBeHidden();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("switching language keeps the visitor on the same page", async ({ page }) => {
  await page.goto("/en/posts/");

  const picker = page.getByRole("navigation", { name: "Please select language" });
  await picker.getByRole("link", { name: "繁體中文" }).click();

  await expect(page).toHaveURL(/\/zh-tw\/posts\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("文章");
});

test("each language lists posts under its own path and links into them", async ({ page }) => {
  for (const lang of Object.keys(languages)) {
    await page.goto(`/${lang}/posts/`);

    // Scope to post rows: the category nav links into `/posts/categories/…`.
    const link = page
      .getByRole("main")
      .locator("li")
      .filter({ has: page.locator(`a[href^="/${lang}/posts/"]:not([href*="/posts/categories/"])`) })
      .first()
      .getByRole("link");
    // The slug must not carry the language again, e.g. /en/posts/en/...
    await expect(link).toHaveAttribute("href", new RegExp(`^/${lang}/posts/(?!${lang}/)`));

    await link.click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/posts/(?!${lang}/)`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("a translated post renders its own language's content", async ({ page }) => {
  await page.goto("/en/posts/astro-islands-explained/");
  const enHeadline = await page.getByRole("heading", { level: 1 }).textContent();

  await page.goto("/zh-tw/posts/astro-islands-explained/");
  const twHeadline = await page.getByRole("heading", { level: 1 }).textContent();

  expect(twHeadline).not.toBe(enHeadline);
  expect(twHeadline).toMatch(/[\u4e00-\u9fff]/);
});
