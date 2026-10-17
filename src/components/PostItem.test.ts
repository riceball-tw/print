import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import PostItem from "@/components/PostItem.astro";

type Post = {
  id: string;
  data: { headline: string; publishDate: Date };
};

const renderPostItem = async (post: Post, lang = "en") => {
  const container = await AstroContainer.create();
  return container.renderToString(PostItem, { props: { post, lang } });
};

const post: Post = {
  id: "alpha",
  data: { headline: "Alpha", publishDate: new Date("2024-01-02T00:00:00Z") },
};

describe("PostItem", () => {
  it("renders a single list item for the post", async () => {
    const html = await renderPostItem(post);

    expect(html.match(/<li\b/g)).toHaveLength(1);
  });

  it("renders the list item as its root element", async () => {
    const html = await renderPostItem(post);

    expect(html).toMatch(/^<li\b/);
    expect(html).toMatch(/<\/li>$/);
  });

  it("links the headline to its post, ahead of the publish date", async () => {
    const html = await renderPostItem(post);

    expect(html).toMatch(/<a[^>]*href="\/en\/posts\/alpha\/"[^>]*>Alpha<\/a>/);
    expect(html).toContain("2024-01-02");
    expect(html.indexOf("Alpha")).toBeLessThan(html.indexOf("2024-01-02"));
  });

  it("prefixes the post link with the given language", async () => {
    const html = await renderPostItem(post, "zh-tw");

    expect(html).toMatch(/<a[^>]*href="\/zh-tw\/posts\/alpha\/"[^>]*>Alpha<\/a>/);
  });

  it("does not repeat the language when the post id is language-scoped", async () => {
    const html = await renderPostItem(
      { ...post, id: "zh-tw/alpha" },
      "zh-tw",
    );

    expect(html).toMatch(/<a[^>]*href="\/zh-tw\/posts\/alpha\/"[^>]*>Alpha<\/a>/);
    expect(html).not.toContain("/zh-tw/posts/zh-tw/");
  });
});
