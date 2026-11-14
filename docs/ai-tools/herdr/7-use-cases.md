---
sidebar_position: 7
slug: use-cases
title: Use Cases
---

# Use Cases

Herdr is infrastructure, so its value shows up in *how* you work. These are the patterns that hold up in practice.

## 1. Ship one feature with parallel agents

**The pattern:** one worktree per agent, one workspace per worktree, you in a review pane.

- Agent A implements the feature in `feat/search`.
- Agent B writes the tests in `feat/search-tests`.
- Agent C updates docs in `docs/search`.

Each gets a clean checkout (`herdr worktree create --branch …`), its own build, and no file collisions. You merge branch by branch after reviewing each diff.

**Why it works:** parallelism without shared mutable state. The sidebar tells you which agent finished first.

## 2. The review desk

**The pattern:** an implementer agent and a reviewer agent, plus you.

- `claude` implements in one pane.
- `codex` reviews the diff in a second pane — prompt it with "review the working tree for bugs, not style."
- You read both, run the tests yourself, and decide.

Herdr's `agent read` lets you pull the reviewer's conclusion without scrolling; `agent wait --until blocked` tells you when it wants a decision.

## 3. The always-on dev loop

**The pattern:** the boring three — dev server, test watcher, log tail — in a `logs` tab that never closes.

```bash
herdr pane run w1:p3 "npm run dev"
herdr pane run w1:p4 "npm test -- --watch"
herdr pane run w1:p5 "tail -f .tmp/dev.log"
```

Because the server owns the panes, closing your laptop or detaching does not kill the watchers. Reattach and the state is still there.

## 4. Remote and GPU work — including from a phone

**The pattern:** code and compute live on a remote box; you attach from wherever you are.

```bash
ssh you@gpu-box
herdr            # agents, training runs, and logs run here
```

Or keep it as a saved machine in your local window (`herdr machine add gpu-box`) and switch between Local and remote workspaces without another client. On a phone, any SSH client works; the TUI adapts to narrow screens so you can answer a `blocked` agent from the train.

This is the modern replacement for "SSH in, start tmux, hope the connection holds."

## 5. Long jobs and approval queues

**The pattern:** start work, walk away, come back to a queue.

- Agents run multi-minute refactors and builds.
- Notifications fire on `done` and `blocked`.
- The workspace list shows which project needs you, not just which terminal is busy.

For agents that pause on approvals, you get a genuine inbox: answer the blocked one, let the working ones continue. Scripts can join in with `herdr agent wait <name> --until blocked`.

## 6. Multi-repo maintenance

**The pattern:** one workspace per repo, one session across all of them.

Portfolio site, docs site, infra repo, a couple of services — each is a workspace with its own tabs and agents. The sidebar becomes a control panel for your whole machine. `prefix+w` jumps between projects without losing scrollback or agent conversations.

## 7. Local agent orchestration

**The pattern:** a script (or an agent) coordinates other agents through the CLI.

```bash
# fan out: start two reviewers, wait for both to settle
herdr agent prompt reviewer-a "Review PR #42" --wait --timeout 300000 &
herdr agent prompt reviewer-b "Review PR #42 for security issues" --wait --timeout 300000 &
wait

# collect their verdicts
herdr agent read reviewer-a --source recent-unwrapped --lines 60
herdr agent read reviewer-b --source recent-unwrapped --lines 60
```

Or install the agent skill and let one agent manage the others — splitting panes, running tests, and waiting for workers. Everything is JSON, so it composes with `jq` and ordinary shell tooling.

## 8. Teaching, pairing, and onboarding

**The pattern:** a shared session instead of a screen share.

- `herdr agent attach <name>` drops your current terminal straight into one agent's terminal (detach with `ctrl+b q`).
- New teammates can watch a real workflow — panes, states, and approvals — rather than a recording.
- Because the session persists, a pairing session can pause and resume hours later.

## When *not* to use Herdr

- **Unattended pipelines.** Use CI/CD. Herdr is an interactive workspace, not a scheduler.
- **One-shot commands.** If it finishes in seconds, a plain terminal is simpler.
- **Secrets handling.** Any agent or plugin inherits your privileges; keep credentials in env vars/secret managers and out of prompts.
- **Changes you cannot review.** `done` means "review ready," never "merge approved."

:::tip Key takeaway
Start with pattern **3** (always-on dev loop) to feel the persistence, then **1** (parallel worktrees) once you trust the review loop. Pattern **7** is where it compounds — your scripts and agents start orchestrating the workspace.
:::

---

**Next:** [Troubleshooting →](./8-troubleshooting.md) — when detection, keys, restores, or remote auth misbehave.
