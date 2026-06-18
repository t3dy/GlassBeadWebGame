// The unified-ontology TS model — mirrors the JSON emitted by tools/ingest/build_corpus.py
// (see docs/UNIFIED_ONTOLOGY.md). Read-only at runtime; the corpus is a static knowledge layer.

export type SourceDb = 'alchemy' | 'medieval' | 'renmagic' | 'theosophical' | '_cross';
export type EntityType = 'figure' | 'text' | 'concept' | 'event' | 'location' | 'emblem';
export type Predicate =
  | 'authored' | 'participated_in' | 'cites' | 'concerns'
  | 'influenced' | 'belongs_to_tradition' | 'located_at' | 'related_to' | 'depicts';

export interface Entity {
  uid: string;
  db: SourceDb;
  type: EntityType;
  name: string;
  slug?: string | null;
  summary?: string | null;
  era?: string | null;
  dateStart?: number | null;
  dateEnd?: number | null;
  lat?: number | null;
  lng?: number | null;
  fields: Record<string, unknown>;
  sourceMethod?: string | null;
  reviewStatus?: string | null;
  confidence?: number | null;
  sourceRef: string;
  portal?: string | null;
}

export interface Relation {
  uid: string;
  db: SourceDb;
  subject: string; // Entity.uid
  predicate: Predicate;
  object: string;  // Entity.uid
  confidence?: number | null;
  sourceRef: string;
}

export interface UnifiedCorpus {
  entities: Entity[];
  relations: Relation[];
}
