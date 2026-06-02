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

## Tools (MCP `life-on-golang`)

- `todo_list` — filter by goal/milestone/deadline/completed
- `todo_add` — create a new todo
- `todo_complete` — toggle completion (`completed: false` to un-complete)

## CLI fallback

If MCP tools are unavailable or the user asks to use the local CLI, use the `cli/` subrepo:

```bash
cd /Users/songyy/fast/serious/life-on-golang/cli
go run ./cmd/life sync
go run ./cmd/life list list
go run ./cmd/life todo list --open
```

Useful commands:

- `life list add/list/update/delete` manages todo lists.
- `life todo add/list/show/update/done/delete` manages todos.
- `life todo update <uuid-prefix> --list <list-uuid-or-name>` classifies or moves a todo.
- `life todo update <uuid-prefix> --clear-list` removes a todo from its list.
- `life sync` pulls and pushes pending todo/list changes through `https://api.integ.life`.

When list names are duplicated, prefer UUID prefixes from `life list list`. After bulk updates, run `life sync` and verify no pending changes remain.

## Patterns

**Adding.** If the user mentions a goal or project by name, call `goals_list` first to resolve the UUID before `todo_add`.

**Listing.** Default behavior is active (non-completed, non-archived) todos. Only pass `include_completed: true` if the user asks for history.

**Marking done.** When the user says "I finished X", look up by content match in `todo_list`, then call `todo_complete` with the matched UUID. Confirm if multiple matches.

**Classifying.** For uncategorized todos, first list active todo lists, then move each todo to the closest list by content. If the task is ambiguous, inspect parent/notes before choosing. Confirm with a query for active todos whose `list_uuid` is empty.

## Notes

- `todo_source` is set to `"mcp"` on writes — easy to distinguish from app/Wear-OS-created todos.
- Sub-tasks: pass `parent_uuid` of the parent todo.
