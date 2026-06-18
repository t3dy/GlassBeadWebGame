import type { CardDef } from '../../engine/types';
import type { Entity } from './types';

// DERIVATION — turn unified-ontology entities into game assets, grounded in their source records.
// Entity → CardDef (infusible). Attributes land in `correspondences` (NOT glyph ids) so the existing
// relation engine matches on them; the entity's own name is added as a correspondence so corpus
// relations (observe.ts) can fire when two such beads sit adjacent. role_primary → meeple occupation.

const CARD_TYPES: Record<string, CardDef['cls']> = {
  figure: 'figure', text: 'text', concept: 'concept', emblem: 'symbol',
};

const titleCase = (s: string): string =>
  s.toLowerCase().replace(/(^|[\s_-])([a-z])/g, (_, p, c) => p.replace('_', ' ') + c.toUpperCase()).trim();

// figure role_primary → an existing meeple occupation id (occupations.ts). Grounded by vocation.
export const ROLE_TO_OCCUPATION: Record<string, string> = {
  ALCHEMIST: 'alchemist', CHEMIST: 'alchemist', PHILOSOPHER: 'philosopher',
  CLERICAL: 'cleric', PHYSICIAN: 'physician', MATHEMATICIAN: 'scholar',
  SCHOLAR: 'scholar', TRANSLATOR: 'scholar', POET: 'artisan', ASTROLOGER: 'astrologer',
};

const F = (e: Entity, k: string): string | undefined => {
  const v = e.fields[k];
  return typeof v === 'string' && v ? v : undefined;
};

/** The correspondences a corpus card carries (drives relation matching + the inspector). */
export function correspondencesOf(e: Entity): Record<string, string> {
  const c: Record<string, string> = { entity: e.name };
  const op = F(e, 'operation_type');
  if (op) c.operation = titleCase(op);
  const trad = F(e, 'tradition') ?? F(e, 'primary_tradition');
  if (trad) c.tradition = titleCase(trad);
  const role = F(e, 'role_primary');
  if (role) c.vocation = titleCase(role);
  const cat = F(e, 'category') ?? F(e, 'category_type');
  if (cat) c.category = titleCase(cat);
  if (e.era) c.era = titleCase(String(e.era));
  return c;
}

/** Entity → infusible card (figure/text/concept/emblem only; events & locations are not cards). */
export function entityToCard(e: Entity): CardDef | null {
  const cls = CARD_TYPES[e.type];
  if (!cls) return null;
  const text = e.summary?.trim() ||
    `${e.name} — drawn from the ${e.sourceRef}. (Awaiting a sourced gloss.)`;
  return {
    id: `corpus:${e.uid}`,
    cls,
    name: e.name,
    text,
    glyphs: [],
    correspondences: correspondencesOf(e),
    sourceRef: e.sourceRef,
    portal: e.portal ?? undefined,
  };
}

export const cardIdForEntity = (uid: string): string => `corpus:${uid}`;
export const entityUidForCard = (cardId: string): string | null =>
  cardId.startsWith('corpus:') ? cardId.slice('corpus:'.length) : null;

/** The meeple occupation a figure entity is suited to (or undefined). */
export function occupationForFigure(e: Entity): string | undefined {
  if (e.type !== 'figure') return undefined;
  const role = F(e, 'role_primary');
  return role ? ROLE_TO_OCCUPATION[role.toUpperCase()] : undefined;
}
