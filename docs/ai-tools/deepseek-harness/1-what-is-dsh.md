---
sidebar_position: 1
slug: what-is-dsh
title: What is DeepSeek Harness?
---

# What is DeepSeek Harness?

**DeepSeek Harness is an open-source agent harness.** It is the software layer that sits between a language model and your machine: it decides what the model sees, which tools it can call, when to stop, what to remember, and which actions need your approval.

DeepSeek's own summary of the design is a formula:

> **Agent = Model + Harness**

A model on its own can only produce text. Give it a filesystem, a shell, a search tool, a plan, a loop that keeps going, and a durable record of what happened — and it becomes something that can fix a failing test or open a pull request.

![Animated diagram: a model box and a harness made of plugin chips — model adapter, tools, prompt assembly, loop, session log, sandbox, UI — combining into one agent](/img/deepseek-harness/agent-model-harness.svg)

## The four jobs a harness does

| Job | What `dsh` provides |
|---|---|
| **Tools** | Read, write, edit, and patch files; `bash` on Linux/macOS or PowerShell on Windows; web search and fetch; image reading; subagents; task and goal tracking; MCP servers; skills |
| **Context** | Prompt-section assembly, runtime reminders, workspace instructions from `AGENTS.md` / `CLAUDE.md`, per-model reasoning effort, image inputs |
| **Control** | The agent loop: turns → steps → tool calls → another request, with retries, cancellation, plan mode, and policy hooks between every stage |
| **Durability & policy** | An append-only session log, resume/fork/replay, an OS-level sandbox, and approval prompts bundled into permission presets |

Every one of those is configurable. That is the distinguishing feature.

## "Everything is a plugin"

Most agents hard-code their loop and expose extension points around it. DeepSeek went the other way: the harness is a **plugin tree**, and every capability is a row in that tree.

| Seam | What it decides |
|---|---|
| Model adapter | Which provider, endpoint, protocol, and reasoning controls are used |
| Tool registry | Which tools the model can see and call, scoped per agent |
| System prompt | Which sections are assembled and in what order |
| Agent loop | How one turn is driven, retried, and stopped |
| Session log | What is recorded, persisted, and replayed |
| Sandbox & filesystem | What the shell and file tools are allowed to touch |
| Orchestration | Subagents, Agent Teams, workflows, schedules |
| UI | Desktop shell, browser app, headless printer, or SDK protocol |

The framework underneath is **Cordis**, where plugins contribute services, typed events, and *reversible effects* to a shared context. The practical consequence: unmounting a plugin unwinds its registrations cleanly, and there is **no privileged core to patch**. You extend `dsh` by mounting a plugin beside the others — or by replacing a row entirely.

```yaml
# a profile patch that swaps one row and inserts another
- id: tool-str-replace-editor
  name: '@deepseek-ai/dsh-tool-str-replace-editor'
  config:
    maxOutputChars: 16000
```

You will meet these layers properly in [Core concepts](./4-core-concepts.md). The point here is architectural: the thing you would normally file an issue about is usually a config override.

## Three ideas worth internalising

### 1. The harness is where the leverage is

Two agents on the same model can behave completely differently because of context assembly, tool descriptions, retry policy, and what gets persisted. DeepSeek ships the harness as code rather than as a product surface, so those decisions are inspectable.

### 2. The log is the source of truth

Everything the model sees is written to an append-only `SessionEvent` log: system prompts, reasoning, tool calls and results, subagent scheduling, context injections. Resume, fork, search, replay, transcripts, telemetry, and the Trajectory view are all projections of that one stream. If a feature changes what the model sees, it adds a session event.

This is not just debugging plumbing. It means an agent run is **auditable after the fact** — useful when the run cost money, touched production config, or needs to be explained to a reviewer.

### 3. A harness is a runtime, so it has runtime problems

Ports, sandboxes, credentials, version pins, plugin load failures, and OS-specific shells. That is why this guide spends as much time on isolation and troubleshooting as on prompts.

## What DeepSeek Harness is *not*

- **Not a model.** It ships with DeepSeek models as the default route, but it is model-agnostic. You can point it at Anthropic, OpenAI, Gemini, Bedrock, Azure, or your own OpenAI-compatible gateway.
- **Not a chat app.** The Web UI and desktop app look like chat, but each session drives a real tool loop with filesystem and shell access.
- **Not a vendor lock-in play.** MIT-licensed, local-first, and explicit that community plugins are not second-class.
- **Not a finished product.** It is a developer preview. DeepSeek warns of compatibility-breaking changes, accepts no external pull requests at the moment, and states the project has not been security audited.
- **Not a replacement for your terminal multiplexer.** It runs one agent per session; pairing it with [Herdr](/docs/ai-tools/herdr) or tmux is the practical way to keep several sessions in view.

:::tip Key takeaway
DeepSeek Harness is a **composable agent runtime**: model + tools + loop + log + sandbox, where each part is a swappable plugin. Use it when you want control over how the agent works, not just what it says.
:::

---

**Next:** [Why DeepSeek Harness? →](./2-why-dsh.md) — the problems it solves, where it wins, and where it will frustrate you.
