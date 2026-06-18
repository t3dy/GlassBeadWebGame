# Narrative Review 010 — Playable prototype: turns, scoring, 2-player hot-seat, deploy

- **Date:** 2026-06-18
- **Turn / prompt (goal):** A prototype ready to play 1-player and 2-player hot-seat; deploy to GitHub
  with an elevator pitch + tech-stack docs in the README and a link to the live website at the top.
- **What was produced:** turn/score/end-condition engine (`players`, `active`, `phase`, `endTurn`,
  `winner`); `scoring.ts` (coherence / interdisciplinary / counterpoint / resonance) so triads pay
  off; a setup screen, turn bar, scoring readout, hot-seat **handoff curtain**, and results overlay;
  6/6 tests (incl. a 2-player cycle + winner); GitHub Pages CI; README with live link + pitch + stack.
  **Live:** https://t3dy.github.io/GlassBeadWebGame/ .

## Analysis (against the study materials)

- **The core now has a *point* (Shipp ch.4; Ham ch.4):** triads score, and the score gives 2-player a
  genuine contest and solo a meditative high-score. The earlier "no payoff" gap (review 009) is closed
  at a minimal, honest level — scoring rewards exactly the Game's values (reconcile opposites, span
  disciplines), so the mechanic still teaches the theme.
- **Hot-seat done right (Fullerton — players; Shipp — hidden info):** the handoff curtain (blur board,
  hide hands, "I am Player N · begin") is the standard, correct pass-and-play pattern; private hands
  create real per-turn information asymmetry without a backend.
- **Always-a-move held under the new turn model:** `endTurn` is total and always legal in `play`; the
  property test still passes. Adding turns/phases didn't compromise the no-deadlock guarantee.
- **Restraint sustained (complexity-brake):** every speculative system stayed bracketed; the shipped
  game is two verbs + relate + score + take turns. Clean enough to teach in one sentence.
- **Grounding intact:** all surfaced strings (cards, glyphs, tiles, readouts, the verdict line) are
  sourced; CI runs the grounding-sourceRef test on every deploy.

## Honest limits (truth in advertising)

- **Scoring is coarse** — four flat bonuses, no circuits, no Adventure-Starter story text yet. It's a
  score, not yet a *narrative*. Good enough to be fun-competitive; not yet the full vision.
- **Small fixed deck** (14 cards ×3) → repetition over a long session. CROWLEYDB ingestion is next.
- **Plain CSS, no motion/lifecycle.** Tailwind + Framer deferred.
- **Win = higher score at board-full / conclude.** No round limit or richer end conditions yet.
- **No AI opponent** — 2-player is human-vs-human hot-seat only (as requested).

## Suggestions (next)

1. **narrative-designer + crucible-engineer:** wire a first **Adventure-Starter** line onto a scored
   triad (turn the readout into a sentence of synthesis + one optional choice) — the next quality jump.
2. **bead-smith + crucible-engineer:** pilot **CROWLEYDB ingestion** to deepen the deck (figures/texts).
3. **mirror-warden:** Tailwind + a light Framer pass (bloom on a high-scoring triad; gentle handoff).
4. **infra:** the Pages deploy is live; when online play lands, move to the Vercel+Supabase path.

## Grounding check

- No ungrounded strings shipped. CI enforces the seed-card `sourceRef` test. README cites the three
  source streams. No `TODO(grounding)` opened this turn.
