import type { UnifiedCorpus, Entity, Relation } from './types';

// Lazy loader + indexes for the unified corpus. The corpus JSON (~3.4MB) is loaded on demand via a
// dynamic import so it never bloats the main bundle — the game runs fully without it (local-first).
// Indexes: by uid, by normalized name (for bead↔entity matching), and an adjacency map for relations.

export interface CorpusIndex {
  corpus: UnifiedCorpus;
  byUid: Map<string, Entity>;
  byName: Map<string, Entity[]>;            // normalized name -> entities (cross-db collisions kept)
  relsBetween: Map<string, Relation[]>;     // unordered uid-pair key -> relations
  relsByEntity: Map<string, Relation[]>;    // uid -> relations touching it
}

export const normName = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const pairKey = (a: string, b: string): string => (a < b ? `${a}::${b}` : `${b}::${a}`);

let cache: CorpusIndex | null = null;
let inflight: Promise<CorpusIndex> | null = null;

function buildIndex(corpus: UnifiedCorpus): CorpusIndex {
  const byUid = new Map<string, Entity>();
  const byName = new Map<string, Entity[]>();
  for (const e of corpus.entities) {
    byUid.set(e.uid, e);
    const k = normName(e.name);
    (byName.get(k) ?? byName.set(k, []).get(k)!).push(e);
  }
  const relsBetween = new Map<string, Relation[]>();
  const relsByEntity = new Map<string, Relation[]>();
  for (const r of corpus.relations) {
    const pk = pairKey(r.subject, r.object);
    (relsBetween.get(pk) ?? relsBetween.set(pk, []).get(pk)!).push(r);
    (relsByEntity.get(r.subject) ?? relsByEntity.set(r.subject, []).get(r.subject)!).push(r);
    (relsByEntity.get(r.object) ?? relsByEntity.set(r.object, []).get(r.object)!).push(r);
  }
  return { corpus, byUid, byName, relsBetween, relsByEntity };
}

/** Build an index from already-loaded data (used by tests / the ingester check). */
export function indexCorpus(corpus: UnifiedCorpus): CorpusIndex {
  return buildIndex(corpus);
}

/** Load the corpus once (dynamic import). Returns null on failure — the game keeps running. */
export async function loadCorpus(): Promise<CorpusIndex | null> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const mod = await import('./unified.corpus.json');
    cache = buildIndex((mod.default ?? mod) as UnifiedCorpus);
    return cache;
  })();
  try {
    return await inflight;
  } catch {
    inflight = null;
    return null;
  }
}

export const getLoadedCorpus = (): CorpusIndex | null => cache;

/** All relations directly between two entities (either direction). */
export function relationsBetween(idx: CorpusIndex, a: string, b: string): Relation[] {
  return idx.relsBetween.get(pairKey(a, b)) ?? [];
}
