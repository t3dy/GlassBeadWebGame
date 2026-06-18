# Narrative Review 007 — Optional board modes (Tarot / Geomancy / I Ching / Kamea sigils)

- **Date:** 2026-06-18
- **Turn / prompt:** Add a tarot-spread mode, a geomancy mode, an I Ching mode, and a drawing-sigils-
  on-a-magic-square mode.
- **What was produced:** [BOARD_MODES](../BOARD_MODES.md) — a `BoardMode` abstraction with four
  optional divinatory layouts over the Free-Grid core; `boardMode` on the game + geomantic/kamea glyph
  sets in [DATA_MODEL](../DATA_MODEL.md)/[SYMBOL_SETS](../SYMBOL_SETS.md); loop pointer in
  [GAME_LOOP](../GAME_LOOP.md); a new **Phase 8** (incremental, opt-in) in PLAN.

## Analysis (against the study materials)

- **One engine, many layouts (Tom Smith ch.6 Systems):** The key move is recognizing each divination
  system is *already a correspondence engine* — so `mode.read()` emits the same **signatures** our
  Adventure-Starter pipeline consumes. Modes reuse the coverage guarantee, slot-fill, goals, and
  progression rather than forking the game. High leverage, low duplication.
- **Consistent with the re-centering (review 006):** modes are explicitly **optional**, the **Free
  Grid stays the default**, and both core actions (infuse card / apply glyph) + **Pass** work in every
  mode. We did not re-inflate an opt-in layer into the core.
- **Knitted theme (Shipp ch.2):** Each mode's *positions carry meaning* (spread positions, geomantic
  houses, hexagram lines) — so placement is inherently thematic, not abstract. Strong.
- **Procedural generation (PCG corpus):** Geomancy and I Ching *generate* a reading (Mothers→Judge;
  cast→hexagram→transform). This is grounded PCG — the output is structured by tradition, then
  explored — and it guarantees a non-empty board to read (supports always-a-move).
- **Reuse (efficiency):** I Ching leans on the existing **8 trigrams ↔ 8 circuits** bridge; Kamea
  sigils reuse the wiki **Goetia sigil analysis** (kamea-path hypothesis); Tarot reuses CROWLEYDB.

## Risks / watch-items

- **Scope sprawl:** four modes is a lot. PLAN sequences them one-at-a-time, post-core, with a per-mode
  gate — hold that line; don't build modes before the Free-Grid core is fun.
- **Per-mode authoring:** each needs mode-specific starters + position meanings + glyph sets. Treat
  each mode as its own small vertical slice. (narrative-designer + bead-smith)
- **Procedural grounding:** geomancy/I-Ching generation must follow the *real* rules (geomantic
  addition; line-casting + moving lines) — verify against sources, not approximations. (crucible-engineer)
- **Kamea tracing UX/accessibility:** drawing a sigil by tracing a magic square is gesture-heavy —
  needs a keyboard/stepwise path-builder too. (mirror-warden)
- **Don't let modes fragment identity:** they should feel like *lenses on the same Game*, not four
  minigames; keep shared scoring/goals/progression across all.

## Suggestions

1. **crucible-engineer:** define `BoardMode` (`layout` / `generate` / `read`) with Free Grid as the
   reference impl; ship Tarot Spread first (layout + neighbor-read, no procedural step).
2. **bead-smith:** author the 16 geomantic figures + hexagram/trigram + planetary-kamea glyph sets
   with grounded correspondences; reconcile with the glyph-bank starter/gated split.
3. **narrative-designer:** per-mode Tier-A starters (e.g. "Witnesses → Judge", "moving line",
   "Crossing card") + grounded position meanings; cite sources.

## Grounding check

- No player-facing strings shipped. Modes specified as **sourced traditions** (tarot, geomancy, I
  Ching, planetary kameas) reusing existing portals/work (CROWLEYDB, Goetia sigil analysis). Position
  meanings + generation rules flagged for source-verification before authoring.
