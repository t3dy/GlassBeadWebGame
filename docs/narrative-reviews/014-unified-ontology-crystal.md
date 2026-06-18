# Narrative Review 014 — Unified Esoteric Ontology / the "Crystal" data layer

- **Date:** 2026-06-18
- **Turn / prompt:** Audit the new unified-ontology layer that fuses four standalone study DBs into one
  knowledge graph and feeds the relation-observation mechanic from real, cited triples.
- **What was produced:**
  - `docs/UNIFIED_ONTOLOGY.md` — the contract: 6 entity types (figure, text, concept, event, location,
    emblem) + 9 typed predicates, full provenance (`db`, `sourceRef`, `confidence`, `reviewStatus`).
  - `tools/ingest/build_corpus.py` — reads 4 sources (3 SQLite + 1 JSON) → `unified.corpus.json`
    (2,470 entities / 3,685 relations) + manifest.
  - `src/data/corpus/{types,loader,derive,observe,index}.ts` — `entityToCard()`, `correspondencesOf()`,
    `occupationForFigure()`, `corpusRelationEntries()` / `observeBetween()`.
  - Engine wiring: `registerCorpusRelations()` (relations.ts), corpus-card registry (content.ts),
    lazy load + "✦ Draw from the Crystal" action (App.tsx). In-browser: 2470 entities / 1433
    connectable relations / 931 cards; a unit test proves John Dee + *Monas Hieroglyphica* adjacency
    surfaces the real `Authorship` situation.

## Analysis (against the study materials)

