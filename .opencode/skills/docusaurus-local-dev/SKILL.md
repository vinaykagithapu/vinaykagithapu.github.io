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
- `src/pages/` — standalone pages (`about`, `projects`, `markdown-page`)
- `src/css/custom.css` — theme customization
- `docusaurus.config.js` — site config: dark default theme, baseUrl `/`,
  trailingSlash true, deployment to gh-pages via `npm run deploy`
