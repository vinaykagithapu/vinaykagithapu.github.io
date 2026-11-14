---
sidebar_position: 9
slug: troubleshooting
title: Troubleshooting
---

# Troubleshooting

Most `dsh` failures are runtime problems wearing a model costume. Work outward: process → profile → model → workspace → permissions → prompt.

## First three commands

```bash
dsh --version                              # what am I actually running?
dsh --profile web --dump-config            # what does this profile boot?
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3080/   # is it up?
```

If those three are sane, skip to [Models](#models) or [Permissions and sandbox](#permissions-and-sandbox).

## Install and startup

| Symptom | Cause | Fix |
|---|---|---|
| `dsh: command not found` | Not installed globally, or a different Node prefix | Use `npx @deepseek-ai/dsh@<version>`, or check `npm bin -g` is on `PATH` |
| Engine/version error at startup | Node too old | Use Node 24 (the repo toolchain requires ≥ 24.9); 22.19+ works for the CLI |
| `EADDRINUSE` on 3080 | Another instance or app owns the port | `--port 3081`, or `--port 0` to let the OS choose |
| Browser did not open | SSH session, or `--no-open` | The UI prints the URL; forward the port with `ssh -L 3080:127.0.0.1:3080` |
| Bind refused for `0.0.0.0` | Wildcard binds are rejected by design | Pass one concrete interface address |
| Process exits before the UI appears | A profile row failed to load | Run with the loader's stderr visible; then `--dump-default-config` to compare against your patch |

**A profile that fails to load fails loudly.** Do not work around it by deleting rows blindly — compare `--dump-config` with `--dump-default-config` and look for the row your patch touched.

## Models

| Symptom | Likely cause | Fix |
|---|---|---|
| `401` / `403` | Bad key, or a GUI-saved key where it is not read | In headless, export `DEEPSEEK_API_KEY` (env → `<cwd>/.env` → `$DSH_HOME/.env`); the managed store is disabled there |
| Model list is empty | Endpoint does not publish a catalogue | Add model ids manually in **Customized settings** |
| `404` on requests | Wrong protocol or wrong base path | Match the protocol to the gateway; include `/v1` (or `/v1beta` for Gemini) in the base URL |
| Works in the UI, fails in CI | Different credential source | Export the key in the job environment; do not rely on `~/.dsh` |
| "Model not found" | Provider id or model id mismatch | Provider ids are permanent; rename means add-new + delete-old |
| Image input refused | Route does not declare image support | Enable **Image** input on that model, or use a vision-capable route |
| Reasoning effort ignored | Adapter default applied | Set effort explicitly; an omitted effort keeps the saved route default |

A gateway that speaks two protocols needs **two providers**. One entry cannot translate.

## Workspace and sessions

| Symptom | Likely cause | Fix |
|---|---|---|
| Composer disabled | No workspace, no model, or both | **Choose workspace**, **Settings → Models** |
| `--session-id` fails immediately | Unknown id, different cwd, different preset, or a subagent session | Use the exact id; resume from the same workspace and profile |
| Session feels "stuck in the past" | Model selection is recorded per step | Start a new session for a different model |
| Context/token growth | Long trajectory, verbose tools | New session; trim the workspace; consider `minimal` for narrow tasks |
| Fork looks like a copy | Fork branches history, it does not clone files | Use a git branch for code isolation |

## Permissions and sandbox

| Symptom | Meaning | Fix |
|---|---|---|
| `[sandbox: file access denied under <mode> mode]` | The sandbox enforced its boundary | Do not retry another way. Move the work inside the workspace, use `--add-dir`, or change the preset deliberately |
| Approval prompt never appears | Preset uses `never` (for example `danger-full-access`) | Switch to `workspace-write`, or pass `--approval-policy ask` |
| Approval loop on one command | Command needs a path outside the workspace | Grant the directory explicitly with `--add-dir` in headless, or restructure the task |
| A tool "does not exist" | Preset restriction filtered it from the scope | Expected: restricted tools are absent from the prompt and refuse execution |
| Plugin management refused | `plugin_manager` needs full access | Run plugin changes from the UI/CLI instead of the model |

:::warning Do not "fix" a sandbox denial by escalating
The denial is the feature. If a task genuinely needs another directory, grant that directory; if it needs full access, run the whole session in a disposable container instead of on your laptop.
:::

## Plugins

| Symptom | Cause | Fix |
|---|---|---|
| Install blocked by an `engines.dsh` requirement | Plugin targets a different runtime contract | Install the matching `dsh` version; do not bypass |
| `Cannot find package` at boot | Peer dependency not installed | Profiles do not install peers automatically — add them explicitly |
| Row does not appear in the tree | Wrong `id`, or the patch targeted a row that does not exist | `--dump-config` and check the exact row id |
| Config edit has no effect | Non-web profiles apply patches at startup | Restart the profile (the `web` profile reloads live) |
| Plugin crashes the app | A loaded plugin threw during mount | Disable its row, then bisect by re-enabling |
| Two plugins fight over a seam | Both provide the same service | Keep one provider per seam; restate the intended row in a later patch |

## Upgrades and breaking changes

Pre-release software moves. Three habits prevent most upgrade pain:

1. **Pin an exact version** — `@0.2.2-rc.3`, not `@next`, for anything you depend on.
2. **Read the upgrade guides** in the repository's `docs/upgrade-guide/` for the version you are jumping to; they name the rows and behaviours that changed.
3. **Test in a separate `DSH_HOME`** before changing your daily profile:

   ```bash
   DSH_HOME=~/dsh-labs/next dsh web
   ```

Remember that the `latest` dist-tag is also a pre-release. "Install the latest" is not the safe default it usually is.

## Desktop app

The desktop build bundles its own runtime and manages a reserved `desktop` profile, separate from your npm install's packages and lockfile. Consequences:

- A plugin installed through the npm CLI is **not** visible to the desktop app, and vice versa.
- Version drift between the two is normal; do not copy profile directories between them.
- If you remove the app, follow the official uninstall/cleanup guide rather than deleting `~/.dsh` wholesale — you may have unrelated sessions there.

## Where to look when it is genuinely the model

- **Trajectory** — did it call the tool you think it called, with the arguments you approved?
- **Session log** — `$DSH_HOME/profiles/<profile>/sessions/`; the raw sequence of events.
- **`--json` events** — machine-readable progress for headless runs.
- **stderr** — headless failures print `dsh: <code>: <message>`; reasoning streams under `dsh: reasoning:`.

If the trajectory shows the right tool calls and the wrong outcome, it is a prompt or model problem. If it shows the wrong calls, it is a tool-description problem. If it shows no calls, check permissions before blaming the model.

## Getting help

- **GitHub Discussions** — bug reports and feature requests are routed there; external PRs are not being accepted.
- **Discord** — linked from the repository README.
- **Docs** — the repository's `docs/user/` tree, plus the generated CLI help and config catalog.

When you ask for help, include: `dsh --version`, the profile name, `--dump-config` (redact keys), the failing prompt, and the trajectory excerpt. That is 90% of a good report.

:::tip Key takeaway
Bisect the stack: version → profile → credential → workspace → permission → prompt. The harness is unusually good at telling you which layer failed — the session log is not shy.
:::

---

**Back to:** [DeepSeek Harness overview](/docs/ai-tools/deepseek-harness) · [AI Tools](/docs/ai-tools)
