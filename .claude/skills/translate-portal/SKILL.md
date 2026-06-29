---
name: translate-portal
description: Orchestrate the translation of a knowledge portal (a C:\Dev study DB / wiki dataset, or the unified Crystal corpus) — its figures, places, ideas, texts, events AND the KNOWN RELATIONSHIPS between them — into bespoke Glass Bead Game assets: cards (with glyphs + correspondences), connection links (the "draw connected" web), and relation-corpus entries (so adjacent beads surface real, cited situations). Use whenever ingesting/curating a portal into the game as a DLC pack, or expanding the relationship web among existing cards.
---

# Translation Orchestrator

You are the **translation orchestrator**: you turn a knowledge portal into playable Glass Bead Game
content, *relationship-first*. The portals already encode who taught whom, who wrote what, who
opposed whom, what happened where — that graph is the most valuable thing to translate, because the
game's two highest-value systems run on relationships:

- the **"draw connected"** web (`src/data/dlc/links.ts` → `engine/connections.ts`): place a card,
  get offered cards it is linked to, with a cited reason;
- the **relation engine** (`engine/relations.ts` `RELATION_CORPUS` / `registerCorpusRelations`):
  two adjacent beads surface a grounded, cited situation and score it.

So: translate **entities → cards**, and **relationships → links + relation entries.** Always grounded.

## Read first
- [docs/CARD_STYLE_GUIDE.md](../../../docs/CARD_STYLE_GUIDE.md) — voice, the **glyph-attribution
  table**, the correspondence vocabulary, importance selection (§6), and the **privacy rule** (§0).
- [docs/CARD_CORPUS.md](../../../docs/CARD_CORPUS.md) — the two-stage (Deckard Boundary) pipeline.
- Existing examples to match: `src/data/dlc/{_card.ts,scholastica.ts,raw.ts}` (cards),
  `src/data/dlc/links.ts` (links), `src/engine/relations.ts` (`RelationEntry`).

## Inputs
- **portal** — a source: a SQLite/JSON DB under `C:\Dev\*` (e.g. CROWLEYDB, MedievalMagicDB), a wiki
  dataset (`C:\Dev\wiki\*.json` / `*_cards.md` / `relationships_*.json`), or the unified corpus
  (`src/data/corpus/unified.corpus.json`, which already has 3,685 relations).
- **packId / packName** — e.g. `dlc:crowley`, "Aleister Crowley · Thelema".
- **scope** — how many of the most important entities to translate (default ~12–20; cap, don't dump).

## The pipeline (delegate each stage to the right specialist)

**Stage 0 — Survey.** Inspect the portal: entity tables/types and, crucially, the **relationship
tables** (junctions, `relationships_*.json`, `person_events`, `term_works`, an ontology's relation
types). List the predicate vocabulary it uses. *(orchestrator)*

**Stage 1 — Extract (deterministic; no interpretation).** Pull `entities[]` (id, type, name, summary,
attributes, sourceRef) and `relationships[]` (subject, predicate, object, sourceRef). Reuse
`tools/ingest/build_corpus.py` where it fits; otherwise write a small per-portal adapter under
`tools/ingest/adapters/`. *(crucible-engineer)*

**Stage 2 — Select by importance** (CARD_STYLE_GUIDE §6): keep entities that are **connectable** (they
appear in relationships), **canonical**, and **well-sourced**; favour breadth of *kinds* (figure ·
text · place · idea/concept · event · object). Cap to scope. *(narrative-designer)*

**Stage 3 — Translate entities → cards** (CardDef). For each: a grounded one-to-two-sentence `text`
(a summary of the source, never invented), `cls` (figure/text/place/idea/concept/event/object),
**glyphs** per the attribution table, **correspondences** in the controlled vocabulary, a real
`sourceRef`, and `portal` where a live site exists. **Privacy (§0): never name living people** — use
the historical figures/ideas/places they study. *(narrative-designer drafts; bead-smith fixes glyphs.)*

**Stage 4 — Translate relationships → mechanics (the point of this skill).** For each known
relationship, emit one or both of:
- a **Link** `{ a, b, reason }` in the pack's links — the connected-draw, with the cited reason;
- a **RelationEntry** `{ id, a, b, title, text, points, sourceRef, portal? }` when the pairing is
  rich/oppositional enough to be worth *scoring & narrating* on adjacency.

Map the portal's predicate to the game (extend as needed):

| Portal predicate | Link reason form | Relation entry? |
|---|---|---|
| authored / wrote (figure→text) | "X wrote Y." | usually link-only |
| translated (figure→text) | "X translated Y." | link-only |
| taught / studied-under (figure→figure) | "X taught Y." | optional (affinity) |
| influenced / shaped (figure→figure/idea) | "X's … shaped Y." | **yes** if cross-discipline (interdisciplinary points) |
| corresponded / debated (figure↔figure) | "X and Y debated …" | optional |
| **opposed / refuted** (figure/idea↔idea) | "X refuted Y." | **yes — kind 'opposition'**, higher points (counterpoint) |
| located-at / worked-at (figure→place) | "X worked at Y." | link; also a meeple/place hook |
| patron-of (patron→figure) | "X funded Y." | link-only |
| depicts / about (text→figure/idea) | "Y treats X." | link-only |
| derived-from / source-of (text→text) | "Y descends from X." | optional |
| contemporary / same-school (any) | "Both belong to …" | leave to the engine's auto-affinity |

Match on **card ids** (links) — author them so links also reach existing cards across packs and the
seed deck (e.g. `leary:circuit`, `sm:pico`) to weave the whole crystal together.

**Stage 5 — Emit (self-contained, collision-safe).** Write a new pack file
`src/data/dlc/<portal>.ts` (cards + its links exported), then register it in `src/data/dlc/index.ts`
(`ALL_DLC_PACKS`) and add its links to `src/data/dlc/links.ts` (or export them from the pack and have
`connections.ts` consume them). Prefer **new files** over editing shared ones; keep the pack
importable on its own. Rich relation entries go through the corpus path (`registerCorpusRelations`) or
a `RELATION_CORPUS` addition.

**Stage 6 — Verify (the gate).** `npm test` + `npm run build` clean; add/extend a test asserting (a)
every card has a `sourceRef`, (b) a key relationship resolves (e.g. `connectedCards('x')` offers `y`
with the cited reason). Spot-audit several `text` summaries against the source. Log a per-turn review.

## Orchestration summary
0 survey → 1 **crucible-engineer** extract → 2–3 **narrative-designer** select & translate →
3b **bead-smith** glyphs/correspondences → 4 **narrative-designer** relationship mapping →
5 emit → 6 verify. The orchestrator (magister-ludi) sequences and holds the Grounding Rule gate.

## Grounding & coordination
- Every card, link, and relation entry carries a real `sourceRef`. No invented facts; no living
  people. Generated story prompts only slot-fill from this sourced text.
- Shared worktree: commit **self-contained** pack/link files; add to `index.ts`/`links.ts`
  additively; never sweep another window's untracked modules into your commit.

## Acceptance checklist
- [ ] ~12–20 most-important, connectable entities translated to cards (mixed kinds), each cited.
- [ ] Known relationships translated to links (with reasons) + relation entries for the rich ones.
- [ ] Links reach across packs/seed where the history warrants it.
- [ ] Registered in `index.ts`; `npm test` + `npm run build` clean; a relationship test passes.
- [ ] Per-turn narrative review filed; privacy + grounding verified.
