// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
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
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
