# Narrative Review 015 — DLC Packs (player-curated topical decks)

- **Date:** 2026-06-18
- **Turn / prompt:** Users should be able to curate their own DLC packets with selections of cards
  from the various databases (or that they built themselves) covering a topic — e.g. "Medieval
  Alchemists Pack".
- **What was produced:** a **Packs** layer in `content.ts` (create/edit/delete/activate, persisted
  `gbg_packs_v1`; `deckCardIds()` builds the game deck from active packs; `libraryCardIds()` spans
  base + the 931-card Crystal + homebrew; **export/import** as self-contained JSON embedding card
  defs). UI: a **▦ Packs** modal + **Pack Builder** (topic search across the whole library, Add /
  Add-all, selected chips, activate, export ⧉, import). Verified live.

## Analysis (against the study materials)

- **This is the Fost "ever-growing crystal," made curatable.** Fost imagined players drawing from "a
  pool of familiar symbols developed in earlier games" and contributing to a shared crystal of
  insights. DLC packs let a player *carve a coherent region out of the crystal* and share it — the
  collaborative, accreting vision in concrete form, and shareable JSON makes it literally exchangeable.
- **It completes the editor arc (Print Shop → Packs).** Edit a card → forge a card → gather cards into
  a themed pack → share. The player is now a full content author/curator, not just a consumer — the
  "every element editable" vision (review 013) extended to *decks*.
- **Topical coherence serves theme (Shipp ch.2).** A "Medieval Alchemists Pack" gives a game a
  consistent symbolic vocabulary, so adjacency relations land within a coherent world rather than a
  scattershot deck — tighter, more legible play.
- **Verified the real payoff:** searching "alchem" surfaced **420** library cards; the activated pack
  built a 1255-card deck whose hand was entirely alchemical/Rosicrucian (Ashmole, Atalanta Fugiens
  emblems…), each card cited to its DB. The databases now flow into curated play.

## Risks / watch-items

- **Deck size / balance:** a 420-card "Add all" pack makes a huge, sprawling deck. Fine for sandbox,
  but curated *small* packs play better — consider a soft nudge or a per-pack size hint.
- **Provenance on shared packs:** exported packs embed card defs incl. `sourceRef`; a shared pack may
  mix grounded DB cards with `player (Print Shop)` cards. Keep the distinction visible on import.
- **Imported homebrew cards persist into `newCards`** (so they resolve) — could accrete cruft over
  many imports; a "manage homebrew" cleanup is eventually worth surfacing.
- **No multi-pack overlap dedup beyond Set** — fine; just note packs union, not intersect.

## Suggestions (next)

1. **Curated example packs** shipped as defaults (a real "Medieval Alchemists", "Renaissance Magi",
   "Thelema") so players see the feature without building one.
2. **Pack size guidance** + a "draft N from this pack" option rather than the whole pack.
3. Tie packs to the **named-historical-figure workers** (audit rec #1) — a pack could also seed
   themed meeples.

## Grounding check

- Pack cards inherit their cards' `sourceRef` (DB-cited or `player (Print Shop)`). No new ungrounded
  content; export/import preserves provenance. No `TODO(grounding)` opened.
