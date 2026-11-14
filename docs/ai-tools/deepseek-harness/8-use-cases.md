---
sidebar_position: 8
slug: use-cases
title: Use Cases
---

# Use Cases

Eight patterns that fit the harness model. Each one names the preset, the surface, and the guardrail that keeps it honest.

| Pattern | Preset | Surface | Guardrail |
|---|---|---|---|
| Repo triage and bugfix | `standard` | Web UI | `workspace-write` + independent verification |
| CI failure explainer | `standard` | Headless | Read-only prompt, artifacts uploaded |
| Internal model gateway | `standard` | Web UI | One profile patch, one audited provider id |
| Write-free reviewer | `standard` | Webhook overlay | Read-only permission preset |
| Plugin product | `cordis` | Web UI | Scratch home, reviewed packages |
| Document and data work | `standard` | Desktop | Scoped workspace, no secrets in files |
| Research with citations | `standard` | Web UI | Require sources; treat fetched text as untrusted |
| Disposable experiments | `minimal` | Container | No mounts except a scratch directory |

## 1. Repo triage and bugfix

**When:** you inherit a repository, or a failing test has no obvious owner.

**How:** the [end-to-end walkthrough](./5-workflow-walkthrough.md), compressed:

```text
Map the repo: entry points, test command, CI. Then find the failing test,
explain the root cause, and propose the smallest fix. Wait for approval.
```

**Why the harness helps:** the Trajectory view shows whether it actually ran the tests, and the session log lets a reviewer replay the reasoning.

**Guardrail:** never accept "tests pass" as prose. Run them yourself, and read the diff for weakened assertions.

## 2. CI failure explainer

**When:** your test job fails and the log is 4,000 lines of noise.

**How:** run headless in the pipeline, upload the JSON stream, and post a summary:

```bash
dsh headless --permission-mode workspace-write --json \
  "Run the test suite. For each failure, give file, assertion, and likely cause." \
  > dsh-run.jsonl
```

**Why the harness helps:** the event stream separates `tool_call` from `final`, so you can prove the suite ran rather than trusting the summary.

**Guardrail:** pin the version, keep the API key in CI secrets only, and make the prompt read-only in intent even though tests need to run.

## 3. Internal model gateway

**When:** your organisation routes all LLM traffic through one gateway with its own keys, logging, and model catalogue.

**How:** add one custom provider entry in a profile patch and roll that profile out to the team:

```yaml
- id: llm-pi-ai
  config:
    providers:
      corp-gateway:
        name: Corp gateway
        baseURL: https://llm.corp.example/v1
        protocol: openai-completions
        apiKey: ${CORP_LLM_KEY}
        models:
          - id: coder-large
          - id: reasoner-small
```

**Why the harness helps:** the model is an adapter. Swapping the gateway or adding a second one does not touch the rest of the composition.

**Guardrail:** one provider id per protocol. A gateway that serves both Chat Completions and Anthropic Messages needs two entries.

## 4. Write-free reviewer

**When:** you want a second opinion on a pull request without giving an agent push access.

**How:** the GitHub review overlay creates a session when a PR moves from draft to ready, using the `standard` preset with a **read-only** permission preset.

**Why the harness helps:** the read-only scope is enforced by the tool registry and sandbox, not by prompt wording. A filtered tool is absent from the prompt and refuses execution.

**Guardrail:** review sessions still read your repository. Point them at the checkout you intend, and keep the webhook secret stable across restarts.

## 5. Plugin product

**When:** your team has a repetitive workflow that no shipped tool covers — a deploy gate, an internal API, a compliance check.

**How:** open **Creator mode** (`cordis`) and ask for a plugin that inspects the relevant service before writing code.

```text
Use cordis_inspect_query to look at how tools register and what config a tool
row accepts. Then write a plugin exposing a `deploy_status` tool that calls
our internal API, with a config schema for the base URL and token.
```

**Why the harness helps:** the inspection tools turn "guess the API" into "read the live registry". The plugin is a package, so it can be versioned, reviewed, and published to a plugin index.

**Guardrail:** plugins run with harness privileges. Review every dependency, and test in a scratch `DSH_HOME`.

## 6. Document and data work

**When:** the work is a PDF, a spreadsheet, a report, or a slide deck rather than a codebase.

**How (desktop app):** drop documents, spreadsheets, or PDFs into a session and ask for analysis, charts, or slides. The desktop build ships the usual office and development tools preloaded.

**Why the harness helps:** the same session can read a CSV, run a script to chart it, and write the result — no context switch to a data tool.

**Guardrail:** a document workspace is still a filesystem. Keep customer data out of it unless the isolation story is real, and check generated numbers against the source.

## 7. Research with citations

**When:** you need a briefing, not a code change.

**How:**

```text
Research <topic> using web search and fetch. For every claim, cite the URL and
the date you retrieved it. Flag anything you could not verify.
```

**Why the harness helps:** search and fetch are tools with visible calls in the trajectory, so you can audit the sources rather than trusting a bibliography the model invented.

**Guardrail:** fetched pages are **untrusted input**. A page can contain instructions aimed at the agent; treat prompt-injection resistance as a policy question, not a guarantee.

## 8. Disposable experiments

**When:** you want to try an agent on an unfamiliar or untrusted repo.

**How:** bring your own boundary:

```bash
docker run --rm -it \
  -v "$PWD/scratch:/work" -w /work \
  -e DEEPSEEK_API_KEY \
  node:24-bookworm \
  bash -lc 'npm i -g @deepseek-ai/dsh@0.2.2-rc.3 && dsh headless --permission-mode danger-full-access "map this repo"'
```

Inside a disposable container, `danger-full-access` is a reasonable choice — the container is the boundary. Outside one, it is not.

**Why the harness helps:** `minimal` keeps the tool surface small, and the sandbox modes are explicit rather than implied.

**Guardrail:** mount only the scratch directory, pass only the key you can rotate, and throw the container away.

## Bonus: several agents at once

`dsh` runs one session per agent. When you want four sessions across three repositories, put them in [Herdr](/docs/ai-tools/herdr/core-concepts) or tmux: `dsh web` in one pane, `dsh headless` jobs in others, and a persistent workspace that survives detach.

For parallel work **inside** one session tree, use Agent Teams or subagents rather than opening several sessions on the same files.

:::tip Key takeaway
The best `dsh` use cases share a shape: **a narrow task, a verifiable result, and a boundary you control**. If any of the three is missing, the harness will happily let you discover that the hard way.
:::

---

**Next:** [Troubleshooting →](./9-troubleshooting.md) — when the runtime, not the model, is the problem.
