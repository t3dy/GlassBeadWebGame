import type { Glyph, GlyphCategory } from './types';

// THE GLYPH BANKS — glyphs are now ATTRIBUTES applied to beads (drag onto a bead to complicate a
// board state). Four banks: Planets & Metals, the Zodiac (alchemical processes), the Three
// Principles, the Four Elements. Each glyph reads into the shared info panel (alchemy meaning +
// in-game use). Relations between adjacent beads are then derived programmatically from these
// attributes (see relations.ts). Mercury appears twice — the planet-metal ☿ and the principle ☤
// (caduceus) — distinguished by glyph and by panel text.

export const PLANETS: Glyph[] = [
  { id: 'sol', glyph: '☉', label: 'Sol · Gold', category: 'planet', correspondences: { planet: 'Sun', metal: 'Gold', pole: 'sol' },
    meaning: 'The Sun and its metal gold — perfection, the goal of the Great Work, the radiant masculine principle.',
    gameUse: 'A solar attribute. Beside Luna it invites the coniunctio; beside Saturn, the lead-to-gold extremes.', sourceRef: 'alchemical tradition' },
  { id: 'luna', glyph: '☽', label: 'Luna · Silver', category: 'planet', correspondences: { planet: 'Moon', metal: 'Silver', pole: 'luna' },
    meaning: 'The Moon and silver — reflection, the receptive feminine principle, the albedo (whitening).',
    gameUse: 'A lunar attribute. Sol + Luna is the alchemical wedding; Saturn + Luna deepens melancholy.', sourceRef: 'alchemical tradition' },
  { id: 'mercury', glyph: '☿', label: 'Mercury · Quicksilver', category: 'planet', correspondences: { planet: 'Mercury', metal: 'Quicksilver' },
    meaning: 'The planet Mercury and the metal quicksilver — the volatile mediator, the messenger between extremes.',
    gameUse: 'A mercurial attribute (the metal). Distinct from the principle Mercury ☤. Bridges unlike beads.', sourceRef: 'alchemical tradition' },
  { id: 'venus', glyph: '♀', label: 'Venus · Copper', category: 'planet', correspondences: { planet: 'Venus', metal: 'Copper' },
    meaning: 'Venus and copper — love, concord, generation; with Jupiter, a benefic against Saturnine gloom.',
    gameUse: 'A venusian attribute. Beside Jupiter, Ficino’s remedy for melancholy; beside Mars, strife-and-concord.', sourceRef: 'alchemical tradition' },
  { id: 'mars', glyph: '♂', label: 'Mars · Iron', category: 'planet', correspondences: { planet: 'Mars', metal: 'Iron' },
    meaning: 'Mars and iron — force, severance, the heat of dissolution; the martial, choleric principle.',
    gameUse: 'A martial attribute. Beside Venus, the lovers’ discord; a severing, energetic neighbor.', sourceRef: 'alchemical tradition' },
  { id: 'jupiter', glyph: '♃', label: 'Jupiter · Tin', category: 'planet', correspondences: { planet: 'Jupiter', metal: 'Tin' },
    meaning: 'Jupiter and tin — expansion, fortune, benevolence; the greater benefic.',
    gameUse: 'A jovial attribute. The benefic pairings (Venus, Sun) brighten a board state.', sourceRef: 'alchemical tradition' },
  { id: 'saturn', glyph: '♄', label: 'Saturn · Lead', category: 'planet', correspondences: { planet: 'Saturn', metal: 'Lead' },
    meaning: 'Saturn and lead — limitation, time, death, the nigredo; the cold, dry, melancholic principle.',
    gameUse: 'A saturnine attribute. Beside Sol, lead-to-gold; beside the benefics, the melancholy to be remedied.', sourceRef: 'alchemical tradition' },
];

const Z = (id: string, glyph: string, sign: string, process: string, meaning: string): Glyph => ({
  id, glyph, label: `${sign} · ${process}`, category: 'zodiac', correspondences: { sign, process },
  meaning, gameUse: `A process attribute (${process}). Shapes how a bead transforms its neighbours.`, sourceRef: 'alchemical tradition',
});

