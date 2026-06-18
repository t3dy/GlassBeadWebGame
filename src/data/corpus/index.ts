import { loadCorpus, type CorpusIndex } from './loader';
import { corpusRelationEntries } from './observe';
import { entityToCard } from './derive';
import { registerCorpusRelations } from '../../engine/relations';
import { registerCorpusCards } from '../../engine/content';
import type { CardDef } from '../../engine/types';

// ACTIVATION — the single entry point that lights up the unified-ontology layer at runtime:
//   1. load the corpus (lazy, async; the game runs without it),
//   2. register its grounded relations so adjacent corpus beads surface real cited situations,
//   3. register a CURATED deck of corpus cards (entities that actually take part in relations, so the
//      library is connectable, not inert) into the content layer for drawing/searching.
// Returns a small summary for the UI; on failure it no-ops and the local-first game is unaffected.

export interface CorpusActivation {
  ok: boolean;
  entities: number;
  relations: number;
  cards: number;
}

/** Build the curated card set: connectable entities (figures/texts/concepts/emblems with relations). */
export function curatedCards(idx: CorpusIndex): CardDef[] {
  const cards: CardDef[] = [];
  for (const e of idx.corpus.entities) {
    if (!(idx.relsByEntity.get(e.uid)?.length)) continue; // only connectable entities
    const card = entityToCard(e);
    if (card) cards.push(card);
  }
  return cards;
}

let activated: CorpusActivation | null = null;

export async function activateCorpus(): Promise<CorpusActivation> {
  if (activated) return activated;
  const idx = await loadCorpus();
  if (!idx) {
    activated = { ok: false, entities: 0, relations: 0, cards: 0 };
    return activated;
  }
  const entries = corpusRelationEntries(idx);
  registerCorpusRelations(entries);
  const cards = curatedCards(idx);
  registerCorpusCards(cards);
  activated = { ok: true, entities: idx.corpus.entities.length, relations: entries.length, cards: cards.length };
  return activated;
}

export const corpusActivation = (): CorpusActivation | null => activated;

export { loadCorpus } from './loader';
export { observeBetween } from './observe';
export type { Entity, Relation, UnifiedCorpus } from './types';
