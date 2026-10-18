import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import CategoryNav from "@/components/CategoryNav.astro";

const renderNav = async (categories: string[], active?: string) => {
  const container = await AstroContainer.create();
  return container.renderToString(CategoryNav, { props: { categories, lang: "en", active } });
};

describe("CategoryNav", () => {
  it("renders a nav landmark labelled after the categories title", async () => {
    const html = await renderNav(["CSS"]);

    expect(html).toMatch(/<nav\b[^>]*aria-label="Categories"/);
  });

  it("renders one link per category, each pointing at its own page", async () => {
    const html = await renderNav(["CSS", "Functional Programming"]);

    expect(html).toContain('href="/en/categories/css/"');
    expect(html).toContain('href="/en/categories/functional-programming/"');

    const positions = ["CSS", "Functional Programming"].map((name) => html.indexOf(name));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("marks the active category as the current page", async () => {
    const html = await renderNav(["CSS", "Astro"], "CSS");

    const currentLink = html.match(/<a\b[^>]*aria-current="page"[^>]*>/)?.[0];
    expect(currentLink).toBeDefined();
    expect(currentLink).toContain('href="/en/categories/css/"');
  });

  it("marks nothing as current when no category is active", async () => {
    const html = await renderNav(["CSS", "Astro"]);

    expect(html).not.toContain("aria-current");
  });
});
