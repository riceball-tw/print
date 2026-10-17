/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // Run unit tests in a negative-offset timezone so `formatDate`'s
    // UTC guarantee is actually exercised, not just incidentally satisfied.
    env: { TZ: "America/New_York" },
  },
});
