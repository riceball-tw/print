import { getCollection } from "astro:content";
import type { LanguageKey } from "@/i18n/ui";
import { getLangFromId } from "@/i18n/utils";

export const shortposts = await getCollection("shortpost");

export const dateSortedShortposts = [...shortposts].sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
);

/** Shortposts written in the given language, newest first. */
export const shortpostsByLang = (lang: LanguageKey) =>
  dateSortedShortposts.filter((shortpost) => getLangFromId(shortpost.id) === lang);

/** The categories that have shortposts in the given language, alphabetically. */
export const shortpostCategoriesByLang = (lang: LanguageKey) =>
  [...new Set(shortpostsByLang(lang).map((shortpost) => shortpost.data.category))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );

/** The given language's shortposts grouped by their category. */
export const shortpostsByCategoryForLang = (lang: LanguageKey) =>
  shortpostCategoriesByLang(lang).map((category) => ({
    category,
    shortposts: shortpostsByLang(lang).filter(
      (shortpost) => shortpost.data.category === category,
    ),
  }));
