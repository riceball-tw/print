// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import astroExpressiveCode from "astro-expressive-code";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import { resolveBase } from "./src/utils/base.ts";
import mermaid from "./src/plugins/mermaid.ts";

// The deployment sub-path, e.g. `/print/` for https://<owner>.github.io/print/.
// Unset locally, so development and the test suites run from the root.
const base = resolveBase(process.env.PUBLIC_BASE_URL);

// https://astro.build/config
export default defineConfig({
  base,
  markdown: {
    // MDX inherits this processor, so the mermaid plugin covers every entry.
    processor: satteri({ mdastPlugins: [mermaid] }),
  },
  integrations: [
    // Must come before `mdx()` so MDX pages pick up the code block rendering.
    // Syntax highlighting and annotations for every fenced code block in
    // Markdown/MDX. The processor above is Sätteri, which Expressive Code
    // detects and extends directly, so no remark/rehype wiring is needed.
    // Styling and theme options live in the auto-detected `ec.config.mjs` at
    // the project root; Expressive Code imports it during `astro:config:setup`,
    // so there is nothing to import here.
    astroExpressiveCode(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
