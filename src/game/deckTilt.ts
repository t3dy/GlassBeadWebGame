// GENRE → DECK TILT — biases which cards a draw surfaces toward the kinds the active mode/genre wants
// to talk about. The Magister's Game is class-neutral; the Novel wants figures, settings, and fates;
// the Scholarly Article wants texts and concepts; the Video Game wants systems (concepts/objects);
// the Painting wants symbols and places. Genres refine the mode (Sci-Fi tilts toward ideas/objects;
// History of Science toward texts/events; Allegory toward symbols).
//
// PURE (the Deckard Boundary): no React, no globals — every reader passes a `getCard` lookup and, for
// sampling, an rng. The tilt only re-WEIGHTS an existing pool; it never invents or hides cards (the
// always-a-move guarantee holds — a tilt of 0.2 still leaves every card drawable). This is a soft lens,
// not a filter, so off-tilt cards (the productive surprise the Game prizes) still come up.

import type { CardDef } from '../engine/types';

// Keyed by card class NAME (figure/text/symbol/concept/place/event/object/idea). Typed as a loose
// string map on purpose, so this module compiles whether or not CardDef['cls'] has been widened to the
// full corpus set — the tilt simply never matches a class the data layer doesn't yet produce.
export interface Affinity {
  /** added to a card's base weight (1.0) when its class matches; absent classes get no nudge. */
  classes: Record<string, number>;
  /** small boost when a card's `tradition`/`discipline` correspondence contains one of these. */
  traditions?: string[];
}

// Mode-level affinities. Weights are deliberately modest (≈ +0.4…+1.6) so the tilt nudges, not gates.
export const MODE_AFFINITY: Record<string, Affinity> = {
  magister: { classes: { symbol: 0.4, concept: 0.4 }, traditions: ['the Glass Bead Game'] },
  novel: { classes: { figure: 1.4, place: 1.0, event: 1.0, object: 0.4 } },
  'short-story': { classes: { figure: 1.2, event: 1.2, object: 0.6 } },
  poem: { classes: { symbol: 1.2, idea: 1.0, concept: 0.6 } },
  painting: { classes: { symbol: 1.4, place: 0.8, figure: 0.6 } },
  biography: { classes: { figure: 1.6, event: 1.0, text: 0.6 } },
  article: { classes: { text: 1.4, concept: 1.2, idea: 1.0 } },
  'film-critique': { classes: { text: 1.2, concept: 0.8, figure: 0.6 } },
  'bong-session': { classes: { concept: 1.2, idea: 1.2, symbol: 0.8 } },
  'video-game': { classes: { concept: 1.2, object: 1.2, idea: 1.0, place: 0.6 } },
  'court-patronage': { classes: { figure: 1.4, place: 1.0, object: 1.0, text: 0.6 } },
};

// Genre nudges layered ON TOP of the mode affinity (added, then merged). Only a representative set —
// absent entries simply fall back to the mode tilt.
export const GENRE_AFFINITY: Record<string, Record<string, Affinity>> = {
  novel: {
    scifi: { classes: { object: 1.2, idea: 1.0, concept: 0.8 } },
    historical: { classes: { event: 1.2, place: 0.8 } },
    gothic: { classes: { place: 1.2, symbol: 0.6 } },
  },
  poem: {
    haiku: { classes: { symbol: 0.8 }, traditions: ['classical elements'] },
    psalm: { classes: { text: 0.8, concept: 0.6 } },
  },
  painting: {
    allegory: { classes: { symbol: 1.2, figure: 0.8 } },
    surreal: { classes: { symbol: 1.0, object: 0.8 } },
  },
  article: {
    'history-of-science': { classes: { text: 1.0, event: 1.0, figure: 0.6 } },
    'close-reading': { classes: { text: 1.4 } },
  },
  'video-game': {
    'open-world': { classes: { place: 1.2, event: 0.8 } },
    soulslike: { classes: { place: 1.0, object: 0.8 } },
  },
  'court-patronage': {
    kunstkammer: { classes: { object: 1.4, symbol: 0.6 } },
    laboratory: { classes: { text: 1.0, object: 1.0 } },
  },
};

const FLOOR = 0.2; // never let the tilt drop a card below this — keeps every card drawable.

/** The draw weight for one card under the active mode/genre. Base 1.0, nudged by class + tradition. */
export function tiltWeight(card: CardDef | undefined, modeId: string, genreId?: string): number {
  if (!card) return FLOOR;
  let w = 1;
  const mode = MODE_AFFINITY[modeId];
  if (mode) {
    w += mode.classes[card.cls] ?? 0;
    if (mode.traditions && matchesTradition(card, mode.traditions)) w += 0.4;
  }
  if (genreId) {
    const genre = GENRE_AFFINITY[modeId]?.[genreId];
    if (genre) {
      w += genre.classes[card.cls] ?? 0;
      if (genre.traditions && matchesTradition(card, genre.traditions)) w += 0.4;
    }
  }
  return Math.max(FLOOR, w);
}

function matchesTradition(card: CardDef, traditions: string[]): boolean {
  const hay = `${card.correspondences.tradition ?? ''} ${card.correspondences.discipline ?? ''}`.toLowerCase();
  return traditions.some((t) => hay.includes(t.toLowerCase()));
}

/** Deterministically order a pool so the mode/genre's preferred cards come first. Stable: ties keep
 *  their input order. Used to surface relevant cards at the top of the Draw browser. */
export function tiltOrder(ids: string[], getCard: (id: string) => CardDef | undefined,
                          modeId: string, genreId?: string): string[] {
  return ids
    .map((id, i) => ({ id, i, w: tiltWeight(getCard(id), modeId, genreId) }))
    .sort((a, b) => (b.w - a.w) || (a.i - b.i))
    .map((x) => x.id);
}

/** Weighted sample of `n` DISTINCT ids from the pool, biased by the mode/genre tilt. `rnd` defaults to
 *  Math.random (inject a deterministic rng in tests). Falls back gracefully when the pool is small. */
export function tiltedSample(ids: string[], n: number, getCard: (id: string) => CardDef | undefined,
                             modeId: string, genreId?: string, rnd: () => number = Math.random): string[] {
  const pool = ids.map((id) => ({ id, w: tiltWeight(getCard(id), modeId, genreId) }));
  const picks: string[] = [];
  const take = Math.min(n, pool.length);
  for (let k = 0; k < take; k++) {
    let total = 0;
    for (const p of pool) total += p.w;
    let r = rnd() * total;
    let idx = 0;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].w;
      if (r <= 0) { idx = j; break; }
      idx = j;
    }
    picks.push(pool[idx].id);
    pool.splice(idx, 1); // without replacement
  }
  return picks;
}
