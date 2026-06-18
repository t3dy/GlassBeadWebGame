import { describe, it, expect } from 'vitest';
import { applyMove, cellId, createGame, emptyCount, legalMoveKinds, winner } from './engine';
import { computeRelations } from './relations';
import { SEED_DECK } from '../data/seedDeck';
import type { GameState } from './types';

function firstEmpty(s: GameState) {
  for (let r = 0; r < s.size; r++)
    for (let c = 0; c < s.size; c++) {
      const id = cellId(r, c);
      if (!s.beads[id] && !s.meeples[id]) return id;
    }
  return undefined;
}

// Build a state with two adjacent beads carrying chosen glyphs (bypassing the hand for determinism).
function withAdjacentBeads(glyphsA: string[], glyphsB: string[]): GameState {
  const s = createGame(1, 5, 5);
  s.beads[cellId(2, 2)] = { cell: cellId(2, 2), glyphIds: glyphsA, owner: 0 };
  s.beads[cellId(2, 3)] = { cell: cellId(2, 3), glyphIds: glyphsB, owner: 0 };
  return s;
}

describe('core engine', () => {
  it('always offers a move (endTurn floor) for every reachable play state', () => {
    let s = createGame(1, 5, 5);
    for (let i = 0; i < 60; i++) {
      if (s.phase === 'play') expect(legalMoveKinds(s)).toContain('endTurn');
      if (s.phase === 'over') break;
      const kinds = legalMoveKinds(s);
      if (s.phase === 'play' && kinds.includes('infuse')) {
        s = applyMove(s, { kind: 'infuse', cardId: s.players[s.active].hand[0], cell: firstEmpty(s)! });
      } else {
        s = applyMove(s, { kind: 'endTurn' });
      }
    }
  });

  it('infuses a bead with a card and discards it', () => {
    let s = createGame(1, 5, 5);
    const card = s.players[0].hand[0];
    s = applyMove(s, { kind: 'infuse', cardId: card, cell: cellId(2, 2) });
    expect(s.beads[cellId(2, 2)]?.cardId).toBe(card);
    expect(s.discard).toContain(card);
  });

  it('derives a grounded relation between adjacent Venus and Jupiter beads', () => {
    const s = withAdjacentBeads(['venus'], ['jupiter']);
    const rels = computeRelations(s);
    expect(rels.some((r) => r.title === 'The Benefics against Melancholy')).toBe(true);
  });

  it('scores the active player when applying a glyph creates a new relation', () => {
    let s = withAdjacentBeads(['venus'], []); // neighbour has no attribute yet → no relation
    expect(computeRelations(s).length).toBe(0);
    s = applyMove(s, { kind: 'applyGlyph', glyphId: 'jupiter', cell: cellId(2, 3) });
    expect(s.players[0].score).toBeGreaterThanOrEqual(3); // Venus+Jupiter benefic = 3
    expect(s.lastRelations).toContain('The Benefics against Melancholy');
  });

  it('detects opposition between Fire and Water as counterpoint', () => {
    const s = withAdjacentBeads(['fire'], ['water']);
    const rels = computeRelations(s);
    expect(rels.some((r) => r.kind === 'opposition' || r.title.includes('Contraries'))).toBe(true);
  });

  it('places a meeple on an empty space', () => {
    let s = createGame(2, 5, 5);
    s = applyMove(s, { kind: 'placeMeeple', occId: 'alchemist', cell: cellId(0, 0) });
    expect(s.meeples[cellId(0, 0)]?.occId).toBe('alchemist');
    expect(emptyCount(s)).toBe(24);
  });

  it('runs a 2-player hot-seat cycle and declares a winner', () => {
    let s = createGame(2, 5, 5);
    s = applyMove(s, { kind: 'endTurn' });
    expect(s.phase).toBe('handoff');
    expect(s.active).toBe(1);
    s = applyMove(s, { kind: 'ready' });
    s = applyMove(s, { kind: 'concludeGame' });
    expect(s.phase).toBe('over');
    expect(winner(s)).not.toBeNull();
  });

  it('every seed card carries a sourceRef (Grounding Rule)', () => {
    for (const c of SEED_DECK) expect(c.sourceRef.length).toBeGreaterThan(0);
  });
});
