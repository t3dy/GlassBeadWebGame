# Narrative Review 004 — Adventure Starters, draft phases & private goals

- **Date:** 2026-06-18
- **Turn / prompt:** (1) A combinatorial system that intelligently combines any two symbols and gives
  story options inspired by chosen portals/cards — "Adventure starters" prewritten to represent each
  possible combination. (2) Draft phases (pick a portal; depth-vs-breadth consequences conditioned on
  the board) and **private goals** that reward placing certain glyphs/correspondences.
- **What was produced:** [ADVENTURE_STARTERS](../ADVENTURE_STARTERS.md), [DRAFT_AND_GOALS](../DRAFT_AND_GOALS.md);
  shapes + tables in [DATA_MODEL](../DATA_MODEL.md); engine/draft/goal pointers in [GAME_LOOP](../GAME_LOOP.md);
  depth/breadth tie-in in [PROGRESSION](../PROGRESSION.md); narrative-designer authoring duties; PLAN
  Phases 2 & 6 updated.

## Analysis (against the study materials)

- **The combinatorial decision is the right one.** Keying starters to a **signature** (class ×
  operation × axis) rather than card pairs is the difference between ~250 authorable templates and
  ~1.5M impossible ones, while **guaranteeing coverage**. This is the *content/system* lesson from
  Tom Smith ch.7 (MTG content) — design a generative grammar, not a finite list.
- **Knitted (Shipp ch.2):** Excellent. The starter is selected by the *same correspondences* that
  define the beads, and inflected by the player's *acquired portals* — theme, mechanic, and
  personalization are one object. Grounding holds (authored templates + sourced slot-fill, no runtime
  hallucination).
- **Conflict & meaningful choice (Shipp ch.4; Ham ch.4):** **Private goals** add the *plot engine* —
  hidden objectives convert "place a symbol" into "pursue my secret thread," the strongest source of
  Player-vs-Self/Player-vs-Player tension here. Draft depth-vs-breadth is a genuine, board-conditioned
  dilemma (not a dominant strategy). Both raise stakes without violating the always-a-move floor.
- **Player verbs (Tom Smith):** +Draft as a phase, +goal pursuit as motivation — no new *board* verb,
  so the core stays tight. Good.

## Risks / watch-items

- **Sameness of starters (the real failure mode):** if Tier-A is too coarse, every Conjunction feels
  identical. Mitigate: enough A templates per (class × operation × axis), seeded variety on ties, and
  Tier-B portal overlays early. Track a "starter variety" metric in playtest. (narrative-designer)
- **Authoring load:** ~250 backbone templates is real work. Sequence it — pilot one portal's slice
  end-to-end before carpet-authoring. Optional LLM *drafting* (curated) can accelerate, but runtime
  stays deterministic + grounded.
- **Goal legibility vs. secrecy:** hidden goals must still be *discoverable in hindsight* (players
  should understand why an opponent steered the board) — reveal completed goals at scoring.
- **Draft balance:** board-conditioned reward weights need tuning so neither deep nor wide dominates;
  expose the read to the player (why is this draft attractive now?). (crucible-engineer)
- **Quiet PvP in a contemplative game:** ensure private-goal competition doesn't override the
  reverent/meditative tone (Hesse). Default collaborative mode should frame goals as personal motifs,
  not zero-sum.

## Suggestions

1. **crucible-engineer:** the signature builder + `resolveStarter` (most-specific-wins, seeded) + the
   **coverage test** (∀ A,B,op → a starter); draft state machine + goal evaluator as pure reductions.
2. **narrative-designer:** author a *vertical slice* — Tier-A for one operation (e.g. Conjunction)
   across the planet axis + a handful of goals — to validate the pipeline before scaling.
3. **bead-smith:** finalize the correspondence axes/poles (shared with review 002's vocab TODO) so
   signatures + goal conditions are deterministic.

## Grounding check

- No player-facing strings shipped (design docs). Starters/goals specified as **authored + sourced**;
  runtime is deterministic slot-fill; optional LLM assist is bounded to authoring-time or cited
  online rephrasing. Goals grounded in Hesse's individual-path (*Seelenbiografie*).
- Open `TODO(grounding)`: correspondence axis/pole vocabulary (shared with reviews 002–003).
