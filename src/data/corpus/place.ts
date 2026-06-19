import type { CorpusIndex } from './loader';
import { normName } from './loader';
import { occupationForFigure } from './derive';
import type { Entity } from './types';

// PLACE / FIGURE / ROLE SELECTION (TICKET-002) — the data behind the user's headline scenario:
// "a meeple with the alchemist role on the Prague Castle tile → attach the John Dee card."
// Pure selectors over the corpus relation graph (no React, fully unit-testable). A figure reaches a place
// either DIRECTLY (figure --located_at--> place) or INDIRECTLY (figure --participated_in--> event
// --located_at--> place). Role-matching reuses occupationForFigure() so the meeple's occupation gates
// which historical figures are apt for that place.

/** Every location an entity is tied to — directly, or via an event it took part in. */
export function placesForEntity(idx: CorpusIndex, entityUid: string): Entity[] {
  const out = new Map<string, Entity>();
  const addLoc = (uid: string) => {
    const e = idx.byUid.get(uid);
    if (e?.type === 'location') out.set(e.uid, e);
  };
  for (const r of idx.relsByEntity.get(entityUid) ?? []) {
    if (r.subject !== entityUid) continue;
    if (r.predicate === 'located_at') {
      addLoc(r.object);
    } else if (r.predicate === 'participated_in') {
      // entity → event → location
      for (const r2 of idx.relsByEntity.get(r.object) ?? []) {
        if (r2.subject === r.object && r2.predicate === 'located_at') addLoc(r2.object);
      }
    }
  }
  return [...out.values()];
}

/** Figures tied to a named place (directly or via an event), filtered to those whose vocation matches
 *  the given meeple occupation id (e.g. 'alchemist'). The John-Dee-on-Prague-Castle resolver. */
export function figuresForPlaceAndRole(idx: CorpusIndex, placeName: string, occupationId: string): Entity[] {
  const locations = (idx.byName.get(normName(placeName)) ?? []).filter((e) => e.type === 'location');
  const figures = new Map<string, Entity>();
  const consider = (uid: string) => {
    const f = idx.byUid.get(uid);
    if (f?.type === 'figure' && occupationForFigure(f) === occupationId) figures.set(f.uid, f);
  };
  for (const loc of locations) {
    for (const r of idx.relsByEntity.get(loc.uid) ?? []) {
      if (r.object !== loc.uid || r.predicate !== 'located_at') continue;
      const subj = idx.byUid.get(r.subject);
      if (subj?.type === 'figure') {
        consider(subj.uid);                       // direct: figure --located_at--> place
      } else if (subj?.type === 'event') {
        // indirect: any figure who participated in this event at the place
        for (const r2 of idx.relsByEntity.get(subj.uid) ?? []) {
          if (r2.object === subj.uid && r2.predicate === 'participated_in') consider(r2.subject);
        }
      }
    }
  }
  return [...figures.values()];
}
