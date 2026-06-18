import type { Bead, CellId, GameState, Move, Player } from './types';
import { CARDS, SEED_DECK } from '../data/seedDeck';
import { TILES } from './tiles';
import { GLYPHS } from './glyphBank';
import { scoreTriad } from './scoring';

// Pure engine. applyMove(state, move) -> new state. `endTurn` is TOTAL (defined for every state)
// and always legal — the always-a-move / no-deadlock guarantee. Supports 1-player and 2-player
// hot-seat (shared board + deck, private hands, a handoff phase between turns).

export const cellId = (r: number, c: number): CellId => `${r},${c}`;
export const parseCell = (id: CellId): [number, number] => {
  const [r, c] = id.split(',').map(Number);
  return [r, c];
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(playerCount = 1, size = 5, handSize = 5): GameState {
  const ids = SEED_DECK.map((c) => c.id);
  const deck = shuffle([...ids, ...ids, ...ids]); // a few copies so the deck lasts
  const players: Player[] = Array.from({ length: Math.max(1, Math.min(2, playerCount)) }, (_, i) => ({
    id: i,
    name: `Player ${i + 1}`,
    hand: [],
    score: 0,
  }));
  let state: GameState = {
    size,
    beads: {},
    tiles: {},
    triads: [],
    deck,
    discard: [],
    players,
    active: 0,
    phase: 'play',
    handSize,
    log: ['The workspace is clear as the sun. Infuse a bead with a card, or apply a glyph. End your turn to draw.'],
  };
  // deal opening hands
  for (let i = 0; i < players.length; i++) state = refill(state, i);
  return state;
}

/** Refill player p's hand to handSize, reshuffling the discard if the deck runs dry. Never fails. */
function refill(state: GameState, p: number): GameState {
  const deck = state.deck.slice();
  let discard = state.discard.slice();
  const players = state.players.map((pl) => ({ ...pl, hand: pl.hand.slice() }));
  const hand = players[p].hand;
  while (hand.length < state.handSize) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      deck.push(...shuffle(discard));
      discard = [];
    }
    hand.push(deck.pop()!);
  }
  return { ...state, deck, discard, players };
}

const onBoard = (s: GameState, r: number, c: number) => r >= 0 && c >= 0 && r < s.size && c < s.size;
const isEmpty = (s: GameState, cell: CellId) => !s.beads[cell] && !s.tiles[cell];

export function emptyCount(s: GameState): number {
  let n = 0;
  for (let r = 0; r < s.size; r++) for (let c = 0; c < s.size; c++) if (isEmpty(s, cellId(r, c))) n++;
  return n;
}

/** Beads on opposite orthogonal sides of `cell` — the ends of a triad through it. */
export function triadEndsThrough(s: GameState, cell: CellId): Array<[CellId, CellId]> {
  const [r, c] = parseCell(cell);
  const pairs: Array<[CellId, CellId]> = [];
  const axes: Array<[[number, number], [number, number]]> = [
    [[r, c - 1], [r, c + 1]],
    [[r - 1, c], [r + 1, c]],
  ];
  for (const [[ar, ac], [br, bc]] of axes) {
    if (onBoard(s, ar, ac) && onBoard(s, br, bc)) {
      const a = cellId(ar, ac);
      const b = cellId(br, bc);
      if (s.beads[a] && s.beads[b]) pairs.push([a, b]);
    }
  }
  return pairs;
}

/** End the active player's turn: refill their hand, check for game end, hand off to the next. */
function endTurn(state: GameState, note: string): GameState {
  let s = refill(state, state.active);
  s = { ...s, log: [...s.log, note] };
  if (emptyCount(s) === 0) return { ...s, phase: 'over', log: [...s.log, 'The board is full. The Game concludes.'] };
  if (s.players.length === 1) return s; // solo: continue
  const next = (s.active + 1) % s.players.length;
  return { ...s, active: next, phase: 'handoff' };
}

