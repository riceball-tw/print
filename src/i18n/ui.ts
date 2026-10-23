// Translation dictionaries and locale metadata for the site.
//
// This follows the official Astro i18n recipe:
// https://docs.astro.build/en/recipes/i18n/
//
// Each language is served from its own subpath (e.g. `/en/`, `/zh-tw/`).
// English is the default language and is fully translated here, so it doubles
// as the source of truth for the set of translation keys.

export const languages = {
  en: "English",
  "zh-cn": "简体中文",
  "zh-tw": "繁體中文",
} as const;

export const defaultLang = "en" satisfies keyof typeof languages;

// IETF BCP 47 language tags, used for the <html lang> attribute.
// https://www.w3.org/International/questions/qa-choosing-language-tags
export const languageTags = {
  en: "en",
  "zh-cn": "zh-Hans",
  "zh-tw": "zh-Hant-TW",
} as const;

// Compact labels the language picker shows in the narrow top bar, where the
// full names would crowd out the navigation. Keyed like `languages`, so every
// language has to provide one, and kept shorter than the full name.
export const languageShortNames = {
  en: "EN",
  "zh-cn": "简",
  "zh-tw": "繁",
} as const satisfies Record<keyof typeof languages, string>;

const en = {
  "nav.home": "Home",
  "nav.posts": "Posts",
  "nav.shortposts": "Shortposts",
  "nav.about": "About",
  "home.postsByCategory": "Posts by category",
  "home.more": "… {count} more",
  "posts.title": "Posts",
  "posts.description": "Every post, newest first.",
  "posts.count": "{count} entries",
  "shortposts.title": "Shortposts",
  "shortposts.description": "Quick thoughts and updates, newest first.",
  "shortposts.count": "{count} entries",
  "categories.title": "Categories",
  "categories.description": "Posts grouped by category, newest first.",
  "categories.more": "… {count} more",
  "categories.less": "… less",
  "common.back": "[ back ]",
  "common.top": "[ top ]",
  "footer.links": "connect:",
  "language.select": "Please select language",
  "language.unavailable": "Not available in this language",
  "notfound.kicker": "Error 404 · Not in this print run",
  "notfound.title": "That page was never printed.",
  "notfound.body":
    "The document you asked for is not in the archive. It may have moved, been unpublished — or the address may hold a typo.",
  "notfound.pathLabel": "requested",
  "theme.toggle": "Toggle color theme",
  "theme.light": "[light]",
  "theme.dark": "[dark]",
} as const;

// `satisfies` keeps every language in sync with the English keys: adding a key
// to `en` without translating it elsewhere becomes a type error.
const zhCn = {
  "nav.home": "首页",
  "nav.posts": "文章",
  "nav.shortposts": "短帖",
  "nav.about": "关于",
  "home.postsByCategory": "按分类浏览文章",
  "home.more": "… 还有 {count} 篇",
  "posts.title": "文章",
  "posts.description": "所有文章，最新在前。",
  "posts.count": "共 {count} 篇",
  "shortposts.title": "短帖",
  "shortposts.description": "快速想法与更新，最新在前。",
  "shortposts.count": "共 {count} 条",
  "categories.title": "分类",
  "categories.description": "按分类浏览文章，最新在前。",
  "categories.more": "… 还有 {count} 个",
  "categories.less": "… 收起",
  "common.back": "[ 返回 ]",
  "common.top": "[ 顶部 ]",
  "footer.links": "联系：",
  "language.select": "请选择语言",
  "language.unavailable": "此页面暂无该语言版本",
  "notfound.kicker": "错误 404 · 不在本次印刷中",
  "notfound.title": "这一页从未被印出。",
  "notfound.body": "您查找的文档不在归档中。它可能已被移动或从未发布——也可能是网址打错了。",
  "notfound.pathLabel": "请求路径",
  "theme.toggle": "切换配色主题",
  "theme.light": "[明亮]",
  "theme.dark": "[黑暗]",
} satisfies Record<keyof typeof en, string>;

const zhTw = {
  "nav.home": "首頁",
  "nav.posts": "文章",
  "nav.shortposts": "短帖",
  "nav.about": "關於",
  "home.postsByCategory": "依分類瀏覽文章",
  "home.more": "… 還有 {count} 篇",
  "posts.title": "文章",
  "posts.description": "所有文章，最新在前。",
  "posts.count": "共 {count} 篇",
  "shortposts.title": "短帖",
  "shortposts.description": "快速想法與更新，最新在前。",
  "shortposts.count": "共 {count} 條",
  "categories.title": "分類",
  "categories.description": "依分類瀏覽文章，最新在前。",
  "categories.more": "… 還有 {count} 個",
  "categories.less": "… 收合",
  "common.back": "[ 返回 ]",
  "common.top": "[ 頂端 ]",
  "footer.links": "聯繫：",
  "language.select": "請選擇語言",
  "language.unavailable": "此頁面暫無該語言版本",
  "notfound.kicker": "錯誤 404 · 不在此次印刷中",
  "notfound.title": "這一頁從未被印出。",
  "notfound.body": "您查找的文件不在歸檔中。它可能已被移動或從未發布——也可能是網址打錯了。",
  "notfound.pathLabel": "請求路徑",
  "theme.toggle": "切換配色主題",
  "theme.light": "[明亮]",
  "theme.dark": "[黑暗]",
} satisfies Record<keyof typeof en, string>;

export const ui = {
  en,
  "zh-cn": zhCn,
  "zh-tw": zhTw,
} satisfies Record<keyof typeof languages, Record<string, string>>;

export type LanguageKey = keyof typeof languages;
export type TranslationKey = keyof typeof en;
