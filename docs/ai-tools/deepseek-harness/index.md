---
sidebar_position: 4
slug: /ai-tools/deepseek-harness
title: DeepSeek Harness
description: DeepSeek Harness (dsh) — DeepSeek's open-source, MIT-licensed agent harness where "everything is a plugin". Run a coding agent from a desktop app, a local web UI, or headless in CI, with swappable models, tools, sandboxes, and even the agent loop itself.
---

# DeepSeek Harness

**DeepSeek Harness** (short name **`dsh`**) is DeepSeek's open-source **agent harness** — the runtime that turns a model into an agent. It is not a new model and not a chat wrapper: it is the layer that supplies tools, context, a control loop, a durable session log, and a sandbox around whichever model you plug in.

Its one-line design rule is unusually literal: **everything is a plugin**. The model adapter, the tool registry, the session log, the sandbox, the user interface, and even the agent loop can be mounted, replaced, or removed from configuration. There is no privileged core to patch.

![Animated diagram: a model box on the left and a ring of harness plugins — tools, session log, sandbox, prompt assembly, loop, UI — on the right, together forming an agent](/img/deepseek-harness/agent-model-harness.svg)

## At a glance

| Aspect | Detail |
|---|---|
| **What** | Open-source agent harness / agent runtime (`dsh`) |
| **Maker** | DeepSeek AI |
| **License** | MIT — source on [GitHub](https://github.com/deepseek-ai/deepseek-harness) |
| **First release** | v0.1 developer preview, 13 August 2026 (alongside DeepSeek-V4-Pro) |
| **Current build** | `0.2.2-rc.3` (13 November 2026) — every published version is a pre-release |
| **Architecture** | Built on [Cordis](https://github.com/cordiverse/cordis); plugin tree composed from *profiles*, *bundles*, and ordered *patch* layers |
| **Surfaces** | Desktop app (macOS arm64, Windows x64), local web UI, headless CLI, ACP server, Python and TypeScript SDKs |
| **Models** | DeepSeek by default; also Anthropic, OpenAI, Gemini, Bedrock, Azure, and any OpenAI-compatible or Anthropic-compatible gateway |
| **Safety model** | OS-level sandbox (Landlock, Seatbelt, Windows restricted token) plus approval prompts bundled into permission presets |
| **Install** | `npx @deepseek-ai/dsh@next web` (Node.js) or the desktop installer |
| **Status** | Developer preview — DeepSeek states it has **not** had a security audit and is not production-ready |

## The 30-second version

```bash
# 1. run the web UI (Node.js 22.19+ / 24+)
npx @deepseek-ai/dsh@next web
#    → http://127.0.0.1:3080 opens in your browser

# 2. in the UI: Settings → Models → paste a DeepSeek API key
# 3. choose a workspace (a project directory)
# 4. ask for something real
#    "Map this repository, then fix the failing test."
```

No browser needed for the scriptable path:

```bash
# one task, final answer on stdout, then exit
npx @deepseek-ai/dsh@next headless "run the tests and summarize failures"

# machine-readable event stream for CI
npx @deepseek-ai/dsh@next headless --json "run the tests"
```

The same agent, tools, sandbox, and session log are behind both commands — only the surface changes.

## Why it belongs in an AI-tools guide

Every serious coding agent in this section is a **model plus a harness**. DeepSeek's contribution is to make the harness itself open, inspectable, and re-composable:

- **Nobody owns the loop.** Change the model adapter, the tool set, the prompt assembly, or the sandbox by editing a YAML patch — no fork, no upstream PR (DeepSeek is not currently accepting external PRs).
- **Log-first, not chat-first.** Every prompt, reasoning block, tool call, and result lands in an append-only session log. Resume, fork, replay, search, and the Trajectory view all read the same event stream.
- **Runs the same everywhere.** Desktop app, browser UI, headless CI job, editor via ACP, or your own Python program — one runtime, different entry points.
- **Isolation is a first-class feature.** The sandbox is a plugin backed by real OS primitives, and approvals are bundled into switchable permission presets.

If [OpenCode](/docs/ai-tools/opencode/what-is-opencode) is the agent you use every day and [Herdr](/docs/ai-tools/herdr) is the desk it works at, DeepSeek Harness is the **workshop you can rebuild**: a harness you can take apart, rewire to your own gateway, and embed in your own tooling.

:::warning Developer preview
DeepSeek labels `dsh` experimental, warns that compatibility-breaking changes are coming, and says it must not be treated as secure or production-ready. Run it in a disposable VM or container with least privilege — the [safety notice](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md) is short and worth reading before your first session.
:::

## Full guide

- [What is DeepSeek Harness?](/docs/ai-tools/deepseek-harness/what-is-dsh) — the model/harness split, the plugin model, and what it is not
- [Why DeepSeek Harness?](/docs/ai-tools/deepseek-harness/why-dsh) — the problems it solves, honest trade-offs, and how it compares
- [Getting started](/docs/ai-tools/deepseek-harness/getting-started) — install, first run, model keys, workspace, updates, isolation
- [Core concepts](/docs/ai-tools/deepseek-harness/core-concepts) — profiles, bundles, patches, plugins, sessions, presets, tools, permissions
- [End-to-end walkthrough](/docs/ai-tools/deepseek-harness/workflow-walkthrough) — take a failing repo from "map it" to a verified fix
- [Modes and plugins](/docs/ai-tools/deepseek-harness/modes-and-plugins) — Standard, PTC, Minimal, Creator, plus the plugin and MCP surfaces
- [Automation and SDKs](/docs/ai-tools/deepseek-harness/automation-and-sdk) — headless CI, Python/TypeScript SDKs, ACP, schedules, webhooks
- [Use cases](/docs/ai-tools/deepseek-harness/use-cases) — eight practical patterns, from repo triage to plugin products
- [Troubleshooting](/docs/ai-tools/deepseek-harness/troubleshooting) — model keys, ports, sandbox denials, plugin load failures, upgrades

---

**See also:** [AI Tools overview](/docs/ai-tools) — DeepSeek Harness compared with [OpenCode](/docs/ai-tools/opencode), [Herdr](/docs/ai-tools/herdr), Cursor, and Claude Code.