export const ZODIAC: Glyph[] = [
  Z('aries', '♈', 'Aries', 'Calcination', 'The first operation: burning to dry ash, reducing a thing to its essence.'),
  Z('taurus', '♉', 'Taurus', 'Dissolution', 'Loosening the calcined matter in water; opening what was fixed.'),
  Z('gemini', '♊', 'Gemini', 'Separation', 'Dividing the dissolved into its parts; discerning essence from accident.'),
  Z('cancer', '♋', 'Cancer', 'Conjunction', 'The marriage — recombining the separated into a new, purer body.'),
  Z('leo', '♌', 'Leo', 'Fermentation', 'Quickening the matter with new life, as a ferment leavens.'),
  Z('virgo', '♍', 'Virgo', 'Distillation', 'Raising and recondensing the subtle essence, purifying it.'),
  Z('libra', '♎', 'Libra', 'Coagulation', 'Bringing the purified essence into a stable, balanced body.'),
  Z('scorpio', '♏', 'Scorpio', 'Putrefaction', 'The blackening death and decay that must precede rebirth.'),
  Z('sagittarius', '♐', 'Sagittarius', 'Exaltation', 'The rising of the spirit; the second, ascending ferment.'),
  Z('capricorn', '♑', 'Capricorn', 'Fixation', 'Making the volatile permanent; binding what would escape.'),
  Z('aquarius', '♒', 'Aquarius', 'Multiplication', 'Amplifying the Stone’s power, the work repeated and increased.'),
  Z('pisces', '♓', 'Pisces', 'Projection', 'The completion — casting the Stone upon base matter to transmute it.'),
];

export const PRINCIPLES: Glyph[] = [
  { id: 'sulphur', glyph: '🜍', label: 'Sulphur', category: 'principle', correspondences: { principle: 'Sulphur' },
    meaning: 'The soul of metals — the combustible, fiery, active principle; the capacity to transform.',
    gameUse: 'A principle attribute. With Mercury (the spirit) it forms the alchemical parents.', sourceRef: 'Paracelsian tria prima' },
  { id: 'salt', glyph: '🜔', label: 'Salt', category: 'principle', correspondences: { principle: 'Salt' },
    meaning: 'The body — the fixed, crystalline, enduring principle; the vessel in which sulphur burns.',
    gameUse: 'A principle attribute. Grounds and fixes a volatile board state.', sourceRef: 'Paracelsian tria prima' },
  { id: 'mercury-spirit', glyph: '☤', label: 'Mercury · the Spirit', category: 'principle', correspondences: { principle: 'Mercury' },
    meaning: 'The spirit — the mediating principle (the caduceus of Hermes), neither fixed nor combustible. Distinct from the planet-metal Mercury ☿.',
    gameUse: 'A principle attribute. Mediates Sulphur and Salt; the agent of every conjunction.', sourceRef: 'Paracelsian tria prima' },
];

export const ELEMENTS: Glyph[] = [
  { id: 'fire', glyph: '🜂', label: 'Fire', category: 'element', correspondences: { element: 'Fire' },
    meaning: 'Hot and dry — transformation, ascent, the consuming and purifying element.',
    gameUse: 'An elemental attribute. Beside Water, the tension of contraries.', sourceRef: 'classical elements' },
  { id: 'water', glyph: '🜄', label: 'Water', category: 'element', correspondences: { element: 'Water' },
    meaning: 'Cold and moist — dissolution, flow, the solvent and reflective element.',
    gameUse: 'An elemental attribute. Beside Fire, contraries; the universal solvent.', sourceRef: 'classical elements' },
  { id: 'air', glyph: '🜁', label: 'Air', category: 'element', correspondences: { element: 'Air' },
    meaning: 'Hot and moist — dispersion, mediation, the volatile carrier of essences.',
    gameUse: 'An elemental attribute. Beside Earth, contraries; lightens and disperses.', sourceRef: 'classical elements' },
  { id: 'earth', glyph: '🜃', label: 'Earth', category: 'element', correspondences: { element: 'Earth' },
    meaning: 'Cold and dry — fixation, stability, the body and vessel of the work.',
    gameUse: 'An elemental attribute. Beside Air, contraries; grounds and contains.', sourceRef: 'classical elements' },
];

export interface GlyphBankDef { id: GlyphCategory; title: string; glyphs: Glyph[] }
export const BANKS: GlyphBankDef[] = [
  { id: 'planet', title: 'Planets & Metals', glyphs: PLANETS },
  { id: 'zodiac', title: 'Zodiac · Processes', glyphs: ZODIAC },
  { id: 'principle', title: 'The Three Principles', glyphs: PRINCIPLES },
  { id: 'element', title: 'The Four Elements', glyphs: ELEMENTS },
];

export const ALL_GLYPHS: Glyph[] = BANKS.flatMap((b) => b.glyphs);
export const GLYPHS: Record<string, Glyph> = Object.fromEntries(ALL_GLYPHS.map((g) => [g.id, g]));
