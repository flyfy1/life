---
name: life-todo
description: Manage the user's TODO list in life-on-golang. Trigger when they want to add a task, check what's on their plate, mark something done, classify todos into lists, manage todo lists, or filter by goal/milestone/deadline.
---

# life-todo

The user keeps their TODOs in life-on-golang. Each todo can optionally hang off a goal + milestone, has an optional deadline, and supports parent/child nesting.

## When to use

- *"add a todo to ..."*, *"remind me to ..."*
- *"what's on my list"*, *"what's due today / this week"*
- *"mark X as done"*, *"complete the ... todo"*
- *"show todos for the <goal> goal"*

## Primary tool: local CLI

Use the `cli/` subrepo as the default implementation path in Codex sessions. It reads the user's local integ.life SQLite database, syncs through the production API when a token is configured, and does not require MCP tools to be exposed in the current session.

```bash
cd /Users/songyy/fast/serious/life-on-golang/cli
go run ./cmd/life sync
go run ./cmd/life list list --json
go run ./cmd/life todo list --open --json
```

Useful commands:

- `life list add/list/update/delete` manages todo lists.
- `life todo add/list/show/update/done/delete` manages todos.
- `life todo reply <uuid-prefix> "<message>"` adds a synced reply to a todo.
- `life todo replies <uuid-prefix> --json` lists replies for a todo.
- `life todo update <uuid-prefix> --list <list-uuid-or-name>` classifies or moves a todo.
- `life todo update <uuid-prefix> --clear-list` removes a todo from its list.
- `life sync` pulls and pushes pending todo/list changes through `https://api.integ.life`.

When the user asks Codex to implement or fix an existing TODO, add a reply to that TODO after the work is complete. The reply should include what changed, the verification commands, and the commit hash. Use `go run ./cmd/life todo reply --source Codex --actor Codex <uuid-prefix> "<message>"`, then run `go run ./cmd/life sync` and verify with `go run ./cmd/life todo replies <uuid-prefix> --json`.

For category/list-specific queries, sync first, list categories, resolve the exact list name or UUID, then filter todos:

```bash
go run ./cmd/life sync
go run ./cmd/life list list --json
go run ./cmd/life todo list --open --list "个人项目" --json
```

When list names are duplicated, prefer UUID prefixes from `life list list --json`. After bulk updates, run `life sync` and verify no pending changes remain.

## MCP fallback

If `life-on-golang` MCP tools are available in the session, they can be used instead of the CLI:

- `todo_list` — filter by goal/milestone/deadline/completed
- `todo_add` — create a new todo
- `todo_complete` — toggle completion (`completed: false` to un-complete)

## Patterns

**Adding.** Use `go run ./cmd/life todo add --list <list-name-or-uuid> "<content>"` for list/category tasks. If the user mentions a goal or project by name and MCP tools are available, call `goals_list` first to resolve the UUID before `todo_add`.

**Listing.** Default behavior is active (non-completed, non-archived) todos. In the CLI, use `go run ./cmd/life todo list --open`; only use `--done` or MCP `include_completed: true` if the user asks for history.

**Marking done.** When the user says "I finished X", look up by content match in `go run ./cmd/life todo list --open --json`, then run `go run ./cmd/life todo done <uuid-or-prefix>`. Confirm if multiple matches.

**Replying after implementation.** Resolve the target TODO UUID first. Add a short reply after the code is committed and pushed:

- What changed in user-facing terms.
- Verification commands and whether they passed.
- The commit hash.

Use the CLI reply command:

```bash
go run ./cmd/life todo reply --source Codex --actor Codex <uuid-prefix> "<message>"
go run ./cmd/life sync
go run ./cmd/life todo replies <uuid-prefix> --json
```

**Classifying.** For uncategorized todos, first list active todo lists, then move each todo to the closest list by content. If the task is ambiguous, inspect parent/notes before choosing. Confirm with a query for active todos whose `list_uuid` is empty.

## Notes

- CLI-created todos use the CLI sync path and local SQLite first; sync failures leave pending rows for a later `life sync`.
- MCP-created todos set `todo_source` to `"mcp"` on writes — easy to distinguish from app/Wear-OS-created todos.
- Sub-tasks: pass `parent_uuid` of the parent todo.
