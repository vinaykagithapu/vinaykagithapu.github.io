---
sidebar_position: 1
slug: /ai-tools
title: AI Tools
description: A curated guide to AI coding tools — OpenCode, Herdr, Cursor, Claude Code, and how to choose the right one for your workflow.
---

# AI Tools

AI coding tools have moved from autocomplete to **autonomous agents** that can read your repo, run commands, and ship reviewed pull requests. This section is a practical guide to the AI tools I use and recommend, with a focus on terminal-native, open, and model-flexible options.

## At a glance

| Tool | Type | Best for | Open source | Models |
|------|------|----------|-------------|--------|
| **OpenCode** | Terminal coding agent | Complex multi-file changes, builds, tests, deploys | ✅ | Any (Anthropic, OpenAI, Google, OpenRouter, local…) |
| **Herdr** | Agent workspace manager | Running several agents in parallel, durable sessions, SSH/remote work | ✅ | N/A — it hosts any agent |
| **Cursor** | AI code editor | In-editor AI chat, autocomplete, multi-file edits | ❌ | Claude, GPT-4, etc. |
| **Claude Code** | Terminal coding agent | Terminal-native agentic coding with Claude | ❌ | Claude (Anthropic) |

## OpenCode

**OpenCode** is a free, open-source AI coding agent that runs in your terminal. It's the tool I reach for when I need an agent that can plan, edit files across the repo, run builds and tests, open PRs, and hand me a reviewable diff — without vendor lock-in.

- **Why OpenCode?** → [Why OpenCode?](/docs/ai-tools/opencode/why-opencode)
- **Install & first session** → [Getting started](/docs/ai-tools/opencode/getting-started)
- **Full OpenCode guide** → [OpenCode docs](/docs/ai-tools/opencode/what-is-opencode)

OpenCode turns your terminal into a workshop where AI does the labor and you make the calls.

## Herdr

**Herdr** is an open-source (Apache-2.0) terminal workspace manager built for AI coding agents — tmux rebuilt for a world of parallel agents. It keeps panes alive across detach and SSH drops, detects each agent, and rolls `working` / `blocked` / `done` states into a sidebar so you know which project needs you. It is the runtime *around* your agents, not another agent.

- **What it is** → [What is Herdr?](/docs/ai-tools/herdr/what-is-herdr)
- **Install & first session** → [Getting started](/docs/ai-tools/herdr/getting-started)
- **Run agents in parallel** → [End-to-end walkthrough](/docs/ai-tools/herdr/workflow-walkthrough)
- **Full Herdr guide** → [Herdr docs](/docs/ai-tools/herdr)

## Cursor

**Cursor** is an AI-native code editor (a fork of VS Code) that brings AI chat, autocomplete, and multi-file editing directly into the editor. It's a great choice when you want AI pair-programming inside a familiar IDE with a graphical interface.

- Best for: in-editor refactoring, autocomplete, and AI chat while you browse files
- Models: Claude, GPT-4, and others
- Not open source; subscription-based

## Claude Code

**Claude Code** is Anthropic's terminal-native coding agent. It's built around Claude and works over the command line, making it a strong alternative to OpenCode when you prefer Anthropic's models and a terminal-first agent workflow.

- Best for: terminal-native agentic coding with Claude models
- Models: Claude (Anthropic)
- Not open source

## How to choose

| If you want… | Start with |
|--------------|------------|
| Open source, any model, full repo agency | **OpenCode** |
| Several agents at once, durable sessions, remote/SSH work | **Herdr** |
| AI inside a visual IDE/editor | **Cursor** |
| A terminal agent powered by Claude | **Claude Code** |

OpenCode, Cursor, and Claude Code all write, edit, and run code. OpenCode is the fully open-source, model-agnostic one — the default recommendation on this site. Herdr is the complement: put OpenCode, Claude Code, and Codex side by side in one persistent, agent-aware workspace.

---

> **Next:** Pick a tool above, or dive into the full [OpenCode guide](/docs/ai-tools/opencode/what-is-opencode) or the [Herdr guide](/docs/ai-tools/herdr).
