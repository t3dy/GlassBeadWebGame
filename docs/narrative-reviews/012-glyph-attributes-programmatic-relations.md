# Narrative Review 012 — Glyphs as attributes, programmatic relations, meeples

- **Date:** 2026-06-18
- **Turn / prompt:** Glyph bank should explain on click; add "Drag onto a bead to complicate a board
  state"; tiles become "spaces"; **relations created programmatically** by comparing two beads
  (Venus-bead + Jupiter-bead → Ficino on the benefics); separate banks for planets / zodiac-processes
  / principles; distinguish Mercury principle vs planet-metal; emoji-meeple occupations (full worker
  placement); drag + click.
- **What was produced:** glyphs reconceived as **bead attributes** in 4 banks (`glyphBank.ts`); a
  **programmatic relation engine** (`relations.ts`) with a grounded starter corpus (Ficino *De Vita*,
  the coniunctio, the contraries…) that the system evaluates on every move; a unified **info panel**
  (alchemy meaning + game use for every glyph/meeple/bead); **distinct Mercury** (☿ metal / ☤ spirit);
  a **12-occupation meeple bank** + panel + placement (`occupations.ts`); **drag-and-drop + click**;
  the "complicate" label; removed manual process-tiles. 8/8 tests; live-verified.

## Analysis (against the study materials)

- **The pivot is the right one (Tom Smith ch.6 Systems; Shipp ch.2 knitted):** moving relations from a
  *player-laid tile* to a *system-derived reading of adjacent attributes* makes the board a living
  tableau — meaning emerges from arrangement, which is exactly Hesse's synthesis and far more
  "knitted" than a manual connector. Verified: Venus|Jupiter → Ficino's benefic remedy, scored +3.
- **Grounding got stronger, not weaker:** relations quote real sources (Ficino, the tria prima) with
  citations + portal links (RenMagDB, HermeticDB). The generative step is authored data, not runtime
  hallucination — the Grounding Rule holds while the game feels alive.
- **The info panel teaches (Serpa ch.16 UI/UX):** every symbol now explains its alchemical meaning
  and its play function on click — the long-standing legibility gap (review 001) is closed.
- **Worker placement landed as a first cut:** the 12 meeples place and explain; their occupation
  *actions* are still a simple affinity bonus. Honest, not the full contested-role-space system yet.

## Honest limits

- **Relation corpus is small** (~12 entries) — depth comes from authoring more / portal ingestion.
- **"Spaces"** are currently just the board cells re-framed as "the universe"; richer space/terrain
  mechanics are deferred.
- **Meeple depth** — passive affinity bonus only; contested role-spaces + per-occupation actions next.
- **Affinity/opposition generic fallback** keeps every adjacency meaningful but can feel samey until
  the corpus grows.

## Suggestions (next)

1. **bead-smith + narrative-designer:** grow `RELATION_CORPUS` (and wire it to RenMagDB/HermeticDB
   ingestion) — this is now the single highest-leverage content lever.
2. **crucible-engineer:** deepen worker placement (per-occupation actions; contested role-spaces).
3. **mirror-warden:** a subtle bloom when the system surfaces a rich (corpus) relation; touch-drag.

## Grounding check

- All glyph/meeple/relation text carries a `sourceRef`; relations cite real works (Ficino *De Vita*,
  tria prima) and link portals. No invented filler; no `TODO(grounding)` opened.
