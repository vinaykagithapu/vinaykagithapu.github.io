---
sidebar_position: 8
slug: troubleshooting
title: Troubleshooting
---

# Troubleshooting

Start with the basics — they answer half of all questions:

```bash
herdr -V            # version
herdr status        # client + server summary
herdr status server
herdr status client
```

Also note your OS, outer terminal and version, whether the session is local or remote, and whether tmux is involved.

## "My agent is not detected" (or shows the wrong state)

Herdr combines foreground-process detection, screen manifests, and integrations. Ask it what it sees:

```bash
herdr agent list
herdr agent explain <pane_id> --json
herdr integration status
```

`agent explain` prints the final state, the rules that matched, which manifest was used, and why a rule did or did not apply. Common causes:

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent missing from the sidebar | Not a supported agent, or not in the foreground | Run it directly in the pane; supported list: [herdr.dev/tui/docs/agents](https://herdr.dev/tui/docs/agents/) |
| State stuck at `idle` | No manifest rule matched a new approval screen | `agent explain` to confirm; help it by inspecting the pane before answering |
| Session not restored after restart | Integration not installed | `herdr integration install <name>` |
| Detection fails under a sandbox wrapper | The wrapper hides the real process | Prefix the command with `HERDR_AGENT=<agent>`, e.g. `HERDR_AGENT=claude fence -- claude` |
| Shell auto-enters tmux inside a pane | Herdr sees `tmux`, not the agent behind it | Guard the tmux startup with `HERDR_ENV` (below) |

**This is safe by design:** `blocked` is strict, so an unfamiliar dialog may read as `idle`. `idle` is not permission to approve anything — inspect the pane first.

For agents like Antigravity and Grok, `idle` can coexist with background tasks or subagents still running. A settled state is not proof those jobs finished.

## A keybinding does nothing

The outer terminal or desktop environment probably owns that chord before Herdr can see it.

- Press `prefix+?` to see the bindings Herdr actually has active.
- Pick a different chord, or free it in your terminal's settings.
- Every binding, including the prefix, is configurable under `[keys]` in `config.toml`.
- The [keyboard guide](https://herdr.dev/tui/docs/keyboard/) documents which chords are safe and the prefix-free `ctrl+alt` setup.

## Nested tmux breaks detection

Herdr does not inspect tmux sessions launched inside a Herdr pane, and reattaching an outer tmux session from inside a pane can cause recursive resizing and flicker. If your shell framework auto-attaches tmux, exclude Herdr panes:

```zsh
if [[ -z ${TMUX:-} && ${HERDR_ENV:-} != 1 ]]; then
  tmux new-session -A -s my-session
fi
```

## "Everything vanished after a restart"

Restore behavior is deliberate:

| Event | Processes | Layout | Agent conversation |
|---|---|---|---|
| Detach / reattach | ✅ keep running | ✅ | ✅ |
| Server restart | ❌ gone | ✅ restored | Only via an integration's native resume |
| Update with handoff | Best effort | ✅ | ✅ if handoff succeeds |

If conversations do not come back after a restart, install the agent integration. If you want *nothing* to be resumable, set `[session] resume_agents_on_restore = false`.

## Remote machine problems

```bash
herdr machine list
herdr machine status <label> --json
herdr machine reconnect <label>
```

- `reachable` means the remote **server** is up — not that every TUI is connected.
- `machine reconnect` needs you to finish SSH authentication interactively; an agent should not run it for you.
- Herdr never installs, starts, or restarts a remote server automatically.
- Commands use the saved profile (`--machine <label>`), not an arbitrary hostname, and `--machine` cannot be combined with `--session` or `--remote`.
- Local pane IDs mean nothing remotely — discover remote IDs on that machine.

## Windows quirks

| Problem | Fix |
|---|---|
| IME candidate window in the wrong place / cursor flicker | `[ui] host_cursor = "native"` restores the IME anchor; `"drawn"` gives a stable visual cursor |
| Enter / Tab / Backspace firing twice | Update the outer terminal (kitty ≥ 0.33.0, foot ≥ 1.20.0, Alacritty ≥ 0.15.0) |
| Background server controls blocked | Elevation and `server.allow_unelevated_clients` interact; see the Windows docs |

Native Windows support is generally available; see [Windows support](https://herdr.dev/tui/docs/windows-beta/) for the current limitation list.

## Config, logs, and state

| What | Where |
|---|---|
| Config (Linux/macOS) | `~/.config/herdr/config.toml` |
| Config (Windows) | `%APPDATA%\herdr\config.toml` |
| Logs | `~/.config/herdr/` (named sessions under `sessions/<name>/`) |
| Config validation | `herdr config check` |
| Apply edits | `herdr server reload-config` |

Invalid config values fall back with a startup warning; `config check` shows the diagnostics. `herdr config reset-keys` backs up your config and removes custom keybindings if you get stuck.

## Plugins

- Listings are self-tagged and unreviewed — read the source before installing.
- A plugin declares `min_herdr_version`; installs fail if your binary is older.
- Running plugins keep their original files after an update; new invocations use the new install.
- Install over a locally linked plugin is refused by design.
- A plugin runs with your privileges. Treat it like an editor extension, not a sandbox.

## When all else fails

1. Read the matching page at [herdr.dev/tui/docs](https://herdr.dev/tui/docs/) — the docs are versioned with the release.
2. Search or open an issue at [github.com/herdrdev/herdr](https://github.com/herdrdev/herdr).
3. Hand the official [agent guide](https://herdr.dev/agent-guide.md) to a coding agent: it can walk you through setup and diagnosis from the docs.

:::tip Key takeaway
`herdr status` + `herdr agent explain` + `herdr integration status` explain almost every "it doesn't see my agent" report. For keys, suspect the outer terminal first. For restores, suspect a missing integration.
:::

---

**That's the guide.** Want the hands-on path? Go to [Getting started](./3-getting-started.md) or the [end-to-end walkthrough](./5-workflow-walkthrough.md). Curious about the agent side? See [OpenCode](/docs/ai-tools/opencode/what-is-opencode) — they pair well: Herdr is the desk, OpenCode is the worker.
