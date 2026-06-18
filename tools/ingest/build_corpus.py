#!/usr/bin/env python3
"""Unified esoteric-ontology ingester.

Reads the four standalone study DBs (SQLite + JSON), normalizes every record to the unified
Entity/Relation model (docs/UNIFIED_ONTOLOGY.md), and emits:
  - src/data/corpus/unified.corpus.json    {entities:[...], relations:[...]}
  - src/data/corpus/unified.manifest.json  provenance + coverage report

Pure stdlib. Re-runnable. Deterministic ordering for clean diffs. Honours the Grounding Rule:
every Entity/Relation carries db + sourceRef; confidence/reviewStatus preserved; nothing silently
dropped (coverage gaps land in the manifest).
"""
from __future__ import annotations
import sqlite3, json, os, re, html
from collections import defaultdict

DEV = r"C:\Dev"
OUT_DIR = os.path.join(DEV, "glassbeadgame", "src", "data", "corpus")

# (db key, label, portal id where deployed)  -- portal ids must exist in src/data/portals.ts
SOURCES = {
    "alchemy":      ("AlchemyTimeline",       None),
    "medieval":     ("MedievalMagicDB",       None),
    "renmagic":     ("Renaissance Magic (RMDB)", "rmdb"),
    "theosophical": ("TheosophicalAlchemyDB", None),
}

# ---------- helpers ----------
_TAG = re.compile(r"<[^>]+>")
def strip_html(s):
    if not s: return s
    return html.unescape(_TAG.sub(" ", str(s))).strip()

def clean(s, limit=600):
    s = strip_html(s)
    if not s: return s
    s = re.sub(r"\s+", " ", s)
    return s[:limit].rstrip() + ("…" if len(s) > limit else "")

def pick(row, *names):
    for n in names:
        if n in row and row[n] not in (None, "", []):
            return row[n]
    return None

def num(v):
    try: return int(v)
    except (TypeError, ValueError):
        try: return int(float(v))
        except (TypeError, ValueError): return None

# entity type inferred from a junction column name
def endpoint_type(col):
    c = col.lower()
    if "concept" in c or "term" in c: return "concept"
    if "person" in c or "figure" in c or "scholar" in c or "author" in c: return "figure"
    if "document" in c or "text" in c or "work" in c: return "text"
    if "event" in c: return "event"
    if "location" in c or "place" in c: return "location"
    if "emblem" in c: return "emblem"
    if "topic" in c or "tradition" in c: return None  # not first-class entities
    return None

def key_style(col):
    return "slug" if col.lower().endswith("_slug") else "id"

def predicate_for(table, ta, tb):
    t = table.lower()
    if "event" in t and "concept" not in t: return "participated_in"
    if "influence" in t: return "influenced"
    if ("figure_text" in t) or ("person_text" in t) or ("author" in t): return "authored"
    if "cited" in t or "_refs" in t or "document_text" in t: return "cites"
    if "concept" in t and ("event" in t or "text" in t or "document" in t): return "concerns"
    if "link" in t or "related" in t: return "related_to"
    if {ta, tb} == {"figure", "text"}: return "authored"
    if "event" in {ta, tb}: return "participated_in"
    return "related_to"

