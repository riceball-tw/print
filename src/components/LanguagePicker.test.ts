import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import LanguagePicker from "@/components/LanguagePicker.astro";
import type { LanguageKey } from "@/i18n/ui";

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

    expect(html).toContain('<a href="/zh-cn/posts">简体中文</a>');
    expect(html).toContain('<a href="/zh-tw/posts">繁體中文</a>');
  });

  it("marks the current language instead of linking to it", async () => {
    const html = await renderPicker({
      lang: "en",
      path: "/posts",
      label: "Please select language",
    });

    expect(html).toContain('<span aria-current="true">English</span>');
    expect(html).not.toContain('href="/en/posts"');
  });

  it("labels the navigation landmark for screen readers", async () => {
    const html = await renderPicker({
      lang: "zh-tw",
      path: "/",
      label: "請選擇語言",
    });

    expect(html).toContain('aria-label="請選擇語言"');
    expect(html).toContain('<a href="/en/">English</a>');
  });
});
