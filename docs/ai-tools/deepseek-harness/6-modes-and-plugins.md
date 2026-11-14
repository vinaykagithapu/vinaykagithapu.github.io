---
sidebar_position: 6
slug: modes-and-plugins
title: Modes and Plugins
---

# Modes and Plugins

Two dials change what `dsh` is: the **preset** changes how the agent works, and **plugins** change what the harness can do at all.

## Four agent presets

![Animated diagram: four preset cards — standard, ptc, minimal, creator — with their tool sets and loop shapes highlighted in turn](/img/deepseek-harness/preset-modes.svg)

| Preset | Tools the model sees | Loop shape | Reach for it when |
|---|---|---|---|
| `standard` | Files, shell, web search/fetch, subagents, plans, teams, schedules | Full agent loop with approvals | Everyday coding and document work |
| `ptc` | `run_code` plus a generated TypeScript SDK of the other tools | Programmatic tool calling — several calls in one program | Repetitive multi-call work, cheaper round trips |
| `minimal` | `bash`, `str_replace_editor` | Lean loop, smallest context | Benchmarks, constrained environments, cost control |
| `cordis` | `standard` + runtime inspection + plugin authoring | Full loop plus read-only introspection | Building plugins and presets |

### `standard`

The default in the Web UI. It mounts the `dsh-base` core and adds the browser application: file read/write/edit/patch, `read_image`, bash or PowerShell, web search, HTTP fetch, `subagent` / `subagent_fork` / `send_message`, task and goal tools, the working-directory tool, MCP resources, schedule tools, and Agent Teams (off per session by default).

Use it unless you have a specific reason not to. It is the preset all the walkthroughs assume.

### `ptc` — programmatic tool calling

Instead of exposing each tool as a separate function call, PTC exposes **one** tool, `run_code`, and generates a TypeScript SDK for the rest. The model writes a short program:

```ts
const files = await tools.glob({ pattern: "src/**/*.test.ts" });
for (const file of files.paths) {
  const failing = await tools.bash({
    command: `npm test -- --run ${file}`,
    description: `test ${file}`,
  });
  if (failing.exitCode !== 0) console.log(file, failing.stdoutTail);
}
```

Why it matters: a sequence that would otherwise cost five model round trips runs as one call. Program bindings still enter the **same guarded tool pipeline** in submission order, so approvals and sandboxing apply. There are limits on parallel sub-calls, total calls, and timeout — exceeding them terminates the program.

PTC is not available in `minimal` by design; the point of `minimal` is the bare loop.

### `minimal`

Two tools, no planning scaffolding, no schedules, no subagents. DeepSeek uses it for benchmark runs (the company reported Terminal Bench 2.1 results measured in `minimal` mode), and it is the right preset when you want to measure the **model**, not the harness.

It is also the cheapest way to run a task in a hostile environment: fewer tools, fewer prompt tokens, fewer ways to do damage.

### `cordis` — Creator mode

Everything in `standard`, plus:

- `cordis_inspect_list` and `cordis_inspect_query` — read-only introspection of services, events, config schemas, and live UI slots;
- plugin-authoring guidance in the prompt;
- the `plugin_market` tool when custom plugin indexes are enabled.

This is the mode to use when the task is "write me a plugin that adds an X tool". The inspection tools answer questions the model would otherwise hallucinate about.

:::note Presets are recorded, not global
A session records the preset it ran under. Switching presets while the session is blank is allowed; a session with history keeps the composition it started with. Delegated subagents join their parent's preset unless the delegation selects another.
:::

## Plugin management

### From the UI

The Web UI has a **Plugins** page: install, configure, enable, disable, and remove. This is the supported path for everyday use, and it writes the same `package.json` the CLI does.

### From the CLI

`dsh plugin` is a thin forwarder to **pnpm** inside the profile directory:

```bash
# install a plugin into the web profile
dsh plugin --profile web add @scope/dsh-some-plugin

# remove it
dsh plugin --profile web remove @scope/dsh-some-plugin

# ask why a dependency is present
dsh plugin --profile web why @scope/dsh-some-plugin
```

Two rules that save an afternoon:

