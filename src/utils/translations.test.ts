import { describe, expect, it } from "vitest";
import { hasTranslation } from "@/utils/translations";

describe("hasTranslation", () => {
  it("treats static pages as available in every language", () => {
    for (const path of ["/", "/about", "/posts", "/notes"]) {
      expect(hasTranslation(path, "en")).toBe(true);
      expect(hasTranslation(path, "zh-cn")).toBe(true);
      expect(hasTranslation(path, "zh-tw")).toBe(true);
    }
  });

  it("follows which posts each language actually has", () => {
    expect(hasTranslation("/posts/mermaid-gallery", "en")).toBe(true);
    expect(hasTranslation("/posts/mermaid-gallery/", "zh-cn")).toBe(false);
    expect(hasTranslation("/posts/mermaid-gallery/", "zh-tw")).toBe(false);
    expect(hasTranslation("/posts/javascript-event-loop-explained/", "zh-tw")).toBe(true);
  });

  it("follows which notes each language actually has", () => {
    expect(hasTranslation("/notes/astro-v5-thoughts/", "en")).toBe(true);
    expect(hasTranslation("/notes/astro-v5-thoughts/", "zh-cn")).toBe(false);
    expect(hasTranslation("/notes/demo-note/", "zh-cn")).toBe(true);
  });

  it("follows which categories each language actually has", () => {
    expect(hasTranslation("/posts/categories/web-performance/", "zh-cn")).toBe(true);
    expect(hasTranslation("/notes/categories/dev-tools/", "en")).toBe(true);
    expect(hasTranslation("/notes/categories/dev-tools/", "zh-cn")).toBe(false);
  });

  it("assumes unknown paths exist rather than crossing out every language", () => {
    expect(hasTranslation("/some/future/page/", "zh-tw")).toBe(true);
  });
});
