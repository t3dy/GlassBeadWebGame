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
2. **Infuse a bead:** pick a card from your hand, then click an empty cell.
3. **Apply a glyph:** pick a glyph from the bank, then click a bead to qualify it.
4. **Form a triad:** pick a process tile, then click an empty cell *between two beads* — it scores.
5. **End turn** to draw back up (and, in two-player, pass the device behind a hidden-hands screen).
6. The Game concludes when the board is full or a player concludes it; the higher synthesis wins.

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
