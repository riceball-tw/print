import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import ShortpostFeed from "@/components/ShortpostFeed.astro";

type Shortpost = {
  id: string;
  data: { headline: string; publishDate: Date; category: string };
};

const renderFeed = async (shortposts: Shortpost[], currentSlug: string, lang = "en") => {
  const container = await AstroContainer.create();
  return container.renderToString(ShortpostFeed, { props: { shortposts, currentSlug, lang } });
};

const shortposts: Shortpost[] = [
  {
    id: "en/alpha",
    data: { headline: "Alpha", publishDate: new Date("2024-01-02T00:00:00Z"), category: "CSS" },
  },
  {
    id: "en/beta",
    data: { headline: "Beta", publishDate: new Date("2024-01-03T00:00:00Z"), category: "Astro" },
  },
];

describe("ShortpostFeed", () => {
  it("renders one link per shortpost, in order", async () => {
    const html = await renderFeed(shortposts, "en/alpha");

    expect(html.match(/<a\b/g)).toHaveLength(2);
    expect(html).toContain('href="/en/shortposts/alpha/#shortpost-alpha"');
    expect(html).toContain('href="/en/shortposts/beta/#shortpost-beta"');
    expect(html).toContain('id="shortpost-alpha"');
    expect(html).toContain('id="shortpost-beta"');
    expect(html.indexOf("Alpha")).toBeLessThan(html.indexOf("Beta"));
  });

  it("keeps the current shortpost's accessible name plain", async () => {
    const html = await renderFeed(shortposts, "en/alpha");

    const current = html.match(/<a\b[^>]*href="\/en\/shortposts\/alpha\/#shortpost-alpha"[^>]*>/)?.[0];
    // The selection brackets are decorative, so the accessible name stays plain.
    expect(current).toContain('aria-label="Alpha"');

    const other = html.match(/<a\b[^>]*href="\/en\/shortposts\/beta\/#shortpost-beta"[^>]*>/)?.[0];
    expect(other).not.toContain("aria-label");
  });

  it("marks nothing when no shortpost is current", async () => {
    const html = await renderFeed(shortposts, "en/gamma");

    const link = html.match(/<a\b[^>]*href="\/en\/shortposts\/alpha\/#shortpost-alpha"[^>]*>/)?.[0];
    expect(link).not.toContain("aria-label");
  });
});
