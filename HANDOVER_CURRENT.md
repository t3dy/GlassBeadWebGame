# Handover — Current State

> Live status doc. The Magister Ludi agent updates this as work lands. Read it after
> [CLAUDE.md](CLAUDE.md) to know what exists and what's next.

## Status: **Playable prototype shipped & deployed** (solo + 2-player hot-seat) + **Unified Ontology layer live** + **Accounts & cloud sync (Phase 5/6) — code complete, awaiting Supabase provisioning**

### THE CRYSTAL ATLAS — relational card-browser website (added 2026-06-27)
A standalone, dependency-free static site under **`site/`** that shows off the cards and is a **relational
browser** over the corpus. Open `site/index.html` directly, or preview: `npx vite preview --outDir site
--port 4180` (a `crystal-atlas` config is in `.claude/launch.json`).
- **`site/index.html` · `style.css` · `app.js`** — Green-Stone gallery of **198 beads** (glyph badges,
  pack chips, citation); **filters** (search + class + pack + top glyphs); a **detail browser** (each
  glyph + its sourced meaning, correspondences table, source, portal "Explore the source ↗", and
  **Connections** = authored *influence* links + thematic *resonance* neighbours) with **click-through
  navigation + back-stack**; and a **force-directed Connection Web** (86 nodes · 73 edges, class-coloured,
  hover-highlight). Force layout **pre-warms synchronously** (robust to rAF throttling).
