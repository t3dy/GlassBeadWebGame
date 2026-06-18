# Data Model — Triples, Saves, and the Shared Crystal

The board is an **RDF graph** of `bead — tile — bead` (subject–predicate–object) triads, after
Fost. The data layer is abstracted behind a `DataStore` interface so **local-only play needs no
network**, while the same shapes publish to a Supabase-backed shared "crystal." Owned jointly by
**crucible-engineer** (interface, local impl, validation) and **bead-smith** (ontology/vocab).

## Core shapes (TypeScript)

```ts
type SymbolSetId = 'alchemical'|'zodiac'|'astronomical'|'iching'|'musical'
                 |'mathematical'|'archetype'|'tarot'|'circuit';

interface Bead {            // a node — subject or object
  id: string;               // uuid
  set: SymbolSetId;
  glyph: string;            // ☿, ䷀, a kanji, a note…
  label: string;            // grounded gloss
  sourceRef: string;        // corpus citation (Grounding Rule)
  opposes?: string[];       // bead ids it is "maximally opposed" to (Tai Gi / counterpoint)
}

interface Tile {            // a predicate
  id: string;
  relation: string;         // ontology URI, e.g. 'gbg:reconciles'
  glyph: string;            // kanji / relational sign
  sourceRef: string;
}

interface Triad {           // one RDF statement = one move
  id: string;
  subject: string;          // bead id
  predicate: string;        // tile id (→ relation URI)
  object: string;           // bead id
  cells: [Cell, Cell, Cell];// grid placement (bead, tile, bead)
  maybe: number;            // 0..1 — RAW Maybe Logic confidence weight
  score?: ScoreBreakdown;   // coherence / distance / counterpoint / resonance
}

// --- Cards & turn loop (see GAME_LOOP.md, CARD_CORPUS.md) ---
interface Card {            // a drawable; becomes a Bead when placed
  id: string; class: 'figure'|'text'|'symbol'|'concept'|'event';   // see CARD_CORPUS.md
  source: { portal: string; entryId: string; citation: string };
  pack: string; name: string; glyphs: string[]; text: string;
  correspondences: Record<string, unknown>;
  stats: { sulphur: number; salt: number; mercury: number; potency: number };
  opposes?: string[]; affinities?: string[];
}
type Move =
  | { kind: 'placeBead'; card: string; cell: Cell }
  | { kind: 'applySymbol'; card: string; targetBead: string }
  | { kind: 'layTile'; tile: string; between: [string, string] }
  | { kind: 'resolvePrompt'; promptId: string; choice: number }
  | { kind: 'pass' };                       // total — defined for every state
interface PlayerState { id: string; hand: string[]; circuit: number; score: number;
  sheet: CharacterSheet; goals: string[] }   // goals held, private — see DRAFT_AND_GOALS.md
// Adventure Starters (ADVENTURE_STARTERS.md): prewritten, keyed to combination *signature*, not pairs
interface AdventureStarter {
  id: string;
  match: { class: 'affinity'|'opposition'|'transformation'; operation?: string; axis?: string;
           pole?: string; portals?: string[]; pair?: [string,string]; minCircuit?: number };
  template: string;                          // slots: {a}{b}{op}{aText}{bText}{pole}
  choices: { text: string; effects: Effect[] }[];
  sourceRefs: string[];
}
interface CharacterSheet {  // meta-progression, persists across games — see PROGRESSION.md
  playerId: string; ranks: { circuit: number; initiation: string };
  topicXp: Record<string, number>; skillPoints: number;
  unlockedNodes: string[]; portals: string[]; titles?: string[];
}
type ProgressMove =        // resolved on the sheet, never blocks the board loop
  | { kind: 'spendSkillPoint'; node: string }
  | { kind: 'acquirePortal'; portal: string };
interface Role {           // optional worker-placement layer — see ROLES.md
  id: string; name: string; source?: { portal: string; entryId: string };
  primaryAction: string; topicAffinity: string[]; resource?: Effect[];
  gatedBy?: { circuit?: number; node?: string; portal?: string }; sourceRef: string;
}
interface Worker { playerId: string; roleId?: string; cell?: string }   // a placed meeple
interface StoryPrompt { id: string; text: string; choices: { text: string; effects: Effect[] }[] }

interface Game {
  id: string;
  title: string;
  beads: Bead[];
  tiles: Tile[];
  triads: Triad[];
  circuit: number;          // 1..8 highest reached
  // turn loop
  deck: string[];           // card ids, draw order
  discard: string[];
  players: PlayerState[];
  activePlayer: number;
  prompts: StoryPrompt[];   // open story prompts awaiting resolution
  draft?: DraftState;       // active draft phase, if any — see DRAFT_AND_GOALS.md
  boardMode: 'freegrid'|'tarot'|'geomancy'|'iching'|'kamea';  // default 'freegrid' — see BOARD_MODES.md
  rolesEnabled?: boolean;   // optional worker-placement layer — see ROLES.md
  roleSpaces?: { roleId: string; takenBy?: string; cost: number }[];
  workers?: Worker[];
  mode: 'hotseat' | 'online';
  createdBy?: string;       // null = local/anon
  '@context'?: object;      // JSON-LD context when exported
}
```

