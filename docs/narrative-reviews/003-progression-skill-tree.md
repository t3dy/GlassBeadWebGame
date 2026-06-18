# Narrative Review 003 — Progression: character sheet, topic XP, portals & skill tree

- **Date:** 2026-06-18
- **Turn / prompt:** Players choose knowledge portals in various modes → added to inventory + a skill
  tree; gain XP in topics they play with (character sheet) → skill points → spend on the tree, whose
  consequences give more options when choosing which symbol-interactions to explore next.
- **What was produced:** [PROGRESSION](../PROGRESSION.md); `CharacterSheet`/`ProgressMove` + `characters`
  table in [DATA_MODEL](../DATA_MODEL.md); skill-gated choices in [GAME_LOOP](../GAME_LOOP.md);
  depth-vs-breadth note in [MECHANICS](../MECHANICS.md); Phase 3 extended in PLAN.

## Analysis (against the study materials)

- **Two-axis progression (Serpa ch.6 Player; Ham ch.4 Choices):** Circuits = *depth*, skill tree =
  *breadth*. Distinct, complementary, non-redundant — avoids the common trap of two XP bars that
  measure the same thing. Good.
- **Knitted vs. layered (Shipp ch.2):** *Strong.* XP is earned by *playing topics*, and skill nodes
  feed back into the **same** correspondence engine as more options — progression is mechanically
  continuous with the core, not a bolted-on meta screen.
- **Meaningful choices (Ham ch.4; Serpa ch.13):** Skill-point spends are real, lasting choices that
  reshape future option menus. The Tree-of-Life topology gives spends *thematic* meaning, not just
  stat bumps — a node is a place on a map you believe in.
- **Conflict / expression (Shipp ch.4):** Reinforces Player-vs-Self mastery; persistent sheets give a
  long arc (the Castalian ascent) beyond a single session.
- **Player verbs (Tom Smith):** Adds two off-board verbs (*spend point*, *acquire portal*) — kept off
  the board loop so the always-a-move floor is untouched. Acceptable; resist further verb creep.

## Risks / watch-items

- **Power creep / monotonic options:** if nodes only ever *add* options, late game bloats and early
  game feels thin. Mitigate: branch *exclusivity* (Tree paths you can't all take), and ensure the
  Pass floor + a curated default option set keep early turns clean. (crucible-engineer + bead-smith)
- **Grind risk (Shipp/LeBlanc "submission"):** topic XP could devolve into farming one topic. Reward
  *breadth* (cross-discipline leaps give double-topic XP — already specified) over repetition.
- **Sheet ≠ board dissonance:** keep the character sheet legible and tied to in-world identity
  (Castalian rank, attuned portals) so it reads as *who you are becoming*, not a spreadsheet.
- **Rank-name grounding:** Apprentice→Magus / Castalia ranks need source confirmation (`TODO`).

## Suggestions

1. **bead-smith:** define topics = {portals} ∪ {great-table axes}; map each portal → its axes so XP
   tagging + the Tree-of-Life node layout are deterministic. Decide Tree-of-Life vs. per-portal branches.
2. **narrative-designer:** author the first ~6 skill nodes as *grounded story consequences* (each adds
   a specific prompt/option), not bare modifiers; confirm rank names against Hesse/Leary.
3. **crucible-engineer:** XP/points/rank as pure reductions over moves; `spendSkillPoint`/`acquirePortal`
   resolve on the sheet without blocking the board; property-test that unlocks never remove Pass.

## Grounding check

- No player-facing strings shipped (design docs). Progression framed in Castalia's ascent + alchemical
  ranks; **rank names flagged `TODO(grounding)`** → mirrored to HANDOVER.
- Tree-of-Life skill-tree topology is a *proposal* pending grounding, clearly marked as such.
