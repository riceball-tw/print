import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import LanguagePicker from "@/components/LanguagePicker.astro";
import { languageShortNames, languages, type LanguageKey } from "@/i18n/ui";

type Props = { lang: LanguageKey; path: string; label: string };

const renderPicker = async (props: Props) => {
  const container = await AstroContainer.create();
  return container.renderToString(LanguagePicker, { props });
};

describe("LanguagePicker", () => {
  it("links to the current page in every other language", async () => {
    const html = await renderPicker({
      lang: "en",
      path: "/posts",
      label: "Please select language",
    });

    expect(html).toContain('href="/zh-cn/posts"');
    expect(html).toContain('href="/zh-tw/posts"');
  });

  it("marks the current language instead of linking to it", async () => {
    const html = await renderPicker({
      lang: "en",
      path: "/posts",
      label: "Please select language",
    });

    expect(html).toContain('aria-current="true"');
    expect(html).toContain("English");
    expect(html).not.toContain('href="/en/posts"');
  });

  it("strikes through languages that have no version of the page", async () => {
    // `mermaid-gallery` is only written in English, so the other languages
    // have no counterpart to link to.
    const html = await renderPicker({
      lang: "en",
      path: "/posts/mermaid-gallery/",
      label: "Please select language",
    });

    expect(html).not.toContain('href="/zh-cn/posts/mermaid-gallery/"');
    expect(html).not.toContain('href="/zh-tw/posts/mermaid-gallery/"');
    expect(html.match(/line-through/g)).toHaveLength(2);
    expect(html).toContain("Not available in this language");
  });

  it("keeps linking languages that do have the page", async () => {
    const html = await renderPicker({
      lang: "en",
      path: "/shortposts/demo-short-post/",
      label: "Please select language",
    });

    expect(html).toContain('href="/zh-cn/shortposts/demo-short-post/"');
    expect(html).toContain('href="/zh-tw/shortposts/demo-short-post/"');
    expect(html).not.toContain("line-through");
  });

  it("labels the navigation landmark for screen readers", async () => {
    const html = await renderPicker({ lang: "zh-tw", path: "/", label: "請選擇語言" });

    expect(html).toContain('aria-label="請選擇語言"');
    expect(html).toContain('href="/en/"');
  });

  it("renders a short label next to the full name for every language", async () => {
    const html = await renderPicker({ lang: "en", path: "/", label: "Please select language" });

    for (const [key, short] of Object.entries(languageShortNames)) {
      // Wrapped in its own element, so the compact label is not just a
      // substring of the full name.
      expect(html).toContain(`>${short}<`);
      expect(html).toContain(languages[key as LanguageKey]);
    }
  });

  it("names every language link for screen readers, whatever the viewport", async () => {
    const html = await renderPicker({ lang: "en", path: "/", label: "Please select language" });

    // The current language is marked, not linked, so only the others need a name.
    for (const [key, name] of Object.entries(languages)) {
      if (key === "en") continue;
      expect(html).toContain(`aria-label="${name}"`);
    }
  });
});
