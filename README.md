# life

Claude Code Agent Skills for the [LifeOnGolang](https://github.com/flyfy1/life-on-golang) personal-data stack.

Each subdirectory under `skills/` is one skill in the standard `SKILL.md` format. They tell Claude *when* to call which tool from the `life-on-golang` MCP server (which exposes the backend's contract types as JSON-RPC tools at `POST /mcp/v1`).

## Skills

| Skill | Trigger |
|---|---|
| [`life-money`](skills/life-money/SKILL.md) | Record an expense/income, query spending, check balances |
| [`life-todo`](skills/life-todo/SKILL.md) | Add/list/complete todos |
| [`life-idea`](skills/life-idea/SKILL.md) | Capture notes / search past ideas |
| [`life-goal`](skills/life-goal/SKILL.md) | Inspect goals, log check-ins |
| [`life-mood`](skills/life-mood/SKILL.md) | Log feelings/energy, review past entries |
| [`life-pomodoro`](skills/life-pomodoro/SKILL.md) | Inspect focus-time stats |
| [`life-overview`](skills/life-overview/SKILL.md) | Cross-domain weekly/monthly summaries |

## Install

Symlink each skill directory into `~/.claude/skills/`:

```bash
git clone git@github.com:flyfy1/life.git ~/code/life-skills
for d in ~/code/life-skills/skills/life-*; do
  ln -s "$d" ~/.claude/skills/
done
```

You also need the MCP server configured — point Claude Code at `https://<your-host>/mcp/v1` with a `Bearer tok_...` token from `POST /api/tokens` on the backend.

## Consumed as a submodule

This repo is also pulled into [`life-on-golang`](https://github.com/flyfy1/life-on-golang) as a submodule under `tools/skills/`, so the skills version-pin alongside the backend that exposes them. Bump the skills here, then update the submodule pointer in the consumer repo.
