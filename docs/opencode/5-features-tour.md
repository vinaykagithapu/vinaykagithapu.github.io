---
sidebar_position: 5
slug: features-tour
title: Features Tour & What's New
---

# Features Tour & What's New

A map of everything OpenCode offers today — grouped so you know where to look — plus how to track new releases.

## Where you can work

| Surface | What it is |
|---|---|
| **TUI** | The flagship terminal interface |
| **CLI** | One-shot commands for scripts and CI |
| **Web** | Browser UI served locally |
| **IDE** | Editor extension |
| **Desktop app** | Standalone app |
| **Console** | Manage sessions across projects ([v2](https://opencode.ai/v2/docs/console/)) |
| **GitHub / GitLab** | Let agents open and work on PRs in the forge |

## What you can configure

Everything below is optional and grows with your needs:

- **Models** — switch providers and models mid-session; `opencode.json` pins defaults
- **Agents** — custom roles with their own tools, model, and permissions
- **Skills** — on-demand playbooks (`/docs/skills/`)
- **Commands** — reusable `/slash` prompts
- **MCP servers** — external tools and data sources
- **Custom tools** — write your own tools the agent can call
- **Permissions & policies** — `allow` / `ask` / `deny` for tools, skills, commands
- **Rules** — standing instructions followed every session
- **Formatters & LSP** — your code stays formatted; real language intelligence
- **Themes & keybinds** — make the TUI yours

## What you can build on

- **SDK** — drive OpenCode from your own TypeScript/JS apps
- **Server** — run it headless behind services and CI
- **Plugins** — hook into its lifecycle events
- **ACP** — speak the Agent Client Protocol to other editors

## What's new (staying current)

OpenCode moves fast — **v2** is now available with a refreshed experience and the new Console. Both versions use the `opencode` command, so plan migrations deliberately ([v2 docs](https://opencode.ai/v2/docs/)).

To keep up:

- ⭐ Watch the [GitHub repo](https://github.com/anomalyco/opencode) — releases + changelog
- 🔔 The TUI shows in-app update notices
- 📖 The [official docs](https://opencode.ai/docs/) are the source of truth (this guide curates them)

Update paths are covered in [Getting started](./3-getting-started.md#keeping-it-updated).

:::tip Key takeaway
Interfaces for every place you work · configuration for every habit · an SDK when you want to build. Check releases monthly — the surface area only grows.
:::

---

**Next:** [Use cases →](./6-use-cases.md) — what people actually build and automate with OpenCode.
