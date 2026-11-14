---
sidebar_position: 2
slug: why-dsh
title: Why DeepSeek Harness?
---

# Why DeepSeek Harness?

Plenty of agents can edit a file and run a test. The interesting question is *what you control* when they do. DeepSeek Harness is interesting because it exposes the parts that other tools usually keep to themselves.

## Six problems it solves

### 1. Model churn

A new frontier model lands every few weeks, and every agent product has to re-wire itself. In `dsh` the model is an **adapter plugin**: the provider catalog ships Anthropic, OpenAI, Gemini, Bedrock, Azure, and DeepSeek routes, plus custom OpenAI-compatible and Anthropic-compatible endpoints. Changing the model is a settings change, not an upgrade.

```text
Settings → Models → Add model provider
  provider id: my-gateway
  protocol:    openai-completions | openai-responses | anthropic-messages | google-generative-ai
  base URL:    https://llm.internal.example/v1
```

### 2. Opaque context

When an agent goes off the rails, the first question is "what did it actually see?" `dsh` records the answer: every system prompt, injected reminder, tool schema, reasoning block, and tool result is a session event you can replay in the Trajectory view. Compare that with staring at a transcript and guessing.

### 3. One-size-fits-all loops

Benchmark runs, everyday coding, and plugin authoring want different tool sets and different loop behaviour. `dsh` ships four **agent presets** — `standard`, `ptc`, `minimal`, and `cordis` (Creator) — selected per session, with the harness composing only the rows each one needs. See [Modes and plugins](./6-modes-and-plugins.md).

### 4. Trust boundaries

An agent that can run shell commands is a privilege decision, not a feature toggle. `dsh` uses real OS confinement — Linux **Landlock**, macOS **Seatbelt**, and a restricted-token runner on **Windows** — and bundles the sandbox mode with an approval policy into named **permission presets**. You can run a review agent read-only and a refactor agent in a workspace-write sandbox without editing code.

### 5. Automation surfaces

Most agent CLIs are interactive-first. `dsh` ships the same runtime behind five entry points:

| Entry point | Command | Use |
|---|---|---|
| Web UI | `dsh web` | Interactive work with diffs and approvals |
| Desktop app | installer | Same runtime, bundled Node, no terminal |
| Headless | `dsh headless "task"` | CI steps, batch jobs, cron |
| ACP | `dsh acp` | Editors and automation clients over stdio |
| SDK | `dsh sdk` / Python SDK | Embed the agent in your own program |

### 6. Team-scale work

Subagents (including optional providers that delegate to Claude Code and Codex binaries), Agent Teams, goal tracking, and scheduled reminders are all plugins in the same tree. A team can standardise on one profile patch instead of one person's dotfiles.

## What shipped in v0.2 (why now)

The August 2026 launch was a developer preview with a web UI and a headless mode. The v0.2 line added the parts that make it usable for everyday work:

- **Official desktop apps** for macOS (Apple silicon) and Windows (x64), bundling the `dsh` command so users do not need Node or pnpm.
- **A plugin management page** that installs, configures, enables, and disables plugins.
- **File and diff review** in a right-hand sidebar.
- **Document work** — send documents, spreadsheets, or PDFs and ask for charts or slides.
- **Automation tasks** — recurring prompts with run history and editable frequency.
- **Code mode (PTC)** — the model writes a program against a generated TypeScript SDK instead of issuing one tool call at a time.

## How it compares

| | DeepSeek Harness | Claude Code | Codex | OpenCode | Cursor |
|---|---|---|---|---|---|
| **Licence** | MIT, open source | Proprietary | Open source | Open source | Proprietary |
| **Surfaces** | Desktop, web UI, headless, ACP, SDK | Terminal, IDE, web | CLI, IDE, desktop, web | Terminal, desktop | Editor |
| **Models** | Any supported provider or compatible gateway | Claude | OpenAI | Any provider | Vendor-curated |
| **Extension model** | Everything is a plugin, including the loop | Plugins, commands, hooks | MCP, skills, plugins | Plugins, skills, MCP | Fixed feature set |
| **Isolation** | OS sandbox + approval presets | Managed sandbox | OS sandbox | Depends on host | Editor process |
| **Scriptability** | Headless JSON stream, ACP, Python/TS SDK | Headless mode | Headless mode | CLI/SDK | Limited |
| **Maturity** | Developer preview | GA | GA | GA | GA |

The maturity row is the honest one. Claude Code and Codex are finished products with support contracts; `dsh` is a preview that will break your config eventually.

## Where it wins

- You want **one harness across providers** — including an internal gateway or a self-hosted model.
- You need **auditable runs**: replay exactly what the model saw, and why a step was approved.
- You are **building on top of** an agent (a product feature, an internal tool, a CI reviewer) and need a runtime rather than a chat app.
- You want **hard isolation** by default, not a prompt that asks the model to behave.
- You like **small, composable pieces** more than a single opinionated binary.

## Where it will frustrate you

| Friction | What to expect |
|---|---|
| Preview churn | Config rows and presets move between releases; pin an exact version |
| Configuration depth | `cordis.patch.yml`, profiles, bundles, and patch precedence are a learning curve |
| Node/pnpm ecosystem | Plugins install through pnpm; peer dependencies are not automatic for experimental packages |
| Token appetite | Full tool sets and verbose trajectories cost tokens; `minimal` exists for a reason |
| Safety posture | No security audit, shell access, and third-party plugins — isolate it |
| No upstream patches | External PRs are not being accepted; contribute plugins instead |

## Choose `dsh` when…

- you want a **model-agnostic, inspectable harness** you can rewire;
- you need **headless automation with a real event stream**;
- you are comfortable reading a config file to change behaviour.

## Skip it when…

- you want a supported, stable, zero-config product today;
- your policy forbids preview software with shell access;
- your team already standardised on one vendor's agent and does not need portability.

:::tip Key takeaway
Choose DeepSeek Harness for **control and composability**, not for polish. It is the only mainstream harness in this guide where the loop, the log, and the sandbox are all yours to replace.
:::

---

**Next:** [Getting started →](./3-getting-started.md) — install it, add a model, and run a real task.
