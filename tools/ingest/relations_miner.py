"""relations_miner.py — rank a knowledge portal's entities and mine its relationship web.

Part of the `translate-portal` pipeline (.claude/skills/translate-portal/SKILL.md). This is the
DETERMINISTIC, OFFLINE stage (the Deckard Boundary): it never writes game cards or invents lore. It
reads a portal export and emits a *translation plan* — which entities are most worth becoming cards,
and which relationships (explicit + latent) are worth becoming links — for a human/Claude to translate.

Two signals:
  1. networkx graph centrality over the EXPLICIT relationships → importance ranking. The most
     connectable, canonical entities (high degree / PageRank / betweenness) become cards first
     (CARD_STYLE_GUIDE section 6).
  2. sentence-transformer embeddings over entity summaries → (a) LATENT links: pairs that are highly
     similar but share no explicit edge (candidate "draw-connected" links to author), and (b) DUPES:
     near-identical entities across merged DBs to collapse before translation.

Embeddings are OPTIONAL: if sentence-transformers / numpy are not installed, the miner runs graph-only
and says so. No network calls.

Input JSON (tolerant of field names):
  { "entities":  [ {"id","name","type"?,"summary"?|"text"?, "sourceRef"? }, ... ],
    "relations": [ {"subject"|"a"|"source","predicate"|"rel","object"|"b"|"target", "sourceRef"? }, ... ] }

Usage:
  python relations_miner.py path/to/portal.json --top 20 --latent 30 --out plan.json
"""
from __future__ import annotations
import argparse
import json
import sys
from collections import defaultdict
from typing import Any, Optional


def _get(d: dict, *keys: str, default: Any = "") -> Any:
    for k in keys:
        if k in d and d[k] not in (None, ""):
            return d[k]
    return default


def load_portal(path: str) -> tuple[list[dict], list[dict]]:
    with open(path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    entities = data.get("entities") or data.get("cards") or data.get("nodes") or []
    relations = data.get("relations") or data.get("relationships") or data.get("edges") or []
    norm_e = []
    for e in entities:
        eid = str(_get(e, "id", "name"))
        if not eid:
            continue
        norm_e.append({
            "id": eid,
            "name": _get(e, "name", "id", default=eid),
            "type": _get(e, "type", "cls", "kind", default="entity"),
            "summary": _get(e, "summary", "text", "description"),
            "sourceRef": _get(e, "sourceRef", "source", "ref"),
        })
    norm_r = []
    for r in relations:
        a = str(_get(r, "subject", "a", "source", "from"))
        b = str(_get(r, "object", "b", "target", "to"))
        if not a or not b:
            continue
        norm_r.append({
            "a": a, "b": b,
            "predicate": _get(r, "predicate", "rel", "type", default="related"),
            "sourceRef": _get(r, "sourceRef", "source", "ref"),
        })
    return norm_e, norm_r


def rank_importance(entities: list[dict], relations: list[dict], top: int) -> list[dict]:
    try:
        import networkx as nx
    except ImportError:
        sys.stderr.write("[miner] networkx not installed; falling back to raw degree count.\n")
        deg: dict[str, int] = defaultdict(int)
        for r in relations:
            deg[r["a"]] += 1
            deg[r["b"]] += 1
        ranked = sorted(entities, key=lambda e: deg[e["id"]], reverse=True)
        return [{**e, "degree": deg[e["id"]], "pagerank": None} for e in ranked[:top]]

    g = nx.Graph()
    for e in entities:
        g.add_node(e["id"])
    for r in relations:
        g.add_edge(r["a"], r["b"])
    pr = nx.pagerank(g) if g.number_of_edges() else {n: 0.0 for n in g}
    by_id = {e["id"]: e for e in entities}
    scored = []
    for nid in g.nodes:
        e = by_id.get(nid, {"id": nid, "name": nid, "type": "entity", "summary": "", "sourceRef": ""})
        scored.append({**e, "degree": g.degree(nid), "pagerank": round(pr.get(nid, 0.0), 6)})
    scored.sort(key=lambda x: (x["pagerank"], x["degree"]), reverse=True)
    return scored[:top]


def mine_latent(entities: list[dict], relations: list[dict], k: int,
                sim_threshold: float = 0.62, dupe_threshold: float = 0.92) -> Optional[dict]:
    try:
        import numpy as np
        from sentence_transformers import SentenceTransformer
    except ImportError:
        sys.stderr.write("[miner] sentence-transformers/numpy not installed; skipping latent mining.\n")
        return None

    withtext = [e for e in entities if e.get("summary")]
    if len(withtext) < 2:
        return {"latent_links": [], "duplicates": []}
    model = SentenceTransformer("all-MiniLM-L6-v2")
    emb = model.encode([f"{e['name']}. {e['summary']}" for e in withtext], normalize_embeddings=True)
    sim = np.asarray(emb) @ np.asarray(emb).T

    explicit = {frozenset((r["a"], r["b"])) for r in relations}
    latent, dupes = [], []
    n = len(withtext)
    for i in range(n):
        for j in range(i + 1, n):
            s = float(sim[i][j])
            pair = frozenset((withtext[i]["id"], withtext[j]["id"]))
            if s >= dupe_threshold:
                dupes.append({"a": withtext[i]["id"], "b": withtext[j]["id"], "sim": round(s, 3)})
            elif s >= sim_threshold and pair not in explicit:
                latent.append({"a": withtext[i]["id"], "b": withtext[j]["id"], "sim": round(s, 3),
                               "reason_hint": "high textual resonance; candidate draw-connected link"})
    latent.sort(key=lambda x: x["sim"], reverse=True)
    dupes.sort(key=lambda x: x["sim"], reverse=True)
    return {"latent_links": latent[:k], "duplicates": dupes}


def main() -> int:
    ap = argparse.ArgumentParser(description="Rank a portal's entities and mine its relationship web.")
    ap.add_argument("portal", help="path to the portal JSON export")
    ap.add_argument("--top", type=int, default=20, help="how many top entities to surface as card candidates")
    ap.add_argument("--latent", type=int, default=30, help="max latent links to propose")
    ap.add_argument("--out", default="", help="write the plan JSON here (default: stdout)")
    args = ap.parse_args()

    entities, relations = load_portal(args.portal)
    plan = {
        "portal": args.portal,
        "counts": {"entities": len(entities), "relations": len(relations)},
        "card_candidates": rank_importance(entities, relations, args.top),
        "embedding": mine_latent(entities, relations, args.latent),
    }
    out = json.dumps(plan, indent=2, ensure_ascii=False)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(out)
        print(f"[miner] wrote plan to {args.out} "
              f"({plan['counts']['entities']} entities, {plan['counts']['relations']} relations)")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