1. **Peers are not automatic.** Profiles do not install peer dependencies for you. Experimental packages often need their peers added explicitly — the webhook example needs both `@deepseek-ai/dsh-webhook` and `@deepseek-ai/dsh-webhook-github`.
2. **Version requirements are enforced.** Bundles declare `engines.dsh` (or `dsh` peer dependencies). A mismatch blocks installation and activation; do not bypass it, because the plugin was written against a different runtime contract.

### Plugin indexes

The **Discover** experience is experimental and opt-in: enable **Custom plugin indexes** under Experimental plugins, and a Discover tab appears next to Installed. An index is a JSON document listing plugins with metadata. Add the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic to your repository to make a plugin discoverable.

The `plugin_manager` **model tool** also exists. It requires `danger-full-access` or an approval for that specific call, and any change it makes affects **every session in the profile**. Treat it as an admin surface, not a convenience.

:::warning Review plugins before mounting
Plugins run inside the harness with the harness's privileges. There is no marketplace review board. Read the source, check the version constraint, and prefer a scratch `DSH_HOME` for first contact.
:::

## Extension surfaces beyond plugins

Not every extension needs to be a plugin. Six lighter-weight seams cover most integration needs:

| Surface | What it gives you |
|---|---|
| **MCP servers** | Configure MCP client entries and the harness exposes their tools and resources; MCP resources are mounted once and scoped per caller |
| **Skills** | Preset-declared instruction bundles the agent can load when relevant |
| **Instructions files** | `AGENTS.md` and `CLAUDE.md` are discovered and injected as workspace guidance |
| **Hooks bridges** | Run an existing Claude Code or Codex `hooks.json` against harness interception points — a compatibility path, not the preferred design |
| **External subagent providers** | Two shipped providers can delegate work to a **Claude Code** or **Codex** binary on `PATH`; both are off by default |
| **ACP** | Expose the harness to editors and automation clients over Agent Client Protocol (`dsh acp`) |

The external subagent providers are a pragmatic answer to "my team already pays for the other agent". They resolve the binary from the host `PATH`, so installation and login stay your responsibility.

## Writing your first plugin

A plugin is a package that exports a Cordis plugin — a function receiving a context — plus, optionally, a config schema. The smallest useful shape:

```ts
import type { Context } from 'cordis'

export const name = 'hello-tool'

export function apply(ctx: Context, config: { greeting: string }) {
  ctx.tools.register({
    name: 'hello',
    description: 'Say hello to the user.',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    async execute() {
      return { content: [{ type: 'text', text: config.greeting }] }
    },
  })
}
```

Then mount it as a row in your profile patch:

```yaml
- insert:
    - id: hello-tool
      name: 'my-dsh-hello-tool'
      config:
        greeting: hello from a plugin
```

Two habits make plugin work bearable:

- Use **Creator mode** and ask it to inspect the relevant service (`cordis_inspect_query`) before writing code. The API surface moves between pre-releases.
- Get the package into the profile with `dsh plugin --profile web add ./path/to/plugin`, then use `dsh --profile web --dump-config` to confirm the row mounted.

The official development guide — Cordis primer, service and event APIs, the tool cookbook — lives in the [repository docs](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/user/develop).

## Agent Teams and Ralph loops

Two orchestration features sit above single-agent work:

- **Agent Teams** — mounted in `dsh-base`, enabled per root session with the conversation's *Use Agent Teams* switch. Teammates get task tools and can work in parallel inside one session tree.
- **Ralph loop** — one foreground workflow run toward a fixed objective, where each round is a **fresh child agent** with no parent conversation, carrying only a bounded handoff and the shared workspace. Useful for "keep iterating until the objective is met" tasks where you do not want context to accumulate.

Both are advanced and both benefit from the same discipline: narrow objectives, verifiable completion criteria, and a sandbox you would not mind losing.

:::tip Key takeaway
Change the **preset** to change the agent's shape; add a **plugin** to change the harness's capabilities. Start with `standard`, reach for `ptc` when round trips hurt, use `minimal` to measure the model, and open `cordis` when the harness itself is the thing you are building.
:::

---

**Next:** [Automation and SDKs →](./7-automation-and-sdk.md) — run the same agent from CI, Python, editors, and schedules.
