import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import type { TranslationKey } from "../src/i18n/ui";
import { useTranslatedPath, useTranslations } from "../src/i18n/utils";

// Derive expectations from the same sources of truth the page renders from, so
// editing the navigation config or translations never breaks this test, but
// dropping or mangling a link in the navbar does.
const config = JSON.parse(
  readFileSync(fileURLToPath(new URL("../src/data/config.json", import.meta.url)), "utf8"),
) as { site: { navigation: { translationKey: string; url: string }[] } };
const navigation = config.site.navigation;

const t = useTranslations("en");
const translatePath = useTranslatedPath("en");

test("navbar renders the translated navigation defined in the site config", async ({ page }) => {
  await page.goto("/en/");

  const nav = page.getByTestId("navbar").getByRole("navigation");
  await expect(nav).toBeVisible();

  const links = nav.getByRole("link");
  await expect(links).toHaveCount(navigation.length);

  for (const [index, item] of navigation.entries()) {
    const link = links.nth(index);
    await expect(link).toHaveText(t(item.translationKey as TranslationKey));
    await expect(link).toHaveAttribute("href", translatePath(item.url));
  }
});

test("every page shows the navbar with the site logo linking home", async ({ page }) => {
  for (const path of ["/en/", "/en/posts/"]) {
    await page.goto(path);

    const navbar = page.getByTestId("navbar");
    await expect(navbar).toBeVisible();
    await expect(navbar.getByRole("link", { name: /Print/ })).toHaveAttribute("href", "/en/");
    await expect(navbar.getByRole("navigation")).toBeVisible();
  }
});
