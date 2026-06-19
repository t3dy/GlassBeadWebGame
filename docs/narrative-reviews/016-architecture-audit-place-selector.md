# Narrative Review 016 — Architecture audit + the place/figure/role selector

- **Date:** 2026-06-18
- **Turn / prompt:** Process/architecture turn — a system-architecture audit, an agile ticket system,
  a TDD discipline doc, CLAUDE.md "Working disciplines", and one test-first player-facing module.
- **What was produced:**
  - `docs/ARCHITECTURE_AUDIT.md` — system audit placing the game in the `C:\Dev` database ecosystem
    (Knowledge Portal / Procedural Engine / Social Megaphone; the Deckard Boundary; over-engineering
    critique). UDL-styled. *Design-side; not player-facing.*
  - `docs/tickets/` (README, TEMPLATE, TICKETS — 9 seeded). *Process; not player-facing.*
  - `docs/TESTING.md` — TDD discipline (red→green→refactor). *Process; not player-facing.*
  - `CLAUDE.md` — "Working disciplines" section. *Process.*
  - **`src/data/corpus/place.ts` (+ `place.test.ts`)** — TICKET-002, built test-first. The one piece
    of player-facing logic this turn, and the focus of this audit.

This is a process turn, so the lenses below are applied **only to `place.ts`** — the data spine of
the headline scenario "meeple (alchemist) on Prague Castle → attach John Dee."

## Analysis (against the study materials)

- **Knitted vs. layered** (Shipp ch.2): **Knitted, and unusually well.** The mechanic does not *label*
  a generic worker-placement slot with alchemical flavor — it *derives* the offer from the real
  relation graph. You can only be offered Dee/Kelley at Prague Castle because the corpus records that
  they were *actually there* (Rudolf II's court, 1584). The history is the rule, not a skin over the
  rule. This is the strongest form of knitting we have shipped: the theme **is** the data structure.
- **Motivated elements** (Shipp ch.2): **Motivated.** Every element earns its place. The occupation
  gate (`occupationForFigure`) is the *reason* a figure surfaces — an alchemist meeple summons
  alchemists, a scholar summons no one at Prague because the scholars are elsewhere in the record.
  Nothing is arbitrary; the absence of a match is itself meaningful (it tells the player "your role
  doesn't belong here — yet").
- **Degree of thematic action** — mechanical→associated→metaphoric→**simulative**→literal (Shipp ch.2):
  **Simulative**, the second-highest tier. The verb does not merely *associate* (a token coloured
  "alchemist") nor *represent metaphorically* — it **models the historical fact** that occupation +
  place jointly determine which figures are apt. The system simulates "who was where, in what capacity."
  Only a verb that let the player *author* a new historical tie would climb to literal.
- **Conflict / plot** (Shipp ch.4): **Underpowered — the one real gap.** The selector resolves, but
  resolution is *automatic*: place + role deterministically yields the apt set. There is no self-,
  game-, or player-conflict in the act of placement itself. The drama of worker placement
  (contention, opportunity cost, the gamble of "is this the right slot?") is absent when the figure
  is simply *revealed*. Right now the player is shown an answer, not asked a question.
- **Player verbs** (Tom Smith): The implemented verb is **place** (a meeple) → **reveal** (apt
  figures). "Reveal" is a weak verb — it has no agency curve; the same input always returns the same
  output. Strong verbs branch on player judgment. We have *place* and *(implicitly) attach*, but the
  interesting verb — **choose among / commit to** one figure under a cost — is not yet expressed.
- **Choices** (Ham ch.4): A meaningful choice needs (a) >1 viable option, (b) a cost, (c) uncertainty
  or hidden information. The selector supplies (a) when a place has several apt figures (Dee *and*
  Kelley), but supplies neither (b) nor (c). It is currently a lookup, not a decision.

## Verdict

The data layer is excellent and on-philosophy — a genuinely **knitted, simulative** mechanic, which
is rare. The narrative risk is one level up, in the **UI verb** that consumes it: if placing a meeple
*auto-attaches* the historically-apt card, the player is a spectator to a database join. The history
should *gate* the choice, not *make* it.

## Suggestions

1. **(mirror-warden + crucible-engineer — highest value) Turn the reveal into a wager.** When
   `figuresForPlaceAndRole` returns >1 figure, present them as a *draw under contention*: the player
   spends the placement to **claim one** figure-card, and the others become unavailable to them this
   round (claimable by an opponent in hot-seat). When it returns *exactly one*, keep a small friction
   — a "commit" beat, not an auto-snap — so the player *acts*. When it returns *zero*, that is not a
   dead end but information: surface "no one of your vocation stood here" as a grounded prompt to
   *re-place elsewhere*. This injects Shipp's conflict (ch.4), upgrades the verb from *reveal* to
   *claim* (Tom Smith), and satisfies all three of Ham's choice conditions.
2. **(crucible-engineer) Expose the path as provenance, not just the result.** `placesForEntity`
   already distinguishes the **direct** (`located_at`) vs **indirect** (`participated_in → event →
   located_at`) route. Carry that distinction out of the selector so the UI can say *why* a figure is
   apt ("Dee — *present at* the court of Rudolf II" vs "Kelley — *located at* Prague Castle"). The
   indirect, event-mediated tie is the more story-rich one; it should read differently.
3. **(narrative-designer, next turn) Author the grounded micro-copy** for the three outcomes
   (multiple / single / none) so the headline scenario has source-true strings before it ships.

## Grounding check

- **Player-facing strings introduced this turn:** none. `place.ts` emits entities, not copy. The test
  fixture strings ("English magus", "Dee's scryer", "The Bohemian sojourn, 1584", "Seat of Rudolf II")
  are **historically true** and test-only, not shipped UI — acceptable, and a good discipline (the
  fixture itself respects the real record).
- **No `TODO(grounding)` opened** this turn. Suggestion 3 will open the first player-facing copy task
  for this mechanic; flag it in HANDOVER then.
- **Corpus-citation note:** the `E:\pdf\Game Design` tree was not mounted this session; Shipp/Smith/Ham
  citations above are by author/chapter per [CORPUS_GAME_DESIGN](../CORPUS_GAME_DESIGN.md) and are
  consistent with the framework used in reviews 001–015. Re-verify chapter numbers against the
  Markdown when E: is available.
