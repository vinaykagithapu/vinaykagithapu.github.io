---
sidebar_position: 3
slug: getting-started
title: Getting Started (Setup & Updates)
---

# Getting Started (Setup & Updates)

From zero to a working session in about five minutes.

![Terminal: install OpenCode, connect a provider, initialize the project, first prompt](/img/opencode/oc-setup.png)

## 1. Prerequisites

- A modern terminal emulator (WezTerm, Ghostty, Kitty, Alacritty — most defaults work)
- An API key for one LLM provider (or use OpenCode Zen, below)

## 2. Install

Pick one:

```bash
# Install script (any platform)
curl -fsSL https://opencode.ai/install | bash

# npm
npm install -g opencode-ai

# Homebrew (macOS / Linux — recommended tap)
brew install anomalyco/tap/opencode
```

**Windows:** use [WSL](https://opencode.ai/docs/windows-wsl) for full features, or `choco install opencode` / `scoop install opencode`. Binaries are also on the [Releases page](https://github.com/anomalyco/opencode/releases).

Check it worked:

```bash
opencode --version
```

## 3. Connect a model

Inside the TUI, run:

```
/connect
```

Choose **opencode** (Zen — curated models, simplest billing), sign in at `opencode.ai/auth`, and paste the key. Or select another provider and paste its API key. Local models work too (Ollama, LM Studio).

## 4. Start it in your project

```bash
cd path/to/your-project
opencode
```

Then initialize the project context:

```
/init
```

OpenCode analyzes the repo and writes an **`AGENTS.md`** file — its understanding of your structure and conventions. **Commit it to Git**: it's how every future session (yours and your teammates') starts smart.

## 5. Your first task

Ask a question to warm up:

```
How is authentication handled in @src/auth.ts?
```

The `@` key fuzzy-searches files — use it to point the agent at exact code. Then try a small real task, review the diff, and keep or discard it.

:::info OpenCode 1 vs 2
OpenCode **v2** is out and both versions share the `opencode` command, so they can't coexist by default. This guide covers the v1 experience; see the [v2 docs](https://opencode.ai/v2/docs/) when you're ready to migrate.
:::

## Keeping it updated

Stay current — new features ship fast:

| Installed via | Update with |
|---|---|
| npm | `npm update -g opencode-ai` |
| Install script | Re-run the install script |
| Homebrew | `brew update && brew upgrade opencode` |
| Any | Grab the latest binary from [Releases](https://github.com/anomalyco/opencode/releases) |

The TUI also shows update notices, and the [changelog](https://github.com/anomalyco/opencode/releases) is the source of truth for what's new.

:::tip Key takeaway
Install → `/connect` → `cd project` → `opencode` → `/init`. Commit `AGENTS.md`. Update monthly (or when the TUI nudges you).
:::

---

**Next:** [Core concepts →](./4-core-concepts.md) — modes, agents, tools, skills, and the rest of the vocabulary.
