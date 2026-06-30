# 031 — Genre → deck tilt

**Date:** 2026-06-29
**Turn focus:** Close the long-carried suggestion (reviews 021/022/028/030): let the active **mode/genre
bias the deck**, so a draw surfaces the kinds of cards that mode likes to talk about — the Novel wants
figures and settings, the Scholarly Article wants texts and concepts, the Video Game wants systems.

## What was produced
- `src/game/deckTilt.ts` (pure; Deckard Boundary) — `MODE_AFFINITY` (all 11 modes) + `GENRE_AFFINITY`
  (representative genre nudges), with `tiltWeight`, `tiltOrder` (deterministic browse ordering), and
  `tiltedSample` (weighted draw without replacement, injectable rng). 8 tests.
- App wiring (on disk, rides the other window): `drawInto` / `drawFromCrystal` now draw via
  `tiltedSample`; the 🎲 Draw browser orders its pool with `tiltOrder` and shows a "Tilted toward …"
  note. **Verified live:** same library, Article → top results all `text`; Novel → all `figure`.

## Audit against the study materials (docs/CORPUS_GAME_DESIGN.md)
- **Knitted theme (Adams/Rollings, *Theme is not Meaning*).** The tilt tightens the knit between the
  *mode register* (the synthesis voice, review 030) and the *material* the player is handed — content
  and system pull in the same direction, rather than a noir voice over a deck of alchemical symbols.
- **Meaningful choice & the "soft constraint" (Schell, *The Art of Game Design*, lens of the decision;
  Costikyan, *Uncertainty in Games*).** Deliberately a *lens, not a filter*: a 0.2 weight floor keeps
  **every card drawable**, preserving the productive surprise the Game prizes and the always-a-move
  guarantee. The bias shapes the *odds*, not the *options*.
- **Motivated elements (Bateman, *Game Writing*).** A drawn card now arrives pre-motivated by the mode
  ("a figure, for the novel we are writing") instead of as a random symbol needing justification.
- **Conflict (Egri/Shipp via the lit).** Still the open gap: the tilt enriches *supply*, not *stakes*.
  No cost attaches to a draw yet.

## Suggestions (carried)
1. **Bind a draw to a wager** in at least one mode (spend Reserve to "commission" a tilted draw) — the
   conflict/stakes still missing after 030.
2. **Tilt the opening deck/hand too** (not only manual draws) once it can be done without entangling the
   engine's `start` — so a freshly-chosen mode begins in-register.
3. **Surface the tilt in the hand**, not just the Draw browser, so solo players feel it without opening
   the modal.

## Grounding & coordination
Pure module + tests committed; App wiring + the INDEX row ride the other window (shared worktree). No
content invented; the tilt only reweights existing, already-cited cards.
