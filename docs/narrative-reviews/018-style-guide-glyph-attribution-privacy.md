# Narrative Review 018 — Card Style Guide, glyph attribution at scale, privacy fix

- **Date:** 2026-06-18
- **Turn / prompt:** Drop the living scholars (privacy) — use only the concepts, figures, and locations
  they study. Aim for a few thousand cards by selecting the most important from each database, and
  **write a style guide** to drive card writing including **appropriate glyph attribution**.
- **What was produced:** **[CARD_STYLE_GUIDE.md](../CARD_STYLE_GUIDE.md)** (voice, length, the
  CardDef shape, the **glyph-attribution table**, the correspondence vocabulary, selection-by-importance,
  and the **privacy rule**). A **glyph-attribution engine** (`glyphAttribution.ts`) applied at the
  corpus-registration seam (`content.ts`) so the ~931+ corpus cards now carry glyphs. The Societas
  Magica DLC reworked: **scholars removed**; now **Figures · Concepts · Places** (all historical
  subjects). Tests `glyphAttribution.test.ts`; 26/26; build clean.

## Analysis (against the study materials)

- **Privacy = the Grounding Rule, correctly applied.** Naming only historical subjects (figures,
  concepts, places) keeps the cards sourced and safe, and is *more* faithful to the field anyway — the
  scholarship is a lens on the subjects, not a roster. The style guide now encodes this as rule §0.
- **Glyph attribution is the make-or-break for "a few thousand cards" (the game-piece need).** A
  corpus card with no glyph is an inert noun; with its operation/stage glyph it becomes a *bead that
  connects*. Doing it at the registration seam upgrades the whole corpus at once, deterministically,
  and respects hand-authored glyphs. Verified: a Latin "putrefactio" corpus card now self-tags ♏.
- **The style guide is the scalable lever (Shipp ch.11 "editing for resonance").** A few thousand
  hand-written cards is impossible; a guide + a deterministic attributor + curated exemplars (the DLC
  packs) is how quality scales. The guide governs both humans and the `derive`/`attributeGlyphs` code.
- **Concepts & Places broaden the synthesis surface.** Beyond figures, ideas (*Coniunctio*, *Sympathy
  & Antipathy*) and places (*Prague*, *Toledo*) give the relation engine more kinds of adjacency to
  read — closer to Hesse's "total contents of our culture".

## Risks / watch-items

- **Attribution is a *floor*, not perfect.** It fires only on recognised values; a concept with no
  operation/planet/stage signal stays glyph-less. Acceptable — the guide says so, and the curated
  packs cover the canonical terms precisely. Watch for over-tagging (the 4-glyph cap + figure-name
  skip guard against soup/false hits).
- **Importance selection is still the corpus team's call.** The guide defines the criteria
  (connectable · canonical · well-sourced; cap per DB); applying it to trim/grow the 931 is a corpus
  ticket, not done here.
- **Locations are `cls:'concept'`** (no location class); fine for hand cards, but coordinate with the
  other window's board-place selector (TICKET-002) so "place as card" and "place on board" stay coherent.

## Suggestions (next)

1. Apply the style guide's glyph rules inside `derive.ts` too (so glyphs exist even before the
   content-layer pass) — a small corpus ticket.
2. Curate the corpus down/up to the "most important per DB" per the guide's §6 criteria.
3. Author a few **concept↔figure / place↔figure** relations (Prague → Dee; Florence → Ficino) so
   placing a place beside its figure surfaces a cited situation.

## Grounding check

- All DLC cards cite a source; no living people named (privacy §0). Glyph attribution derives only
  from defensible alchemical/astral values. Tests assert the figure-name skip + the cap. No
  `TODO(grounding)` opened.
