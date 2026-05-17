---
name: life-todo
description: Manage the user's TODO list in life-on-golang. Trigger when they want to add a task, check what's on their plate, mark something done, or filter by goal/milestone/deadline.
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

## Patterns

**Adding.** If the user mentions a goal or project by name, call `goals_list` first to resolve the UUID before `todo_add`.

**Listing.** Default behavior is active (non-completed, non-archived) todos. Only pass `include_completed: true` if the user asks for history.

**Marking done.** When the user says "I finished X", look up by content match in `todo_list`, then call `todo_complete` with the matched UUID. Confirm if multiple matches.

## Notes

- `todo_source` is set to `"mcp"` on writes — easy to distinguish from app/Wear-OS-created todos.
- Sub-tasks: pass `parent_uuid` of the parent todo.
