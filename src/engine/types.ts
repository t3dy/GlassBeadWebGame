// Core types — the four systems: BEAD, CARD, GLYPH, TILE — plus minimal turn/score state for
// 1-player and 2-player hot-seat. Pure data; no React, no I/O. Everything else (circuits, the
// correspondence/story engine, board modes, roles, draft, goals, progression, online multiplayer)
// is BRACKETED — see docs/.

export type CellId = string; // "r,c"

/** A glyph from the always-available GLYPH BANK (applied to beads to qualify significance). */
export interface Glyph {
  id: string;
  glyph: string;
  label: string;
  set: string;
  correspondences: Record<string, string>;
  sourceRef: string;
}

/** A CARD — drawn and infused into a bead to give it significance (lore + correspondences). */
export interface CardDef {
  id: string;
  cls: 'figure' | 'text' | 'symbol' | 'concept';
  name: string;
  text: string;
  glyphs: string[];
  correspondences: Record<string, string>;
  sourceRef: string;
  portal?: string; // id of a knowledge portal (src/data/portals.ts) — links the card to its live site
}

/** A TILE — a process relation (the alchemical operation) laid between two beads. */
export interface TileDef {
  id: string;
  glyph: string;
  operation: string;
  relation: string;
  gloss: string;
  sourceRef: string;
}

/** A BEAD — its significance = (card infused) + (glyphs applied). */
export interface Bead {
  cell: CellId;
  cardId?: string;
  glyphIds: string[];
  owner: number; // player index who placed it
}

export interface PlacedTile {
  cell: CellId;
  tileId: string;
  owner: number;
}

/** A TRIAD — bead → tile → bead = subject → operation → object. */
export interface Triad {
  id: string;
  subject: CellId;
  tile: CellId;
  object: CellId;
  by: number;     // player who formed it
  points: number; // resonance scored
}

export interface Player {
  id: number;
  name: string;
  hand: string[];
  score: number;
}

export type Phase = 'play' | 'handoff' | 'over';

export interface GameState {
  size: number;
  beads: Record<CellId, Bead>;
  tiles: Record<CellId, PlacedTile>;
  triads: Triad[];
  deck: string[];
  discard: string[];
  players: Player[];   // 1 or 2
  active: number;      // index of the player to move
  phase: Phase;
  handSize: number;
  log: string[];
  lastReadout?: string; // scoring readout for the most recent triad
}

export type Move =
  | { kind: 'infuse'; cardId: string; cell: CellId }      // core action 1: card → bead
  | { kind: 'applyGlyph'; glyphId: string; cell: CellId } // core action 2: glyph → bead
  | { kind: 'layTile'; tileId: string; cell: CellId }     // relate two beads → triad (scores)
  | { kind: 'endTurn' }                                   // refill hand + pass (the always-legal floor)
  | { kind: 'ready' }                                     // dismiss the hot-seat handoff screen
  | { kind: 'concludeGame' };                             // end now → results
