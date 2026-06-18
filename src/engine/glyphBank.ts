import type { Glyph } from './types';

// THE GLYPH BANK — always-available palette. Applying a glyph to a bead is always a legal move
// (a floor beside Meditate). Grounded in the alchemical tradition. Optional gated/extended sets
// (Unicode alchemical block, geomantic figures, kameas) are BRACKETED — see docs/SYMBOL_SETS.md.

export const GLYPH_BANK: Glyph[] = [
  // Planet–metals (the charged, opposable beads-vocabulary)
  { id: 'sol', glyph: '☉', label: 'Sol / Gold — perfection, the goal', set: 'metals',
    correspondences: { planet: 'Sun', element: 'Fire', pole: 'sol' }, sourceRef: 'alchemical tradition' },
  { id: 'luna', glyph: '☽', label: 'Luna / Silver — reflection, the feminine', set: 'metals',
    correspondences: { planet: 'Moon', element: 'Water', pole: 'luna' }, sourceRef: 'alchemical tradition' },
  { id: 'mercurius', glyph: '☿', label: 'Mercurius — mediation, the messenger', set: 'metals',
    correspondences: { planet: 'Mercury', element: 'Air' }, sourceRef: 'alchemical tradition' },
  { id: 'venus', glyph: '♀', label: 'Venus / Copper — love, union', set: 'metals',
    correspondences: { planet: 'Venus', element: 'Earth' }, sourceRef: 'alchemical tradition' },
  { id: 'mars', glyph: '♂', label: 'Mars / Iron — force, severance', set: 'metals',
    correspondences: { planet: 'Mars', element: 'Fire' }, sourceRef: 'alchemical tradition' },
  { id: 'jupiter', glyph: '♃', label: 'Jupiter / Tin — expansion, fortune', set: 'metals',
    correspondences: { planet: 'Jupiter', element: 'Air' }, sourceRef: 'alchemical tradition' },
  { id: 'saturn', glyph: '♄', label: 'Saturn / Lead — limitation, the nigredo', set: 'metals',
    correspondences: { planet: 'Saturn', element: 'Earth' }, sourceRef: 'alchemical tradition' },
  // Elements (prima materia) — element triangles
  { id: 'fire', glyph: '🜂', label: 'Fire — transformation, ascent', set: 'elements',
    correspondences: { element: 'Fire' }, sourceRef: 'alchemical tradition' },
  { id: 'water', glyph: '🜄', label: 'Water — dissolution, flow', set: 'elements',
    correspondences: { element: 'Water' }, sourceRef: 'alchemical tradition' },
  { id: 'air', glyph: '🜁', label: 'Air — dispersion, mediation', set: 'elements',
    correspondences: { element: 'Air' }, sourceRef: 'alchemical tradition' },
  { id: 'earth', glyph: '🜃', label: 'Earth — fixation, the vessel', set: 'elements',
    correspondences: { element: 'Earth' }, sourceRef: 'alchemical tradition' },
  // Tria prima (principles)
  { id: 'sulphur', glyph: '🜍', label: 'Sulphur — soul, the volatile', set: 'principles',
    correspondences: { principle: 'Sulphur' }, sourceRef: 'Paracelsian tria prima' },
  { id: 'salt', glyph: '🜔', label: 'Salt — body, the fixed', set: 'principles',
    correspondences: { principle: 'Salt' }, sourceRef: 'Paracelsian tria prima' },
];

export const GLYPHS: Record<string, Glyph> = Object.fromEntries(GLYPH_BANK.map((g) => [g.id, g]));
