# Narrative Review 025 — The Crystal Atlas (relational card-browser site) + Court Patronage mode

- **Date:** 2026-06-27
- **Turn / prompt:** "Keep going and do some more, then commit when you're done and build me a website
  showing off your cards and otherwise being a useful relational browser for the database information."
- **What was produced:**
  1. **`site/`** — *The Crystal Atlas*, a dependency-free static site: `index.html` · `style.css` ·
     `app.js` · generated `data.js`. A **card gallery** (198 beads in Green-Stone card faces, glyph
     badges, pack chips, citation), **filters** (search + class + pack + top-14 glyphs), a **detail
     browser** (every glyph with its sourced meaning, a correspondences table, the source, an "Explore
     the source ↗" portal link, and **Connections** = authored *influence* links + thematic *resonance*
     neighbours), **click-through navigation** with a back-stack, and a **force-directed Connection Web**
     (86 connected nodes · 73 edges, coloured by card class, hover-to-highlight a neighbourhood).
  2. **`src/site/genData.test.ts`** — a source-of-truth data generator (vitest-run, inert in `npm test`)
     that emits `site/data.js` from the live DLC packs + seed deck + `links.ts` + glyph banks, so the
     site can never drift from the engine. Includes an always-on consistency test (links resolve;
     every card glyph renders).
  3. **`src/game/modes.ts`** — a new **Court Patronage** mode (the social technology of patronage) with
     four genre registers — *Letters (Visual Novel)*, *Laboratory Commission*, *Courtly Roguelike*,
     *The Kunstkammer* — slotting into the other window's mode→genre structure and pairing with the
     Patrons DLC. (Rides the other window's `modes.ts` commit.)
- **Verified:** `npm test` 51 pass / 1 generator skipped; `npm run build` clean. Site verified live in
  the preview (198 cards; Rudolf II → Maier/Dee/Prague influence links; click-through to Maier opens his
  links + alchemy resonance with a back button; web view lays out 86 nodes spread across the canvas).
  Screenshots were blocked by tab-throttling (rAF disabled on a backgrounded tab) — an environment limit,
  not a site bug; the force layout now **pre-warms synchronously** so it is correct without animation.

## Analysis (against the study materials)

- **Knitted vs. layered** (Shipp ch.2): the site is **knitted to the data**, not a brochure. Its central
  act — follow a card's links to another card, and that card's links onward — is the same *relational*
  premise as the game itself (beads joined by relations). The generator guarantees the showcase *is* the
  corpus, so theme and artefact can't diverge.
- **Degree of thematic action** (Shipp ch.2): the **Connection Web** is the most *metaphoric→simulative*
  surface — it renders Hesse's "ever-growing crystal of insights" literally as a navigable graph; the
  gallery is *associated* (a catalogue). Together they move the project's public face up Shipp's scale.
- **Player verbs** (Tom Smith): a browser's verbs are **search / filter / open / traverse / back**. The
  traverse verb is the important one — it turns a static card list into an explorable relational space,
  which is exactly what a "relational browser" should privilege over a flat grid.
- **Motivated elements** (Shipp ch.2): every surface element is sourced — glyph meanings from the banks,
  link reasons from `links.ts`, portal URLs from the real DH sites. Nothing on screen is unmotivated copy.
- **Conflict / plot** (Shipp ch.4): **n/a for a browser** (no opposition by design) — but the Court
  Patronage mode carries the latent patronage conflict (favour, debt, scandal, deadline) into a *playable*
  register, which is where review 023's "reach simulative action" suggestion lands.
- **Other — UDL / accessibility** (workspace house style): keyboard-openable cards, `aria-live` detail,
  Escape-to-close, semantic roles. The web view is mouse-first (a known gap — see Suggestions).

## Suggestions

1. **Deploy the Atlas** as a second GitHub Pages target (or a `/atlas` path) so it's publicly shareable
   alongside the game; add a regen step to CI so `data.js` rebuilds on push. (magister-ludi / deployment)
2. **Keyboard + a11y for the web view** — focusable nodes, arrow-key traversal of links — so the
   relational verb isn't mouse-only. (mirror-warden)
3. **Bring in the corpus** behind a lazy toggle (the 2,470-entity Crystal) so the Atlas can browse the
   full relation graph, not only the curated ~200; reuse the existing dynamic-import seam. (crucible-engineer)
4. **Cross-link the Atlas and the game** — "open this bead in the Atlas" from the in-game inspector, and
   "play this card" from an Atlas detail — so the browser and the board share one relational spine.

## Grounding check

- New player-facing strings: the masthead/blurbs quote Hesse ("an ever-growing crystal of insights") and
  describe the corpus; the Court Patronage mode copy is original mode-voice writing grounded in the
  patronage sourcebook's mechanisms (stipend, commission, dedication, fraud-check). No invented facts —
  card content is rendered verbatim from the sourced data. No `TODO(grounding)` opened.
