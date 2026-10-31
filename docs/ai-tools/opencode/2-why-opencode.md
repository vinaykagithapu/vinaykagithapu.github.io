---
sidebar_position: 2
slug: why-opencode
title: Why OpenCode?
---

# Why OpenCode?

AI can already write code. So why does another tool exist? Because most AI coding experiences force a trade-off: **convenience** (closed, cloud-bound, one model) or **control** (self-hosted, painful to set up). OpenCode refuses the trade-off.

## Five reasons people switch

### 1. It's open source
No black box. The full source is on GitHub — inspect it, extend it, self-host it, or pin a version your company trusts. New features land in the open, in the changelog.

### 2. It's terminal-native
Your editor, your shell, your dotfiles, your SSH sessions. OpenCode works over a remote connection, inside containers, and anywhere a terminal exists — no plugin marketplace required.

### 3. You pick the model — any model
Locked-in models age badly. OpenCode is **provider-agnostic**: bring API keys from Anthropic, OpenAI, Google, OpenRouter, or run **local models** through Ollama or LM Studio. New to LLM providers? **OpenCode Zen** is a curated, tested model list with simple billing.

### 4. Work you can review — and undo
Every change arrives as a **diff**, not a surprise. **Plan mode** proposes before it edits. `/undo` and `/redo` step through changes like text edits. Nothing lands in your codebase without you.

### 5. It grows with you
OpenCode's real power is the extension surface — all covered later in this guide:

- **Agents** — specialized roles (plan-only, review, custom jobs)
- **Skills** — reusable playbooks the agent loads on demand
- **Commands** — your own `/slash` shortcuts
- **MCP servers** — plug in databases, browsers, tickets, anything
- **Custom tools + SDK** — build your own integrations

## "Why not just use a chatbot?"

You can — and sometimes you should. Here's the honest split:

| Task | Best tool |
|---|---|
| Quick syntax question | Web chatbot |
| Explaining a concept | Web chatbot |
| Autocompleting a line | Editor autocomplete |
| **Changing real code across files** | **OpenCode** |
| **Running builds/tests and fixing failures** | **OpenCode** |
| **Shipping a reviewed PR** | **OpenCode** |

The pattern: chatbots are great at *answers*, agents are great at *work*.

## The compounding part

Every project-specific thing your agent learns — how to build it, how to deploy it, what breaks — can be **written down and versioned** in the repo (`AGENTS.md`, skills). Your agent gets smarter about *your* codebase with every session, and so does every teammate's.

:::tip Key takeaway
OpenCode = the control of self-hosted tooling with the ease of a chat app, plus a straight line from "idea" to "reviewed, tested change".
:::

---

**Next:** [Getting started →](./3-getting-started.md) — install, connect a model, and run your first session in minutes.
