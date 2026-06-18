import type { CardDef } from './types';

// GLYPH ATTRIBUTION — derive a card's glyph attributes from its correspondences, so the thousands of
// corpus cards become real game pieces (a bead that connects in the relation engine + shows a sigil),
// not glyph-less placeholders. Conservative & defensible: it maps only recognised alchemical/astral
// VALUES (operations, planet-metals, elements, principles, colour stages). Hand-authored cards keep
// their precise glyphs; this is the floor for everything else. The mapping is the canonical table in
// docs/CARD_STYLE_GUIDE.md — keep the two in sync.

const PROCESS: Record<string, string> = {
  // English
  calcination: 'aries', dissolution: 'taurus', separation: 'gemini', conjunction: 'cancer',
  fermentation: 'leo', distillation: 'virgo', coagulation: 'libra', congelation: 'libra',
  putrefaction: 'scorpio', exaltation: 'sagittarius', sublimation: 'sagittarius',
  fixation: 'capricorn', multiplication: 'aquarius', projection: 'pisces',
  // Latin variants (the corpus often records the operation in Latin)
  calcinatio: 'aries', dissolutio: 'taurus', separatio: 'gemini', coniunctio: 'cancer',
  fermentatio: 'leo', distillatio: 'virgo', coagulatio: 'libra', putrefactio: 'scorpio',
  sublimatio: 'sagittarius', fixatio: 'capricorn', multiplicatio: 'aquarius', proiectio: 'pisces',
};
const PLANET: Record<string, string> = {
  sun: 'sol', sol: 'sol', gold: 'sol', moon: 'luna', luna: 'luna', silver: 'luna',
  mercury: 'mercury', quicksilver: 'mercury', venus: 'venus', copper: 'venus',
  mars: 'mars', iron: 'mars', jupiter: 'jupiter', tin: 'jupiter', saturn: 'saturn', lead: 'saturn',
};
const ELEMENT: Record<string, string> = { fire: 'fire', water: 'water', air: 'air', earth: 'earth' };
const PRINCIPLE: Record<string, string> = { sulphur: 'sulphur', sulfur: 'sulphur', salt: 'salt' };
const STAGE: Record<string, string> = { nigredo: 'saturn', albedo: 'luna', citrinitas: 'sol', rubedo: 'sol' };
const DICTS = [PROCESS, PLANET, ELEMENT, PRINCIPLE, STAGE];

/** Glyph ids implied by a set of correspondences (the entity name is skipped to avoid false hits). */
export function attributeGlyphs(correspondences: Record<string, unknown>): string[] {
  const out = new Set<string>();
  for (const [key, raw] of Object.entries(correspondences)) {
    if (key === 'entity' || typeof raw !== 'string') continue; // skip the name field
    const v = raw.toLowerCase();
    for (const dict of DICTS) {
      if (dict[v]) { out.add(dict[v]); continue; }
      for (const k of Object.keys(dict)) if (new RegExp(`\\b${k}\\b`).test(v)) out.add(dict[k]);
    }
  }
  return [...out].slice(0, 4); // cap — a bead is a focus, not a soup
}

/** Fill a card's glyphs from its correspondences IF it has none (respects hand-authored attributions).
 *  For non-figure cards the NAME is also scanned (a concept named "Putrefactio" should self-tag);
 *  figures skip the name to avoid false hits from a person's name. */
export function enrichGlyphs(card: CardDef): CardDef {
  if (card.glyphs && card.glyphs.length) return card;
  const corr: Record<string, unknown> = { ...card.correspondences };
  if (card.cls !== 'figure') corr['_name'] = card.name; // self-tag concepts/places/texts/emblems
  const g = attributeGlyphs(corr);
  return g.length ? { ...card, glyphs: g } : card;
}
