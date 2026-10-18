import { describe, expect, it, vi } from "vitest";
import {
  getLangFromId,
  getLangFromUrl,
  getPathFromUrl,
  getSlugFromId,
  isLanguageKey,
  useTranslatedPath,
  useTranslations,
} from "@/i18n/utils";

const url = (path: string) => new URL(`https://example.com${path}`);

describe("isLanguageKey", () => {
  it("accepts a supported language and rejects anything else", () => {
    expect(isLanguageKey("zh-tw")).toBe(true);
    expect(isLanguageKey("fr")).toBe(false);
    expect(isLanguageKey(undefined)).toBe(false);
  });
});

describe("getLangFromId", () => {
  it("reads the language prefix from a language-scoped content id", () => {
    expect(getLangFromId("zh-tw/why-pure-function")).toBe("zh-tw");
    expect(getLangFromId("en/alpha")).toBe("en");
  });

  it("returns undefined when the id has no supported language prefix", () => {
    expect(getLangFromId("why-pure-function")).toBeUndefined();
    expect(getLangFromId("fr/why-pure-function")).toBeUndefined();
  });
});

describe("getSlugFromId", () => {
  it("removes the language prefix so the id can be used as a slug", () => {
    expect(getSlugFromId("zh-cn/why-pure-function")).toBe("why-pure-function");
  });

  it("leaves ids without a language prefix untouched", () => {
    expect(getSlugFromId("why-pure-function")).toBe("why-pure-function");
  });
});

describe("getLangFromUrl", () => {
  it("reads the language from the first path segment", () => {
    expect(getLangFromUrl(url("/zh-cn/posts/"))).toBe("zh-cn");
  });

  it("falls back to the default language for missing or unsupported segments", () => {
    expect(getLangFromUrl(url("/fr/posts/"))).toBe("en");
    expect(getLangFromUrl(url("/"))).toBe("en");
  });
});

describe("getPathFromUrl", () => {
  it("strips the language prefix but keeps the trailing slash", () => {
    expect(getPathFromUrl(url("/zh-tw/posts/"))).toBe("/posts/");
    expect(getPathFromUrl(url("/zh-tw/posts"))).toBe("/posts");
  });

  it("returns the root path when only a language is present", () => {
    expect(getPathFromUrl(url("/zh-tw/"))).toBe("/");
    expect(getPathFromUrl(url("/"))).toBe("/");
  });
});

describe("useTranslations", () => {
  it("returns the string for the requested language", () => {
    expect(useTranslations("zh-tw")("nav.home")).toBe("首頁");
  });

  it("falls back to the key when it is absent from every dictionary", () => {
    expect(useTranslations("zh-tw")("nope.not.a.key" as never)).toBe("nope.not.a.key");
  });

  it("replaces {name} placeholders with the supplied params", () => {
    expect(useTranslations("en")("home.more", { count: 3 })).toBe("… 3 more");
    expect(useTranslations("zh-cn")("posts.count", { count: 2 })).toBe("共 2 篇");
  });
});

describe("useTranslatedPath", () => {
  it("prefixes a path with the current language", () => {
    expect(useTranslatedPath("zh-tw")("/posts")).toBe("/zh-tw/posts");
  });

  it("can target another language", () => {
    expect(useTranslatedPath("en")("/posts", "zh-cn")).toBe("/zh-cn/posts");
  });

  it("keeps a trailing slash on the root path", () => {
    expect(useTranslatedPath("en")("/")).toBe("/en/");
  });
});

describe("with a configured deployment base", () => {
  it("prefixes outgoing links and parses incoming URLs without it", async () => {
    vi.stubEnv("PUBLIC_BASE_URL", "print");
    vi.resetModules();

    const i18n = await import("@/i18n/utils");

    // Outgoing links carry the base so they resolve on a sub-path deployment…
    expect(i18n.useTranslatedPath("en")("/posts")).toBe("/print/en/posts");
    expect(i18n.useTranslatedPath("en")("/")).toBe("/print/en/");
    // …while incoming URLs are parsed as if the base were not there.
    expect(i18n.getLangFromUrl(new URL("https://example.com/print/en/posts/"))).toBe("en");
    expect(i18n.getPathFromUrl(new URL("https://example.com/print/zh-tw/posts/"))).toBe("/posts/");

    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
