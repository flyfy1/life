---
name: life-goal
description: Inspect and check in against the user's goals/milestones in life-on-golang. Trigger when they want to review progress on a goal, list their goals, or log a check-in.
---

# life-goal

Goals in life-on-golang have a structured shape — title, status, success criteria, milestones, periodic check-ins. The user uses this for things they care about more than a one-off todo.

## When to use

- *"what are my active goals"*, *"show my goals"*
- *"how am I doing on <goal>"*, *"give me a status on X"*
- *"log a check-in for the <goal> — I shipped Y today"*
- *"what milestones are coming up"*

## Tools (MCP `life-on-golang`)

- `goals_list` — defaults to all statuses; filter via `status`
- `goals_get` — single goal + its milestones + last 20 check-ins
- `goals_add_checkin` — record progress / blocker / completion *(stubbed; falls back to telling user to use the app)*

## Patterns

**Reviewing a goal.** Always pull `goals_get` for the full picture before commenting on progress — milestone completion rates + recent check-ins are the real signal.

**Naming.** Goals are referenced by UUID in the API but by title in conversation. Resolve via `goals_list` first.

**Health.** A goal whose `last_checkin_at` is older than `review_cadence_days` is drifting — surface this proactively when the user asks for status.