- **`site/data.js`** is generated — never edit by hand. Regenerate from the live engine data:
  `GEN_SITE=1 npx vitest run src/site/genData.test.ts` (generator: **`src/site/genData.test.ts`**; pulls
  ALL_DLC_PACKS + seed deck + `links.ts` + glyph banks → the site can't drift from the engine). An
  always-on test asserts links resolve + every card glyph renders. `tsconfig.app.json` excludes `src/site`
  (it uses node builtins); vitest still runs it.
- **NEW MODE:** `src/game/modes.ts` gained a **Court Patronage** mode (Letters / Laboratory Commission /
  Courtly Roguelike / Kunstkammer genres) pairing with the Patrons DLC — **rides the other window's
  modes.ts commit** (left uncommitted by me).
- **Verified:** `npm test` 51/1-skipped; build clean; site verified live (Rudolf II→Maier/Dee/Prague
  influence; click-through + back; web lays out spread). Screenshots blocked by tab-throttling (env, not a bug).
- **NEXT:** deploy the Atlas (Pages target or `/atlas`) + CI regen of `data.js`; web-view keyboard a11y;
  lazy-load the 2,470-entity corpus into the Atlas; cross-link Atlas↔in-game inspector.

### PATRONS DLC — medieval & Renaissance patronage assets (added 2026-06-27)
Turns the new **patronage research database** (`docs/research/` — sourcebook + `patronage_catalog.sql`/
`.sqlite`) into playable **assets**, parallel to the other window's mode→genre *mechanic* work.
- **`src/data/dlc/patrons.ts`** — **30 grounded patron figure cards** (`patron:<slug>`; al-Ma'mun →
  Rudolf II) in the **5 packs** the sourcebook names: `patron:women` · `patron:astronomy` ·
  `patron:manuscript` · `patron:alchemy` · `patron:magnificence`. Patrons recur across packs as the
  same const (stable ids). Glyphs/correspondences per the sourcebook's attribution table; every card
  cited. (Authored by **bead-smith**; integrated here.)
- **Wired in:** `src/data/dlc/index.ts` (`...PATRON_PACKS`). **~24 influence links** added to
  `links.ts` — patrons → who/what they funded (Cosimo→`sm:ficino`, Rudolf II→`ema:maier`/`sm:dee`/
  `sm:l-prague`, Alfonso X→`sm:l-toledo`, Elizabeth I→`sm:dee`) + patron↔patron dynasties (Medici house,
  Roman papacy, Valois–Burgundy brothers, Timurid Herat, Habsburg). So patrons join the **draw-connected**
  web. Tests `patrons.test.ts` (7). **`npm test` 50/50; build clean.**
- **Coordination:** stayed out of `modes.ts` / `modes.test.ts` / `App.tsx` (a second window was live-
  editing them for the mode→genre layer, review 022). Committed nothing — left the shared worktree's
  in-flight files untouched; my new files are uncommitted and ready.
- **WITHHELD (design captured, code not written to avoid the live `modes.ts` edit):** four **patronage
  genre-modes** matching the sourcebook's Genre Hooks — **Court Patronage (letters)** / visual-novel of
  favour & dependency; **Laboratory Commission** / lab-business-sim; **Courtly Roguelike** / procedural
  patronage dungeon; **The Kunstkammer** / cabinet of wonders. Each = a move budget + 5–6 patron-voiced
  interaction prompts (commission, dedication, scandal, deadline, agent, fraud-check). Hand these to
  whoever next owns `modes.ts`; they slot into the new mode→genre structure and pair with the patron cards.
- **NEXT:** asymmetric-sponsor rule (one favoured glyph + one forbidden risk per patron → *simulative*
  thematic action, review 023); meeple+place hook now has real patron cards to attach (alchemist on
  Prague Castle → Rudolf II); link patrons to their named works/artists as those enter the corpus.

### ACCOUNTS + CLOUD PERSISTENCE + NAV SHELL (added 2026-06-18)
Full login + auto-sync layer, **local-first / graceful guest mode** (runs with no env vars). Brings
forward [DEPLOYMENT](docs/DEPLOYMENT.md) Phase 5/6 backend without blocking solo play.
- **Auth (username + password, email optional):** `src/store/supabase.ts` (client; `isCloudConfigured`
  false → app stays fully local), `src/auth/authClient.ts` (username→synthetic `…@gbg.local` email;
  `signUp/signIn/signOut/fetchProfile`; pure helpers `isValidUsername`/`slugifyUsername`/`usernameToEmail`),
  `src/auth/AuthContext.tsx` (React provider; wires Supabase session → pull/teardown sync),
  `src/auth/AuthModal.tsx` ("Enter Castalia" / "Join the Order").
- **Cloud sync (`src/store/sync.ts`):** pull-on-login (cloud wins, else push local up so guest work is
  kept), **debounced auto-push** of the user library + live board. Status observable → nav sync chip.
  Saved-games API (`listGames/loadGame/saveGameAs/renameGame/deleteGame`).
- **content.ts seam:** `onContentChange` notifier (drives push; restore deliberately silent to avoid a
  loop), `exportUserLibrary/importUserLibrary/isLibraryEmpty/rehydrate`. `touch()` replaces bare
  `version++` in the two user-mutation persist fns.
- **UI:** `src/ui/NavBar.tsx` (account menu + sync chip + Saves), `src/ui/SavesModal.tsx` (board states
  as "spaces in memory"), `src/ui/useSyncStatus.ts`. Wired in `main.tsx` (AuthProvider) + `App.tsx`
  (NavBar on both Setup and play screens; cloud board applied on login; `pushGame` in the save effect).
- **Backend:** `supabase/migrations/0001_init.sql` (profiles · user_library · games; owner-only RLS;
  `username_available` RPC). `.env.example` + `src/vite-env.d.ts` added; `.gitignore` already ignores `.env`.
- **Verified:** `npm run build` clean; `npm test` **37/37** (new: `authClient.test.ts` ×4,
  `userLibrary.test.ts` ×3); **live in browser (guest mode):** nav renders "Guest · local only", zero
  console errors, full game intact (screenshot taken).
- **TO GO LIVE (user action):** provision Supabase + run the SQL + disable email confirm + set the two
  `VITE_` env vars (local `.env` + Vercel) — see [DEPLOYMENT §"Turning on cloud accounts"](docs/DEPLOYMENT.md).
- **NEXT:** profile/account page (change username/password, set recovery email); per-table normalization
  of the library if it grows; published/world-readable games for the shared crystal; realtime co-op (Phase 6).

### CARD STYLE GUIDE + GLYPH ATTRIBUTION + PRIVACY (added 2026-06-18)
- **[docs/CARD_STYLE_GUIDE.md](docs/CARD_STYLE_GUIDE.md)** — voice/length, CardDef shape, the canonical
  **glyph-attribution table**, correspondence vocabulary, importance-selection (§6), and the **privacy
  rule** (§0: name only historical figures/concepts/places — never living scholars).
- **Glyph attribution at scale** — `src/engine/glyphAttribution.ts` (`attributeGlyphs`/`enrichGlyphs`)
  applied in `content.ts` `registerCorpusCards`, so the ~931+ corpus cards now carry glyphs derived
  from operation/planet/element/principle/stage (English + Latin) and, for non-figures, the name.
  Respects hand-authored glyphs; caps at 4; skips figure names (no false hits). **Verified live:**
  corpus "putrefactio"→♏, "calcinatio"→♈, "Albedo"→☽. Tests `glyphAttribution.test.ts`.
- **Privacy rework:** the Societas Magica DLC dropped the living-scholars pack; now **Figures ·
  Concepts · Places** of learned magic (`src/data/dlc/societasMagica.ts`), all historical & cited,
  with style-guide glyphs. Pack ids: `dlc:sm-figures` / `dlc:sm-concepts` / `dlc:sm-places`.
- **`npm test` 26/26; build clean.** Committed only my files (shared worktree). NEXT: apply §6
  importance-selection per DB; mirror the glyph rules into `derive.ts`; concept/place↔figure relations.

### SOCIETAS MAGICA DLC + DRAW PANEL (added 2026-06-18)
- **Built-in DLC infrastructure** (`content.ts`): `registerDlc()` / `isBuiltinPack()`; built-in packs
  surface in the ▦ Packs modal as activatable/exportable DLC (no edit/delete; cards resolve via
  `getCard`). `listPacks`/`deckCardIds`/`exportPack`/`libraryCardIds` now span built-ins too.
- **Societas Magica** (`src/data/dlc/societasMagica.ts`): two packs — **Historical Figures** (12:
  Hermes→Paracelsus, with planetary/disciplinary attributes so they're live in the relation engine)
  and **Contemporary Scholars** (10: Kieckhefer, Fanger, Klaassen, Page, Láng, Boudet, Bailey, Davies,
  Véronèse, Rider — each cited to a real signature work). Playable either/both; drawable or on the board.
  *Starter set — the user will provide the definitive curated list; replace this file or import.*
- **🎲 Draw panel** (App `DrawModal`): filter the library by **search + card type**, see the pool
  count, then **Draw 5 random** / **Redraw hand** / **click a card to draw it**. Answers review 014's
  "gate the draw / restore agency."
- **Verified live:** both DLC packs show (DLC tag); activating Historical Figures → a figures-only deck;
  Draw filter "Kieckhefer" → pick into hand; filter "Societas Magica"+figure (22) → Draw 5. Test
  `content.test.ts` (DLC register + deck-from-pack + sourceRefs). **`npm test` 20/20; build clean.**
- **Coordination:** committed only my files (shared single worktree); left the other window's
  tickets/TDD/architecture docs + CLAUDE.md edits untouched.
- **Next:** scholar↔figure relations; a draw cost/cap for competitive pacing; ingest the user's
  definitive Societas list.

### UNIFIED ESOTERIC ONTOLOGY — the "Crystal" data layer (added 2026-06-18)
The standalone study DBs are now fused into one queryable ontology that feeds game assets. See
[docs/UNIFIED_ONTOLOGY.md](docs/UNIFIED_ONTOLOGY.md).
- **Sources (Wave 1):** AlchemyTimeline · MedievalMagicDB · Renaissance Magic (RMDB) · TheosophicalAlchemyDB
  — all four already shared one entity/relation shape (figures · texts · concepts · events · locations
  · emblems + junction tables), which is the unification seam.
- **Ingestion:** `tools/ingest/build_corpus.py` (pure stdlib; re-runnable; schema-tolerant column-mapping
  + generic junction harvesting) reads SQLite + JSON → emits **`src/data/corpus/unified.corpus.json`**
  (**2,470 entities · 3,685 relations**) + `unified.manifest.json` (provenance + coverage). Full
  Grounding-Rule provenance on every row (`db`, `sourceRef`, `confidence`, `reviewStatus`).
- **TS layer:** `src/data/corpus/{types,loader,derive,observe,index}.ts`. `entityToCard()` → infusible
  CardDef; `correspondencesOf()` lands alchemical attributes (e.g. `operation_type` PUTREFACTION →
  'Putrefaction'); `occupationForFigure()` maps `role_primary` → a meeple occupation (the John-Dee→
  alchemist bridge); `observe.ts` turns the relation graph into engine `RelationEntry` rows keyed on
  entity **names**, with grounded per-predicate templates that **cite the source inline**.
- **Engine seam (light touch):** `relations.ts` `registerCorpusRelations()` (indexed matcher, no per-pair
  scan of thousands); `content.ts` corpus-card registry resolvable via `getCard()`. **The corpus is
  lazy-loaded** (dynamic import → its own 3MB chunk; main bundle unchanged at ~190KB) so local-first play
  is untouched if it never loads.
- **In game:** App lights the crystal on mount; a **"✦ Draw from the Crystal"** action + a header readout
  (`✦ crystal N entities · M relations · K cards`). **Verified in-browser** (2470 / 1433 connectable /
  931 cards; drawing yields a real cited card — e.g. Benivieni's *Trattato in difesa di Savonarola*) and
  by a **unit test**: two adjacent corpus beads surface the real **Authorship** situation (John Dee →
  *Monas Hieroglyphica*), cited. `npm test` **14/14**; `npm run build` clean.
- **DLC PACKS (added 2026-06-18):** players curate **topical decks** from the whole library (base +
  the 931-card Crystal + their Print Shop cards). `content.ts`: `Pack` + create/edit/delete/
  `toggleActivePack`, `deckCardIds()` (active packs build the deck; `createGame` uses it),
  `libraryCardIds()`, `exportPack`/`importPack` (self-contained JSON embedding card defs — shareable
  "DLC"); persisted `gbg_packs_v1`. UI: **▦ Packs** modal + Pack Builder (topic search across the
  library, Add / Add-all, chips, activate, export ⧉, import). **Verified live:** a "Medieval
  Alchemists Pack" (search "alchem" → 420 cards) → activated → new game deck = 1255, hand all
  alchemical/cited (Ashmole, Atalanta Fugiens emblems). **Delivers review 014's "gate the draw."**
- **NEXT for the Crystal layer:** (1) ✅ partly done — DLC Packs give a curated library subset; still
  want a lightweight in-hand browser; (2) the meeple+role+place hook (alchemist on Prague Castle →
  attach the John Dee figure card) using `participated_in`/`located_at`; (3) Wave-2 sources (CROWLEYDB,
  PicoDB, ChristianCabalaDB…); (4) ship a few **example packs** as defaults; (5) the Supabase "crystal"
  (online phase) seeds from this same corpus.

---

## Status: **Playable prototype shipped & deployed** (solo + 2-player hot-seat)

- **Live:** https://t3dy.github.io/GlassBeadWebGame/ (GitHub Pages via Actions; push to `main` redeploys).
- **Repo:** https://github.com/t3dy/GlassBeadWebGame (public). README has the live link at top, an
  elevator pitch, and the tech-stack table.
- Runs locally: `npm install` → `npm run dev` (:5173); `npm test` (**6/6**); `npm run build` (clean).
- **Verified end-to-end (local preview + live):** setup (solo / 2-player) → infuse bead from card →
  apply glyph → lay tile → **triad scores** with a readout (coherence / interdisciplinary /
  counterpoint) → **End turn** → 2-player **hot-seat handoff** (hands hidden behind a curtain) →
  **Conclude** → results + winner.
- **PRINT SHOP / editor (2026-06-18):** `src/engine/content.ts` is a homebrew overlay (persisted,
  `gbg_homebrew_v1`) merged over base data; the engine/relations read through `getCard`/`getGlyph`, so
  edits go live. UI: a **✎ pen** to edit any card (name/text/glyph-attributions/correspondences) or
  glyph (meaning/gameUse), **⧉ copy** on explanations + the relations readout, and **✎ New card** to
  forge a card straight into the active hand. Player cards carry `sourceRef: 'player (Print Shop)'`.
  Verified live (edited a card body; forged a card → hand). `resetHomebrew()` exists but isn't surfaced.
- **VISION AUDIT (2026-06-18):** [docs/VISION_AUDIT.md](docs/VISION_AUDIT.md) — narrative-designer
  audit vs the user's vision + Hesse + **sourced Leary research** (Castalia Foundation; the "Interior
  Journey" essay; Leary's cybernetic "glass beads strung in combinations"). Spine realized; top gaps =
  **named historical-figure workers**, a real **location layer**, deeper **DB ingestion**, and a
  Hesse-faithful **contemplative/non-scored mode**.
- **MODEL PIVOT (2026-06-18):** glyphs are now **bead attributes** in 4 banks (Planets/Metals,
  Zodiac/Processes, Principles, Elements); **relations are derived programmatically** by the system
  comparing adjacent beads' attributes against a grounded corpus (`src/engine/relations.ts` —
  Ficino's *De Vita*, the coniunctio, contraries…), scored to the active player. Manual process-tiles
  are gone (processes became zodiac glyphs). A unified **info panel** explains every glyph/meeple/bead
  (alchemy + game use). **Mercury** is two distinct glyphs: ☿ planet-metal, ☤ principle/spirit.
  **Worker placement (first cut):** a 12-occupation **meeple bank** + panel + placement (affinity
  bonus; deeper actions later). **Drag-and-drop + click** both work. Verified live (Venus|Jupiter →
  Ficino benefics, +3; Salt dragged onto a bead). Next big lever: grow `RELATION_CORPUS`.
- **Wired to the live knowledge portals:** `src/data/portals.ts` registers the 8 deployed DH sites
  (HermeticDB, RMDB, Goetia, HPMarginalia, QueryPat, Shakespeare, Marxist, Dreambase). Cards carry an
  optional `portal`; the bead inspector shows an **"Explore the source ↗"** link to the portal site,
  the header links the **DBCatalog hub**, and a footer **portal bar** links all 8. (CROWLEYDB,
  Neoplatonism, etc. aren't publicly deployed yet — add to the registry when they are.)
- All **optional layers remain bracketed** (circuits, correspondence/story engine, Adventure Starters,
  draft, goals, progression, board modes, roles, online, diagrams) — specified in `docs/`, not built.

### Code shipped (the four core systems)
- `src/engine/types.ts` — BEAD / CARD / GLYPH / TILE + `Move` (infuse | applyGlyph | layTile | meditate).
- `src/engine/engine.ts` — pure reducer `applyMove`; triad detection; `meditate` (the Pass floor) is
  **total**; `legalMoveKinds` always includes it. `src/engine/engine.test.ts` — 5 passing tests
  incl. the always-a-move invariant.
- `src/engine/glyphBank.ts` — the always-available glyph bank (metals, elements, tria prima).
- `src/engine/tiles.ts` — 8 process tiles (Conjunction … Fixation).
- `src/data/seedDeck.ts` — 14 grounded seed cards (each with `sourceRef`).
- `src/store/dataStore.ts` — `DataStore` + `localStore` (localStorage `gbg_save_v1`).
- `src/App.tsx` + `src/styles.css` — Green-Stone UI: board, hand, glyph bank, tile tray, inspector, log.
- Config: Vite + React + TS; `vite.config.ts` (app) / `vitest.config.ts` (tests, split to avoid a
  nested-Vite type clash); `.claude/launch.json` for preview.

### Run it
`npm install` then `npm run dev` → http://localhost:5173 . `npm test`, `npm run build`.

### Deliberately NOT built yet (next, in priority order)
1. Scoring (coherence / interdisciplinary distance / counterpoint) + a triad readout.
2. The correspondence engine v1 + Tier-A Adventure Starters (signature → grounded story option).
3. Tailwind + Framer Motion polish (currently plain CSS); first Vercel deploy + `git init`.
4. CROWLEYDB card-ingestion pilot.
Optional layers (draft, goals, progression, board modes, roles, online) stay off until the core sings.

### What exists
- `CLAUDE.md` — agent entry point.
- `PLAN.md` — phased roadmap (re-prioritized: **Phase 2 = the turn loop**; Phase 6 = online + ingestion).
- `docs/` — PHILOSOPHY, **GAME_LOOP**, **CARD_CORPUS**, **ADVENTURE_STARTERS**, **DRAFT_AND_GOALS**,
  **PROGRESSION**, **BOARD_MODES**, **ROLES**, MECHANICS, SYMBOL_SETS, AESTHETIC, DATA_MODEL,
  DEPLOYMENT, NARRATIVE_DESIGN, CORPUS_GAME_DESIGN, `narrative-reviews/`.
- `.claude/agents/` — magister-ludi, crucible-engineer, bead-smith, mirror-warden, **narrative-designer**.
- `.claude/settings.local.json` — permission allowlist.

### Per-turn narrative-review protocol (added 2026-06-18)
- `UserPromptSubmit` hook in `.claude/settings.json` (project, committed) reminds every turn to file
  a grounded review artifact in `docs/narrative-reviews/` (TEMPLATE + INDEX; first artifact = 001).
- Permissions stay in `.claude/settings.local.json`. **Note:** hook added mid-session — open `/hooks`
  once or restart to load it into the watcher.
- Glyph palette expanded: element triangles + `substances`/`apparatus` sets + Unicode Alchemical
  Symbols block (U+1F700–U+1F77F) in SYMBOL_SETS.

### Narrative-designer module (added 2026-06-18)
- Studies `E:\pdf\Game Design` (≈30 books, already chapter-Markdown'd; indexed in CORPUS_GAME_DESIGN).
- First audit landed in NARRATIVE_DESIGN.md, grounded in **Shipp** (knitted/layered theme, motivated
  elements, 5 degrees of thematic action, conflict=plot) and **Tom Smith** (verbs).
- **Alchemical glyph system refined from `C:\Dev\AlchemyBlockInvaders\`**: substances (elements +
  planet-metals) → **beads**; 12 zodiacal processes → **tiles** (`alch:*`); tria prima → **modifiers**;
  magnum-opus colours → session arc. SYMBOL_SETS.md updated accordingly.

### Decisions locked (2026-06-18)
- Stack: **React + Vite + TypeScript + Tailwind + Framer Motion**.
- Persistence: **local-first behind a `DataStore` interface + shared Supabase backend** (backend
  planned from the start, implemented in Phase 5).
- Hosting: **Vercel (Hobby)** static SPA + **Supabase (free)** backend, browser→Supabase directly
  (anon key + RLS, no serverless functions). Account `tedhand-2181s-projects`. See
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Highest-priority system: the turn loop (added 2026-06-18)
- [GAME_LOOP](docs/GAME_LOOP.md): card-driven turns; **always-a-move invariant** (Pass is total —
  refills hand, reshuffles discard, never deadlocks); the **correspondence engine** classifies triads
  (affinity/opposition/transformation) and emits grounded **story prompts** whose choices draw cards
  / change the board. Same pure-TS reducer for **hot-seat** and **online-collaborative**.
- Cards = narrative-designer **translations** of `C:\Dev\wiki` portal entries (index-card + essay)
  into game terms — grounded `text` + `correspondences` + `glyphs` + tria-prima `stats`
  ([CARD_CORPUS](docs/CARD_CORPUS.md)). Ingestion = two stages (engineer extract → designer translate);
  **pilot one portal first, don't bulk-copy.**
- **Grounding Rule broadened:** the knowledge-portal corpus is now an authorized *sourced* origin for
  card content (invariant "no invented filler; everything cited" preserved).

### Optional roles / worker placement (added 2026-06-18)
- [ROLES](docs/ROLES.md): optional meeple-into-role layer (Alchemist, Cleric, Necromancer, Philosopher,
  Neoplatonist, Printer, Artisan, Scholar, Patron, **historical-character** figure cards). A role
  **empowers/flavors the two core actions** and biases which Adventure Starters surface; **contested
  role spaces** in competitive play. Roles **derive from concept/figure cards** (extensible, not
  hardcoded); gated by skill tree / portal; grant topic XP.
- Optional + togglable (`rolesEnabled`); a generic **Seeker** role + Pass keep the always-a-move floor.
  PLAN Phase 8 (with board modes). **Watch layer-stacking** — run complexity-brake before combining
  optional layers; keep default play clean (review 008).

### Optional board modes (added 2026-06-18)
- [BOARD_MODES](docs/BOARD_MODES.md): a `BoardMode` abstraction (layout / generate / read) over the
  **Free-Grid core**. Four optional divinatory layouts — **Tarot Spread, Geomancy, I Ching,
  Sigil-on-a-Kamea** — each emits **signatures** into the existing correspondence/Adventure-Starter
  pipeline, so they reuse coverage, goals, and progression rather than forking the game.
- **Optional, post-core** (PLAN Phase 8, incremental; Tarot Spread first). Free Grid stays default;
  both core actions + Pass work in every mode. I Ching reuses the 8-trigram↔8-circuit bridge; Kamea
  reuses the wiki Goetia sigil analysis; Tarot reuses CROWLEYDB.

### Core re-centering (2026-06-18) — read this before the CROWLEYDB note below
- **The core of the game = two actions:** (1) **draw cards to infuse beads with significance**,
  (2) **apply glyphs from the always-available glyph bank** ([SYMBOL_SETS](docs/SYMBOL_SETS.md#the-glyph-bank),
  [GAME_LOOP](docs/GAME_LOOP.md#the-two-core-actions-what-the-game-is)). The glyph bank is a second
  always-legal floor beside Pass.
- **Occult diagrams (Tree of Life, Rose Cross lamen) are OPTIONAL tools**, not the center. Skill-tree
  **default = plain per-portal branch tree**; default ranks = Castalian. The Tree-of-Life view + A∴A∴
  grades are an **opt-in overlay** for players who want the Qabalistic frame. Build core palette +
  branch-tree first; diagrams later.
- So the CROWLEYDB Tree/grades work below is **retained but scoped to the optional overlay** (and as a
  *source of correspondence values*), not the default topology.

### CROWLEYDB grounding: Tree of Life (now OPTIONAL overlay), card classes, events (added 2026-06-18)
- **Skill-tree topology = Tree of Life**, seeded from `C:\Dev\CROWLEYDB\frontend\public\data\thelemic_tree.json`
  (10 sephiroth + 22 paths w/ letter, astro, Thoth/GD tarot, color scales, god/archangel/choir);
  reuse `frontend/src/pages/TreeOfLife.tsx`. **Ranks = A∴A∴ grades** (`grades.json`). → closes the
  topology + rank-name TODOs.
- **Card classes:** `figure` (`persons.json`), `text` (`works.json`), `symbol`, `concept`, `event`.
  Figures + texts are *key classes*; figure↔text↔event links (`person_events`, `term_works`) = affinities.
- **Timeline events** (`events.json` + `event_topics` + `person_events`) surface as Adventure-Starter
  options when a board combination matches an event's associations — grounded in the real cited entry.
- **Pilot portal = CROWLEYDB** (it has the full structure: tree, grades, figures, works, events).
- **Occult diagrams:** port TreeOfLife.tsx (skill-tree view) + build a Rose Cross lamen (glyph selector).
- Correspondence-vocabulary TODO (reviews 002–004) can now be filled from `thelemic_tree.json` values.

### Combinatorial story system + draft/goals (added 2026-06-18)
- [ADVENTURE_STARTERS](docs/ADVENTURE_STARTERS.md): prewritten starters keyed to the combination
  **signature** (class × operation × axis), **not** card pairs — ~250 backbone templates cover **every**
  combination (coverage guaranteed by a class fallback + a unit test); slot-filled with sourced card
  text; Tier-B overlays inflect by the player's portals. Resolver = most-specific-wins, seeded.
- [DRAFT_AND_GOALS](docs/DRAFT_AND_GOALS.md): **draft phases** (deep/wide/open from a chosen portal,
  rewards conditioned on board state → depth-vs-breadth dilemma) + **private goals** (discovered hidden
  objectives rewarding specific glyph/correspondence placements → players' *reasons* to steer the board).
- Both preserve the always-a-move floor (draft *skip*; goals = motivation, not obligation).
- **Author a vertical slice first** (one operation × one axis of Tier-A + a few goals) before scaling.

### Progression meta-layer (added 2026-06-18)
- [PROGRESSION](docs/PROGRESSION.md): **two axes** — Leary **circuits** (depth) + a **skill tree**
  (breadth). **Topic XP** (earned by playing topics) → **skill points** → spent on tree nodes whose
  consequence is *more story-prompt options* (which symbol-interaction to explore next). **Portals**
  are acquired in-play (several modes) into **inventory**, opening tree branches + their cards.
- **Character sheet** persists across games (meta-progression); per seat (hot-seat) / per account
  (online). Engine: XP/points/rank are pure reductions; spend/acquire resolve on the sheet and never
  block the board's always-a-move floor. Folded into **PLAN Phase 3**.
- Proposed skill-tree topology: the **Tree of Life** (sephiroth nodes / 22 paths) — grounded, fits the
  occult portals; per-portal branches are the fallback.

### Immediate next step
Core is in (see Status above). Next: triad **scoring** + a **correspondence readout** on the formed
triad, then the **Adventure-Starter** Tier-A backbone. Then `git init` + first Vercel deploy. Keep
optional layers off until the core is fun. See [PLAN.md](PLAN.md).

### Open questions / `TODO(grounding)` log
*(Add any string/symbol you couldn't ground here, per the Grounding Rule.)*
- [ ] **Corpus cards with no summary** fall back to a `"… Awaiting a sourced gloss."` face
      (`src/data/corpus/derive.ts`). Either filter these from the curated deck or backfill glosses from
      the source DBs. (review 014)
- [ ] **Gate the Crystal draw** instead of exposing all 931 cards at once — scope the per-move surface by
      active portal / tradition / era / private goal; prefer a *seek* verb over random draw, to restore
      scarcity + agency (Shipp ch.4 conflict; Tom Smith verbs). (review 014)
- [ ] Verify each starter **kanji tile** gloss against a source ([SYMBOL_SETS](docs/SYMBOL_SETS.md#tile-sets-predicates--relations--kanji--relational-signs)).
- [ ] Confirm trigram↔circuit assignments are defensible or label them clearly interpretive.
- [ ] Decide board size default (9×9 proposed) and whether grid is fixed or growable.
- [ ] Define the `correspondences` controlled vocabulary — **now sourceable from CROWLEYDB
      `thelemic_tree.json`** (sephirah/planet/element/tarot/color axes). (bead-smith) — reviews 002, 005.
- [ ] Give **Pass** a mild opportunity cost so it's a floor, not a strategy. (review 002)
- [ ] Add skill-tree **branch exclusivity** to avoid late-game option bloat. (review 003)
- [x] ~~Pilot portal~~ → **CROWLEYDB** (review 005).
- [x] ~~Skill-tree topology~~ → **default = plain branch tree**; Tree of Life is an *optional overlay*
      (review 006 revised 005). Rank default = Castalian; A∴A∴/alchemical = optional.
- [ ] Specify the **glyph bank** contents (starter vs. gated) and balance free glyphs vs. drawn cards
      so neither trivializes the other. (bead-smith + crucible-engineer) — review 006.
- [ ] **Complexity guard:** optional layers now = board modes + roles + draft + goals + progression +
      lenses. Before combining, run `complexity-brake`; ensure each is independently togglable and the
      **default core stays clean**. (magister-ludi) — review 008.
- [ ] Ensure figure/text/event card classes **generalize beyond Crowley** (Pico, Neoplatonism, …);
      cap event-match surfacing to top-k. (review 005)
- [ ] Enumerate exact Unicode codepoints + grounded glosses for the `substances`/`apparatus` glyph
      sets (U+1F700–U+1F77F); cap the starter palette (~12–16 substances, ~6 apparatus) so it stays
      motivated, not an icon dump; verify font rendering. (bead-smith) — see review 001.
- [ ] Verify the 12 process→zodiac→relation mappings against an alchemical source. Note: Sagittarius
      is `alch:exalts` here (AlchemyBlocks labeled it "Fermentation Continuation"); confirm the
      operation name and the Libra/Capricorn coagulation-vs-fixation split. (narrative-designer + bead-smith)
