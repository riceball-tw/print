import { expect, test, type Page } from "@playwright/test";

const codeBlocks = (page: Page) => page.locator(".expressive-code");

test("the demo post renders frames and every text marker", async ({ page }) => {
  await page.goto("/en/posts/expressive-code-demo/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Expressive Code: code blocks that explain themselves",
  );
  await expect(codeBlocks(page)).toHaveCount(5);

  const first = codeBlocks(page).first();
  await expect(first.locator("figcaption .title")).toHaveText("src/lib/retry.ts");
  await expect(first.locator(".ec-line.highlight.mark")).not.toHaveCount(0);
  await expect(first.locator(".ec-line.highlight.ins")).not.toHaveCount(0);
  await expect(first.locator(".ec-line.highlight.del")).not.toHaveCount(0);

  const terminal = page.locator(".expressive-code .is-terminal");
  await expect(terminal).toHaveCount(1);
  await expect(terminal.locator("figcaption .title")).toHaveText("pnpm test");

  const wrapBlock = codeBlocks(page).filter({ has: page.locator('pre[data-language="css"]') });
  await expect(wrapBlock.locator("pre")).toHaveClass(/\bwrap\b/);
});

test("fenced code blocks in posts are rendered by Expressive Code", async ({ page }) => {
  await page.goto("/en/posts/build-kanban-with-drag-drop/");

  const block = page.locator(".prose .expressive-code");
  await expect(block).not.toHaveCount(0);
  await expect(block.first().locator(".ec-line")).not.toHaveCount(0);
  await expect(block.first().locator("button[title='Copy to clipboard']")).toHaveCount(1);
});

test("code blocks follow the site theme toggle", async ({ page }) => {
  await page.goto("/en/posts/expressive-code-demo/");

  const pre = page.locator(".expressive-code pre").first();
  const background = () => pre.evaluate((element) => getComputedStyle(element).backgroundColor);

  const light = await background();
  await page.getByTestId("theme-toggle").click();
  const dark = await background();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(dark).not.toBe(light);
});
