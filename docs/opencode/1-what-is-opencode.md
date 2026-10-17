---
sidebar_position: 1
slug: what-is-opencode
title: What is OpenCode?
---

# What is OpenCode?

**OpenCode** is a free, open-source **AI coding agent** that runs where you already work: your terminal. You describe a task in plain English, and it reads your code, plans an approach, edits files, runs commands, and shows you exactly what changed — like a competent teammate who never gets tired of questions.

It's also available as a **desktop app** and an **IDE extension**, but the terminal is home.

![A single OpenCode session: you describe the task, the agent reads your repo, edits code, runs checks, and shows the diff](/img/opencode/oc-what.png)

## What does "coding agent" actually mean?

Three things separate an **agent** from the AI tools you already know:

| | Web chatbot | Code autocomplete | **Coding agent** |
|---|---|---|---|
| Sees your project | ❌ copy-paste snippets | ⚠️ open file only | ✅ reads the whole repo |
| Runs commands | ❌ | ❌ | ✅ builds, tests, deploys |
| Makes real edits | ❌ | ⚠️ completes lines | ✅ multi-file changes + diff |
| You stay in control | — | — | ✅ review, approve, undo |

A chatbot *tells you* what to type. An agent **does the work** and hands you a reviewable diff.

## What is it like to use?

You start it in any project folder, and an interface opens right in the terminal:

```bash
cd my-project
opencode
```

Then you talk to it like a developer on your team:

- *"How is authentication handled in `@src/auth.ts`?"*
- *"Add a dark-mode toggle to the navbar and verify it in both themes."*
- *"Open a PR with this change and make sure the site still builds."*

You can drag-and-drop screenshots into the prompt, undo any change with `/undo`, and switch to **Plan mode** (the `Tab` key) when you want a proposal instead of edits.

## Who is it for?

- **Developers who live in the terminal** — no context-switching to a browser
- **Anyone tired of vendor lock-in** — OpenCode works with almost any model provider (Anthropic, OpenAI, Google, OpenRouter, local models…)
- **Teams** — project instructions live in the repo (`AGENTS.md`, skills), so every teammate's agent starts smart
- **Learners** — ask it to explain unfamiliar code, line by line, at your pace

## What it is *not*

- Not a cloud lock-in — it's **open source** and runs on your machine, against your files
- Not autocomplete — it works in **tasks**, not line completions
- Not magic — you review every change; that's the point (see [Why OpenCode](./2-why-opencode.md))

:::tip Key takeaway
OpenCode turns your terminal into a workshop where AI does the labor and you make the calls.
:::

---

**Next:** [Why OpenCode? →](./2-why-opencode.md) — the problems it solves and how it compares.
