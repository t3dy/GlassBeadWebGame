# The Ticket System — how we track work, bugs, and ideas

> **Purpose.** A lightweight, in-repo issue tracker so that problems, ideas, and work-in-progress are
> *written down where the code lives* — not lost in chat. It is deliberately small: a board
> (`TICKETS.md`), a template (`TEMPLATE.md`), and this guide. No external tool, no account, works offline.

## How to read this (Universal Design for Learning)

This guide is written in three registers so it serves whoever opens it:
- 🟢 **Plain** — what to do, in one sentence.
- 🔵 **Procedure** — the exact steps.
- 🟣 **Why** — the reasoning, so you can adapt it when reality doesn't fit the steps.

---

## 1. What a ticket is

🟢 **Plain.** A ticket is one unit of *intent*: a bug to fix, a feature to build, a question to resolve,
or a chunk of debt to pay down. One ticket = one outcome you could check off.

🟣 **Why.** Agile practice (Beck, *Extreme Programming Explained*; the Scrum "Product Backlog Item")
keeps work in small, independently-shippable slices so progress is visible and reversible. We borrow the
*spirit* — small, written, prioritized, definition-of-done — without the ceremony.

## 2. The pieces

| File | Role | Analogy |
|---|---|---|
| `TICKETS.md` | the **board** — every ticket, its status, priority, and full body | the Kanban wall |
| `TEMPLATE.md` | the **blank form** — copy it to open a new ticket | the index card |
| `README.md` (this) | the **rules of the game** | the wall instructions |

There is no separate file per ticket: the board *is* the tickets. This keeps everything on one page you
can `Ctrl-F`, which matters more at this scale than per-issue files.

## 3. The lifecycle (statuses)

🟣 **Picture.**

```
  BACKLOG ──▶ TODO ──▶ IN-PROGRESS ──▶ IN-REVIEW ──▶ DONE
     │                                                  ▲
     └────────────────────▶ WONT-DO ───────────────────┘ (closed, not done)
```

| Status | Means | Who moves it |
|---|---|---|
| `backlog` | captured, not yet scheduled | anyone, anytime |
| `todo` | scheduled for the current focus | whoever plans the session |
| `in-progress` | actively being worked | the implementer (claim it!) |
| `in-review` | code written, awaiting test/review/verify | the implementer |
| `done` | merged + **Definition of Done** met | the reviewer |
| `wont-do` | closed deliberately without doing | with a one-line reason |

## 4. Priorities & types

- **Priority:** `P1` (do next — blocks the vision or users) · `P2` (important, soon) · `P3` (nice, later).
- **Type:** `epic` (large, multi-step) · `feature` · `bug` · `perf` · `refactor` · `debt` · `question` ·
  `chore`.

## 5. Definition of Done (the gate)

🟢 **Plain.** A ticket is only `done` when it actually works and won't quietly rot.

🔵 A ticket is `done` when **all** hold:
1. The change is implemented and `npm run build` is clean.
2. **There is a test** that fails without the change and passes with it (see `docs/TESTING.md` — we work
   test-first). For pure logic this is a `vitest`; for UI, a verified preview interaction noted in the
   ticket.
3. Any player-facing string is **grounded/cited** (the Grounding Rule).
4. The ticket's *Acceptance* checklist is fully ticked.
5. `HANDOVER_CURRENT.md` is updated if the change is user-visible.

## 6. The workflow (for a human or an agent)

🔵 **Procedure.**
1. **Open one:** copy `TEMPLATE.md` into a new `### TICKET-NNN` block in `TICKETS.md`; give it the next
   number; set `status: backlog`, a type, a priority, and write the *Acceptance* checklist **first**.
2. **Start one:** set `status: in-progress` and add your name/agent to `owner`. Write the failing test
   (red) before the implementation.
3. **Finish one:** make the test pass (green), refactor, set `status: in-review`, then `done` once the
   Definition of Done is met. Update the row in `ARCHITECTURE_AUDIT.md §5` if it's listed there.
4. **Drop one:** set `status: wont-do` with a reason. Never delete tickets — the trail is the value.

🟣 **Why test-first?** Writing the acceptance checklist and the failing test *before* the code forces you
to define "done" precisely, and it produces the regression net for free. This is the **TDD** discipline
described in `docs/TESTING.md`; the ticket system and the test system are two halves of one habit.

## 7. For AI agents specifically

When you (an agent) pick up work in this repo:
- **Check `TICKETS.md` first.** If your task matches an open ticket, claim it; if not, open one.
- Keep the board honest: move statuses as you go; don't mark `done` with failing tests or partial work.
- When you discover a problem you won't fix now, **open a `backlog` ticket** rather than leaving a TODO
  comment buried in code. The board is the single source of truth for "what's wrong / what's next."
