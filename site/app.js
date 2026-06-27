/* The Crystal Atlas — relational browser over the Glass Bead Game corpus. Dependency-free. */
(function () {
  'use strict';
  const DATA = window.GBG_DATA;
  if (!DATA) { document.body.innerHTML = '<p style="padding:40px">Could not load data.js.</p>'; return; }

  const PORTALS = {
    hermeticdb: 'https://t3dy.github.io/HermeticDB/', rmdb: 'https://t3dy.github.io/RMDB/',
    goetia: 'https://t3dy.github.io/goetia-sigil-analysis/', hpmarginalia: 'https://t3dy.github.io/HPMarginalia/',
    querypat: 'https://t3dy.github.io/QueryPat/', shakesphyllis: 'https://t3dy.github.io/ShakesPhyllis/',
    marxistportal: 'https://t3dy.github.io/MarxistPortal/', dreambase: 'https://t3dy.github.io/BetterDreambaseChunks/',
  };
  const THEMATIC_KEYS = ['discipline', 'tradition', 'field', 'facet', 'stage', 'operation'];

  // ── indices ──────────────────────────────────────────────────────────────────────────────────
  const byId = new Map(DATA.cards.map((c) => [c.id, c]));
  const packName = new Map(DATA.packs.map((p) => [p.id, p.name]));
  const adj = new Map(); // id -> [{id, reason}]
  for (const c of DATA.cards) adj.set(c.id, []);
  for (const l of DATA.links) {
    if (adj.has(l.a)) adj.get(l.a).push({ id: l.b, reason: l.reason });
    if (adj.has(l.b)) adj.get(l.b).push({ id: l.a, reason: l.reason });
  }
  const glyphCount = new Map();
  for (const c of DATA.cards) for (const g of c.glyphs) glyphCount.set(g, (glyphCount.get(g) || 0) + 1);

  // ── state ────────────────────────────────────────────────────────────────────────────────────
  const state = { q: '', classes: new Set(), packs: new Set(), glyphs: new Set(), view: 'gallery' };
  const history = []; // detail navigation stack

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const beadCat = (gid) => (DATA.glyphs[gid] && DATA.glyphs[gid].category) || 'other';
  const glyphChar = (gid) => (DATA.glyphs[gid] && DATA.glyphs[gid].glyph) || '◈';

  // ── filters ──────────────────────────────────────────────────────────────────────────────────
  function passes(c) {
    if (state.classes.size && !state.classes.has(c.cls)) return false;
    if (state.packs.size && !c.packs.some((p) => state.packs.has(p))) return false;
    if (state.glyphs.size && !c.glyphs.some((g) => state.glyphs.has(g))) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      const hay = (c.name + ' ' + c.text + ' ' + c.sourceRef + ' ' + Object.values(c.correspondences).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }
  const filtered = () => DATA.cards.filter(passes);

  // ── chips ────────────────────────────────────────────────────────────────────────────────────
  function buildChips() {
    const classes = [...new Set(DATA.cards.map((c) => c.cls))].sort();
    const cf = $('#class-filters');
    classes.forEach((cl) => cf.appendChild(chip(cl, () => toggle(state.classes, cl), () => state.classes.has(cl))));

    const pf = $('#pack-filters');
    DATA.packs.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((p) => {
      pf.appendChild(chip(shortPack(p.name), () => toggle(state.packs, p.id), () => state.packs.has(p.id)));
    });

    const gf = $('#glyph-filters');
    [...glyphCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([gid]) => {
      const c = chip(glyphChar(gid), () => toggle(state.glyphs, gid), () => state.glyphs.has(gid), 'glyph-chip');
      c.title = (DATA.glyphs[gid] && DATA.glyphs[gid].label) || gid;
      gf.appendChild(c);
    });
  }
  function chip(label, onClick, isOn, extra) {
    const b = el('button', 'chip' + (extra ? ' ' + extra : ''), label);
    b.addEventListener('click', () => { onClick(); refresh(); });
    b._isOn = isOn; return b;
  }
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }
  const shortPack = (n) => n.replace(/ ·.*/, '').replace(/Patrons/, 'Patrons');

  function syncChips() {
    document.querySelectorAll('.chip').forEach((c) => { if (c._isOn) c.classList.toggle('on', c._isOn()); });
    const any = state.classes.size || state.packs.size || state.glyphs.size || state.q;
    $('#clear-filters').hidden = !any;
  }

  // ── gallery ──────────────────────────────────────────────────────────────────────────────────
  function renderGallery() {
    const g = $('#gallery'); g.innerHTML = '';
    const list = filtered();
    if (!list.length) { g.appendChild(el('p', 'empty', 'No beads match these filters.')); return; }
    const frag = document.createDocumentFragment();
    for (const c of list) frag.appendChild(cardEl(c));
    g.appendChild(frag);
  }
  function cardEl(c) {
    const card = el('div', 'card'); card.tabIndex = 0;
    const top = el('div', 'card-top');
    const glyphs = el('div', 'glyphs');
    c.glyphs.slice(0, 4).forEach((gid) => glyphs.appendChild(bead(gid)));
    top.appendChild(glyphs);
    top.appendChild(el('span', 'cls-tag', c.cls));
    card.appendChild(top);
    card.appendChild(el('h3', null, c.name));
    card.appendChild(el('p', null, c.text));
    const packs = el('div', 'pack-chips');
    c.packs.forEach((p) => packs.appendChild(el('span', 'pack-chip', shortPack(packName.get(p) || p))));
    card.appendChild(packs);
    card.appendChild(el('div', 'src', c.sourceRef));
    const open = () => openCard(c.id, true);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
    return card;
  }
  function bead(gid) {
    const b = el('div', 'bead ' + beadCat(gid), glyphChar(gid));
    b.title = (DATA.glyphs[gid] && DATA.glyphs[gid].label) || gid;
    return b;
  }

  // ── detail (the relational browser) ──────────────────────────────────────────────────────────
  function openCard(id, fresh) {
    if (fresh) history.length = 0;
    renderDetail(id);
  }
  function navTo(id) { history.push(currentId); renderDetail(id); }
  let currentId = null;

  function renderDetail(id) {
    const c = byId.get(id); if (!c) return;
    currentId = id;
    const d = $('#detail'); d.hidden = false; $('#scrim').hidden = false; d.innerHTML = '';
    d.scrollTop = 0;

    d.appendChild(iconBtn('close', '✕', closeDetail));
    if (history.length) { const back = el('button', 'back', '‹ back'); back.onclick = () => renderDetail(history.pop()); d.appendChild(back); }

    d.appendChild(el('div', 'd-cls', c.cls + (c.portal ? ' · ' + c.portal : '')));
    d.appendChild(el('h2', null, c.name));

    if (c.glyphs.length) {
      const gw = el('div', 'd-glyphs');
      c.glyphs.forEach((gid) => {
        const row = el('div', 'd-glyph'); row.appendChild(bead(gid));
        const m = el('div', 'g-meaning');
        const gdef = DATA.glyphs[gid] || {};
        m.innerHTML = '<b>' + esc(gdef.label || gid) + '</b> — ' + esc(gdef.meaning || '');
        row.appendChild(m); gw.appendChild(row);
      });
      d.appendChild(gw);
    }

    d.appendChild(el('p', 'd-text', c.text));

    const corrEntries = Object.entries(c.correspondences || {});
    if (corrEntries.length) {
      d.appendChild(el('h4', null, 'Correspondences'));
      const t = el('table', 'corr-table');
      corrEntries.forEach(([k, v]) => {
        const tr = el('tr'); tr.appendChild(el('td', 'k', k)); tr.appendChild(el('td', null, v)); t.appendChild(tr);
      });
      d.appendChild(t);
    }

    d.appendChild(el('h4', null, 'Source'));
    d.appendChild(el('div', 'd-src', c.sourceRef));
    if (c.portal && PORTALS[c.portal]) {
      const a = el('a', 'd-portal', 'Explore the source ↗'); a.href = PORTALS[c.portal]; a.target = '_blank'; a.rel = 'noopener';
      d.appendChild(a);
    }

    // Connections — authored influence links first, then thematic neighbours.
    const authored = adj.get(id) || [];
    const authoredIds = new Set(authored.map((x) => x.id));
    if (authored.length) {
      d.appendChild(el('h4', null, 'Influence · ' + authored.length));
      authored.forEach((a) => d.appendChild(connEl(a.id, a.reason, 'linked')));
    }
    const thematic = thematicNeighbours(c, authoredIds).slice(0, 8);
    if (thematic.length) {
      d.appendChild(el('h4', null, 'Resonance'));
      thematic.forEach((t) => d.appendChild(connEl(t.id, t.reason, 'thematic')));
    }
    if (!authored.length && !thematic.length) d.appendChild(el('div', 'd-src', 'A solitary bead — no links yet.'));
  }
  function connEl(id, reason, kind) {
    const c = byId.get(id); if (!c) return el('div');
    const b = el('button', 'conn ' + kind);
    b.appendChild(el('span', 'c-tag', kind === 'linked' ? 'influence' : 'resonance'));
    const name = el('div', 'c-name'); name.innerHTML = '<span class="arrow">→</span> ' + esc(c.name);
    b.appendChild(name);
    b.appendChild(el('div', 'c-reason', reason));
    b.onclick = () => navTo(id);
    return b;
  }
  function thematicNeighbours(c, exclude) {
    const mine = {};
    for (const k of THEMATIC_KEYS) { const v = c.correspondences[k]; if (v) mine[v.toLowerCase()] = k; }
    if (!Object.keys(mine).length) return [];
    const out = [];
    for (const o of DATA.cards) {
      if (o.id === c.id || exclude.has(o.id)) continue;
      for (const k of THEMATIC_KEYS) {
        const v = o.correspondences[k];
        if (v && mine[v.toLowerCase()]) { out.push({ id: o.id, reason: 'Shares ' + mine[v.toLowerCase()] + ': ' + v + '.' }); break; }
      }
    }
    return out;
  }
  function iconBtn(cls, txt, fn) { const b = el('button', cls, txt); b.onclick = fn; return b; }
  function closeDetail() { $('#detail').hidden = true; $('#scrim').hidden = true; currentId = null; }
  function esc(s) { return String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])); }

  // ── connection web (force-directed, vanilla) ───────────────────────────────────────────────────
  let graphBuilt = false;
  function buildGraph() {
    const svg = $('#graph');
    const linkedIds = new Set();
    for (const l of DATA.links) { linkedIds.add(l.a); linkedIds.add(l.b); }
    const nodes = [...linkedIds].filter((id) => byId.has(id)).map((id) => {
      const c = byId.get(id);
      return { id, name: c.name, cls: c.cls, x: 0, y: 0, vx: 0, vy: 0 };
    });
    const nidx = new Map(nodes.map((n, i) => [n.id, i]));
    const edges = DATA.links.filter((l) => nidx.has(l.a) && nidx.has(l.b)).map((l) => ({ s: nidx.get(l.a), t: nidx.get(l.b) }));

    const W = svg.clientWidth || 900, H = svg.clientHeight || 560;
    // circle-pack initial positions (deterministic)
    nodes.forEach((n, i) => { const a = (i / nodes.length) * Math.PI * 2; n.x = W / 2 + Math.cos(a) * Math.min(W, H) * 0.32; n.y = H / 2 + Math.sin(a) * Math.min(W, H) * 0.32; });

    const NS = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = '';
    const gEdges = document.createElementNS(NS, 'g');
    const gNodes = document.createElementNS(NS, 'g');
    svg.appendChild(gEdges); svg.appendChild(gNodes);
    const COLORS = { figure: '#9400d3', text: '#c8a24a', concept: '#228b22', symbol: '#2f7fb8' };

    const edgeEls = edges.map((e) => { const ln = document.createElementNS(NS, 'line'); ln.setAttribute('class', 'edge'); gEdges.appendChild(ln); return ln; });
    const nodeEls = nodes.map((n) => {
      const grp = document.createElementNS(NS, 'g'); grp.setAttribute('class', 'node');
      const circ = document.createElementNS(NS, 'circle');
      const deg = (adj.get(n.id) || []).length;
      n.r = 5 + Math.min(deg, 8) * 1.4;
      circ.setAttribute('r', n.r); circ.setAttribute('fill', COLORS[n.cls] || '#888');
      const label = document.createElementNS(NS, 'text'); label.setAttribute('dx', n.r + 2); label.setAttribute('dy', 3); label.textContent = n.name.length > 22 ? n.name.slice(0, 21) + '…' : n.name;
      grp.appendChild(circ); grp.appendChild(label);
      grp.addEventListener('click', () => openCard(n.id, true));
      grp.addEventListener('mouseenter', () => highlight(n.id));
      grp.addEventListener('mouseleave', clearHighlight);
      gNodes.appendChild(grp); n._el = grp; n._circ = circ; return grp;
    });

    function highlight(id) {
      const keep = new Set([id]); (adj.get(id) || []).forEach((a) => keep.add(a.id));
      nodes.forEach((n) => n._el.classList.toggle('dim', !keep.has(n.id)));
      nodes.forEach((n) => n._el.classList.toggle('hot', n.id === id));
      edges.forEach((e, i) => {
        const hot = nodes[e.s].id === id || nodes[e.t].id === id;
        edgeEls[i].classList.toggle('hot', hot);
        edgeEls[i].classList.toggle('dim', !(keep.has(nodes[e.s].id) && keep.has(nodes[e.t].id)));
      });
    }
    function clearHighlight() {
      nodes.forEach((n) => n._el.classList.remove('dim', 'hot'));
      edgeEls.forEach((e) => e.classList.remove('dim', 'hot'));
    }

    // force simulation — one physics step (no DOM writes), so it can run headless / pre-warmed.
    let alpha = 1;
    function step() {
      alpha *= 0.97;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          let d2 = dx * dx + dy * dy || 0.01; const f = 900 / d2;
          const d = Math.sqrt(d2); const ux = dx / d, uy = dy / d;
          nodes[i].vx += ux * f; nodes[i].vy += uy * f; nodes[j].vx -= ux * f; nodes[j].vy -= uy * f;
        }
      }
      for (const e of edges) {
        const a = nodes[e.s], b = nodes[e.t];
        let dx = b.x - a.x, dy = b.y - a.y; const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - 70) * 0.02; const ux = dx / d, uy = dy / d;
        a.vx += ux * f; a.vy += uy * f; b.vx -= ux * f; b.vy -= uy * f;
      }
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.002; n.vy += (H / 2 - n.y) * 0.002;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx * alpha * 4; n.y += n.vy * alpha * 4;
        n.x = Math.max(n.r, Math.min(W - n.r, n.x)); n.y = Math.max(n.r, Math.min(H - n.r, n.y));
      }
    }
    function render() {
      for (const n of nodes) n._el.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')');
      for (let i = 0; i < edges.length; i++) {
        const a = nodes[edges[i].s], b = nodes[edges[i].t];
        edgeEls[i].setAttribute('x1', a.x); edgeEls[i].setAttribute('y1', a.y);
        edgeEls[i].setAttribute('x2', b.x); edgeEls[i].setAttribute('y2', b.y);
      }
    }
    // Pre-warm synchronously so the layout is settled and correct even if rAF is throttled
    // (e.g. a backgrounded tab). Then a short rAF pass for a smooth settle when visible.
    for (let k = 0; k < 260 && alpha > 0.005; k++) step();
    render();
    function animate() { if (alpha < 0.02) return; for (let k = 0; k < 2; k++) step(); render(); requestAnimationFrame(animate); }
    alpha = 0.12; requestAnimationFrame(animate);

    // drag-to-pan via viewBox
    let pan = { x: 0, y: 0 }, drag = null;
    svg.addEventListener('mousedown', (e) => { if (e.target.closest('.node')) return; drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; });
    window.addEventListener('mousemove', (e) => {
      if (!drag) return; pan.x = drag.px - (e.clientX - drag.x); pan.y = drag.py - (e.clientY - drag.y);
      svg.setAttribute('viewBox', pan.x + ' ' + pan.y + ' ' + W + ' ' + H);
    });
    window.addEventListener('mouseup', () => { drag = null; });
    graphBuilt = true;
  }

  // ── view switching ───────────────────────────────────────────────────────────────────────────
  function setView(v) {
    state.view = v;
    document.querySelectorAll('.vt').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
    $('#gallery').hidden = v !== 'gallery'; $('#filters').hidden = v !== 'gallery';
    $('#web').hidden = v !== 'web';
    if (v === 'web' && !graphBuilt) setTimeout(buildGraph, 30);
  }

  function refresh() { syncChips(); renderGallery(); }

  function init() {
    $('#counts').textContent = DATA.cards.length + ' beads · ' + DATA.links.length + ' influence links · ' + DATA.packs.length + ' packs · ' + Object.keys(DATA.glyphs).length + ' glyphs';
    buildChips();
    $('#search').addEventListener('input', (e) => { state.q = e.target.value.trim(); refresh(); });
    $('#clear-filters').addEventListener('click', () => {
      state.classes.clear(); state.packs.clear(); state.glyphs.clear(); state.q = ''; $('#search').value = ''; refresh();
    });
    document.querySelectorAll('.vt').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
    $('#scrim').addEventListener('click', closeDetail);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });
    refresh();
  }
  init();
})();
