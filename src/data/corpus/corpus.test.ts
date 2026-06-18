import { describe, it, expect } from 'vitest';
import { indexCorpus, relationsBetween } from './loader';
import { entityToCard, occupationForFigure, correspondencesOf } from './derive';
import { corpusRelationEntries, observeBetween } from './observe';
import type { UnifiedCorpus } from './types';
import { registerCorpusRelations, computeRelations } from '../../engine/relations';
import { registerCorpusCards as registerCards } from '../../engine/content';
import type { Bead, GameState } from '../../engine/types';

// A tiny grounded fixture: John Dee authored the Monas Hieroglyphica; both took part in an event.
const FIX: UnifiedCorpus = {
  entities: [
    { uid: 'renmagic:figure:dee', db: 'renmagic', type: 'figure', name: 'John Dee',
      summary: 'English mathematician and magus.', fields: { role_primary: 'MATHEMATICIAN', tradition: 'Hermeticism' },
      sourceRef: 'Renaissance Magic (RMDB)', portal: 'rmdb' },
    { uid: 'renmagic:text:monas', db: 'renmagic', type: 'text', name: 'Monas Hieroglyphica',
      summary: 'Dee’s 1564 hieroglyphic monad.', fields: { language: 'Latin' },
      sourceRef: 'Renaissance Magic (RMDB)', portal: 'rmdb' },
    { uid: 'renmagic:concept:monad', db: 'renmagic', type: 'concept', name: 'The Monad',
      summary: 'The unity behind all symbols.', fields: { operation_type: 'PUTREFACTION' },
      sourceRef: 'Renaissance Magic (RMDB)' },
  ],
  relations: [
    { uid: 'renmagic:authored:dee->monas', db: 'renmagic', subject: 'renmagic:figure:dee',
      predicate: 'authored', object: 'renmagic:text:monas', sourceRef: 'RMDB (figure_texts)' },
    { uid: 'renmagic:concerns:monas->monad', db: 'renmagic', subject: 'renmagic:text:monas',
      predicate: 'concerns', object: 'renmagic:concept:monad', sourceRef: 'RMDB' },
  ],
};

describe('unified corpus derivation', () => {
  it('derives an infusible card from a figure entity, carrying its name + provenance', () => {
    const card = entityToCard(FIX.entities[0])!;
    expect(card.cls).toBe('figure');
    expect(card.name).toBe('John Dee');
    expect(card.correspondences.entity).toBe('John Dee');
    expect(card.sourceRef).toContain('RMDB');
    expect(card.portal).toBe('rmdb');
  });

  it('maps a figure role_primary to a meeple occupation', () => {
    expect(occupationForFigure(FIX.entities[0])).toBe('scholar'); // MATHEMATICIAN → scholar
  });

  it('puts the alchemical operation into correspondences for relation matching', () => {
    expect(correspondencesOf(FIX.entities[2]).operation).toBe('Putrefaction');
  });
});

describe('relation observation', () => {
  const idx = indexCorpus(FIX);

  it('indexes relations between two entities (either direction)', () => {
    const rels = relationsBetween(idx, 'renmagic:figure:dee', 'renmagic:text:monas');
    expect(rels).toHaveLength(1);
    expect(rels[0].predicate).toBe('authored');
  });

  it('observeBetween returns a grounded, cited RelationEntry', () => {
    const obs = observeBetween(idx, 'John Dee', 'Monas Hieroglyphica');
    expect(obs).toHaveLength(1);
    expect(obs[0].title).toBe('Authorship');
    expect(obs[0].text).toContain('John Dee');
    expect(obs[0].text).toContain('figure_texts'); // the source is cited inline
  });

  it('adjacent corpus beads surface the real situation through the engine', () => {
    // wire the fixture into the live content + relation registries
    const cards = FIX.entities.map((e) => entityToCard(e)!).filter(Boolean);
    registerCards(cards);
    registerCorpusRelations(corpusRelationEntries(idx));

    const beads: Record<string, Bead> = {
      '0,0': { cell: '0,0', cardId: 'corpus:renmagic:figure:dee', glyphIds: [], owner: 0 },
      '0,1': { cell: '0,1', cardId: 'corpus:renmagic:text:monas', glyphIds: [], owner: 0 },
    };
    const rels = computeRelations({ beads } as GameState);
    const authored = rels.find((r) => r.title === 'Authorship');
    expect(authored).toBeDefined();
    expect(authored!.kind).toBe('corpus');
    expect(authored!.portal).toBe('rmdb');
  });
});
