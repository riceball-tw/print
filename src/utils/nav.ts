import type { TranslationKey } from "@/i18n/ui";

export interface NavItem {
  name: string;
  url: string;
}

/** A navigation entry as stored in the site config. */
export interface NavigationEntry {
  translationKey: string;
  url: string;
}

/**
 * Turns the config's navigation entries into renderable items: the label is
 * translated and the language-relative URL is localized.
 */
export const buildNav = (
  navigation: NavigationEntry[],
  t: (key: TranslationKey) => string,
  translatePath: (path: string) => string,
): NavItem[] =>
  navigation.map((item) => ({
    name: t(item.translationKey as TranslationKey),
    url: translatePath(item.url),
  }));
