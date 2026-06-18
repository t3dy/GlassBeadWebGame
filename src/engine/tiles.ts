import type { TileDef } from './types';

// TILES — the process relations laid between two beads (subject → operation → object).
// A starter subset of the 12 zodiacal operations. Full set + the correspondence/scoring engine
// are BRACKETED — see docs/SYMBOL_SETS.md, docs/MECHANICS.md.

export const TILE_DEFS: TileDef[] = [
  { id: 'conjoins', glyph: '♋', operation: 'Conjunction', relation: 'alch:conjoins',
    gloss: 'X wedded to Y — the alchemical marriage', sourceRef: 'alchemical tradition' },
  { id: 'separates', glyph: '♊', operation: 'Separation', relation: 'alch:separates',
    gloss: 'X distinguished from Y', sourceRef: 'alchemical tradition' },
  { id: 'calcines', glyph: '♈', operation: 'Calcination', relation: 'alch:calcines',
    gloss: 'X reduced to its essence by Y', sourceRef: 'alchemical tradition' },
  { id: 'dissolves', glyph: '♉', operation: 'Dissolution', relation: 'alch:dissolves',
    gloss: 'X loosened / opened into Y', sourceRef: 'alchemical tradition' },
  { id: 'ferments', glyph: '♌', operation: 'Fermentation', relation: 'alch:ferments',
    gloss: 'X quickened by Y over time', sourceRef: 'alchemical tradition' },
  { id: 'distills', glyph: '♍', operation: 'Distillation', relation: 'alch:distills',
    gloss: 'the pure essence of X drawn through Y', sourceRef: 'alchemical tradition' },
  { id: 'coagulates', glyph: '♎', operation: 'Coagulation', relation: 'alch:coagulates',
    gloss: 'X brought into stable balance with Y', sourceRef: 'alchemical tradition' },
  { id: 'fixes', glyph: '♑', operation: 'Fixation', relation: 'alch:fixes',
    gloss: 'X made permanent by Y', sourceRef: 'alchemical tradition' },
];

export const TILES: Record<string, TileDef> = Object.fromEntries(TILE_DEFS.map((t) => [t.id, t]));
