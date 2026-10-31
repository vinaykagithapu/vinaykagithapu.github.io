---
sidebar_position: 4
slug: core-concepts
title: Core Concepts
---

# Core Concepts

Eight words, and OpenCode makes complete sense. Here's the whole vocabulary in plain English.

![Terminal: Plan mode proposes a change, Build mode applies it](/img/opencode/oc-modes.png)

## The mental model

```
        You ── prompt ──▶  Session (agent + context)
                              │  uses
                              ▼
                     Tools: read · edit · bash · grep · web
                              │  guided by
                              ▼
                  AGENTS.md · Skills · Commands · Permissions
```

You talk. The **session** works your repo using **tools**, guided by what you've written down. That's it.

## The eight concepts

| Concept | One-line meaning |
|---|---|
| **Session** | One conversation with full project context; close it and history persists |
| **Modes** | `Tab` switches **Plan** (propose only, no edits) ↔ **Build** (make changes) |
| **Tools** | What the agent can *do*: read, edit, run commands, search, fetch docs |
| **Agents** | Specialized roles — built-in `plan`/`build`, or your own custom agents |
| **Skills** | Reusable playbooks (`.opencode/skills/`) loaded on demand for repeat tasks |
| **Commands** | Your own `/slash` shortcuts that prompt like a pro every time |
| **MCP servers** | Plug external systems (databases, browsers, trackers) into the agent's reach |
| **Permissions** | `allow` / `ask` / `deny` rules — you decide what the agent may touch |

## Two habits that make everything click

### 1. Plan first, build second
Big tasks deserve a proposal. Hit `Tab` into **Plan mode**, describe the goal, and iterate on the plan *without a single file changing*. When it's right, `Tab` back to **Build** and say "go". It's the cheapest review you'll ever do.

### 2. Write things down once
Every "remember that…" you'd tell a teammate belongs in the repo:

- **`AGENTS.md`** — project overview and conventions (created by `/init`)
- **Skills** — step-by-step workflows (build, ship, verify) the agent can reuse
- **Commands** — `/slash` prompts for your team's recurring asks

This is the compounding loop: **the repo becomes the agent's memory**, versioned and reviewable like any other code.

:::note Want the skills deep-dive?
Skills get a full walkthrough in the blog post: [Agentic Workflows with OpenCode](/blog/opencode-agentic-workflows), plus a copy-paste starter pack at [vinaykagithapu/opencode-skills](https://github.com/vinaykagithapu/opencode-skills).
:::

:::tip Key takeaway
Session + modes + tools do the work; AGENTS.md + skills + commands make it *your* agent. Plan first, write things down, review every diff.
:::

---

**Next:** [Features tour →](./5-features-tour.md) — everything OpenCode can do today, and how to keep up with what's new.
