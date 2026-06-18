# Narrative Review 005 — CROWLEYDB Tree of Life, figure/text cards, timeline events

- **Date:** 2026-06-18
- **Turn / prompt:** Use CROWLEYDB's Tree-of-Sefirot work + occult-diagram dev (Rose Cross lamen, Tree
  of Life). Make **historical figures and their texts key card classes**. **Timeline events** carry
  combinations and surface as options when those combinations are explored.
- **What was produced:** confirmed Tree-of-Life skill-tree topology + A∴A∴ grade ranks from CROWLEYDB
  (`thelemic_tree.json`, `grades.json`, `TreeOfLife.tsx`) in [PROGRESSION](../PROGRESSION.md); added a
  **card-class taxonomy** (figure/text/symbol/concept/event) in [CARD_CORPUS](../CARD_CORPUS.md) mapped
  to `persons.json`/`works.json`/etc.; **timeline-events-as-triggered-content** in
  [ADVENTURE_STARTERS](../ADVENTURE_STARTERS.md); shapes/tables in [DATA_MODEL](../DATA_MODEL.md);
  occult diagrams in [AESTHETIC](../AESTHETIC.md) + mirror-warden; PLAN Phases 3/4/6.

## Analysis (against the study materials)

- **Resolves three open questions with real sources, not invention.** Skill-tree topology (Tree of
  Life), rank names (A∴A∴ grades), and pilot portal (CROWLEYDB) are now grounded in shipped data —
  exactly the Grounding Rule's intent. Strong.
- **Figures/texts as classes (Shipp ch.6–7 Characters; Tom Smith ch.7 content):** Making historical
  figures and their works first-class cards gives the game *characters* and *canon* — the richest
  story fuel. Figure↔text↔event links as affinities mean "play Crowley next to *Liber AL* near its
  reception event" is a legible, high-resonance, narratively dense move. Excellent knitting.
- **Timeline events (Shipp ch.5 Narrative Structure):** Events triggered by matching combinations turn
  the board into a *history surfacing through synthesis* — real plot from real sources, no fabrication.
  This is the single biggest grounding win: event text **is** the cited portal entry.
- **Reuse over rebuild (efficiency):** porting `TreeOfLife.tsx` instead of authoring a tree from
  scratch is the right call; the Rose Cross lamen is the one net-new diagram.

## Risks / watch-items

- **CROWLEY-centric framing:** CROWLEYDB centers on one figure (Crowley). Good for a pilot, but ensure
  the engine generalizes — the figure/text/event classes must work for any portal (Pico, Neoplatonism,
  medieval magic) so the pilot doesn't bake in Thelemite-only assumptions. (crucible-engineer)
- **Tree licensing/voice:** porting CROWLEYDB code/data — keep `source.citation` on every card; the
  game's tone stays Hesse-contemplative even when content is Thelemic (don't let one portal's voice
  dominate the frame).
- **Event match flooding:** a busy board could match many events at once → option overload. Cap surfaced
  events (top-k by association overlap + player portals) so choices stay curated. (crucible-engineer)
- **Tree-as-skill-tree vs. Tree-as-correspondence:** the same Tree is both a progression UI and a
  correspondence source — keep the two reads coherent so a node's *meaning* and its *unlock* align.

## Suggestions

1. **crucible-engineer:** CROWLEYDB adapter emits figure/text/symbol/event cards + the association
   graph (`person_events`, `event_topics`, `term_works`); event-match = association ∩ board, capped top-k.
2. **bead-smith:** seed the skill tree from `thelemic_tree.json` (sephiroth nodes + 22 paths w/
   attributions); map grades→ranks; reconcile the sephirah/planet/element axes with the correspondence
   vocabulary (the long-standing review-002 TODO — CROWLEYDB now gives the canonical values).
2. **mirror-warden:** port `TreeOfLife.tsx`; build the Rose Cross lamen as the glyph selector.
3. **narrative-designer:** author figure/text/event starters as a CROWLEYDB Tier-B slice in the pilot.

## Grounding check

- No player-facing strings shipped (design docs). Three prior `TODO(grounding)` items **closed** by
  CROWLEYDB sources: skill-tree topology, rank names, pilot portal. Card/event text remains cited to
  portal entries. Correspondence-vocabulary TODO can now be filled from `thelemic_tree.json`.
