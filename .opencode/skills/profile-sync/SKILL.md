---
name: Profile Sync
description: Update GitHub/LinkedIn profiles via a headed Playwright browser (user logs in manually, agent attaches over CDP) — bio/headline edits, profile verification, session reuse
---

# Profile Sync

Update the owner's social profiles (GitHub, LinkedIn) in a **visible**
browser so they can log in themselves; afterwards attach over CDP and make
edits. Use when asked to update GitHub/LinkedIn profile info.

## Safety rules

- **Never** see, type, or store passwords — the human does the login.
- Attach only to the local debugging port (`127.0.0.1:9222`).
- Keep LinkedIn edits minimal and slow (aggressive anti-automation); confirm
  intended wording with the user first.
- Show before/after for every change; verify GitHub changes afterwards via
  `curl -s https://api.github.com/users/vinaykagithapu`.

## Workflow

1. **Launch** (headed, visible on the X11 desktop, persistent session):

   ```sh
   NODE_PATH=$(npx playwright --version >/dev/null 2>&1 && ls -d ~/.npm/_npx/*/node_modules | head -1) \
     node scripts/login-browser.js   # from this skill's base dir
   ```

   Opens GitHub + LinkedIn login tabs; CDP on `:9222`; profile stored at
   `~/.cache/opencode/login-browser` (sessions survive restarts — check if
   already logged in before asking the human to log in again).

2. **Human logs in** to the requested sites.

3. **Attach & act** with `chromium.connectOverCDP('http://127.0.0.1:9222')`,
   then `browser.contexts()[0]` and find tabs by URL. Bundled scripts:

   | Script | Purpose |
   | --- | --- |
   | `scripts/login-browser.js` | launch headed browser + login tabs |
   | `scripts/li-read-profile.js` | read LinkedIn name/headline/about (source of truth) |
   | `scripts/gh-set-bio.js` | set GitHub bio (arg: text), screenshot before/after |

   Run them with `NODE_PATH=<playwright node_modules>` (see launch line) —
   playwright is in the npx cache, not in this repo's dependencies.

## Gotchas (verified)

- GitHub bio field is `textarea[name="user[profile_bio]"]` on
  `github.com/settings/profile` (was `user[bio]` — GitHub renamed it; if the
  selector misses, dump `form textarea` names and adapt). Save via the
  form's `button[type=submit]` matching /update|save/i; the page then shows
  "Profile updated successfully".
- LinkedIn profile top card: no stable selectors (hashed classes) — extract
  `main.innerText` and parse; own profile at `/in/vinaykagithapu/`.
- Headed Chrome needs `DISPLAY=:0` (X11 here); `viewport: null` +
  `--start-maximized` for a natural window; `ignoreDefaultArgs:
  ['--enable-automation']` avoids the "automation" banner.
- After edits, re-read the public page or API — form state ≠ published
  state until saved.

## Current synced state (2026-10)

- GitHub bio: `AI Infrastructure & Platform Engineer — building, securing & scaling AI/LLM platforms. Kubernetes · DevSecOps · cloud-native.`
- LinkedIn headline: `Building, Securing & Scaling AI | Senior Engineer` (owner-maintained — treat as source of truth)
- GitHub already has: name, company (Stealth AI Startup), location (Hyderabad), site URL, LinkedIn + blog social links.
