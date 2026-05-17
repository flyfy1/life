---
name: life-money
description: Record and query 记账 (money transactions) in the user's life-on-golang app. Trigger when the user wants to log an expense/income, ask 'how much did I spend on X', see recent transactions, or check account balances.
---

# life-money

The user runs a self-hosted finance tracker (life-on-golang). All transactions live in their backend, exposed via an MCP server at the same host as the API.

## When to use this skill

- The user dictates a transaction: *"I spent 35 on lunch"*, *"got paid 8000 today"*, *"transferred 500 to savings"*.
- They ask about spending: *"how much did I spend on food this week"*, *"show last month's transactions"*.
- They want a balance: *"what's my CNY balance"*, *"list my accounts"*.

## Tools available (via MCP server `life-on-golang`)

- `money_list_transactions` — list with date / currency / book filters
- `money_list_books` — list 账本
- `money_list_currencies` — list currencies + current balance
- `money_add_transaction` — record a new transaction *(write path is stubbed for now; fall back to telling the user to open the app for writes)*

## Patterns

**Logging an expense.** Default `transaction_type=expense`, `occurred_at=now`. Always confirm the currency if the user is multi-currency — call `money_list_currencies` first if unsure.

**Sums and aggregates.** The list endpoint returns raw rows — compute totals/averages locally rather than asking the user for them.

**Amounts are in minor units.** `amount_minor=3500` means 35.00 CNY (precision=2). Convert before showing to the user, and convert the other way before writing.

## Setup

The MCP server is configured at `~/.claude/mcp/life-on-golang.json` (or however the user wires it). It needs a bearer token from `POST /api/tokens` in the backend.
