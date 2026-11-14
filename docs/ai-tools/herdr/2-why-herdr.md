---
sidebar_position: 2
slug: why-herdr
title: Why Herdr?
---

# Why Herdr?

Plenty of tools give you panes. Herdr exists because **agent sessions behave differently** from ordinary shell commands, and the tooling had not caught up. Here are the problems it actually solves.

## 1. Agent work must survive the terminal

An agent turn is long: it reads files, runs builds, waits on test suites, and may pause for approval. A plain terminal ties that process to a window. Close the window — or lose Wi-Fi on an SSH session — and the work dies mid-edit.

Herdr's background server owns the process. Detach with `prefix+q`; the agent keeps thinking. Reattach later, from the same machine or over SSH, and the layout, scrollback, and conversation are there.

> This is the single biggest reliability upgrade. It turns "don't close that tab" into a non-issue.

## 2. You cannot watch five agents by hand

Running one agent is a conversation. Running five is an operations problem: which one is working, which one finished, and which one is *stuck waiting for your approval*?

Herdr answers that with state rollups:

- A `blocked` agent marks its pane, tab, and workspace as blocked — the top of your triage queue.
- A `working` agent keeps its workspace active.
- A `done` agent stays visible until you actually look at it.

You stop polling terminals and start responding to a queue. Notifications cover the "I walked away" case.

## 3. Parallel agents need isolation, not optimism

Two agents editing the same checkout will collide. Herdr gives each one a real boundary:

| Boundary | Herdr primitive | Use it when |
|---|---|---|
| Separate project | **Workspace** | One workspace per repo |
| Separate view | **Tab** | `agents`, `logs`, `server`, `review` |
| Separate terminal | **Pane** | One agent or process per pane |
| Separate Git checkout | **Worktree workspace** | Two agents on the *same* repo at once |

`herdr worktree create --branch feat/search` creates a real `git worktree`, opens it as a grouped workspace, and leaves your main checkout alone. Each agent gets its own files, its own build, and a clean merge story.

## 4. Remote work should not mean remote suffering

The code, GPU, or credentials often live on another machine. Herdr supports that natively:

- **SSH + Herdr** — `ssh you@server` then `herdr`. Same experience, remote server, remote panes.
- **Thin client** — `herdr --remote workbox` attaches your local terminal to a remote server.
- **Saved machines** — keep Local and several SSH machines in one window, each with independent reconnects and a combined agent list.
- **Phone** — any SSH client works; the TUI adapts to narrow screens. Check on agents from a phone without a web dashboard.

## 5. Automation needs reality, not scraping

Scripts that orchestrate agents usually end up scraping terminal text. Herdr exposes real lifecycle state and control:

```bash
# wait until another agent needs a decision (not "guess from output")
herdr agent wait reviewer --until blocked --timeout 600000

# read what it is asking, then answer deliberately
herdr agent read reviewer --source recent-unwrapped --lines 80
herdr agent send-keys reviewer esc

# prompt it and wait for the turn to settle
herdr agent prompt reviewer "Review the current diff" --wait --timeout 120000
```

Every command returns JSON, and the same surface is available over the local socket API. It is also the mechanism behind the official **agent skill**, which lets an agent inside a pane coordinate its siblings.

## How it compares

| | **Herdr** | tmux / zellij | IDE terminals | Plain terminal tabs |
|---|---|---|---|---|
| Panes persist across detach | ✅ | ✅ | ❌ (window-bound) | ❌ |
| Mouse-first UI | ✅ | ⚠️ limited | ✅ | ✅ |
| Detects agents + lifecycle state | ✅ | ❌ | ⚠️ per-extension | ❌ |
| Cross-repo agent sidebar | ✅ | ❌ | ❌ | ❌ |
| Git worktree workspaces | ✅ | ❌ | ⚠️ manual | ❌ |
| CLI + socket API for agents | ✅ | ⚠️ scripting only | ❌ | ❌ |
| Works over plain SSH / phone | ✅ | ✅ | ❌ | ❌ |
| Open source | ✅ Apache-2.0 | ✅ | ❌ | varies |

**tmux is not obsolete.** It is everywhere, scriptable, and perfect for servers where you just need persistence. Herdr's bet is that agent-heavy local development deserves a UI and an API built around agents, not just windows.

## When *not* to use Herdr

Honesty matters:

- **You run one agent at a time in one terminal.** The value is real but small; plain tabs are fine.
- **You need unattended/CI execution.** Use CI. Herdr is an interactive workspace, not a job scheduler.
- **You want a GUI-only environment.** Herdr lives in the terminal by design (though it is mouse-first).
- **You cannot run a background server** (locked-down environments) — check with your platform team.

:::tip Key takeaway
Reach for Herdr when **persistence**, **parallel agents**, or **visibility across projects** matter. If you only need to run one command once, you do not need it.
:::

---

**Next:** [Getting started →](./3-getting-started.md) — install it, start a session, and wire up your first agent in about five minutes.
