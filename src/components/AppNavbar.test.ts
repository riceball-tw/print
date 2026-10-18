import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import AppNavbar from "@/components/AppNavbar.astro";

type NavigationItem = { name: string; url: string };

const renderNavbar = async (navigation: NavigationItem[]) => {
  const container = await AstroContainer.create();
  return container.renderToString(AppNavbar, { props: { navigation } });
};

describe("AppNavbar", () => {
  it("renders a nav landmark wrapping the navigation", async () => {
    const html = await renderNavbar([{ name: "Alpha", url: "/alpha" }]);

    expect(html).toMatch(/^<nav\b/);
    expect(html).toMatch(/<\/nav>$/);
  });

  it("renders one link per item, in the given order", async () => {
    const navigation: NavigationItem[] = [
      { name: "Alpha", url: "/alpha" },
      { name: "Beta", url: "/beta" },
      { name: "Gamma", url: "/gamma" },
    ];

    const html = await renderNavbar(navigation);

    for (const { name, url } of navigation) {
      expect(html).toContain(`href="${url}"`);
      expect(html).toContain(`>${name}</a>`);
    }

    const positions = navigation.map((item) => html.indexOf(item.name));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("renders an empty nav for an empty navigation list", async () => {
    const html = await renderNavbar([]);

    expect(html).not.toContain("<a ");
  });
});
