---
sidebar_position: 6
slug: use-cases
title: Use Cases
---

# Use Cases

What do people actually *do* with OpenCode? Six patterns, from first hour to daily driver.

![Six real-world OpenCode use cases at a glance](/img/opencode/oc-usecases.png)

## 1. Learn an unfamiliar codebase
New job, new repo, 200k lines. Instead of archaeology, ask:

> *"Trace how a request flows from the router to the database in `@src/api`."*

The agent reads across files and explains the path — with file references you can verify. It's the fastest onboarding tool you've never had.

## 2. Ship a feature end-to-end
The flagship loop — plan → build → verify → review:

1. **Plan mode**: describe the feature, iterate on the proposal
2. **Build mode**: the agent edits across files
3. It runs your build and tests, fixing what breaks
4. You review the diff, then a PR opens with a clean message

You stay in the reviewer's chair the whole way. The full pattern is in the blog post [Agentic Workflows with OpenCode](/blog/opencode-agentic-workflows).

## 3. Automate the boring maintenance
Sites, docs, configs — the recurring chores:

- "Update the footer year across all pages and verify both themes"
- "Triage these issues into the backlog with labels"
- "Regenerate the screenshots after the redesign"

Write the workflow as a **skill** once; reuse it every time.

## 4. DevOps & infrastructure work
YAML-heavy, pattern-matching, error-prone work — an agent's favorite:

- Draft and review Kubernetes manifests, CI pipelines, Terraform modules
- Debug a failing pipeline from its log
- Keep environment documentation and `.env.example` in sync

## 5. Data & ML chores
The 20% of ML work nobody wants: dataset scripts, cleaning steps, experiment logging, notebook-to-module refactors. Point the agent at the files with `@` and describe the outcome.

## 6. Team standards that stick
This is the compounding one. `AGENTS.md` + skills + commands live **in the repo**, so:

- Every teammate's agent follows the same conventions
- Reviewers approve AI changes faster (they know the rules it followed)
- Onboarding an agent takes minutes, not weeks

## When *not* to use it

Honesty matters:

- **One-line syntax questions** — a chatbot is faster
- **Production credentials** — never paste secrets into any agent; keep them in env vars (the `secret-scan` skill in the starter pack automates this)
- **Unreviewable changes** — if you can't review the diff, don't approve it

:::tip Key takeaway
Start with #1 (learning) or #3 (maintenance) today; graduate to #2 (shipping) once you trust the loop; let #6 compound for months.
:::

---

**That's the guide.** Want hands-on? Jump to [Getting started](./3-getting-started.md), or grab the [skills starter pack](https://github.com/vinaykagithapu/opencode-skills) and put the ideas to work. Curious about the internals? The [official docs](https://opencode.ai/docs/) go deeper on everything here.
