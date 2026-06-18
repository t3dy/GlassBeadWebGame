import type { Bead, CellId, GameState, Move, Player } from './types';
import { getCard, getGlyph, allCardIds } from './content';
import { OCC_MAP } from './occupations';
import { attributesOf, computeRelations } from './relations';

// Pure engine. Relations between adjacent beads are derived by the system after every move and
// scored to the active player. `endTurn` is TOTAL and always legal — the no-deadlock guarantee.

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
  const ids = allCardIds();
  const deck = shuffle([...ids, ...ids, ...ids]);
  const players: Player[] = Array.from({ length: Math.max(1, Math.min(2, playerCount)) }, (_, i) => ({
    id: i, name: `Player ${i + 1}`, hand: [], score: 0,
  }));
  let state: GameState = {
    size, beads: {}, meeples: {}, realized: [], lastRelations: [],
    deck, discard: [], players, active: 0, phase: 'play', handSize,
    log: ['The universe is clear as the sun. Infuse a bead with a card, then complicate it with glyphs. Place beads side by side and the system will read the relations between them.'],
  };
  for (let i = 0; i < players.length; i++) state = refill(state, i);
  return state;
}

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

const occupied = (s: GameState, cell: CellId) => !!s.beads[cell] || !!s.meeples[cell];

export function emptyCount(s: GameState): number {
  let n = 0;
  for (let r = 0; r < s.size; r++) for (let c = 0; c < s.size; c++) if (!occupied(s, cellId(r, c))) n++;
  return n;
}

/** Recompute relations; award the active player for any newly realized one; record the readout. */
function scoreNewRelations(state: GameState): GameState {
  const rels = computeRelations(state);
  const realized = new Set(state.realized);
  const fresh = rels.filter((r) => !realized.has(r.id));
  if (fresh.length === 0) return { ...state, lastRelations: [] };
  let gained = 0;
  const titles: string[] = [];
  const lines: string[] = [];
  for (const r of fresh) {
    realized.add(r.id);
    gained += r.points;
    titles.push(r.title);
    lines.push(`✦ ${r.title} (+${r.points}) — ${r.text}`);
  }
  const players = state.players.map((pl, i) => (i === state.active ? { ...pl, score: pl.score + gained } : pl));
  return {
    ...state,
    players,
    realized: [...realized],
    lastRelations: titles,
    log: [...state.log, ...lines, `+${gained} to ${state.players[state.active].name}.`],
  };
}

export function applyMove(state: GameState, move: Move): GameState {
  if (state.phase === 'over') return state;

  switch (move.kind) {
    case 'infuse': {
      if (state.phase !== 'play') return state;
      const player = state.players[state.active];
      if (!player.hand.includes(move.cardId) || occupied(state, move.cell)) return state;
      const card = getCard(move.cardId);
      if (!card) return state;
      const bead: Bead = { cell: move.cell, cardId: move.cardId, glyphIds: card.glyphs.slice(), owner: state.active };
      const players = state.players.map((pl, i) => (i === state.active ? { ...pl, hand: pl.hand.filter((id) => id !== move.cardId) } : pl));
      const next: GameState = {
        ...state,
        beads: { ...state.beads, [move.cell]: bead },
        players,
        discard: [...state.discard, move.cardId],
        log: [...state.log, `${player.name} infused a bead with “${card.name}”.`],
      };
      return scoreNewRelations(next);
    }

    case 'applyGlyph': {
      if (state.phase !== 'play') return state;
      const bead = state.beads[move.cell];
      const glyph = getGlyph(move.glyphId);
      if (!bead || !glyph || bead.glyphIds.includes(move.glyphId)) return state;
      const next: GameState = {
        ...state,
        beads: { ...state.beads, [move.cell]: { ...bead, glyphIds: [...bead.glyphIds, move.glyphId] } },
        log: [...state.log, `${state.players[state.active].name} complicated a bead with ${glyph.glyph} ${glyph.label}.`],
      };
      return scoreNewRelations(next);
    }

    case 'placeMeeple': {
      if (state.phase !== 'play') return state;
      const occ = OCC_MAP[move.occId];
      if (!occ || occupied(state, move.cell)) return state;
      // worker bonus: +1 per orthogonally-adjacent bead bearing the occupation's affinity
      const [r, c] = parseCell(move.cell);
      let bonus = 0;
      for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]] as Array<[number, number]>) {
        const b = state.beads[cellId(nr, nc)];
        if (b && attributesOf(b).has(occ.affinity)) bonus++;
      }
      const players = state.players.map((pl, i) => (i === state.active ? { ...pl, score: pl.score + bonus } : pl));
      return {
        ...state,
        meeples: { ...state.meeples, [move.cell]: { cell: move.cell, occId: move.occId, owner: state.active } },
        players,
        log: [...state.log, `${state.players[state.active].name} placed the ${occ.emoji} ${occ.name}${bonus ? ` (+${bonus} affinity)` : ''}.`],
      };
    }

    case 'endTurn': {
      if (state.phase !== 'play') return state;
      let s = refill(state, state.active);
      s = { ...s, log: [...s.log, `${state.players[state.active].name} ends the turn; the hand is replenished.`] };
      if (emptyCount(s) === 0) return { ...s, phase: 'over', log: [...s.log, 'The universe is full. The Game concludes.'] };
      if (s.players.length === 1) return s;
      return { ...s, active: (s.active + 1) % s.players.length, phase: 'handoff' };
    }

    case 'ready':
      return state.phase === 'handoff' ? { ...state, phase: 'play' } : state;

    case 'concludeGame':
      return { ...state, phase: 'over', log: [...state.log, 'The players conclude the Game.'] };
  }
}

export function legalMoveKinds(state: GameState): Move['kind'][] {
  if (state.phase === 'over') return [];
  if (state.phase === 'handoff') return ['ready'];
  const kinds: Move['kind'][] = ['endTurn', 'concludeGame'];
  const hasEmpty = emptyCount(state) > 0;
  if (state.players[state.active].hand.length > 0 && hasEmpty) kinds.push('infuse');
  if (Object.keys(state.beads).length > 0) kinds.push('applyGlyph');
  if (hasEmpty) kinds.push('placeMeeple');
  return kinds;
}

export function winner(state: GameState): Player | 'tie' | null {
  if (state.phase !== 'over' || state.players.length < 2) return null;
  const [a, b] = state.players;
  if (a.score === b.score) return 'tie';
  return a.score > b.score ? a : b;
}