## JSON-LD / RDF export

A `Game` serializes to **JSON-LD** with a `gbg:` context, so a triad becomes a real RDF statement
and can also emit **Turtle** for publishing — fulfilling Fost's "XML-based syntax for publishing
semantically meaningful assertions." Sketch:

```json
{
  "@context": { "gbg": "https://glassbeadgame.local/ns#", "rdfs": "http://www.w3.org/2000/01/rdf-schema#" },
  "@graph": [
    { "@id": "gbg:bead/sol",  "@type": "gbg:Bead", "gbg:set": "alchemical", "rdfs:label": "Sol" },
    { "@id": "gbg:bead/luna", "@type": "gbg:Bead", "gbg:set": "alchemical", "rdfs:label": "Luna" },
    { "@id": "gbg:bead/sol",  "gbg:reconciles": { "@id": "gbg:bead/luna" }, "gbg:maybe": 0.7 }
  ]
}
```

## The ontology (relation domains/ranges & opposites)

`bead-smith` maintains an ontology that the engine validates against:
- each relation's allowed **subject/object bead sets** (domain/range) — enables the **coherence**
  score and blocks illegal triads;
- the **opposites** graph — enables the **counterpoint bonus** and **Tai Gi** collapse;
- the **discipline-distance** matrix between symbol sets — drives **interdisciplinary distance**
  scoring (the core reward). Store as a symmetric matrix of set→set distances.

## DataStore interface

```ts
interface DataStore {
  loadLocal(id: string): Promise<Game | null>;
  saveLocal(game: Game): Promise<void>;      // localStorage key gbg_save_v1[:id]
  publish(game: Game): Promise<string>;      // → shared crystal (Supabase); returns public id
  browseCrystal(query?: CrystalQuery): Promise<GameSummary[]>;
  poolBeads(): Promise<Bead[]>;              // "pool of familiar symbols from earlier games"
}
```
Phase 0–4 ship a `LocalDataStore` (localStorage + JSON-LD export/import). Phase 5 adds
`SupabaseDataStore` implementing `publish`/`browseCrystal`/`poolBeads`.

## Shared backend (Supabase) — Phase 5

Postgres schema (RLS on; published rows world-readable):

- `games(id, title, owner, circuit, jsonld jsonb, created_at)`
- `triples(id, game_id, subject_iri, predicate_iri, object_iri, maybe real)` — flattened RDF for
  querying the crystal.
- `pool_beads(iri, set, glyph, label, source_ref, first_game)` — the growing shared symbol pool;
  a `UNIQUE(iri)` so agreed-upon symbols accrete rather than duplicate ("ever-growing crystal").
- `cards(id, portal, pack, name, glyphs, text, correspondences jsonb, stats jsonb, source_citation)`
  — the translated card corpus ([CARD_CORPUS](CARD_CORPUS.md)); the deck draws from here.
- `starters(id, match jsonb, template, choices jsonb, source_refs)` — the Adventure Starter library
  ([ADVENTURE_STARTERS](ADVENTURE_STARTERS.md)); also shippable as local JSON packs.
- `goals(id, text, secret, tier, condition jsonb, reward jsonb, source_ref)` — the private-goal library.
- `events(id, title, date_start, date_end, description, topics, figures, works, starter jsonb, source_ref)`
  — timeline events surfaced by matching combinations ([ADVENTURE_STARTERS](ADVENTURE_STARTERS.md#timeline-events-as-combination-triggered-content)).
- `skill_tree(node_id, kind, sephirah|path, attribution jsonb, unlock jsonb)` — the Tree-of-Life nodes/
  paths, seeded from CROWLEYDB `thelemic_tree.json`; `grades` ladder from CROWLEYDB `grades.json`.
- `characters(player_id, ranks jsonb, topic_xp jsonb, skill_points, unlocked_nodes, portals)` — the
  per-player meta-progression sheet ([PROGRESSION](PROGRESSION.md)), persists across games.
- **Online turn state:** the shared board/deck live on the game row; **hands are per-player private**
  (RLS: a player reads only their own `hand`). Turn order enforced by an `active_player` lock +
  realtime broadcast of each applied `Move`.

Keep all backend access inside `SupabaseDataStore`; **no Supabase imports in the engine or React
components** — swap-ability and offline play depend on it.
