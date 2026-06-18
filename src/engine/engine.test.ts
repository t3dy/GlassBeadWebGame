import { describe, it, expect } from 'vitest';
import { applyMove, cellId, createGame, legalMoveKinds, triadEndsThrough, winner } from './engine';
import { SEED_DECK } from '../data/seedDeck';
import type { GameState } from './types';

function firstEmpty(s: GameState) {
  for (let r = 0; r < s.size; r++)
    for (let c = 0; c < s.size; c++) {
      const id = cellId(r, c);
      if (!s.beads[id] && !s.tiles[id]) return id;
    }
  return undefined;
}

describe('core engine', () => {
  it('always offers a move (endTurn floor) for every reachable play state', () => {
    let s = createGame(1, 5, 5);
    for (let i = 0; i < 60; i++) {
      const kinds = legalMoveKinds(s);
      if (s.phase === 'play') expect(kinds).toContain('endTurn'); // the invariant
      if (s.phase === 'over') break;
      if (s.phase === 'play' && kinds.includes('infuse')) {
        const cell = firstEmpty(s)!;
        s = applyMove(s, { kind: 'infuse', cardId: s.players[s.active].hand[0], cell });
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
    expect(s.players[0].hand).not.toContain(card);
    expect(s.discard).toContain(card);
  });

  it('forms a triad and awards points when a tile relates two beads', () => {
    let s = createGame(1, 5, 5);
    s = applyMove(s, { kind: 'infuse', cardId: s.players[0].hand[0], cell: cellId(2, 1) });
    s = applyMove(s, { kind: 'infuse', cardId: s.players[0].hand[0], cell: cellId(2, 3) });
    expect(triadEndsThrough(s, cellId(2, 2)).length).toBe(1);
    s = applyMove(s, { kind: 'layTile', tileId: 'conjoins', cell: cellId(2, 2) });
    expect(s.triads.length).toBe(1);
    expect(s.players[0].score).toBeGreaterThanOrEqual(1);
  });

  it('runs a 2-player hot-seat turn cycle through the handoff phase', () => {
    let s = createGame(2, 5, 5);
    expect(s.players.length).toBe(2);
    expect(s.active).toBe(0);
    s = applyMove(s, { kind: 'endTurn' });
    expect(s.phase).toBe('handoff'); // hide hands between turns
    expect(s.active).toBe(1);
    s = applyMove(s, { kind: 'ready' });
    expect(s.phase).toBe('play');
    s = applyMove(s, { kind: 'endTurn' });
    expect(s.active).toBe(0);
  });

  it('declares a winner when the game is over (2-player)', () => {
    let s = createGame(2, 5, 5);
    // give P0 a triad, then conclude
    s = applyMove(s, { kind: 'infuse', cardId: s.players[0].hand[0], cell: cellId(0, 0) });
    s = applyMove(s, { kind: 'infuse', cardId: s.players[0].hand[0], cell: cellId(0, 2) });
    s = applyMove(s, { kind: 'layTile', tileId: 'conjoins', cell: cellId(0, 1) });
    s = applyMove(s, { kind: 'concludeGame' });
    expect(s.phase).toBe('over');
    expect(winner(s)).not.toBeNull();
  });

  it('every seed card carries a sourceRef (Grounding Rule)', () => {
    for (const c of SEED_DECK) expect(c.sourceRef.length).toBeGreaterThan(0);
  });
});