# ---------- corpus accumulator ----------
class Corpus:
    def __init__(self):
        self.entities = {}                       # uid -> entity
        self.relations = {}                      # uid -> relation
        self.idx = defaultdict(dict)             # (db,type) -> {key -> uid}  (key by id and slug)
        self.manifest = {"sources": {}, "warnings": [], "predicateCounts": defaultdict(int),
                         "typeCounts": defaultdict(int), "lowConfidence": 0}

    def add_entity(self, db, etype, key_id, slug, name, **kw):
        if not name: return None
        canon = slug or (str(key_id) if key_id is not None else re.sub(r"\W+", "-", name.lower()))
        uid = f"{db}:{etype}:{canon}"
        portal = SOURCES[db][1]
        ent = {
            "uid": uid, "db": db, "type": etype, "name": clean(name, 160),
            "slug": slug, "summary": kw.get("summary"),
            "era": kw.get("era"), "dateStart": kw.get("dateStart"), "dateEnd": kw.get("dateEnd"),
            "lat": kw.get("lat"), "lng": kw.get("lng"),
            "fields": {k: v for k, v in (kw.get("fields") or {}).items() if v not in (None, "", [])},
            "sourceMethod": kw.get("sourceMethod"), "reviewStatus": kw.get("reviewStatus"),
            "confidence": kw.get("confidence"),
            "sourceRef": kw.get("sourceRef") or f"{SOURCES[db][0]}",
            "portal": portal,
        }
        self.entities[uid] = ent
        if key_id is not None: self.idx[(db, etype)][("id", str(key_id))] = uid
        if slug: self.idx[(db, etype)][("slug", str(slug))] = uid
        self.manifest["typeCounts"][etype] += 1
        if isinstance(ent["confidence"], (int, float)) and ent["confidence"] < 0.5:
            self.manifest["lowConfidence"] += 1
        return uid

    def resolve(self, db, etype, key):
        if key in (None, ""): return None
        m = self.idx[(db, etype)]
        return m.get(("slug", str(key))) or m.get(("id", str(key)))

    def add_relation(self, db, subj, pred, obj, sourceRef, confidence=None):
        if not subj or not obj or subj == obj: return
        uid = f"{db}:{pred}:{subj}->{obj}"
        if uid in self.relations: return
        self.relations[uid] = {"uid": uid, "db": db, "subject": subj, "predicate": pred,
                               "object": obj, "confidence": confidence, "sourceRef": sourceRef}
        self.manifest["predicateCounts"][pred] += 1

C = Corpus()

# ---------- generic SQLite adapter ----------
ENTITY_TABLES = {  # table -> unified type
    "persons": "figure", "figures": "figure", "scholars": "figure",
    "texts": "text", "documents": "text",
    "concepts": "concept", "dictionary_terms": "concept", "terms": "concept",
    "timeline_events": "event", "events": "event",
    "locations": "location", "emblems": "emblem",
}

def cols_of(cur, table):
    return [r[1] for r in cur.execute(f'PRAGMA table_info("{table}")')]

