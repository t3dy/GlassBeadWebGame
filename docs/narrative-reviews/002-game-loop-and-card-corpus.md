# Narrative Review 002 — Game loop, always-a-move, card corpus

- **Date:** 2026-06-18
- **Turn / prompt:** Highest priority = the turn loop (hot-seat + online); symbols play off each
  other; story prompts built programmatically from correspondences. Guarantee always-a-move + Pass.
  Choices draw cards / change the board. Copy `C:\Dev\wiki` portal content into a card DB — each card
  = narrative-designer's interpretation of the portal index-card + essay, with stats + glyphs.
- **What was produced:** [GAME_LOOP](../GAME_LOOP.md), [CARD_CORPUS](../CARD_CORPUS.md); Card/Move
  shapes + cards table in [DATA_MODEL](../DATA_MODEL.md); broadened Grounding Rule in
  [PHILOSOPHY](../PHILOSOPHY.md); turn-loop pointer in [MECHANICS](../MECHANICS.md); PLAN re-prioritized
  (new Phase 2 = turn loop; Phase 6 = online + ingestion).

## Analysis (against the study materials)

- **Knitted vs. layered (Shipp ch.2):** *Strong.* The correspondence engine reads the *same*
  attributes that make a bead meaningful and turns them into the story — theme and mechanic are the
  same object. Cards-as-translated-essays keep content motivated, not flavor-pasted.
- **Conflict / plot (Shipp ch.4):** Now explicit. Pass = the *Player-vs-Self* floor (decline
  complexity); the engine's **opposition** class = narrative conflict; Tai Gi = its resolution. The
  always-a-move design avoids the dead-end fail state Shipp warns produces "why am I doing this."
- **Player verbs (Tom Smith):** Verb set stayed small and meaningful — *place / apply / operate /
  resolve / pass*. Good; resist adding more.
- **Choices & economy (Ham ch.4 Choices; Serpa ch.13 moral choices):** Story choices that draw/alter
  are real decisions with trade-offs (take the bold opposition for richer choices vs. safe affinity).
  Watch that **Pass** stays a genuine option, never strictly dominated or strictly dominant.
- **Generativity grounding (PCG corpus + Grounding Rule):** Prompts slot-fill from sourced card text
  + fixed grammar — generative *without* hallucination. This is the right seam.

## Risks / watch-items

- **Pass balance:** if Pass always refills with no cost, it can be optimal to stall. Give it a mild
  opportunity cost (no scoring, slow circuit progress) so it's a floor, not a strategy. (crucible-engineer)
- **Ingestion ungrounding:** the Stage-2 summary is where hallucination could creep in. Each card
  `text` must be checkable against its `source.citation`. Pilot + spot-audit before scaling. (narrative-designer)
- **Deck balance across packs:** mixing portals risks incoherent decks; per-pack curation + stat
  normalization needed. (bead-smith)
- **Prompt-template sameness:** few templates → repetitive prompts. Need enough templates × the
  affinity/opposition/transformation × operation matrix to stay fresh. (narrative-designer)

## Suggestions

1. **crucible-engineer:** implement `Move` as a total reducer; property-test *"∀ reachable state,
   `legalMoves` ∋ Pass."* Give Pass a small opportunity cost.
2. **narrative-designer:** author the first story-prompt template set (affinity/opposition/
   transformation × the 12 operations) for Phase 2; pilot CROWLEYDB or TheosophicalAlchemyDB cards.
3. **bead-smith:** define the `correspondences` controlled vocabulary (which great-table axes) so the
   engine can compute affinity/opposition deterministically.

## Grounding check

- No player-facing strings shipped (design docs only). Grounding Rule **broadened** (portal corpus is
  now an authorized *sourced* origin; invariant "no invented filler" preserved) — logged in HANDOVER.
- `TODO(grounding)`: card `text` summaries must each cite `source.citation`; pilot audit required.