- **Knitted vs. layered (Shipp ch.2 *Modes of Thematic Expression*).** **Strongly knitted at the data
  spine — partially layered at the verb.** The core GBG promise is interdisciplinary synthesis ("a bead
  beside a bead surfaces a real relationship"). Sourcing that relationship from 1,433 *real, cited*
  historical triples instead of a hand-authored handful is the most on-theme thing this layer could do:
  the mechanic now literally *is* "connecting two beads = discovering a sourced correspondence," which is
  Hesse's reconciliation enacted on real scholarship. That is a genuine knit. The seam where it slips to
  *layered* is that the predicate the player experiences is still surfaced by **bare adjacency**, not by a
  chosen alchemical operation — see degree-of-action below.
- **Motivated elements (Shipp ch.2).** **Excellent.** Every entity carries an in-world reason to exist
  (it is a real figure/text/concept with a citation) and every relation is motivated by the historical
  record (`authored`, `influenced`, `cites`). Provenance-preservation (`sourceRef` rendered inline in the
  situation text) is exactly the "resonance/worldbuilding" payload Shipp asks a motivated element to
  carry. No unmotivated generic nodes were introduced.
- **Degree of thematic action — mechanical→associated→metaphoric→simulative→literal (Shipp ch.2).**
  The *content* sits at the **literal** pole (a real authorship is named, cited) — the strongest grounding
  possible. But the *verb* the player performs to trigger it sits only at **associated**: placing two
  beads adjacent reveals a label; the player did not *operate* on anything. NARRATIVE_DESIGN.md's own
  standing target for the place-tile verb is **metaphoric/simulative** ("Conjunction visibly merges two
  beads"). The corpus templates in `observe.ts` are declarative sentences ("X is the author of Y"), not
  enactments. So we have a literal *fact* delivered by an associated *gesture* — a mismatch worth naming.
- **Conflict / plot (Shipp ch.4 *Connecting Story to Gameplay*).** **A real risk surfaces here.** 931
  cards drawable from one "✦ Draw from the Crystal" button threatens **Player-vs-Self** expression with
  paradox-of-choice flooding: when any bead can connect to hundreds of others, the scarcity that makes a
  *found* connection feel like an authored synthesis evaporates. Shipp frames conflict as the engine of
  meaning; an undifferentiated firehose of true facts has no conflict — discovery becomes lookup. The
  John-Dee-on-Prague-Castle meeple hook (figure `located_at`/`participated_in` event at a place) is the
  one spot where a *spatial constraint* would reintroduce scarcity and agency — and it is still unbuilt.
- **Player verbs (Tom Smith, *Anatomy of Game Design*, ch.2).** The verb set is unchanged
  (*select · place · observe · re-read*), which is correct — no new mechanic was added, the ontology
  feeds existing verbs. But "Draw from the Crystal" adds a **random-draw** verb whose meaning is thin;
  Smith's test is whether a verb carries meaning. Drawing 1-of-931 at random is a weak, low-agency verb
  compared to *seeking* a specific correspondence. The expressive power is in `observeBetween()`, not in
  the draw button.
- **Other (Bycer, *Trading/Collectible CGs*, ch.6 — card legibility; Shaker et al, *PCG*).** Bycer's
  legibility lens flags that 931 cards with auto-derived summaries ("Awaiting a sourced gloss" fallback in
  `derive.ts`) will vary wildly in card-face quality. The PCG corpus (Shaker) is the right frame for the
  draw: treat the corpus as a *generator to be curated/filtered* (by portal, era, tradition), not an
  undifferentiated bag — generation needs constraints to be expressive.

## Suggestions

1. **(Highest value) Gate the draw, don't flood it (crucible-engineer + narrative-designer).** Replace the
   single 931-card "✦ Draw from the Crystal" with a *constrained* draw scoped by the active portal /
   chosen tradition / era / private goal — and prefer a **seek/search** verb ("find a bead that connects to
   this one") over pure random. This restores scarcity (Shipp ch.4 conflict) and turns a weak random verb
   into a meaningful one (Tom Smith). The corpus stays huge; the *exposed surface per move* stays small.
2. **Lift the adjacency verb from associated → metaphoric (mirror-warden + narrative-designer).** When
   `observeBetween()` fires, render the surfaced predicate *through* its alchemical operation tile (map
   `authored`→a Fixation/Coagulation enactment, `influenced`→Fermentation, `cites`→Distillation) so the
   player sees an *operation*, not just a sentence. Keep the cited fact as the literal payload; wrap it in
   the metaphoric gesture NARRATIVE_DESIGN.md already specifies. This closes the literal-fact/associated-
   gesture mismatch.
3. **Build the meeple-place hook to reintroduce constraint (crucible-engineer).** The
   `participated_in`-at-`location` situation (John Dee on Prague Castle) is the design's natural scarcity
   valve — a *placed worker* unlocks figure cards, so not everything is drawable at once. Prioritize it
   over breadth of the corpus.
4. **Curate the card-face floor (bead-smith).** Audit entities whose only `text` is the "Awaiting a
   sourced gloss" fallback; either suppress them from the draw pool or queue them for grounded summaries.
   A drawable card with no gloss is a legibility failure (Bycer ch.6).

## Grounding check

- **Player-facing strings introduced this turn:** the situation templates in `observe.ts`
  ("X is the author of Y", "X shaped the thought of Y", etc.) are *interpretive predicate readings of real
  cited triples* — each renders its `sourceRef` inline, satisfying the Grounding Rule's "cite or
  `TODO(grounding)`." They are paraphrase-of-record, not invented lore — acceptable. **However:** these
  template verbs are plain editorial English, not yet phrased in the Hesse/alchemical register
  (cf. NARRATIVE_DESIGN.md's `authored`→Fixation mapping). Not a violation, but a missed grounding
  opportunity — see suggestion 2.
- The `entityToCard()` fallback string `"… — drawn from the {sourceRef}. (Awaiting a sourced gloss.)"` is
  an honest placeholder that names its own gap — good practice, but each instance is effectively an
  ungrounded card face. → **Open `TODO(grounding): corpus cards with no source summary draw a fallback
  face` and mirror into HANDOVER_CURRENT.md.**
- No design-reference (PDF) prose leaked into player content; citations above are by author/chapter only.