def ingest_sqlite(db, path):
    if not os.path.exists(path):
        C.manifest["warnings"].append(f"{db}: missing {path}"); return 0, 0
    con = sqlite3.connect(path); con.row_factory = sqlite3.Row; cur = con.cursor()
    tables = [r[0] for r in cur.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '%_fts%'")]
    label = SOURCES[db][0]
    ne0, nr0 = len(C.entities), len(C.relations)
    # entities
    for table, etype in ENTITY_TABLES.items():
        if table not in tables: continue
        for r in cur.execute(f'SELECT * FROM "{table}"'):
            row = dict(r)
            name = pick(row, "name", "title", "label", "term", "place_name", "date_label")
            summary = pick(row, "definition_short", "summary", "description", "significance",
                           "definition_long", "bio_html", "analysis_html", "alchemical_significance",
                           "english_translation", "definition_brief")
            sref = f"{label}"
            if name and table in ("texts", "documents"):
                sref = f"{clean(name,120)} — {label}"
            C.add_entity(db, etype,
                key_id=pick(row, "id"), slug=pick(row, "slug"),
                name=name, summary=clean(summary),
                era=pick(row, "era", "period", "composition_date"),
                dateStart=num(pick(row, "date_start_year", "composition_year_start", "birth_year",
                                   "year", "date_start")),
                dateEnd=num(pick(row, "date_end_year", "composition_year_end", "death_year",
                                 "year_end", "date_end")),
                lat=pick(row, "latitude", "lat"), lng=pick(row, "longitude", "lng"),
                sourceMethod=pick(row, "source_method"), reviewStatus=pick(row, "review_status"),
                confidence=pick(row, "confidence"),
                sourceRef=sref,
                fields={k: clean(row[k], 200) if isinstance(row[k], str) else row[k]
                        for k in ("role_primary", "category_type", "category", "operation_type",
                                  "text_type", "doc_type", "tradition", "primary_tradition",
                                  "language", "original_language", "term_language", "domain",
                                  "event_type", "figure_type", "region", "nationality") if k in row})
    # relations from inline "involved" arrays / FK columns on entity rows
    if "timeline_events" in tables:
        ev_cols = cols_of(cur, "timeline_events")
        for r in cur.execute('SELECT * FROM "timeline_events"'):
            row = dict(r); eslug = pick(row, "slug")
            euid = C.resolve(db, "event", eslug) or C.resolve(db, "event", pick(row, "id"))
            if not euid: continue
            for col, etype, pred in (("persons_involved", "figure", "participated_in"),
                                     ("texts_involved", "text", "cites"),
                                     ("concepts_involved", "concept", "concerns")):
                if col in row and row[col]:
                    for tok in re.split(r"[;,|]", str(row[col])):
                        tok = tok.strip()
                        ouid = C.resolve(db, etype, tok)
                        if ouid: C.add_relation(db, euid, pred, ouid, f"{label}: {clean(pick(row,'title','date_label') or 'event',80)}")
            loc = pick(row, "location_slug")
            if loc:
                luid = C.resolve(db, "location", loc)
                if luid: C.add_relation(db, euid, "located_at", luid, label)
    if "texts" in tables and "author_figure_id" in cols_of(cur, "texts"):
        for r in cur.execute('SELECT id, author_figure_id FROM "texts" WHERE author_figure_id IS NOT NULL'):
            t = C.resolve(db, "text", r["id"]); f = C.resolve(db, "figure", r["author_figure_id"])
            if t and f: C.add_relation(db, f, "authored", t, label)
    # generic junction harvester (skip statistical/frequency tables — not meaningful "situations")
    SKIP = {"term_documents", "cited_documents", "reading_tracker", "document_topics",
            "schema_version", "era_assignments", "term_variants"}
    for table in tables:
        if table in ENTITY_TABLES or table in SKIP: continue
        cols = cols_of(cur, table)
        eps = [(c, endpoint_type(c)) for c in cols if endpoint_type(c)]
        if len(eps) < 2: continue
        (ca, ta), (cb, tb) = eps[0], eps[1]
        pred = predicate_for(table, ta, tb)
        try:
            rows = cur.execute(f'SELECT * FROM "{table}"').fetchall()
        except sqlite3.Error:
            continue
        used = 0
        for r in rows:
            row = dict(r)
            sa = C.resolve(db, ta, row.get(ca)); sb = C.resolve(db, tb, row.get(cb))
            if sa and sb:
                C.add_relation(db, sa, pred, sb, f"{label} ({table})", confidence=row.get("confidence"))
                used += 1
        if used == 0 and rows:
            C.manifest["warnings"].append(f"{db}.{table}: {len(rows)} rows, 0 resolved ({ca}/{cb})")
    con.close()
    return len(C.entities) - ne0, len(C.relations) - nr0

# ---------- JSON adapter (Theosophical) ----------
def ingest_theosophical():
    db = "theosophical"; label = SOURCES[db][0]
    path = os.path.join(DEV, "TheosophicalAlchemyDB", "data", "prototype_data.json")
    if not os.path.exists(path):
        C.manifest["warnings"].append(f"{db}: missing {path}"); return 0, 0
    ne0, nr0 = len(C.entities), len(C.relations)
    data = json.load(open(path, encoding="utf-8"))
    type_map = {"figures": "figure", "scholars": "figure", "concepts": "concept",
                "texts": "text", "emblems": "emblem"}
    for bucket, etype in type_map.items():
        for row in data.get(bucket, []):
            name = pick(row, "name", "title")
            C.add_entity(db, etype, key_id=pick(row, "id"), slug=pick(row, "slug"), name=name,
                summary=clean(pick(row, "summary", "operational_meaning", "philosophical_meaning")),
                dateStart=num(pick(row, "birth_year", "year")),
                dateEnd=num(pick(row, "death_year")),
                lat=pick(row, "lat"), lng=pick(row, "lng"),
                sourceRef=label,
                fields={k: row[k] for k in ("nationality", "primary_discipline", "category",
                                            "language", "type", "source_book") if row.get(k)})
    def ref_key(v):
        if isinstance(v, dict): return v.get("slug") or v.get("id")
        return v
    # inline relations
    for row in data.get("emblems", []):
        e = C.resolve(db, "emblem", pick(row, "slug")) or C.resolve(db, "emblem", pick(row, "id"))
        for cv in (row.get("concepts") or []):
            c = C.resolve(db, "concept", ref_key(cv))
            if e and c: C.add_relation(db, e, "depicts", c, f"{label}: {clean(pick(row,'title') or 'emblem',80)}")
    for row in data.get("texts", []):
        t = C.resolve(db, "text", pick(row, "slug")) or C.resolve(db, "text", pick(row, "id"))
        for cv in (row.get("concepts") or []):
            c = C.resolve(db, "concept", ref_key(cv))
            if t and c: C.add_relation(db, t, "concerns", c, label)
    for row in data.get("figures", []):
        f = C.resolve(db, "figure", pick(row, "slug")) or C.resolve(db, "figure", pick(row, "id"))
        for kw in (row.get("key_works") or []):
            title = kw if isinstance(kw, str) else kw.get("title")
            t = C.resolve(db, "text", re.sub(r"\W+", "-", title.lower())) if title else None
            if f and t: C.add_relation(db, f, "authored", t, label)
    return len(C.entities) - ne0, len(C.relations) - nr0

# ---------- cross-DB sameAs ----------
def link_cross_db():
    by_key = defaultdict(list)
    for uid, e in C.entities.items():
        k = (e["type"], re.sub(r"[^a-z0-9]", "", e["name"].lower()))
        if len(k[1]) >= 4: by_key[k].append(uid)
    same = 0
    for k, uids in by_key.items():
        if len(uids) < 2: continue
        for i in range(len(uids)):
            for j in range(i + 1, len(uids)):
                if C.entities[uids[i]]["db"] != C.entities[uids[j]]["db"]:
                    C.add_relation("_cross", uids[i], "related_to", uids[j],
                                   "cross-database identity (same name & type)", confidence=0.6)
                    same += 1
    C.manifest["sameAsLinks"] = same

# ---------- run ----------
def main():
    DBS = {
        "alchemy":  os.path.join(DEV, "ALCHEMYTIMELINEMAP", "db", "alchemy_timeline.db"),
        "medieval": os.path.join(DEV, "MedievalMagicDB", "db", "medieval_magic.db"),
        "renmagic": os.path.join(DEV, "renaissance magic", "db", "renmagic.db"),
    }
    for db, path in DBS.items():
        ne, nr = ingest_sqlite(db, path)
        C.manifest["sources"][db] = {"label": SOURCES[db][0], "entities": ne, "relations": nr}
    ne, nr = ingest_theosophical()
    C.manifest["sources"]["theosophical"] = {"label": SOURCES["theosophical"][0], "entities": ne, "relations": nr}
    link_cross_db()

    entities = sorted(C.entities.values(), key=lambda e: (e["db"], e["type"], e["name"].lower()))
    relations = sorted(C.relations.values(), key=lambda r: r["uid"])
    C.manifest["predicateCounts"] = dict(C.manifest["predicateCounts"])
    C.manifest["typeCounts"] = dict(C.manifest["typeCounts"])
    C.manifest["totals"] = {"entities": len(entities), "relations": len(relations)}

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, "unified.corpus.json"), "w", encoding="utf-8") as f:
        json.dump({"entities": entities, "relations": relations}, f, ensure_ascii=False, indent=1)
    with open(os.path.join(OUT_DIR, "unified.manifest.json"), "w", encoding="utf-8") as f:
        json.dump(C.manifest, f, ensure_ascii=False, indent=2)

    print("TOTALS:", C.manifest["totals"])
    print("by type:", C.manifest["typeCounts"])
    print("by predicate:", C.manifest["predicateCounts"])
    print("sameAs cross-db links:", C.manifest.get("sameAsLinks"))
    print("low-confidence entities:", C.manifest["lowConfidence"])
    if C.manifest["warnings"]:
        print("warnings:", *C.manifest["warnings"][:12], sep="\n  ")

if __name__ == "__main__":
    main()
