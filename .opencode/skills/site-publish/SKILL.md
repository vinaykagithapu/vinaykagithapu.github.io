---
name: Site Publish
description: Git workflow for this site — feature branches, GitHub PR creation/merge via REST API (no gh CLI here), docusaurus deploy to gh-pages with required env vars, and post-deploy verification
---

# Site Publish

How to take changes from a feature branch to the live site
(https://vinaykagithapu.github.io). Use when asked to open a PR, merge,
deploy, or publish.

## Workflow overview

```
feature branch → push → PR (GitHub API) → merge → git pull main
  → npm run deploy (build + push gh-pages) → verify live
```

## 1. Push & PR (no gh CLI in this environment)

`gh` is not installed and no `GH_TOKEN` exists, but **git push works** —
credentials come from git's configured helper. Reuse them for the REST API
without ever printing the token:

```sh
token=$(printf 'protocol=https\nhost=github.com\n\n' | git credential fill 2>/dev/null | sed -n 's/^password=//p')

# Create PR (then /pulls/7/merge with merge_method + delete_branch: true)
curl -s -H "Authorization: Bearer $token" \
  -d '{"title":"...","head":"<branch>","base":"main","body":"..."}' \
  https://api.github.com/repos/vinaykagithapu/vinaykagithapu.github.io/pulls
```

- Encode request bodies with python3 (heredoc) — never interpolate secrets
  into the command text; keep them in shell variables.
- Try `merge_method: "merge"`, fall back to `squash` → `rebase`.
- Keep the token out of output/transcripts: capture into a var, only echo API
  responses.

## 2. Deploy to GitHub Pages

Publishing is **not** GitHub Actions (no workflows in this repo) — the site
serves the `gh-pages` branch, pushed by Docusaurus:

```sh
GIT_USER=vinaykagithapu \
GIT_USER_NAME="Vinay Kagithapu" \
GIT_USER_EMAIL=vinaykagithapu@Vinays-MacBook-Pro.local \
NO_UPDATE_NOTIFIER=1 npm run deploy
```

Env-var gotchas (all verified the hard way):

- **`GIT_USER`** goes into the clone URL → must have **no spaces**
  (a "Vinay Kagithapu" value fails with `fatal: Too many arguments`).
- **`GIT_USER_NAME` / `GIT_USER_EMAIL`** set the commit identity inside the
  temp gh-pages clone — repo-local `git config` does NOT reach it, and
  without them the commit dies with "Author identity unknown".
- **`NO_UPDATE_NOTIFIER=1`** is still required (see the local-dev skill:
  yarn.lock + missing yarn crashes the CLI otherwise).
- Deploy = fresh `docusaurus build` + clone gh-pages + force-push. Success
  ends with "Website is live at https://vinaykagithapu.github.io/."
- **If `npm run deploy` hangs/times out** (happened once — no output for 10min,
  remote gh-pages untouched): deploy manually. Same result, fully deterministic:

```sh
NO_UPDATE_NOTIFIER=1 npm run build           # 1. fresh build (verify new content in build/)
git worktree add --detach /tmp/gh origin/gh-pages
git -C /tmp/gh checkout -q -B gh-pages origin/gh-pages
rsync -a --delete --exclude .git build/ /tmp/gh/   # 2. .nojekyll comes along
git -C /tmp/gh add -A
git -C /tmp/gh -c user.name="Vinay Kagithapu" -c user.email="…" \
    commit -m "Deploy website - based on $(git rev-parse HEAD)"
git -C /tmp/gh push origin gh-pages         # 3. plain push, no force needed
git worktree remove --force /tmp/gh
```

## 3. Post-deploy verification

```sh
curl -s https://vinaykagithapu.github.io/ -o live.html -w "HTTP %{http_code}\n"
grep -o 'og:image[^>]*' live.html                 # must be social-card.png
css=$(grep -o '/assets/css/styles\.[a-z0-9]*\.css' live.html | head -1)
curl -s "https://vinaykagithapu.github.io$css" | grep -o '0a0f1a\|22d3ee' | sort -u
# assets: /img/{logo.svg,favicon.svg,favicon.ico,social-card.png} all 200
```

A new hashed `styles.*.css` filename = the fresh build is live.

## Repo facts

- Remote: `origin` = github.com/vinaykagithapu/vinaykagithapu.github.io (HTTPS, credentialed push works)
- Default branch `main`; deploy branch `gh-pages` (force-pushed by deploy)
- **`.env.example`** at repo root samples every env var used here (GITHUB_TOKEN*,
  GIT_USER*, NO_UPDATE_NOTIFIER) — copy to `.env` (gitignored) and fill in.
  Never commit real values; keys only in commits/docs.
- Git identity is configured **repo-locally** (Vinay Kagithapu) — global config absent
- Open PRs: `https://github.com/<owner>/<repo>/compare/<branch>...main`
