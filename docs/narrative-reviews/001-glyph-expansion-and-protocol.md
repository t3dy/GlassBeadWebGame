# Narrative Review 001 — Glyph-palette expansion + review protocol

- **Date:** 2026-06-18
- **Turn / prompt:** "There are also other alchemy emojis we could use (the still, fire, etc.)" + "The
  narrative designer should be creating artifacts with every prompt analyzing the output and
  offering suggestions from our study materials."
- **What was produced:** expanded the alchemical bead vocabulary in
  [SYMBOL_SETS](../SYMBOL_SETS.md) (element **triangles** 🜂🜄🜁🜃; new `substances` and `apparatus`
  sets; pointer to the **Unicode Alchemical Symbols block** U+1F700–U+1F77F); installed the
  **per-turn narrative-review protocol** (this file, TEMPLATE, INDEX, the `UserPromptSubmit` hook,
  agent + CLAUDE.md updates).

## Analysis (against the study materials)

- **Knitted vs. layered (Shipp ch.2):** *Strengthening.* The expanded glyphs aren't decoration if
  they stay tied to mechanics. `apparatus` is the strongest move — making the alembic/crucible the
  literal **Crucible workspace** and **Lute** input (not just icons) keeps theme in the *baked-in*
  layer, not the opt-in layer. **Risk:** ~116 Unicode sigils could become an unmotivated icon dump.
- **Motivated elements (Shipp ch.2):** Element **triangles** over emoji raises register and
  historical motivation (🔥 reads as "campfire"; 🜂 reads as "fire, the element"). Good.
- **Degree of thematic action (Shipp ch.2):** Apparatus beads invite a *simulative* read (a still
  *distills* → pairs with the `alch:distills` tile). Keep them out of mere *associated* labeling.
- **Conflict / plot (Shipp ch.4):** Neutral this turn (vocabulary, not mechanics).
- **Player verbs (Tom Smith):** Unchanged — but apparatus suggests a latent verb ("charge a vessel,
  then operate") worth considering without bloating the core verb set.
- **Process (the protocol itself):** The per-turn artifact is, in Shipp's terms, an *opt-in* layer
  for **us** (the designers) — a worldbuilding/QA aid. Healthy *as long as it never substitutes for
  knitting theme into the core*. Watch for ritual-compliance (filing empty reviews on trivial turns).

## Suggestions

1. **bead-smith:** enumerate exact codepoints + grounded glosses for `substances`/`apparatus` from
   the Unicode block; **cap the starter palette** (~12–16 substances, ~6 apparatus) so it stays
   motivated, not a dump. Flag unconfirmed senses `TODO(grounding)`.
2. **mirror-warden:** bind apparatus glyphs to actual UI organs (alembic⚗️ → Crucible; balance⚖️ →
   the Libra/coagulation scoring read) so they are *simulative*, not labels.
3. **crucible-engineer + bead-smith:** consider apparatus beads as *operation-enablers* (a still
   unlocks `alch:distills` in a region) — a knitted way to gate the process tiles.
4. **magister-ludi:** keep the per-turn review **proportional** — a 2-line entry is fine for trivial
   turns; reserve full audits for mechanic/content changes.

## Grounding check

- No player-facing strings shipped this turn (design docs only).
- `TODO(grounding)` opened: exact Unicode codepoints + sigil glosses for the new sets — mirrored into
  [HANDOVER_CURRENT.md](../../HANDOVER_CURRENT.md).
