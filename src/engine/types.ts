// Core types. Glyphs are ATTRIBUTES on beads; relations between adjacent beads are derived
// programmatically (relations.ts). Worker-placement meeples (occupations) sit on the board's
// spaces. 1- and 2-player hot-seat. Pure data; no React, no I/O.

export type CellId = string; // "r,c"

export type GlyphCategory = 'planet' | 'zodiac' | 'principle' | 'element';

/** A glyph from a bank — applied to a bead as an attribute. */
export interface Glyph {
  id: string;
  glyph: string;
  label: string;
  category: GlyphCategory;
  correspondences: Record<string, string>;
  meaning: string;  // alchemical explanation (info panel)
  gameUse: string;  // how it behaves in play (info panel)
  sourceRef: string;
}

/** A CARD — infused into a bead to give it significance (lore + base correspondences). */
export interface CardDef {
  id: string;
  cls: 'figure' | 'text' | 'symbol' | 'concept';
  name: string;
  text: string;
  glyphs: string[];
  correspondences: Record<string, string>;
  sourceRef: string;
  portal?: string;
}

/** A worker-placement occupation (a meeple). */
export interface Occupation {
  id: string;
  emoji: string;
  name: string;
  affinity: string; // an attribute value it favours
  meaning: string;
  gameUse: string;
  sourceRef: string;
}

/** A BEAD — significance = (card infused) + (glyph attributes applied). */
export interface Bead {
  cell: CellId;
  cardId?: string;
  glyphIds: string[];
  owner: number;
}

/** A placed worker on a board space. */
export interface Meeple {
  cell: CellId;
  occId: string;
  owner: number;
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
  meeples: Record<CellId, Meeple>;
  realized: string[];        // ids of relations already scored (so re-evaluation doesn't double-count)
  lastRelations: string[];   // titles of relations formed by the most recent move (for the readout)
  deck: string[];
  discard: string[];
  players: Player[];
  active: number;
  phase: Phase;
  handSize: number;
  log: string[];
}

export type Move =
  | { kind: 'infuse'; cardId: string; cell: CellId }       // play a card → a bead
  | { kind: 'applyGlyph'; glyphId: string; cell: CellId }  // drag a glyph onto a bead (complicate it)
  | { kind: 'placeMeeple'; occId: string; cell: CellId }   // worker placement
  | { kind: 'endTurn' }                                    // refill + pass (always legal)
  | { kind: 'ready' }                                      // dismiss the hot-seat handoff
  | { kind: 'concludeGame' };
