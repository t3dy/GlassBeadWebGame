# Narrative Review 013 — The Print Shop (editor) + the Vision Audit

- **Date:** 2026-06-18
- **Turn / prompt:** Give players controls to edit/copy explanation & adventure text into their game;
  an always-available pen to change a card's text, re-attribute its glyphs, or create their own card —
  a "developer mode / print shop & level editor." Plus: narrative-designer audit of the prototype
  against the user's vision, Hesse's novel, and Leary's take (with web research on Leary).
- **What was produced:** a **content overlay layer** (`src/engine/content.ts`) merging base data with
  persisted "homebrew" edits; engine + relations read through it so edits go live; a **Print Shop UI**
  (pen ✎ to edit any card/glyph, copy ⧉ on explanations, a "✎ New card" forge → to hand); the
  **[VISION_AUDIT](../VISION_AUDIT.md)** grounded in Hesse + sourced Leary research (Castalia
  Foundation, the *Interior Journey* essay, the cybernetic "glass beads strung in combinations").

## Analysis (against the study materials)

- **Editability serves the deepest theme (Fost; Leary's Castalia).** Making every element editable
  turns players into co-authors — the Fost "ever-growing crystal of insights" and the generative,
  communal spirit Leary tried to institutionalize. The Print Shop is the most *on-philosophy* feature
  yet, not just a convenience.
- **It also closes the loop with the relation engine.** Copying a surfaced relation (Ficino on
  Venus+Jupiter) into a *new card* lets the system's output become the player's input — exactly the
  "play with the interdisciplinary symbols" Leary described.
- **The audit was worth doing.** It found the spine is realized (symbol synthesis; values-in-relation;
  Leary's literal "glass beads strung in combinations" — and Hesse's *own* examples, Bach/Leibniz/I
  Ching, are in our deck) while naming the real gaps the user themselves cares about: **named
  historical-figure workers, a location layer, deeper DB ingestion** — plus a Hesse-faithful
  **contemplative, non-competitive register** the current scoring/contest works against.

## Risks / watch-items

- **Homebrew + Grounding Rule:** player-authored cards carry `sourceRef: 'player (Print Shop)'` — good
  (honest provenance), but homebrew is *unsourced by definition*. Keep player content visibly distinct
  from the grounded base corpus so the archive's authority isn't diluted.
- **Editing glyph correspondences can break relations subtly** (a user could detach a glyph from its
  attribute). Acceptable for a creative tool; consider a "reset edits" affordance (exists in
  `content.ts: resetHomebrew`, not yet surfaced in UI).
- **Validation:** the editor accepts free text; invalid glyph ids are filtered, but correspondences
  are free-form. Fine for a sandbox; revisit if homebrew is ever shared/published.
- **Scope creep vs. Hesse:** see the audit's §4 — competition/worker-placement/RPG pull away from the
  meditative ideal. Recommend a non-scored mode before adding more Euro-mechanics.

## Suggestions (next)

1. **Named historical-figure workers** — the user's clearest unmet ask (audit rec #1).
2. Surface **"reset homebrew"** and mark player cards visually as homebrew.
3. A **contemplative/meditation beat** + non-scored mode (audit recs #4–5).

## Grounding check

- Base corpus unchanged and still sourced. Player-authored content is labelled `player (Print Shop)`.
  The audit cites real sources (UCSB Leary offprint, WRSP, Wikipedia) and flags low-confidence items.
  No `TODO(grounding)` opened.
