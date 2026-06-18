# Unified Esoteric Ontology — the "Crystal" data layer

> **Goal.** Fuse the user's standalone esoteric-studies databases into **one ontology** that becomes
> raw material for game assets: card designs, glyph glosses, meeple/role affinities, and — above all —
> the **relation-observation engine** ("a bead with attribute X sits next to a bead with attribute Y →
> surface the real historical/conceptual relationship between them"). This is the data spine behind the
> "ever-growing crystal of insights" ([CLAUDE.md](../CLAUDE.md)); it honours the **Grounding Rule** —
> every entity and relation carries its source DB, method, and confidence.

This doc is the **contract**. The ingestion pipeline (`tools/ingest/`) writes to it; the TS corpus
layer (`src/data/corpus/`) reads from it.

## The four source databases (Wave 1)

All four already share a near-identical **entity–relation schema** — that shared shape is the seam.

| Source DB | Folder | Store | Entities (counts at ingest) |
|---|---|---|---|
| **AlchemyTimeline** | `C:\Dev\ALCHEMYTIMELINEMAP` | SQLite `db/alchemy_timeline.db` | persons 94 · texts 47 · concepts 42 · locations 62 · timeline_events 602 |
| **MedievalMagicDB** | `C:\Dev\MedievalMagicDB` | SQLite `db/medieval_magic.db` + `site/data.json` | persons 52 · texts 43 · concepts 54 · timeline_events 219 · bibliography 34 |
| **RMDB (Renaissance Magic)** | `C:\Dev\renaissance magic` | SQLite `db/renmagic.db` | figures 48 · texts 36 · concepts 122 · dictionary_terms 186 · documents 338 · timeline_events 135 |
| **TheosophicalAlchemyDB** | `C:\Dev\TheosophicalAlchemyDB` | JSON `data/prototype_data.json` (+ expanded) | figures 100 · concepts 67 · texts 87 · **emblems 178** · scholars 6 |

> Wave 2 candidates (registered later): CROWLEYDB, ChristianCabalaDB, PicoDB, WitchcraftStudiesDB,
> GoetiaRevEng, AgrippaDOP — same pattern, fold in pack-by-pack (don't bulk-copy; pilot one first).

## The unified entity model

Six entity **types**, normalized from the source tables/keys:

| Unified type | Sourced from |
|---|---|
| `figure` | `persons` / `figures` (+ Theosophical `scholars` as `figure` w/ `scholar` flag) |
| `text` | `texts` (+ RMDB `documents` of `is_primary_source`) |
| `concept` | `concepts` (+ RMDB `dictionary_terms`) |
| `event` | `timeline_events` |
| `location` | `locations` (+ inline lat/lng on figures/texts/emblems) |
| `emblem` | Theosophical `emblems` (Atalanta Fugiens &c.) |

```ts
interface Entity {
  uid: string;            // GLOBALLY unique: `${db}:${type}:${slug|id}`
  db: SourceDb;           // 'alchemy' | 'medieval' | 'renmagic' | 'theosophical'
  type: EntityType;       // figure|text|concept|event|location|emblem
  name: string;           // display name / title / label
  slug?: string;
  summary?: string;       // definition_short | bio | description | summary (plain text, HTML stripped)
  era?: string;
  dateStart?: number;     // composition_year_start | birth_year | year
  dateEnd?: number;
  lat?: number; lng?: number;
  // source-specific buckets preserved for fidelity & later derivation:
  fields: Record<string, unknown>;   // role_primary, category_type, operation_type, tradition, language…
  // PROVENANCE (Grounding Rule):
  sourceMethod?: string;  // source_method
  reviewStatus?: string;  // review_status
  confidence?: number;
  sourceRef: string;      // human-readable citation string for cards/relations
  portal?: string;        // maps db → an existing portals.ts id where one is deployed
}
```

## The unified relation model

Every **junction/ref table** and every inline `*_involved` / `related_*` array becomes a typed triple.
This is the heart of the "bead-beside-bead" engine.

```ts
interface Relation {
  uid: string;            // `${db}:${predicate}:${subjectUid}->${objectUid}`
  db: SourceDb;
  subject: string;        // Entity.uid
  predicate: Predicate;
  object: string;         // Entity.uid
  confidence?: number;
  sourceRef: string;
}
```

| Predicate | Sourced from | Reading (subject → object) |
|---|---|---|
| `authored` | `figure_texts`, `person_text_roles`, `texts.author_figure_id` | figure wrote text |
| `participated_in` | `person_event_refs`, `event_figures`, `events.persons_involved` | figure took part in event |
| `cites` | `text_event_refs`, `cited_documents`, `concept_text_refs` | text/concept references X |
| `concerns` | `concept_event_refs`, `document_topics`, `events.concepts_involved` | event/doc is about concept |
| `influenced` | `figure_influences` | figure influenced figure |
| `belongs_to_tradition` | `figure_traditions` | figure aligned with tradition |
| `located_at` | `locations.slug` refs, inline lat/lng | entity sited at location |
| `related_to` | `concept_links`, `term_links`, `related_concepts` | symmetric concept link |
| `depicts` | emblem `concepts` arrays | emblem depicts concept |

## Game projections — how the ontology becomes assets

The TS layer (`src/data/corpus/derive.ts`) maps entities/relations onto the **existing** engine types
([engine/types.ts](../src/engine/types.ts)) — no new board mechanics required:

1. **Entity → `CardDef`.** figure/text/concept/emblem become infusible cards.
   `cls` = the unified type (emblem→`symbol`); `name`, `text` = summary; `sourceRef`, `portal` carried;
   `correspondences` seeded from `fields` + derived glyphs; the entity `name` is itself added as a
   correspondence so the relation engine can match on it.
2. **Entity → glyph attribution.** Grounded maps (owned by **bead-smith**):
   - concept `operation_type` (e.g. `PUTREFACTION`) → the matching zodiac/process glyph.
   - concept `category` / alchemical keywords in summary → element/principle glyphs.
   - figure `role_primary` (ALCHEMIST · PHILOSOPHER · CLERICAL · MATHEMATICIAN · PHYSICIAN · POET ·
     SCHOLAR · TRANSLATOR · CHEMIST) → **meeple occupation affinity** ([occupations.ts](../src/engine/occupations.ts)).
3. **Relation → `RelationEntry`.** Each triple whose two endpoints are infusible becomes a corpus
   relation keyed on the two entity **names** (`a`, `b`), with grounded `title`/`text`/`points`/`sourceRef`.
   → This is the literal answer to *"a John Dee bead next to a Monas Hieroglyphica bead surfaces the real
   `authored` relation, cited."* The `observe()` function looks up triples between two beads' source
   entities at adjacency time.
4. **Location + figure → meeple/place situations.** `participated_in` events at a `location` give the
   *"alchemist meeple on the Prague Castle tile → attach the John Dee figure card"* hook
   (figures `located_at` / `participated_in` events at that place). Scoped to the optional roles layer.

## Provenance & the Grounding Rule

- Every Entity and Relation carries `sourceRef` + `db`; cards/relations rendered in-game cite it.
- `reviewStatus` / `confidence` are preserved; the ingester can **gate** on them (default: include all,
  flag `confidence < 0.5` in the manifest, never silently drop).
- HTML in bio/analysis fields is stripped to plain text at ingest; the original is kept in `fields._html`.
- The pipeline writes a **manifest** (`unified.manifest.json`): per-DB counts, dropped/low-confidence
  rows, and unmatched predicate sources — so coverage gaps are visible, never hidden.

## Outputs

- `src/data/corpus/unified.corpus.json` — `{ entities: Entity[], relations: Relation[] }`.
- `src/data/corpus/unified.manifest.json` — provenance & coverage report.
- Consumed at build time (static import); **no backend required** for read-only content. The same
  corpus seeds the Supabase "crystal" when the online phase ([DEPLOYMENT](DEPLOYMENT.md)) lands.

## Pipeline

`tools/ingest/build_corpus.py` — pure stdlib (sqlite3 + json). Per-source adapters → normalize →
de-dupe by `(name, type)` across DBs (keep both, cross-link with `related_to` + a `sameAs` note) →
emit corpus + manifest. Re-runnable; deterministic ordering for clean diffs.
