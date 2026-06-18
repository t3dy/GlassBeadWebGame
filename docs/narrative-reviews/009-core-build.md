# Narrative Review 009 — Building the core (bead / card / glyph / tile)

- **Date:** 2026-06-18
- **Turn / prompt:** "Do it. Bracket all the pie-in-the-sky stuff and do the core bead, card, glyph,
  and tile systems."
- **What was produced:** a running Vite + React + TS app — pure-TS engine (BEAD/CARD/GLYPH/TILE +
  `applyMove`/`meditate`/triad detection), 14 grounded seed cards, the glyph bank, 8 process tiles,
  `localStore`, a Green-Stone UI. 5/5 tests pass; build clean; verified live (infuse → apply glyph →
  lay tile → triad forms).

## Analysis (against the study materials)

- **Two verbs, on the table (Tom Smith — verbs; Shipp ch.2 baked-in):** the core is exactly the two
  intended actions — *infuse a bead with a card* and *apply a glyph* — plus *lay a tile* to relate
  them. Theme lives in the baked-in layer (alchemical glyphs/tiles are the mechanic), not opt-in
  flavor. The re-centering (review 006) is honored in code.
- **Always-a-move, proven (Shipp ch.4):** `meditate` is a total reducer branch and a passing property
  test asserts `legalMoveKinds ∋ 'meditate'` across a 40-move run. The no-deadlock guarantee is real,
  not aspirational.
- **Grounding holds:** every seed card + glyph + tile carries a `sourceRef`; a test asserts it. No
  invented filler shipped.
- **Restraint (complexity-brake, review 008):** everything optional is bracketed with comments
  pointing to its design doc. The default game is clean: a board, a hand, a glyph bank, tiles.

## Honest gaps (what the core does *not* yet do)

- **No payoff on a triad yet.** A triad forms and logs its operation gloss, but there's no **scoring**
  and no **story/correspondence readout** — so the "symbols playing off each other" reward isn't felt
  yet. This is the #1 next thing; right now the loop is pleasant but not yet *meaningful*.
- **Plain CSS, no motion.** Tailwind + Framer + the Living-City lifecycle are deferred (fine).
- **Single-player sandbox.** No turn-passing/opponents; hot-seat/online bracketed.
- **Hand-authored deck.** 14 cards; the CROWLEYDB ingestion pipeline is future.

## Suggestions (next turn)

1. **crucible-engineer:** add a minimal **triad scoring** (coherence + interdisciplinary distance via
   the cards' `correspondences`) and surface a **readout** when a triad forms — the first taste of the
   correspondence engine, no full Adventure-Starter library required.
2. **narrative-designer:** a handful of **Tier-A starters** for Conjunction/Separation so a formed
   triad yields one grounded story line + a choice (even if the only effect is "draw a card").
3. **infra:** `git init` + push + first Vercel deploy of the working core (cheap, high-signal).

## Grounding check

- All player-facing strings (card text, glyph labels, tile glosses, the Magister log lines) are
  sourced (Hesse / Leary / RAW / alchemical tradition) with `sourceRef`. No `TODO(grounding)` opened.
