---
sidebar_position: 3
slug: /ai-tools/herdr
title: Herdr
description: Herdr — the open-source terminal workspace manager for AI coding agents. Run multiple agents side by side, see who is working, blocked, or done, and keep everything alive across detach, SSH, and restarts.
---

# Herdr

**Herdr** is a terminal workspace manager built for AI coding agents — "the runtime your coding agents live on." Think of tmux, rebuilt for a world where half your terminals are running Claude Code, Codex, OpenCode, or Cursor Agent: **mouse-first**, **agent-aware**, and **scriptable** through a CLI and a local socket API.

If OpenCode is *the agent*, Herdr is *the desk it works at* — the layer that keeps five agents, two dev servers, and a test watcher organized instead of chaotic.

![Animated diagram: a terminal client attaches to a Herdr background server hosting two workspaces with pulsing agent state chips; a remote SSH machine runs its own server](/img/herdr/herdr-overview.svg)

## At a glance

| Aspect | Detail |
|---|---|
| **What** | Terminal workspace manager / multiplexer for AI coding agents |
| **License** | Apache-2.0, open source, written in Rust |
| **Platforms** | Linux, macOS, and native Windows (ConPTY) |
| **Install** | `curl -fsSL https://herdr.dev/install.sh \| sh` (also Homebrew, mise, Nix) |
| **Core idea** | A background server owns real terminals; clients attach and detach freely |
| **Superpower** | It recognizes coding agents and tracks `working` / `blocked` / `done` per pane |
| **Automation** | `herdr` CLI with JSON output, local socket API, and an installable agent skill |

## The 30-second version

```bash
# 1. install
curl -fsSL https://herdr.dev/install.sh | sh

# 2. run it inside a project
cd ~/src/my-app
herdr

# 3. inside a pane, start your agent
claude        # or codex, opencode, cursor-agent, ...

# 4. split right (prefix = ctrl+b), start another agent
#    prefix+v   → new pane
#    prefix+q   → detach; everything keeps running
```

Reattach any time with `herdr`. Nothing was lost.

## Why it belongs in an AI-tools guide

A coding agent is only useful if it can *stay running*: long builds, test suites, multi-minute refactors, and approval prompts that arrive while you are looking at something else. Herdr makes those runs durable and visible:

- **Durable** — close the laptop lid or lose SSH; the agent keeps working in the background server.
- **Visible** — one sidebar shows every agent across every repo, with `blocked` and `done` badges that jump out at you.
- **Parallel** — one workspace per repo (or per git worktree) means agents stop stepping on each other.
- **Automatable** — scripts and agents can split panes, prompt, wait for state, and read output.

## Full guide

- [What is Herdr?](/docs/ai-tools/herdr/what-is-herdr) — the multiplexer model, agent awareness, and what it is not
- [Why Herdr?](/docs/ai-tools/herdr/why-herdr) — the problems it solves and how it compares to tmux, IDEs, and plain tabs
- [Getting started](/docs/ai-tools/herdr/getting-started) — install, first run, integrations, updates
- [Core concepts](/docs/ai-tools/herdr/core-concepts) — sessions, workspaces, tabs, panes, agents, modes
- [End-to-end walkthrough](/docs/ai-tools/herdr/workflow-walkthrough) — run three agents on one project without collisions
- [Features tour](/docs/ai-tools/herdr/features-tour) — worktrees, remote machines, plugins, CLI/API, config
- [Use cases](/docs/ai-tools/herdr/use-cases) — seven patterns from parallel shipping to phone-based ops
- [Troubleshooting](/docs/ai-tools/herdr/troubleshooting) — detection, keybindings, logs, and remote auth

---

**See also:** [AI Tools overview](/docs/ai-tools) — Herdr compared with [OpenCode](/docs/ai-tools/opencode/what-is-opencode), Cursor, and Claude Code. Herdr is not a competing agent; it is where those agents live.
