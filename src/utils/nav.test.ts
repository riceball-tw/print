import { describe, expect, it } from "vitest";
import type { TranslationKey } from "@/i18n/ui";
import { buildNav } from "@/utils/nav";

const labels = { "nav.home": "Home", "nav.posts": "Posts" } satisfies Partial<
  Record<TranslationKey, string>
>;

const t = (key: TranslationKey) => labels[key as keyof typeof labels] ?? key;
const translatePath = (path: string) => `/en${path}`;

describe("buildNav", () => {
  it("translates each label and localizes each url, preserving order", () => {
    const nav = buildNav(
      [
        { translationKey: "nav.home", url: "/" },
        { translationKey: "nav.posts", url: "/posts" },
      ],
      t,
      translatePath,
    );

    expect(nav).toEqual([
      { name: "Home", url: "/en/" },
      { name: "Posts", url: "/en/posts" },
    ]);
  });

  it("returns an empty list for empty navigation", () => {
    expect(buildNav([], t, translatePath)).toEqual([]);
  });
});
