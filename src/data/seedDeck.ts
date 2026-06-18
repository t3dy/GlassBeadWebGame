import type { CardDef } from '../engine/types';

// A small, hand-authored SEED DECK so the core is playable before the portal-ingestion pipeline
// exists (that — translating C:\Dev\wiki portal entries into cards — is BRACKETED; see
// docs/CARD_CORPUS.md). Every card carries a sourceRef per the Grounding Rule.

export const SEED_DECK: CardDef[] = [
  { id: 'gbg:bead', cls: 'concept', name: 'The Glass Bead', text: 'A token of insight; a unit of the Game, to be infused with significance.', glyphs: ['mercurius'], correspondences: { domain: 'the Game' }, sourceRef: 'Hesse, The Glass Bead Game' },
  { id: 'gbg:magister-ludi', cls: 'concept', name: 'Magister Ludi', text: 'The Master of the Game, who inscribes the play with a luminous golden stylus.', glyphs: ['sol'], correspondences: { domain: 'Castalia' }, sourceRef: 'Hesse, The Glass Bead Game' },
  { id: 'gbg:counterpoint', cls: 'concept', name: 'Counterpoint of Opposites', text: 'Take two hostile concepts and combine them into the purest possible synthesis.', glyphs: ['sol', 'luna'], correspondences: { technique: 'reconciliation' }, sourceRef: 'Hesse, The Glass Bead Game' },
  { id: 'gbg:fugue', cls: 'concept', name: 'The Bach Fugue', text: 'A theme stated, varied, and developed — ideas treated as music.', glyphs: ['air'], correspondences: { discipline: 'Music' }, sourceRef: 'Hesse, The Glass Bead Game' },
  { id: 'gbg:leibniz', cls: 'text', name: 'A Sentence of Leibniz', text: 'A philosophical proposition, linked across the gulf to music and the stars.', glyphs: ['mercurius'], correspondences: { discipline: 'Philosophy' }, sourceRef: 'Hesse, The Glass Bead Game' },
  { id: 'gbg:i-ching', cls: 'symbol', name: 'A Hexagram of the I Ching', text: 'A configuration of yin and yang; transformation read in changing lines.', glyphs: ['water'], correspondences: { discipline: 'Divination' }, sourceRef: 'Hesse, The Glass Bead Game' },

  { id: 'alch:rebis', cls: 'symbol', name: 'The Rebis', text: 'The two-headed hermaphrodite: Sol and Luna conjoined into one body.', glyphs: ['sol', 'luna', 'mercurius'], correspondences: { stage: 'rubedo', pole: 'union' }, sourceRef: 'alchemical tradition', portal: 'hermeticdb' },
  { id: 'alch:nigredo', cls: 'concept', name: 'Nigredo', text: 'The blackening — putrefaction, the necessary death before rebirth.', glyphs: ['saturn'], correspondences: { stage: 'nigredo', planet: 'Saturn' }, sourceRef: 'alchemical tradition', portal: 'hermeticdb' },
  { id: 'alch:albedo', cls: 'concept', name: 'Albedo', text: 'The whitening — washing and purification under the Moon.', glyphs: ['luna'], correspondences: { stage: 'albedo', planet: 'Moon' }, sourceRef: 'alchemical tradition', portal: 'hermeticdb' },
  { id: 'alch:green-lion', cls: 'symbol', name: 'The Green Lion', text: 'Vitriol that devours the Sun; the solvent that opens fixed matter.', glyphs: ['venus', 'water'], correspondences: { planet: 'Venus' }, sourceRef: 'alchemical tradition', portal: 'rmdb' },

  // Cards drawn from the live knowledge portals (each links to its site).
  { id: 'herm:emerald-tablet', cls: 'text', name: 'The Emerald Tablet', text: '“That which is below is like that which is above” — the Hermetic axiom of correspondence.', glyphs: ['mercurius', 'sol'], correspondences: { discipline: 'Hermetica' }, sourceRef: 'HermeticDB', portal: 'hermeticdb' },
  { id: 'rmdb:agrippa', cls: 'figure', name: 'Cornelius Agrippa', text: 'Renaissance magus of the Three Books of Occult Philosophy — natural, celestial, and ceremonial magic.', glyphs: ['jupiter'], correspondences: { discipline: 'Renaissance magic' }, sourceRef: 'Renaissance Magic DB', portal: 'rmdb' },
  { id: 'goetia:seal', cls: 'symbol', name: 'A Goetic Seal', text: 'One of the 72 spirit sigils — traced, on one hypothesis, as a path across a planetary kamea.', glyphs: ['saturn', 'mars'], correspondences: { discipline: 'Goetia' }, sourceRef: 'Goetia Sigil Analysis', portal: 'goetia' },
  { id: 'hp:poliphilo', cls: 'figure', name: 'Poliphilo', text: 'The dreamer of the Hypnerotomachia, wandering an allegorical landscape in search of Polia.', glyphs: ['venus'], correspondences: { discipline: 'dream-allegory' }, sourceRef: 'HPMarginalia', portal: 'hpmarginalia' },
  { id: 'pkd:valis', cls: 'concept', name: 'VALIS', text: 'Philip K. Dick’s Vast Active Living Intelligence System — the 2-3-74 gnosis.', glyphs: ['mercurius'], correspondences: { discipline: 'gnosis' }, sourceRef: 'QueryPat', portal: 'querypat' },
  { id: 'shx:dark-lady', cls: 'figure', name: 'The Dark Lady', text: 'The shadowed beloved of the 1609 Quarto — counterpoint to the Fair Youth.', glyphs: ['luna'], correspondences: { discipline: 'poetry', pole: 'luna' }, sourceRef: 'Shakespeare Sonnets', portal: 'shakesphyllis' },

  { id: 'raw:abraxas', cls: 'symbol', name: 'Abraxas', text: 'God and Satan in one; a power beyond good and evil — the goal of individuation.', glyphs: ['sol', 'saturn'], correspondences: { archetype: 'union of opposites' }, sourceRef: 'Hesse, Demian' },
  { id: 'leary:circuit', cls: 'concept', name: 'A Circuit of Consciousness', text: 'One of the eight stages of the nervous system, from bio-survival to the non-local.', glyphs: ['fire'], correspondences: { domain: 'eight-circuit model' }, sourceRef: 'Leary & Wilson, The Game of Life' },
  { id: 'raw:maybe', cls: 'concept', name: 'Maybe Logic', text: 'Hold every assertion with a maybe; no model is final, only resonant within a tunnel.', glyphs: ['mercurius'], correspondences: { stance: 'model-agnosticism' }, sourceRef: 'Robert Anton Wilson' },

  { id: 'hesse:flute', cls: 'concept', name: 'The Flute Dream', text: 'A song that expands the world; progress made audible.', glyphs: ['air'], correspondences: { tale: 'Flute Dream' }, sourceRef: 'Hesse, Flute Dream' },
];

export const CARDS: Record<string, CardDef> = Object.fromEntries(SEED_DECK.map((c) => [c.id, c]));
