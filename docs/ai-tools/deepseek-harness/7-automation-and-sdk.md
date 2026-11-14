---
sidebar_position: 7
slug: automation-and-sdk
title: Automation and SDKs
---

# Automation and SDKs

The Web UI is one surface. The same runtime is available as a one-shot CLI, a protocol server, and a library — which is what makes `dsh` interesting outside your laptop.

| Surface | Entry point | Best for |
|---|---|---|
| Headless CLI | `dsh headless "task"` | CI steps, cron jobs, batch work |
| Agent Client Protocol | `dsh acp` | Editors and automation clients over stdio |
| TypeScript SDK | `dsh sdk` (JSON-RPC) | Node programs and custom front ends |
| Python SDK | `deepseek-harness-sdk` | Scripts, tests, data pipelines |

## Headless mode

```bash
dsh --profile headless "run the tests"
```

The task comes from the argument, or from stdin when the argument is omitted or is a lone `-`. The final answer goes to stdout, diagnostics to stderr, and the process exits `0` only when the last turn completed — `1` for aborted, errored, or no-turn runs.

| Flag | Effect |
|---|---|
| `--json` | Newline-delimited event stream on stdout instead of the final text |
| `--session-id <id>` | Adopt an existing session (unknown ids fail before the task runs) |
| `--permission-mode <preset>` | Apply a permission preset before submitting, including on resume |
| `--approval-policy ask\|never` | Override approval behaviour after selecting the preset |
| `--add-dir <path>` | Grant an additional absolute directory under `workspace-write` (repeatable) |

### The `--json` event stream

The stream opens with `session` and closes with `final`; in between you get `status`, `text`, `thinking`, `tool_call`, and `tool_result`.

```bash
dsh --profile headless --json "run the tests" | tee run.jsonl

jq -r 'select(.type=="session") | .sessionId' run.jsonl
jq -r 'select(.type=="tool_call") | .name' run.jsonl | sort | uniq -c
jq -r 'select(.type=="final") | .reason.kind' run.jsonl
```

Three details that matter when you script it:

- A completed run requires **both** exit code `0` and `final.reason.kind === "completed"`. A `tool_result` that says `completed` only means the tool returned — a shell command inside it can still have failed.
- Event strings are capped (8 KiB per string, 32 KiB per line) and flagged with `truncated`; the terminal `final` event is lossless. The stream is a **projection**, not the session log.
- A runner failure outside a turn emits an `error` event and **no** `final`.

### A CI step

```yaml
name: dsh-test-triage
on:
  workflow_dispatch:
  pull_request:

jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Triage tests with dsh
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
        run: |
          npx --yes @deepseek-ai/dsh@0.2.2-rc.3 headless \
            --permission-mode workspace-write \
            --json \
            "Run the test suite. Summarize each failure with the file and the assertion." \
            > dsh-run.jsonl
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: dsh-run
          path: dsh-run.jsonl
```

Pin the version. A runner that silently upgrades mid-quarter is a runner that breaks on a Tuesday.

:::warning Headless credentials are not the GUI credentials
The shipped headless profile disables the managed credential store. Keys come from the launch environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. A key saved through the UI is **ignored** — which is exactly what you want in CI.
:::

## Python SDK

The Python SDK ships a native runtime wheel and the `dsh` command, so normal SDK execution needs **no system Node.js**.

```bash
python -m venv .venv && . .venv/bin/activate
python -m pip install deepseek-harness-sdk

export DEEPSEEK_API_KEY=sk-...
# export DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1   # optional compatible gateway
```

```python
from pathlib import Path

from deepseek_harness import DeepSeekHarness

workspace = Path("/absolute/path/to/disposable-workspace").resolve()
dsh_home = Path("/absolute/path/to/example-dsh-home").resolve()

with DeepSeekHarness(
    provider="deepseek-official",
    model="deepseek-v4-flash",
    max_tokens=49_152,
    cwd=str(workspace),
    dsh_home=str(dsh_home),
    profile="sdk-minimal",
) as harness:
    result = harness.run(
        "Inspect the repository and fix the failing tests.",
        session_id="example-001",
    )

print(result.final_response)
```

Notes from the official tutorial:

