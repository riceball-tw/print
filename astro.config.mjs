// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { resolveBase } from "./src/utils/base.ts";

// The deployment sub-path, e.g. `/print/` for https://<owner>.github.io/print/.
// Unset locally, so development and the test suites run from the root.
const base = resolveBase(process.env.PUBLIC_BASE_URL);

// https://astro.build/config
export default defineConfig({
  base,
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
