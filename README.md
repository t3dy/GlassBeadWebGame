# The Glass Bead Game

### ▶ Play it live: **https://t3dy.github.io/GlassBeadWebGame/**

*(Solo and two-player hot-seat, in the browser — no install.)*

---

## Elevator pitch

A contemplative web game of **synthesis**, inspired by Hermann Hesse's *Glasperlenspiel*, Joshua
Fost's semantic-web prototype of it, and Timothy Leary & Robert Anton Wilson's *Game of Life*.

You **draw cards** drawn from real esoteric and intellectual history and **infuse glass beads** with
their significance; you **apply alchemical glyphs** from an always-available bank to qualify what each
bead means; and you **lay a process tile** (Conjunction, Separation, Calcination…) between two beads
to form a **triad** — a *subject → operation → object* statement. You score most when your triad
**reconciles opposites** (Sol with Luna, Fire with Water) or **spans disciplines** (a Bach fugue with
an I Ching hexagram). Play solo as a meditative high-score, or pass one device back and forth in
**two-player hot-seat** for a duel of synthesis. There is always a move — when in doubt, *meditate*
and draw.

This repository is the **playable core**. A large speculative design (a programmatic correspondence
engine, signature-keyed "Adventure Starters", an eight-circuit progression and skill tree, draft
phases, private goals, divinatory board modes, worker-placement roles, a card corpus ingested from a
library of knowledge portals, and online collaborative play) is fully specified under [`docs/`](docs/)
and deliberately **bracketed** behind this core.

## How to play

1. Choose **Play solo** or **Two-player hot-seat**.
2. **Infuse a bead:** pick a card from your hand, then click (or drag it onto) an empty space.
3. **Complicate it with glyphs:** glyphs are *attributes* — drag one from a bank (Planets, Zodiac
   processes, Principles, Elements) onto a bead, or click a glyph then a bead. Click any glyph or
   meeple to read what it means in alchemy and in the game.
4. **Let the system read the relations:** place beads side by side and the engine **derives the
   relationship between adjacent beads from their attributes** — e.g. a Venus bead next to a Jupiter
   bead surfaces what Ficino said about the benefics against melancholy. Grounded relations score.
5. **Place meeples:** drag an occupation (Alchemist, Cleric, Scholar…) onto a space to work the board.
6. **Print Shop (✎):** every element is editable — use the pen to rewrite a card or re-attribute its
   glyphs, copy (⧉) any explanation into your own card, or forge a brand-new card straight to your hand.
7. **DLC Packs (▦):** curate a topical deck (e.g. a *Medieval Alchemists Pack*) by searching the whole
   library — base cards, the unified-ontology "Crystal", and your own cards — then activate it to build
   your deck, and export/import packs as shareable JSON. Built-in DLC ships too: the **Societas Magica**
   packs — **Figures · Concepts · Places** of pre-modern learned magic (cards written per
   [docs/CARD_STYLE_GUIDE.md](docs/CARD_STYLE_GUIDE.md), with glyphs attributed so they're real pieces).
8. **Draw (🎲):** filter the pool by search and card type, then *Draw 5 random*, *Redraw* your hand, or
   click to draw a specific card — narrow as much as you like, or just pick the one you want.
6. **End turn** to draw back up (in two-player, pass the device behind a hidden-hands screen).
7. The Game concludes when the universe is full or a player concludes it; the higher synthesis wins.

## Tech stack

| Layer | Choice |
|---|---|
| Language | **TypeScript** (strict) |
| UI | **React 18** |
| Build / dev | **Vite 6** |
| Styling | Plain CSS (the "Green Stone" palette — Tailwind + Framer Motion are planned, currently bracketed) |
| Engine | **Pure TypeScript reducer** (`src/engine/`) — no React, no I/O; unit-testable |
| Tests | **Vitest** (`npm test`) — incl. a property test that the *always-a-move* floor holds for every state |
| Persistence | **localStorage** behind a `DataStore` interface (a shared Supabase backend is planned/bracketed) |
| Hosting / CI | **GitHub Pages** via **GitHub Actions** (build → test → deploy on push to `main`) |

### Project layout

```
src/
  engine/      types.ts · engine.ts (applyMove reducer) · scoring.ts · glyphBank.ts · tiles.ts · engine.test.ts
  data/        seedDeck.ts        (grounded seed cards — each with a sourceRef)
  store/       dataStore.ts       (DataStore + localStorage)
  App.tsx      styles.css         (Green-Stone UI: board, hand, glyph bank, tiles, inspector, log)
docs/          the full design corpus (most of it bracketed for later)
```

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # engine unit tests
npm run build    # type-check + production build (base path set for GitHub Pages)
```

## Design & provenance

The design lives in [`docs/`](docs/) — start with [`docs/GAME_LOOP.md`](docs/GAME_LOOP.md) and
[`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md). A standing **Grounding Rule** requires all player-facing
content to derive from a cited source (Hesse / Leary / RAW, or a knowledge-portal entry) — no invented
filler. Per-turn design reviews are logged under [`docs/narrative-reviews/`](docs/narrative-reviews/).

> Hesse called the Glass Bead Game "purely a symbol of the human imagination." This is not *the*
> Game — it is a **practice** of the skills the Game demands.
