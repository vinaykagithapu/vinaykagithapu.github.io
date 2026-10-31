---
sidebar_position: 2
slug: /ai-tools/opencode
title: OpenCode
description: OpenCode — free, open-source AI coding agent for the terminal. What it is, why use it, and how it compares to chatbots and autocomplete.
---

# OpenCode

**OpenCode** is a free, open-source **AI coding agent** that runs where you already work: your terminal. You describe a task in plain English, and it reads your code, plans an approach, edits files, runs commands, and shows you exactly what changed — like a competent teammate who never gets tired of questions.

It's also available as a **desktop app** and an **IDE extension**, but the terminal is home.

## Agent vs. chatbot vs. autocomplete

| | Web chatbot | Code autocomplete | **OpenCode (coding agent)** |
|---|---|---|---|
| Sees your project | ❌ copy-paste snippets | ⚠️ open file only | ✅ reads the whole repo |
| Runs commands | ❌ | ❌ | ✅ builds, tests, deploys |
| Makes real edits | ❌ | ⚠️ completes lines | ✅ multi-file changes + diff |
| You stay in control | — | — | ✅ review, approve, undo |

A chatbot *tells you* what to type. OpenCode **does the work** and hands you a reviewable diff.

## Quick start

```bash
cd my-project
opencode
```

Then talk to it like a developer on your team:

- *"How is authentication handled in `src/auth.ts`?"*
- *"Add a dark-mode toggle to the navbar and verify it in both themes."*
- *"Open a PR with this change and make sure the site still builds."*

You can drag-and-drop screenshots into the prompt, undo any change with `/undo`, and switch to **Plan mode** (`Tab`) when you want a proposal instead of edits.

## Why OpenCode?

- **Open source** — no black box; inspect, extend, or self-host it
- **Terminal-native** — works over SSH, inside containers, anywhere a terminal exists
- **Any model** — Anthropic, OpenAI, Google, OpenRouter, or local models via Ollama/LM Studio
- **Reviewable diffs** — Plan mode proposes before it edits; `/undo` and `/redo` step through changes

## Full OpenCode guide

This page is a summary. For the complete walkthrough — what OpenCode is, why it exists, setup, core concepts, features tour, and use cases — see the dedicated OpenCode docs:

- [What is OpenCode?](/docs/ai-tools/opencode/what-is-opencode)
- [Why OpenCode?](/docs/ai-tools/opencode/why-opencode)
- [Getting started](/docs/ai-tools/opencode/getting-started)
- [Core concepts](/docs/ai-tools/opencode/core-concepts)
- [Features tour](/docs/ai-tools/opencode/features-tour)
- [Use cases](/docs/ai-tools/opencode/use-cases)

---

**See also:** [AI Tools overview](/docs/ai-tools) — OpenCode compared with Cursor and Claude Code.
