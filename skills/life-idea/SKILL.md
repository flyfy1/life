---
name: life-idea
description: Capture and search the user's notes / ideas / free-form jottings in life-on-golang. Trigger when they want to write down a thought, look up something they noted earlier, or browse recent notes.
---

# life-idea

Notes in life-on-golang are free-form text (markdown-friendly). They support threaded comments — use those for follow-ups and refinements.

## When to use

- *"jot this down"*, *"save this idea"*, *"note that ..."*
- *"what did I write about X"*, *"find my notes on ..."*
- *"show recent notes"*

## Tools (MCP `life-on-golang`)

- `notes_list` — substring search + recency filter
- `notes_add` — create a new note
- `notes_get` — fetch a note + its comments by UUID

## Patterns

**Capturing.** Just call `notes_add` with the user's words verbatim. Don't over-summarize — they want their own thinking back.

**Searching.** `search` is a case-insensitive substring on content. For multi-term queries, do multiple narrow searches and merge.

**Deepening.** When the user wants to add to an existing note, fetch it first (`notes_get`) so you can show them the current text and confirm the addition target.
