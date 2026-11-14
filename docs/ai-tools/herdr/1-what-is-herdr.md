---
sidebar_position: 1
slug: what-is-herdr
title: What is Herdr?
---

# What is Herdr?

**Herdr is a terminal workspace manager for AI coding agents.** It is a multiplexer — the same family as tmux, screen, and zellij — with two important twists: it is **mouse-first**, and it is **agent-aware**.

Concretely: a background server owns the real terminal processes. Your terminal window is just a client that attaches to them. Panes keep running when the client detaches, when you close the window, or when your SSH connection drops.

![Animated diagram: a client detaches with ctrl+b q while the server keeps two agents and a test watcher running, then reattaches to the same layout](/img/herdr/detach-reattach.svg)

## The problem it removes

AI agents changed what a terminal session is *for*. A shell command finishes in milliseconds; an agent turn can run for ten minutes, stop to ask permission, and resume while you are in a meeting. Losing that session — or not noticing it is waiting on you — is the new "I lost my work."

Herdr treats an agent session as something that should **survive** and something you should be able to **see**:

| Without Herdr | With Herdr |
|---|---|
| Closing the terminal kills a running agent | The server keeps the process alive; the client reattaches |
| Four tabs, no idea which one needs input | A sidebar with `working` / `blocked` / `done` per agent |
| One agent at a time, because parallel means chaos | One workspace per repo/worktree, states rolled up |
| SSH drops during a long build | Reconnect and the build is still running |
| Scripts cannot tell when an agent finishes | `herdr agent wait` blocks on real lifecycle states |

## Agent-aware, not just pane-aware

Herdr detects the coding agent running inside a pane (by process, screen manifest, or an integration the agent reports to) and classifies it:

| State | Meaning |
|---|---|
| `working` | The agent is actively running |
| `blocked` | An approval or question UI needs your decision |
| `done` | Finished and not yet viewed |
| `idle` | Finished or waiting, and already seen |
| `unknown` | Agent present, but the state cannot be classified |

Those states roll up: a `blocked` pane makes its tab and workspace look blocked, so the workspace list becomes a **triage queue** instead of a guess. You can also wait on them from scripts (`herdr agent wait reviewer --until blocked`) — more in [Features tour](./6-features-tour.md).

## What it looks like in practice

```bash
cd ~/src/portfolio
herdr                     # create or attach to the session
```

Inside the pane, start an agent the way you always would:

```bash
claude                    # or codex, opencode, cursor-agent…
```

Herdr notices it, adds it to the sidebar, and starts tracking state. Split a pane (`prefix+v`), start a second agent, and let them work while you review diffs in a third pane. Detach with `prefix+q` whenever you want; come back with `herdr`.

You do not need any keybindings to begin — clicking, dragging split borders, and right-click menus cover the whole UI.

## What Herdr is *not*

- **Not an agent.** It does not write code or call models. It is the runtime around your agents — it works with the tools in this guide, including [OpenCode](/docs/ai-tools/opencode/what-is-opencode).
- **Not an IDE.** There is no editor, file tree, or debugger. It manages terminals well and stays out of the rest.
- **Not a cloud service.** It runs locally (or on a machine you own over SSH); control happens over a local socket.
- **Not tmux with a new config.** tmux muscle memory mostly transfers, but Herdr has its own mouse model, agent integrations, CLI, and socket API. Do not apply `.tmux.conf` advice here.

:::tip Key takeaway
Herdr makes agent work **durable** (it survives detach and disconnect), **visible** (states in a sidebar), and **programmable** (CLI, socket API, agent skill). That combination is what makes parallel agents practical.
:::

---

**Next:** [Why Herdr? →](./2-why-herdr.md) — the specific problems it solves, and where it beats (or loses to) alternatives.