- The SDK starts `dsh --profile sdk-minimal` lazily and reuses the process until the context manager exits.
- It **never** silently reads `~/.dsh`: pass `dsh_home` explicitly. The minimal example and this SDK are designed for disposable homes and workspaces.
- The `sdk-minimal` profile pins `danger-full-access`; use a disposable checkout or a container.
- Persistent plugins go through `dsh plugin` with the same `DSH_HOME`.

## TypeScript SDK and ACP

The TypeScript SDK talks to `dsh sdk` over stdio JSON-RPC and resolves its same-version `dsh` dependency, so the runtime and the client cannot drift. The `sdk-minimal` profile exposes the standalone minimal tree instead of `dsh-base`.

ACP is the editor-facing protocol:

```bash
dsh acp     # serve until the client disconnects
```

Anything that speaks Agent Client Protocol — editors, IDEs, orchestrators — can drive the harness without the web app. The difference from the SDK is the audience: ACP models an interactive client session, while the SDK models a program calling an agent.

## Scheduled reminders

The Web profile includes a Host schedule service and an **Automation tasks** page. You can create a reminder by asking the model or by filling in the editor.

```text
Remind me every weekday at 09:00 in Asia/Shanghai to summarize new failing
tests in the invoicer workspace.
```

A reminder has a name, an instruction, a start time (UTC or an IANA zone), and an **RFC 5545** repeat rule. Delivery options:

| Run in | Behaviour |
|---|---|
| Current conversation | Drops the instruction into the session you asked from |
| One new conversation, reused | Creates a conversation on first delivery, then reuses it |
| New conversation every run | Creates a fresh conversation per delivery (rate-limited by the host's minimum interval) |

The `standard`, `cordis`, and `ptc` presets declare the four schedule tools; `minimal` deliberately does not. Delegated subagents can see them but calls are refused, so a subagent cannot quietly reschedule your work.

Scheduled tasks are best for **digests and nudges**, not for unattended writes. Keep the instruction read-only and let a human run the fix.

## GitHub review sessions

An opt-in overlay turns "PR marked ready for review" into a read-only review session. The pieces:

1. Install both packages into the Web profile:

   ```bash
   dsh plugin --profile web add @deepseek-ai/dsh-webhook @deepseek-ai/dsh-webhook-github
   ```

2. Create a webhook secret and keep it stable across restarts:

   ```bash
   export DSH_GITHUB_WEBHOOK_SECRET="$(openssl rand -hex 32)"
   ```

3. Start `dsh web` with the shipped overlay:

   ```bash
   export DSH_GITHUB_REVIEW_WORKSPACE=/path/to/repo
   dsh web --patch "${DSH_HOME:-$HOME/.dsh}/profiles/web/node_modules/@deepseek-ai/dsh-webhook-github/examples/github-review/cordis.yml"
   ```

4. Point a GitHub **Pull requests** webhook (JSON content type) at the overlay's endpoint through a TLS proxy or tunnel. The overlay listens on `127.0.0.1:3081` by default and serves only `POST /github`; the main UI stays on 3080.

The review session selects the `standard` agent preset with a read-only permission preset and reuses the repository's Web workspace. It is a good template for "agent as a reviewer with no write access".

## Public deployments

By default the Web UI is a loopback app. To put it behind a reverse proxy:

| Flag | Purpose |
|---|---|
| `--public-url <url>` | Advertise the external HTTP(S) root in printed/opened URLs and runtime context — **grants no trust** |
| `--trusted-host <authority>` | Add an authority the `/api` browser-trust fence accepts (repeatable) |
| `--tls-cert` / `--tls-key` | Terminate TLS in `dsh` itself |

`--host` accepts one concrete local interface address; wildcard binds are rejected. If the proxy strips a path prefix, `--public-url` should reflect the external root and `--trusted-host` should name the external authority.

:::warning Do not expose an agent with shell access to the internet
The web UI is an authenticated-context application, not a hardened multi-tenant service. Put it behind SSO or a private network, and keep the sandbox at `workspace-write` or stricter.
:::

:::tip Key takeaway
Use **headless + `--json`** for pipelines, the **Python SDK** when the agent is one step in a program, **ACP** when the client is an editor, and **schedules/webhooks** for recurring, read-only work. Always pin the version.
:::

---

**Next:** [Use cases →](./8-use-cases.md) — eight patterns worth stealing.
