import { describe, it, expect } from 'vitest';
import { indexCorpus } from './loader';
import { placesForEntity, figuresForPlaceAndRole } from './place';
import type { UnifiedCorpus } from './types';

// TDD (TICKET-002): the John-Dee-on-Prague-Castle selector, written test-first.
// Fixture: John Dee (an alchemist) participated in an event at Prague Castle; Edward Kelley (alchemist)
// is also tied to the place; Ficino (a philosopher) is tied elsewhere and must NOT match the role filter.
const FIX: UnifiedCorpus = {
  entities: [
    { uid: 'renmagic:figure:dee', db: 'renmagic', type: 'figure', name: 'John Dee',
      summary: 'English magus.', fields: { role_primary: 'ALCHEMIST' }, sourceRef: 'RMDB', portal: 'rmdb' },
    { uid: 'renmagic:figure:kelley', db: 'renmagic', type: 'figure', name: 'Edward Kelley',
      summary: 'Dee’s scryer.', fields: { role_primary: 'ALCHEMIST' }, sourceRef: 'RMDB' },
    { uid: 'renmagic:figure:ficino', db: 'renmagic', type: 'figure', name: 'Marsilio Ficino',
      summary: 'Florentine Platonist.', fields: { role_primary: 'PHILOSOPHER' }, sourceRef: 'RMDB' },
    { uid: 'renmagic:location:prague', db: 'renmagic', type: 'location', name: 'Prague Castle',
      summary: 'Seat of Rudolf II.', fields: {}, sourceRef: 'RMDB' },
    { uid: 'renmagic:location:florence', db: 'renmagic', type: 'location', name: 'Florence',
      summary: 'Medici city.', fields: {}, sourceRef: 'RMDB' },
    { uid: 'renmagic:event:dee-prague', db: 'renmagic', type: 'event', name: 'Dee & Kelley at the court of Rudolf II',
      summary: 'The Bohemian sojourn, 1584.', fields: {}, sourceRef: 'RMDB' },
  ],
  relations: [
    // Dee reaches Prague via an event located there (the indirect path)
    { uid: 'r1', db: 'renmagic', subject: 'renmagic:figure:dee', predicate: 'participated_in', object: 'renmagic:event:dee-prague', sourceRef: 'RMDB' },
    { uid: 'r2', db: 'renmagic', subject: 'renmagic:event:dee-prague', predicate: 'located_at', object: 'renmagic:location:prague', sourceRef: 'RMDB' },
    // Kelley reaches Prague directly
    { uid: 'r3', db: 'renmagic', subject: 'renmagic:figure:kelley', predicate: 'located_at', object: 'renmagic:location:prague', sourceRef: 'RMDB' },
    // Ficino is tied to Florence, not Prague
    { uid: 'r4', db: 'renmagic', subject: 'renmagic:figure:ficino', predicate: 'located_at', object: 'renmagic:location:florence', sourceRef: 'RMDB' },
  ],
};

const idx = indexCorpus(FIX);

describe('place / figure / role selection (TICKET-002)', () => {
  it('placesForEntity finds a figure’s place directly and via an event', () => {
    const deePlaces = placesForEntity(idx, 'renmagic:figure:dee').map((p) => p.name);
    expect(deePlaces).toContain('Prague Castle'); // indirect: Dee → event → Prague
    const kelleyPlaces = placesForEntity(idx, 'renmagic:figure:kelley').map((p) => p.name);
    expect(kelleyPlaces).toContain('Prague Castle'); // direct
  });

  it('figuresForPlaceAndRole returns the alchemists at Prague Castle (not the philosopher elsewhere)', () => {
    const names = figuresForPlaceAndRole(idx, 'Prague Castle', 'alchemist').map((f) => f.name).sort();
    expect(names).toEqual(['Edward Kelley', 'John Dee']);
  });

  it('role filter excludes figures whose vocation does not match the meeple occupation', () => {
    // A scholar meeple on Prague Castle finds no one (Dee/Kelley are alchemists here)
    expect(figuresForPlaceAndRole(idx, 'Prague Castle', 'scholar')).toHaveLength(0);
    // Ficino is a philosopher but he is tied to Florence, not Prague
    expect(figuresForPlaceAndRole(idx, 'Prague Castle', 'philosopher')).toHaveLength(0);
  });
});
