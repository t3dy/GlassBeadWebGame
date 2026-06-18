import type { RelationEntry } from '../../engine/relations';
import type { CorpusIndex } from './loader';
import type { Entity, Predicate, Relation } from './types';

// OBSERVATION — the "bead beside bead surfaces a real relationship" engine. A corpus Relation between
// two entities becomes a RelationEntry keyed on their NAMES; because entityToCard() puts each entity's
// name into its bead's correspondences, the existing relation matcher (engine/relations.ts) fires the
// grounded, cited situation whenever the two beads sit adjacent. Everything is sourced — no runtime
// invention. (Figure↔event / figure↔location situations belong to the meeple/roles layer, not bead
// adjacency, so we keep only relations whose BOTH endpoints are infusible card types.)

const CARD_TYPES = new Set<Entity['type']>(['figure', 'text', 'concept', 'emblem']);

interface Template { title: string; verb: (a: string, b: string) => string; points: number; }

const TEMPLATES: Record<Predicate, Template> = {
  authored:    { title: 'Authorship',  verb: (a, b) => `${a} is the author of ${b}.`, points: 3 },
  influenced:  { title: 'Influence',   verb: (a, b) => `${a} shaped the thought of ${b}.`, points: 3 },
  depicts:     { title: 'Depiction',   verb: (a, b) => `${a} gives figure to ${b}.`, points: 2 },
  concerns:    { title: 'Concern',     verb: (a, b) => `${a} takes up the matter of ${b}.`, points: 2 },
  cites:       { title: 'Citation',    verb: (a, b) => `${a} draws upon ${b}.`, points: 2 },
  related_to:  { title: 'Affinity',    verb: (a, b) => `${a} and ${b} are bound in one tradition.`, points: 1 },
  participated_in: { title: 'Shared Event', verb: (a, b) => `${a} took part in ${b}.`, points: 2 },
  located_at:  { title: 'Place',       verb: (a, b) => `${a} is sited at ${b}.`, points: 1 },
  belongs_to_tradition: { title: 'Lineage', verb: (a, b) => `${a} stands in the lineage of ${b}.`, points: 1 },
};

const PORTAL_OF: Record<string, string | undefined> = { renmagic: 'rmdb' };

function toEntry(idx: CorpusIndex, r: Relation): RelationEntry | null {
  const A = idx.byUid.get(r.subject);
  const B = idx.byUid.get(r.object);
  if (!A || !B) return null;
  if (!CARD_TYPES.has(A.type) || !CARD_TYPES.has(B.type)) return null;
  if (A.name === B.name) return null;
  const t = TEMPLATES[r.predicate] ?? TEMPLATES.related_to;
  return {
    id: `corpus:${r.uid}`,
    a: A.name,
    b: B.name,
    title: t.title,
    text: `${t.verb(A.name, B.name)} (${r.sourceRef})`,
    points: t.points,
    sourceRef: r.sourceRef,
    portal: A.portal ?? B.portal ?? PORTAL_OF[r.db] ?? undefined,
  };
}

/** Every corpus relation whose endpoints are both infusible, as RelationEntry rows for the engine. */
export function corpusRelationEntries(idx: CorpusIndex): RelationEntry[] {
  const out: RelationEntry[] = [];
  for (const r of idx.corpus.relations) {
    const e = toEntry(idx, r);
    if (e) out.push(e);
  }
  return out;
}

/** On-demand: the grounded situations between two named beads (either direction). */
export function observeBetween(idx: CorpusIndex, nameA: string, nameB: string): RelationEntry[] {
  const as = idx.byName.get(nameA.toLowerCase().replace(/[^a-z0-9]/g, '')) ?? [];
  const bs = idx.byName.get(nameB.toLowerCase().replace(/[^a-z0-9]/g, '')) ?? [];
  const out: RelationEntry[] = [];
  const seen = new Set<string>();
  for (const a of as) for (const b of bs) {
    for (const r of idx.relsByEntity.get(a.uid) ?? []) {
      if (r.subject !== b.uid && r.object !== b.uid) continue;
      const e = toEntry(idx, r);
      if (e && !seen.has(e.id)) { seen.add(e.id); out.push(e); }
    }
  }
  return out;
}
