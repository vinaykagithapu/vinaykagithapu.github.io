---
name: Docusaurus Local Dev
description: Build, run, and preview this Docusaurus 3.9.2 portfolio site locally (npm install, build, serve/start, open browser), including the yarn update-notifier crash workaround
---

# Docusaurus Local Dev

Local development workflow for this Docusaurus 3.9.2 portfolio site
(vinaykagithapu.github.io). Use this when asked to run, build, preview, or
open the site locally.

## Commands

All commands run from the repo root. Node >= 20 required (Node 24 tested).

```sh
# 1. Install dependencies (npm is the working package manager on this machine)
npm install

# 2. Production build -> static output in build/
npm run build

# 3. Serve the production build locally at http://localhost:3000
NO_UPDATE_NOTIFIER=1 npm run serve -- --host 0.0.0.0 --port 3000 --no-open

# Dev server with live reload instead (no build/ needed):
# NO_UPDATE_NOTIFIER=1 npm run start -- --host 0.0.0.0 --port 3000 --no-open

# 4. Open in the browser (Linux)
xdg-open http://localhost:3000/
```

Run long-lived serve/start commands in the background, then verify with
`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` before
opening the browser.

## Known gotchas (verified locally)

- **`yarn --version` ENOENT crash**: the repo has both `package-lock.json`
  and `yarn.lock`, but yarn may not be installed. When a newer Docusaurus
  release exists, the CLI update notifier (`node_modules/@docusaurus/core/bin/beforeCli.mjs`)
  sees `yarn.lock` and spawns `yarn --version`, which crashes the whole CLI
  for `start`/`serve`/`build`. Fix: prefix commands with `NO_UPDATE_NOTIFIER=1`
  (disables the notifier before it touches yarn.lock), or install yarn via
  `corepack enable`. Do not delete `yarn.lock` — both lockfiles are tracked
  and maintained in git.
- **`--host` takes a value**: `docusaurus serve --host --port 3000` parses
  `--port` as the host value and `3000` as the siteDir (ENOENT lstat '3000').
  Always pass `--host 0.0.0.0` (or omit `--host` entirely).
- **`onBrokenLinks: 'throw'`** in `docusaurus.config.js`: the build fails on
  any broken internal link. Fix links before assuming a content error.
- **Blog tags must be declared**: undeclared frontmatter tags produce build
  warnings; define them in `blog/tags.yml` (e.g. `chatbot`, `conversational-ai`
  were missing from a 2026-02-01 post).
- **Mermaid is enabled** site-wide (`@docusaurus/theme-mermaid`,
  `markdown.mermaid: true`), so fenced ```mermaid blocks render as diagrams.
- Deps install may warn about `core-js` postinstall scripts not in
  `allowScripts`; harmless for building.

## Site structure

- `docs/` — tutorials (mlops, devops, devsecops, security), sidebar in `sidebars.js`
- `blog/` — posts under `YYYY-MM-DD-slug/index.md`, authors in `blog/authors.yml`
- `src/pages/` — standalone pages (`about`, `projects.js` card grid, `markdown-page`)
- `src/css/custom.css` — **entire theme design system** (see below)
- `docusaurus.config.js` — site config: dark default theme, baseUrl `/`,
  trailingSlash true, deployment to gh-pages via `npm run deploy`

## Design system (2026 refresh, branch `feature/site-design-refresh`)

Dark-first "cloud native" theme: deep slate surfaces (#0a0f1a bg / #0f172a
surface), cyan→indigo gradient accents, Inter Variable typography.

Where to change what:

| Thing | Where |
| --- | --- |
| Colors, typography, buttons, cards, blog cards, footer, navbar, scrollbar | `src/css/custom.css` (Infima `:root` + `[data-theme='dark']` vars, then component overrides) |
| Brand gradient | `--site-gradient` / `--site-gradient-soft` in `custom.css` |
| Hero: mesh bg, avatar ring, status chip, tech chips | `src/pages/index.js` + `index.module.css` |
| Homepage feature cards (SVG icons, no emoji) | `src/components/HomepageFeatures/` |
| Projects card grid | `src/pages/projects.js` (data in `ProjectList` array) + `projects.module.css` |
| Brand assets: `logo.svg`, `favicon.svg` (SVG gradient `#22d3ee→#6366f1`), `favicon.ico` (PNG-in-ICO), `social-card.png` (og:image) | `static/img/` — VK letterforms are **pure vector strokes, no `<text>`** (edit the `<g>` path data in both SVGs; they share a 100×100 viewBox). Social scrapers need raster, so `themeConfig.image` must point at `social-card.png`, never an SVG. Regenerate the raster pair with a Playwright script (render SVG 32×32 `omitBackground` + 1200×630 HTML card; wrap PNG bytes in ICO header via Python — no ImageMagick here). Unused Docusaurus template images were deleted; keep `static/img/` limited to these four files + your own assets. |

Gotchas discovered while styling (Infima quirks):

- `.footer--dark` declares `--ifm-footer-background-color` **on the element**;
  override it with a `.footer--dark { ... }` rule, not just `:root`.
- `.button.button--secondary` (two classes) beats `.button--secondary` —
  match the doubled selector for color overrides.
- Blog list items are `<article class="margin-bottom--xl">` with CSS-module
  hashed title classes; target `.blog-wrapper article` / `[class*='...']`,
  never the hash (`title_f1Hy` changes between versions).
- `custom.css` loads after Infima, so equal-specificity overrides win.

## Visual verification with Playwright

A screenshot script lives at `/tmp/opencode/shoot.js` (recreate if missing):
it captures 9 key pages at 1440×900 full-page into `/tmp/opencode/shots/`.

```sh
# Playwright is in the npx cache, not local deps:
NODE_PATH=/home/vinay/.npm/_npx/705bc6b22212b352/node_modules node /tmp/opencode/shoot.js <label>
NODE_PATH=/home/vinay/.npm/_npx/705bc6b22212b352/node_modules node /tmp/opencode/shoot.js <label>-light light
```

(The `light` arg sets `localStorage.theme=light` before load; it shoots
home/blog/docs only.) If NODE_PATH resolution fails, run
`npx playwright --version` first or `npm i -D playwright` in a scratch dir.
Browsers are cached at `~/.cache/ms-playwright`.

Workflow: rebuild (`npm run build`) → screenshot → `read` the PNGs to
review design changes. `docusaurus serve` picks up the new `build/`
output without a restart.
