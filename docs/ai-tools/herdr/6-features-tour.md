---
sidebar_position: 6
slug: features-tour
title: Features Tour
---

# Features Tour

Everything else in the toolbox, grouped by the job it does.

## Mouse-first UI (and keys when you want them)

The whole interface is clickable: panes, tabs, workspaces, split borders, right-click menus, links. Keyboard control is an optional layer.

| Action | Keys |
|---|---|
| New tab | `prefix+c` |
| Split right / down | `prefix+v` / `prefix+minus` |
| Move between panes | `prefix+h/j/k/l` |
| Workspace navigation | `prefix+w` |
| Zoom the focused pane | `prefix+z` |
| Close pane | `prefix+x` |
| Swap panes | `prefix+shift+h/j/k/l` |
| Next / previous tab | `prefix+n` / `prefix+p` |
| Detach | `prefix+q` |
| Show every binding | `prefix+?` |

The prefix is `ctrl+b` by default. Every binding — including the prefix — is configurable under `[keys]`. A vetted prefix-free setup using `ctrl+alt` chords is documented at [herdr.dev/tui/docs/keyboard](https://herdr.dev/tui/docs/keyboard/).

## Sidebar, rollups, and notifications

Each agent reports `working`, `blocked`, `done`, `idle`, or `unknown`. Panes roll up into tabs and workspaces, so a blocked agent surfaces at the workspace level. Viewing a completion marks it seen (`done` → `idle`); each client tracks that independently.

Notifications cover events you would otherwise miss:

- an agent finishes a turn (`done`)
- an agent needs a decision (`blocked`)

This is the feature that makes five parallel agents tractable: you stop polling and start responding to a queue.

## Git worktree workspaces

Parallel agents on one repo need isolation. Herdr turns Git worktrees into first-class workspaces:

```bash
herdr worktree create --cwd ~/src/app --branch feat/search --label "search"
herdr worktree open  --cwd ~/src/app --branch feat/search
herdr worktree list
herdr worktree remove --workspace w3
```

- `create` makes the checkout **and** opens it as a grouped workspace.
- `--base REF` controls where a new branch starts when `--branch` does not exist yet.
- Without `--path`, checkouts land under the configured worktree directory.
- `remove` runs `git worktree remove`; it never deletes the branch. `--force` handles a dirty checkout.
- Closing a primary workspace with open linked worktrees requires `--group`.

## Remote machines and SSH

Four ways to work remotely, all keeping processes on the machine where the code lives:

| Path | How | Best for |
|---|---|---|
| SSH + Herdr | `ssh you@server` then `herdr` | Simplest; phone/tablet SSH clients |
| Thin client | `herdr --remote workbox` | Local terminal feel, remote panes |
| Saved machines | `herdr machine add workbox` | Switching Local + several remotes in one window |
| Headless server | `herdr server` | Supervised/service-style setups |

Saved machines keep **independent reconnects**: one flaky link does not disconnect the others, and the agent list spans connected machines. Diagnose with `herdr machine status <label> --json`; `herdr machine reconnect` needs you to complete SSH auth interactively.

Remote API calls use the same prefix everywhere:

```bash
herdr --machine "Build machine" agent list
herdr --machine "Build machine" agent prompt reviewer "Status?" --wait --timeout 120000
```

## Agent integrations and detection

Herdr detects supported agents from the foreground process and the live screen, and some agents report their own state. An **integration** adds native session restore after a server restart (and sometimes state reporting):

```bash
herdr integration install claude
herdr integration install codex
herdr integration install opencode
herdr integration install cursor
herdr integration status
```

Well-supported agents include Claude Code, Codex, GitHub Copilot CLI, Cursor Agent CLI, OpenCode, Pi, OMP, Droid, Devin CLI, Kimi Code CLI, Kilo Code CLI, Hermes Agent, Qoder CLI, Qwen Code, Letta Code, MastraCode, Grok CLI, and Antigravity CLI. A few (Kiro, Amp, Maki, Gemini CLI, Cline) get state detection without an integration, and some agents (Crush, Command Code, Kiro, Muse Code, Prime Agent) report themselves with nothing to install.

Agents without support still run normally — they just appear as plain terminals. See [herdr.dev/tui/docs/agents](https://herdr.dev/tui/docs/agents/) for the current matrix.

## Session state and restore

| Event | What happens |
|---|---|
| Detach (`prefix+q`) | Server keeps running; reattach to the same processes |
| Full server restart | Layout, cwd, and focus restore; processes do not |
| Agent resume | Integrations reopen the agent's own session after restart |
| Pane history | Screen history replay where available |
| Update with `--handoff` | Best-effort live handoff for supported servers |

`herdr server stop` is the deliberate stop. On Linux and macOS the server ignores `SIGHUP`, so closing the launching shell does not kill your panes.

## CLI, socket API, and the agent skill

Three layers, one control surface:

| Layer | Use it for |
|---|---|
| **Agent skill** | Teaching a coding agent to control Herdr from inside a pane |
| **CLI wrappers** | Shell scripts, orchestration, human debugging |
| **Socket API** | Custom tools, protocol clients, event subscribers |

The CLI returns JSON. Representative primitives:

```bash
herdr pane split --current --direction right --no-focus   # new terminal
herdr pane run w1:p3 "just test --watch"                  # run a command
herdr pane wait-output w1:p3 --regex "passed|failed"      # wait for output
herdr agent prompt reviewer "Review the diff" --wait      # prompt + wait
herdr agent wait reviewer --until blocked --timeout 600000
herdr agent read reviewer --source recent-unwrapped --lines 120
herdr agent send-keys reviewer esc
```

Install the skill with `npx skills add herdrdev/herdr --skill herdr -g`, or print the release-matched copy with `herdr --skill`. The skill starts with a guardrail: it only drives Herdr when `HERDR_ENV=1` is set, i.e. the agent is actually running inside a Herdr pane.

Inspect the socket protocol itself:

```bash
herdr api schema            # summary
herdr api schema --json     # full JSON Schema
herdr api snapshot          # live runtime state
```

## Plugins and the marketplace

A plugin is a shareable workflow package: a directory with a `herdr-plugin.toml` manifest plus commands Herdr can launch (Bash, JavaScript, Lua, Rust — anything runnable). The entire CLI is the plugin API; the host provides manifest validation, keybindings, panes, events, and logs.

```bash
herdr plugin install ogulcancelik/herdr-plugin-examples/worktree-bootstrap
herdr plugin list
herdr plugin update
```

Browse community plugins at [herdr.dev/plugins](https://herdr.dev/plugins/). Listings are self-tagged and **unreviewed** — treat a plugin like any extension that runs as you. Use `--yes` only for noninteractive installs you have reviewed.

## Configuration and themes

```bash
mkdir -p ~/.config/herdr
herdr --default-config > ~/.config/herdr/config.toml
herdr config check
herdr server reload-config
```

Locations: `~/.config/herdr/config.toml` (Linux/macOS), `%APPDATA%\herdr\config.toml` (Windows). Main sections:

| Section | Controls |
|---|---|
| `[keys]` | Keybindings, including the prefix and custom commands |
| `[theme]` | Built-in themes (default: `catppuccin`), light/dark auto-switch, accent overrides |
| `[ui]` | Sidebar, mouse capture, copy behavior |
| `[terminal]` | Default shell and new-pane cwd policy |
| `[update]` | Update channel and manifest checks |
| `[worktrees]` | Where worktree checkouts are created |

Invalid values fall back safely with a startup warning. Most settings reload live; startup-only settings need a restart.

## Windows

Native Windows support uses ConPTY and is generally available, with a few platform-specific differences. New installs default to the stable channel. Known quirks (cursor/IME behavior, older terminal key-event duplication) are covered in [Troubleshooting](./8-troubleshooting.md).

## Security model, in one breath

- The API is a **local socket** owned by your user; agents and plugins act with your privileges.
- Plugins are ordinary code — review before installing.
- `blocked` detection is strict, but `idle` is **not** an authorization to approve an action. Inspect unfamiliar dialogs.
- Remote machine forwarding uses your SSH configuration; Herdr never installs or restarts remote servers for you.

:::tip Key takeaway
Use worktrees for parallel writers, saved machines for remote boxes, integrations for restart-resume, and the CLI/API when you want the shell to orchestrate agents instead of doing it by hand.
:::

---

**Next:** [Use cases →](./7-use-cases.md) — concrete patterns, from parallel shipping to phone-based ops.
