# [Print](https://riceball-tw.github.io/print/en/)

> A minimal, TUI-inspired blog theme powered by Astro v7

## Key Features

Start writing [posts](https://riceball-tw.github.io/print/en/posts/) or [notes](https://riceball-tw.github.io/print/en/notes/) in typed Markdown or MDX. Everything on the site — navigation, categories, translations, colors — is configured from files you own.

- **Static by default** — a fully prerendered Astro site; JavaScript only where it earns its place
- **Two content types** — long-form `post`s and feed-style `note`s, each with its own index, detail page, and category pages
- **Built-in i18n** — English, 简体中文, and 繁體中文, each served from its own subpath (`/en/`, `/zh-cn/`, `/zh-tw/`); translation keys are type-checked
- **Typed content** — MDX/Markdown front matter validated with Zod, so a missing `headline` fails the build instead of the page
- **Expressive code blocks** — syntax highlighting, editor and terminal frames, line markers, and a copy button on every fenced block, themed by the site's light/dark toggle
- **TUI aesthetic** — a blinking cursor in the wordmark, `[bracketed]` active navigation items, monospace metadata, hairline rules
- **Light & dark themes** — one toggle, persisted in `localStorage`, applied before first paint so there is no flash
- **Responsive** — a fixed top bar on small screens, a fixed side rail on large ones
- **Deploy-anywhere** — a configurable base path means the same build works at a domain root or under a GitHub Pages sub-path
- **Tested** — Vitest unit tests next to the code, Playwright end-to-end tests for what a reader actually does
- **CI/CD** — type checking, linting, tests, and deployment on every push to `main` via [Cloudflare Pages](https://pages.cloudflare.com/) or [GitHub Pages](https://pages.github.com/)

## Getting Started

### Development

```sh
# 1. Clone the repository
git clone https://github.com/riceball-tw/print.git .

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm run dev
```

The site is served at `http://localhost:4321` and redirects to the default language (`/en/`).

### Build

```sh
# Locally — deploy the contents of the `./dist` folder wherever you like
pnpm install
pnpm build
pnpm preview
```

### Commands

All commands run from the root of the project:

| Command                | Action                                                        |
| :--------------------- | :------------------------------------------------------------ |
| `pnpm install`         | Installs dependencies                                         |
| `pnpm dev`             | Starts the dev server at `localhost:4321`                     |
| `pnpm build`           | Builds the production site into `./dist/`                     |
| `pnpm preview`         | Previews the production build locally                         |
| `pnpm test`            | Runs the Vitest unit tests once                               |
| `pnpm test:watch`      | Runs the Vitest unit tests in watch mode                      |
| `pnpm test:e2e`        | Builds the site and runs the Playwright suites                |
| `pnpm test:e2e:deploy` | Runs the Playwright suite against a sub-path deployment build |
| `pnpm typecheck`       | Runs `astro check`                                            |
| `pnpm lint`            | Runs oxlint                                                   |
| `pnpm lint:fix`        | Runs oxlint with `--fix`                                      |
| `pnpm fmt`             | Formats the source with oxfmt                                 |
| `pnpm fmt:check`       | Checks formatting without writing                             |
| `pnpm astro ...`       | Runs CLI commands like `astro add`, `astro check`             |

### Customization

1. `src/data/config.json`: site config — brand name, description, copyright, social links, and navigation (labels are translation keys, paths are language-relative)

2. `src/content/post`, `src/content/note`: your writing (Markdown / MDX), one folder per language and slug

3. `src/i18n/ui.ts`: translations and locale metadata — English is the source of truth, and every other language must define the same keys

4. `src/styles/global.css`: the palette, typography, and layout tokens, plus the base and component styles

5. `ec.config.mjs`: Expressive Code themes and style overrides, auto-loaded from the project root. A demo post lives at `/en/posts/expressive-code-demo/`

6. `public`: static assets served as-is (favicon, images, and anything else you drop in)

7. `src/utils`: the small pure helpers the pages are built from (dates, slugs, navigation, previews, grids, theme)

8. `astro.config.mjs`: Astro configuration, including the deployment base path

9. `.github/workflows`: the CI and GitHub Pages deployment pipelines

### Writing content

Content lives in `src/content/{post|note}/{lang}/{slug}/index.mdx`. The language is the first path segment and the slug is the rest of the path.

A post:

```mdx
---
isDraft: false
headline: "Understand Astro islands and partial hydration"
subHeadline: "See how Astro ships a static page by default."
excerpt: "Islands are the mental model behind Astro's promise to ship less JavaScript."
category: "Astro"
publishDate: 2023-08-14
lastModifiedDate: 2023-09-02 # optional
---
```

A note:

```mdx
---
headline: "Demo Note"
publishDate: 2024-04-22
category: "Non-Technical Discussion"
---
```

Draft posts (`isDraft: true`, the default) are visible in development and excluded from production builds.

### Deployment

`.github/workflows/deploy.yml` runs on every push to `main` and supports **two deployment targets** that run in parallel after the build:

| Target | What you need |
| :--- | :--- |
| **GitHub Pages** | Enable Pages in repo Settings; set `PUBLIC_BASE_URL` to the repo name (e.g. `print`) |
| **Cloudflare Pages** | Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets |

#### GitHub Pages

A GitHub Pages **project** site is served from a sub-path (`https://<owner>.github.io/<repo>/`), so set a repository variable named `PUBLIC_BASE_URL` to the repository name (e.g. `print`). For a site at a domain root — a custom domain or Cloudflare Pages — leave it empty or set it to the full URL. Every generated link goes through the base path so one build works correctly in both cases.

The workflow resolves `PUBLIC_BASE_URL` into an absolute `PUBLIC_SITE_URL` used by `sitemap-index.xml` and `robots.txt`. Set a `PUBLIC_SITE_URL` repository variable to override at build time. Locally and in tests neither variable is set, so the builds skip sitemap generation.

See [`src/utils/base.ts`](src/utils/base.ts) for how the base path is resolved and applied.

#### Cloudflare Pages

Add the following two secrets to your repository (**Settings → Secrets and variables → Actions**):

| Secret | Where to get it |
| :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens (needs *Cloudflare Pages: Edit* permission) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar on any Pages or Workers page |

Leave `PUBLIC_BASE_URL` empty (or set it to your custom domain) so the site resolves paths from the root.

### Testing

Unit tests live next to the code they cover (`src/**/*.test.ts`) and run with Vitest; end-to-end tests live in `e2e/` and run with Playwright against a preview build. A second suite in `e2e-deploy/` builds the site with `PUBLIC_BASE_URL=print` to check the deployment sub-path.

```sh
pnpm test       # unit tests
pnpm test:e2e   # browser tests, including the sub-path deployment suite
```

## Project structure

```text
/
├── e2e/                 # Playwright tests for the root-served site
├── e2e-deploy/          # Playwright tests for a sub-path deployment
├── public/              # static assets (favicon, images)
├── src/
│   ├── components/      # Astro components (navbar, footer, post items, …)
│   ├── content/         # posts and notes, one folder per language
│   ├── data/            # site config (config.json)
│   ├── i18n/            # translations and locale helpers
│   ├── layouts/         # shared page shell
│   ├── pages/           # routes, one folder per language
│   ├── styles/          # global.css — tokens, base styles, components
│   └── utils/           # pure helpers (dates, slugs, navigation, …)
├── astro.config.mjs
├── ec.config.mjs
├── playwright.config.ts
└── vitest.config.ts
```

## Helping out

For questions or support, please open an issue on GitHub.

## License

MIT