export function applyMove(state: GameState, move: Move): GameState {
  if (state.phase === 'over') return state;

  switch (move.kind) {
    case 'infuse': {
      if (state.phase !== 'play') return state;
      const player = state.players[state.active];
      if (!player.hand.includes(move.cardId)) return state;
      if (!isEmpty(state, move.cell)) return state;
      const card = CARDS[move.cardId];
      if (!card) return state;
      const bead: Bead = { cell: move.cell, cardId: move.cardId, glyphIds: card.glyphs.slice(), owner: state.active };
      const players = state.players.map((pl, i) =>
        i === state.active ? { ...pl, hand: pl.hand.filter((id) => id !== move.cardId) } : pl,
      );
      return {
        ...state,
        beads: { ...state.beads, [move.cell]: bead },
        players,
        discard: [...state.discard, move.cardId],
        log: [...state.log, `${player.name} infused a bead with “${card.name}”.`],
      };
    }

    case 'applyGlyph': {
      if (state.phase !== 'play') return state;
      const bead = state.beads[move.cell];
      const glyph = GLYPHS[move.glyphId];
      if (!bead || !glyph || bead.glyphIds.includes(move.glyphId)) return state;
      return {
        ...state,
        beads: { ...state.beads, [move.cell]: { ...bead, glyphIds: [...bead.glyphIds, move.glyphId] } },
        log: [...state.log, `${state.players[state.active].name} applied ${glyph.glyph} to a bead.`],
      };
    }

    case 'layTile': {
      if (state.phase !== 'play') return state;
      const tile = TILES[move.tileId];
      if (!tile || !isEmpty(state, move.cell)) return state;
      const ends = triadEndsThrough(state, move.cell);
      if (ends.length === 0) return state;
      const tiles = { ...state.tiles, [move.cell]: { cell: move.cell, tileId: move.tileId, owner: state.active } };
      const triads = state.triads.slice();
      let gained = 0;
      const readouts: string[] = [];
      for (const [a, b] of ends) {
        const sc = scoreTriad(state.beads[a], state.beads[b]);
        gained += sc.points;
        triads.push({ id: `${a}|${move.cell}|${b}`, subject: a, tile: move.cell, object: b, by: state.active, points: sc.points });
        const na = CARDS[state.beads[a].cardId ?? '']?.name ?? 'a bead';
        const nb = CARDS[state.beads[b].cardId ?? '']?.name ?? 'a bead';
        readouts.push(`${na} ${tile.glyph} ${nb} — ${sc.labels.join(', ')} = ${sc.points}`);
      }
      const players = state.players.map((pl, i) => (i === state.active ? { ...pl, score: pl.score + gained } : pl));
      const readout = `${tile.operation}: ${readouts.join(' · ')}. +${gained} to ${state.players[state.active].name}.`;
      return {
        ...state,
        tiles,
        triads,
        players,
        lastReadout: readout,
        log: [...state.log, readout],
      };
    }

    case 'endTurn':
      if (state.phase !== 'play') return state;
      return endTurn(state, `${state.players[state.active].name} ends the turn; the hand is replenished.`);

    case 'ready':
      if (state.phase !== 'handoff') return state;
      return { ...state, phase: 'play' };

    case 'concludeGame':
      return { ...state, phase: 'over', log: [...state.log, 'The players conclude the Game.'] };
  }
}

/** Coarse legality summary + the always-a-move invariant. `endTurn` is always present in 'play'. */
export function legalMoveKinds(state: GameState): Move['kind'][] {
  if (state.phase === 'over') return [];
  if (state.phase === 'handoff') return ['ready'];
  const kinds: Move['kind'][] = ['endTurn', 'concludeGame'];
  const empties: CellId[] = [];
  for (let r = 0; r < state.size; r++)
    for (let c = 0; c < state.size; c++) if (isEmpty(state, cellId(r, c))) empties.push(cellId(r, c));
  if (state.players[state.active].hand.length > 0 && empties.length > 0) kinds.push('infuse');
  if (Object.keys(state.beads).length > 0) kinds.push('applyGlyph');
  if (empties.some((cell) => triadEndsThrough(state, cell).length > 0)) kinds.push('layTile');
  return kinds;
}

export function winner(state: GameState): Player | 'tie' | null {
  if (state.phase !== 'over' || state.players.length < 2) return null;
  const [a, b] = state.players;
  if (a.score === b.score) return 'tie';
  return a.score > b.score ? a : b;
}
