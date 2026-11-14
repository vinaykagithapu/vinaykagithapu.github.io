---
sidebar_position: 3
slug: getting-started
title: Getting Started (Setup & Updates)
---

# Getting Started (Setup & Updates)

From zero to a running session with an agent in it — about five minutes.

:::info Prerequisites
A modern terminal emulator and at least one coding agent on your `PATH` (`claude`, `codex`, `opencode`, `cursor-agent`, …). No multiplexer experience required. Herdr works without a config file.
:::

## 1. Install

Pick your platform:

```bash
# Linux / macOS — install script
curl -fsSL https://herdr.dev/install.sh | sh

# Homebrew
brew install herdr

# mise
mise use -g herdr

# Nix (replace with the latest release tag)
nix profile install github:herdrdev/herdr/v0.9.5
```

**Windows** — native support is generally available:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```

If endpoint security blocks that fileless command, use Command Prompt:

```cmd
curl.exe -fsSLo install.cmd https://herdr.dev/install.cmd && install.cmd && del install.cmd
```

Verify:

```bash
herdr --version
# herdr 0.9.5
```

Installs from the script use the **stable** channel and update with `herdr update`. Prefer package-manager upgrades for Homebrew/mise/Nix installs.

## 2. First run

```bash
cd ~/src/your-project
herdr
```

Herdr launches (or attaches to) the background server and creates a workspace for the current directory. First run shows a short onboarding flow; after that you land straight in the session.

The UI is mouse-first:

- **Click** panes, tabs, workspaces, and agents to focus them
- **Drag** split borders to resize
- **Right-click** for menus (including split and new tab)
- **Drag-select** to copy; double-click selects a token
- **Ctrl-click** opens links

## 3. Start an agent

Type your agent's command in the pane exactly as you normally would:

```bash
claude        # or codex, opencode, cursor-agent …
```

Herdr detects it automatically and adds it to the sidebar with a live state (`working`, `blocked`, `done`, `idle`). Nothing to configure.

Then install the matching integration — it is what lets Herdr **restore the agent's own session** after a server restart:

```bash
herdr integration install claude
# also: codex, opencode, cursor, copilot, gemini, droid, kimi, qwen …
herdr integration status
```

Integrations are optional for daily use but make restarts much less painful. State detection works without them for supported agents.

## 4. Split, navigate, detach

The only bindings you need on day one — prefix is `ctrl+b` (press, release, then the key):

| Action | Keys |
|---|---|
| Split right | `prefix` + `v` |
| Split down | `prefix` + `-` |
| Move between panes | `prefix` + `h` / `j` / `k` / `l` |
| New tab | `prefix` + `c` |
| Workspace navigation | `prefix` + `w` |
| **Detach (everything keeps running)** | `prefix` + `q` |

Press `prefix+?` any time to see every active binding.

Reattach from anywhere:

```bash
herdr
```

To actually stop everything:

```bash
herdr server stop
```

## 5. Optional: let your agent drive Herdr

Herdr ships an agent skill that teaches a coding agent to split panes, run commands without stealing focus, read output, and wait on other agents:

```bash
npx skills add herdrdev/herdr --skill herdr -g
```

Or print the release-matched copy with `herdr --skill` and install it into your agent's instructions. Ask your agent before it writes to your config locations.

## 6. Configure it (when you want to)

Herdr works with zero configuration. When you want custom keys or a theme:

```bash
mkdir -p ~/.config/herdr
herdr --default-config > ~/.config/herdr/config.toml
herdr config check          # validate
herdr server reload-config  # apply without restarting panes
```

Config lives at `~/.config/herdr/config.toml` (Linux/macOS) or `%APPDATA%\herdr\config.toml` (Windows). Main sections: `[keys]`, `[theme]`, `[ui]`, `[terminal]`, `[update]`. The default theme is `catppuccin`; set `ui.mouse_capture = false` if you want the terminal to own the mouse again.

## Keeping it updated

| Installed via | Update with |
|---|---|
| Install script | `herdr update` |
| Homebrew | `brew upgrade herdr` |
| mise | `mise upgrade herdr` |
| Nix | Re-run `nix profile install github:herdrdev/herdr/<tag>` |
| Any | `herdr channel show` / `herdr channel set preview` to pick a channel |

:::tip Key takeaway
`install → cd project → herdr → start agent → integration install`. Detach with `prefix+q`, reattach with `herdr`, and only use `herdr server stop` when you mean it.
:::

---

**Next:** [Core concepts →](./4-core-concepts.md) — sessions, workspaces, tabs, panes, agents, and the state model.
