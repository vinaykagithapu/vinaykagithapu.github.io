---
sidebar_position: 3
slug: getting-started
title: Getting Started
---

# Getting Started

This chapter takes you from nothing to a working agent, then to a headless run you can put in a script. Budget ten minutes.

## Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js 22.19+ or 24+** | Required for the `npm`/`npx` path and the source build (the repo's own toolchain pins Node ≥ 24.9) |
| **A model credential** | A DeepSeek API key is the shortest path; Anthropic/OpenAI/Gemini or a compatible gateway also work |
| **Git** | Optional for the harness, essential for real work |
| **pnpm** | Only for running from source (`pnpm@11.x`) |

:::warning Run it somewhere disposable
DeepSeek's [safety notice](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md) is explicit: the project has not had a security audit, it can execute model-generated commands, and it can load third-party plugins. Use a throwaway VM, a container, or at minimum a scratch checkout with no production credentials.
:::

## Install path A — try it with `npx`

Nothing to install permanently:

```bash
npx @deepseek-ai/dsh@next web
```

That starts the Web UI on **http://127.0.0.1:3080** and opens your browser. On a headless or SSH machine it prints the forwarded URL instead, so a local browser port-forward is enough:

```bash
ssh -L 3080:127.0.0.1:3080 you@server
# then, on the server:
npx @deepseek-ai/dsh@next web --no-open
```

Useful `web` flags:

| Flag | Effect |
|---|---|
| `--port <n>` | Listen on another port (`0` lets the OS choose) |
| `--host <addr>` | Bind one concrete local interface (wildcard addresses are rejected) |
| `--no-open` | Do not launch a browser |
| `--public-url <url>` | Advertise a reverse-proxy root (see [Automation and SDKs](./7-automation-and-sdk.md)) |
| `--tls-cert` / `--tls-key` | Serve HTTPS directly |

## Install path B — the desktop app

The v0.2 line ships official desktop apps for **macOS (Apple silicon)** and **Windows (x64)** from [deepseek.com/harness](https://www.deepseek.com/en/harness/). The app bundles its own `dsh` runtime, so you do not need Node.js or pnpm.

- Sign in with a DeepSeek account **or** add an API key.
- Account sign-in can include web search without a separate search key.
- Plugin management, diff review, and automation tasks are in the same UI.
- On Linux, use the `npx` or source path; there is no desktop build for it in v0.2.

## Install path C — from source

For contributors, or when you want to read the code you are running:

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm dsh` runs the TypeScript entry from the checkout; `pnpm run build` produces the artifacts. If you want a global command built from your clone, link the CLI package the way the repo's development guide describes rather than copying `lib/` around.

## First run: model, workspace, task

A fresh Web UI has **no model and no workspace**, and the composer stays disabled until both exist.

### 1. Add a model

**Settings → Models →** paste a DeepSeek API key and save. Keys are write-only in the UI; the value is stored in `$DSH_HOME/.credentials.yaml` and settings keep only a credential reference. The route becomes usable immediately — no restart.

For anything else:

- **Third-party provider:** pick a shipped provider id (`anthropic`, `openai`, `moonshotai`, `zai`, …) and add its key.
- **Custom model API:** supply a lowercase provider id, base URL, one protocol (`openai-completions`, `openai-responses`, `anthropic-messages`, or `google-generative-ai`), a credential, and at least one model id.
- **Discovery:** "Fetch available models" asks the endpoint what it serves; if it answers in an unexpected format, add model ids by hand.

### 2. Choose a workspace

Click **Choose workspace** and add the project directory. The directory becomes the agent's filesystem root and the authority boundary for file writes.

### 3. Ask for something real

Start with an orientation prompt, not a code change:

```text
Summarize this repository: what it builds, the main packages, how tests run,
and the three riskiest places to change.
```

Then something small and verifiable:

```text
Find the failing test, explain why it fails, then fix it and re-run only
that test file. Show me the diff before you commit anything.
```

The agent will read files, run commands, and pause for approval where the permission preset requires it.

## Headless smoke test

Prove the runtime works without a browser:

```bash
cd ~/src/my-project
npx @deepseek-ai/dsh@next headless "Summarize the README in three bullets"
```

- The final answer goes to **stdout**, diagnostics to **stderr**, and the process exits `0` on a completed turn, `1` otherwise.
- Credentials are read from the environment, then `<cwd>/.env`, then `$DSH_HOME/.env`.
- Add `--json` for a newline-delimited event stream (`session`, `status`, `text`, `thinking`, `tool_call`, `tool_result`, `final`).

```bash
export DEEPSEEK_API_KEY=sk-...
npx @deepseek-ai/dsh@next headless --json "run the tests" | jq -r 'select(.type=="final")'
```

## Where everything lives

```text
$DSH_HOME/                     # default: ~/.dsh
├── .credentials.yaml          # saved API keys (write-only in the UI)
├── .env                       # optional environment fallback
└── profiles/
    └── web/                   # one directory per profile
        ├── cordis.patch.yml   # your overrides for this profile
        ├── package.json       # installed plugins
        └── sessions/          # persisted session logs
```

Two commands make the composition legible:

```bash
# what this profile actually boots (bundles + your patch + overlays)
dsh --profile web --dump-config

# only the shipped layers, without your overrides
dsh --profile web --dump-default-config
```

## Versioning and updates

There is **no stable release**. Every published version is a pre-release, so pin what you run:

```bash
# inspect the channels
npm view @deepseek-ai/dsh dist-tags

# pin the build this guide was written against
npm install -g @deepseek-ai/dsh@0.2.2-rc.3

# or track the newest prerelease (expect breakage)
npm install -g @deepseek-ai/dsh@next
```

```bash
dsh --version
```

`DSH_HOME` can point at a separate directory per experiment:

```bash
DSH_HOME=~/dsh-experiments/today dsh web
```

That keeps profiles, plugins, and sessions isolated — the fastest way to test a risky config change without touching your daily setup.

## Isolating a run in a container

For headless work, a disposable container is the simplest guardrail:

```bash
docker run --rm -it \
  -v "$PWD:/work" -w /work \
  -e DEEPSEEK_API_KEY \
  node:24-bookworm \
  bash -lc 'npx @deepseek-ai/dsh@next headless "run the tests and summarize failures"'
```

Only that project directory is mounted. For the GUI, prefer a disposable VM (or a dedicated user account) — a browser session inside a container needs deliberate port and bind-address work, and `dsh` rejects wildcard binds.

:::tip Key takeaway
Start with `npx @deepseek-ai/dsh@next web`, add a key and a workspace, and keep the first session read-only in spirit: ask for a map of the repo before letting the agent write. Then pin the version you liked.
:::

---

**Next:** [Core concepts →](./4-core-concepts.md) — what a profile, a bundle, a preset, and a session actually are.
