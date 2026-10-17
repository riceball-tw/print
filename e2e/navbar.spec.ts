import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Derive expectations from the same source of truth the page renders from, so
// editing the site navigation never breaks this test, but dropping or mangling
// a link in the navbar does.
const config = JSON.parse(
  readFileSync(fileURLToPath(new URL("../src/data/config.json", import.meta.url)), "utf8"),
) as { site: { navigation: { name: string; url: string }[] } };
const navigation = config.site.navigation;

test("navbar renders the navigation defined in the site config", async ({ page }) => {
  await page.goto("/");

  const navbar = page.getByRole("navigation");
  await expect(navbar).toBeVisible();

  const links = navbar.getByRole("link");
  await expect(links).toHaveCount(navigation.length);

  for (const [index, item] of navigation.entries()) {
    const link = links.nth(index);
    await expect(link).toHaveText(item.name);
    await expect(link).toHaveAttribute("href", item.url);
  }
});
