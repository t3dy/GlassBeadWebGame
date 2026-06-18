import { useEffect, useRef, useState } from 'react';
import { applyMove, cellId, createGame, emptyCount, parseCell, winner } from './engine/engine';
import type { CellId, GameState, Move } from './engine/types';
import { BANKS, GLYPHS } from './engine/glyphBank';
import { OCCUPATIONS, OCC_MAP } from './engine/occupations';
import { CARDS } from './data/seedDeck';
import { PORTALS, PORTAL_HUB, PORTAL_MAP } from './data/portals';
import { localStore } from './store/dataStore';

type Armed = { kind: 'card' | 'glyph' | 'meeple'; id: string } | null;
type PanelView = { type: 'glyph' | 'occupation' | 'bead'; id: string } | null;

export default function App() {
  const [state, setState] = useState<GameState | null>(() => localStore.load());
  const [armed, setArmed] = useState<Armed>(null);
  const [panel, setPanel] = useState<PanelView>(null);
  const drag = useRef<Armed>(null);

  useEffect(() => { if (state) localStore.save(state); }, [state]);
  if (!state) return <Setup onStart={(n) => setState(createGame(n))} />;

  const active = state.players[state.active];
  const dispatch = (m: Move) => setState((s) => (s ? applyMove(s, m) : s));
  const start = (n: number) => { setState(createGame(n)); setArmed(null); setPanel(null); };

  // Apply a payload (from click or drop) to a target cell.
  function place(payload: Armed, cell: CellId) {
    if (!payload || state!.phase !== 'play') return;
    const bead = state!.beads[cell];
    if (payload.kind === 'glyph' && bead) dispatch({ kind: 'applyGlyph', glyphId: payload.id, cell });
    else if (payload.kind === 'card' && !bead && !state!.meeples[cell]) { dispatch({ kind: 'infuse', cardId: payload.id, cell }); setArmed(null); }
    else if (payload.kind === 'meeple' && !bead && !state!.meeples[cell]) dispatch({ kind: 'placeMeeple', occId: payload.id, cell });
  }

  function handleCell(cell: CellId) {
    if (state!.phase !== 'play') return;
    const bead = state!.beads[cell];
    if (bead && (!armed || armed.kind !== 'glyph')) { setPanel({ type: 'bead', id: cell }); return; }
    place(armed, cell);
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>The Glass Bead Game</h1>
        <a className="hub-link" href={PORTAL_HUB.url} target="_blank" rel="noopener noreferrer">part of the {PORTAL_HUB.title} ↗</a>
        <div className="scores">
          {state.players.map((p) => (
            <span key={p.id} className={`score ${p.id === state.active && state.phase !== 'over' ? 'turn' : ''}`}>{p.name}: <b>{p.score}</b></span>
          ))}
        </div>
        <div className="controls">
          <button className="btn gold" disabled={state.phase !== 'play'} onClick={() => dispatch({ kind: 'endTurn' })}>☽ End turn · draw to {state.handSize}</button>
          <button className="btn" disabled={state.phase === 'over'} onClick={() => dispatch({ kind: 'concludeGame' })}>Conclude</button>
          <button className="btn ghost" onClick={() => start(state.players.length)}>New</button>
          <span className="legal">deck {state.deck.length} · spaces left {emptyCount(state)}</span>
        </div>
        {state.lastRelations.length > 0 && state.phase === 'play' && (
          <div className="readout">✦ The system reads: {state.lastRelations.join(' · ')}</div>
        )}
      </header>

      <main className="layout">
        <section className="board-wrap">
          <div className="board-label">The Universe — place beads side by side; the system reads the relations</div>
          <Board state={state} armed={armed} panel={panel} onCell={handleCell}
            onDropCell={(cell) => { place(drag.current, cell); drag.current = null; }} />
        </section>
        <aside className="side">
          <InfoPanel state={state} view={panel} />
          <Log lines={state.log} />
        </aside>
      </main>

      <footer className="trays">
        <Tray title={`Hand · ${active.name} · cards to infuse`}>
          {active.hand.map((id, i) => {
            const card = CARDS[id]; const on = armed?.kind === 'card' && armed.id === id;
            return (
              <button key={`${id}-${i}`} className={`card ${on ? 'active' : ''}`} disabled={state.phase !== 'play'} draggable
                onDragStart={() => (drag.current = { kind: 'card', id })}
                title={`${card.text} — ${card.sourceRef}`} onClick={() => setArmed(on ? null : { kind: 'card', id })}>
                <span className="card-glyphs">{card.glyphs.map((g) => GLYPHS[g]?.glyph).join(' ')}</span>
                <span className="card-name">{card.name}{card.portal ? ' ↗' : ''}</span>
                <span className="card-cls">{card.cls}</span>
              </button>
            );
          })}
          {active.hand.length === 0 && <span className="muted">Hand empty — end the turn to draw.</span>}
        </Tray>

        <div className="banks-head">Glyph banks · click to read · <b>drag onto a bead to complicate a board state</b></div>
        <div className="banks">
          {BANKS.map((bank) => (
            <Tray key={bank.id} title={bank.title}>
              {bank.glyphs.map((g) => {
                const on = armed?.kind === 'glyph' && armed.id === g.id;
                return (
                  <button key={g.id} className={`glyph ${on ? 'active' : ''}`} disabled={state.phase !== 'play'} draggable
                    onDragStart={() => (drag.current = { kind: 'glyph', id: g.id })}
                    onClick={() => { setPanel({ type: 'glyph', id: g.id }); setArmed(on ? null : { kind: 'glyph', id: g.id }); }}>
                    {g.glyph}
                  </button>
                );
              })}
            </Tray>
          ))}
        </div>

        <Tray title="Meeples · occupations · click to read · drag onto a space to place a worker">
          {OCCUPATIONS.map((o) => {
            const on = armed?.kind === 'meeple' && armed.id === o.id;
            return (
              <button key={o.id} className={`meeple ${on ? 'active' : ''}`} disabled={state.phase !== 'play'} draggable
                onDragStart={() => (drag.current = { kind: 'meeple', id: o.id })}
                onClick={() => { setPanel({ type: 'occupation', id: o.id }); setArmed(on ? null : { kind: 'meeple', id: o.id }); }}
                title={o.name}>
                <span className="meeple-emoji">{o.emoji}</span>
                <span className="meeple-name">{o.name}</span>
              </button>
            );
          })}
        </Tray>
      </footer>

      <PortalBar />

      {state.phase === 'handoff' && (
        <Overlay>
          <h2>Pass the device</h2>
          <p>Hands are hidden. {active.name}, when you are ready —</p>
          <button className="btn gold big" onClick={() => dispatch({ kind: 'ready' })}>I am {active.name} · begin</button>
        </Overlay>
      )}
      {state.phase === 'over' && (
        <Overlay>
          <h2>The Game concludes</h2>
          <ResultLines state={state} />
          <div className="overlay-controls">
            <button className="btn gold big" onClick={() => start(1)}>New solo game</button>
            <button className="btn big" onClick={() => start(2)}>New 2-player game</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Setup({ onStart }: { onStart: (n: number) => void }) {
  return (
    <div className="app setup">
      <h1>The Glass Bead Game</h1>
      <p className="subtitle big">
        Infuse glass beads with significance from cards, complicate them with alchemical glyphs, and
        place them side by side — the system reads the relations between adjacent beads from real
        sources (what Ficino said of Venus and Jupiter against melancholy, the chymical wedding of Sol
        and Luna…). Place occupation meeples to work the board. Solo, or two-player hot-seat.
      </p>
      <div className="overlay-controls">
        <button className="btn gold big" onClick={() => onStart(1)}>Play solo</button>
        <button className="btn big" onClick={() => onStart(2)}>Two-player hot-seat</button>
      </div>
    </div>
  );
}

function Board({ state, armed, panel, onCell, onDropCell }: {
  state: GameState; armed: Armed; panel: PanelView; onCell: (c: CellId) => void; onDropCell: (c: CellId) => void;
}) {
  const hide = state.phase === 'handoff';
  const rows = [];
  for (let r = 0; r < state.size; r++) {
    const cells = [];
    for (let c = 0; c < state.size; c++) {
      const id = cellId(r, c);
      const bead = state.beads[id];
      const meeple = state.meeples[id];
      const empty = !bead && !meeple;
      const cueGlyph = bead && armed?.kind === 'glyph';
      const cuePlace = empty && (armed?.kind === 'card' || armed?.kind === 'meeple');
      const cls = ['cell', bead ? 'has-bead' : '', meeple ? 'has-meeple' : '', panel?.type === 'bead' && panel.id === id ? 'inspected' : '', cueGlyph ? 'cue-glyph' : '', cuePlace ? 'cue-place' : ''].join(' ');
      cells.push(
        <button key={id} className={cls} aria-label={`space ${id}`} onClick={() => onCell(id)}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onDropCell(id); }}>
          {bead && <BeadGlyph state={state} cell={id} />}
          {meeple && <span className="meepleface" title={OCC_MAP[meeple.occId]?.name}>{OCC_MAP[meeple.occId]?.emoji}</span>}
        </button>,
      );
    }
    rows.push(<div key={r} className="row">{cells}</div>);
  }
  return <div className={`board ${hide ? 'curtain' : ''}`}>{rows}</div>;
}

function BeadGlyph({ state, cell }: { state: GameState; cell: CellId }) {
  const bead = state.beads[cell];
  const card = bead.cardId ? CARDS[bead.cardId] : undefined;
  const main = bead.glyphIds[0] ? GLYPHS[bead.glyphIds[0]]?.glyph : card?.name[0] ?? '◦';
  return (
    <span className={`bead p${bead.owner}`} title={card ? card.name : 'a bead'}>
      <span className="bead-main">{main}</span>
      {bead.glyphIds.length > 1 && <span className="bead-extra">{bead.glyphIds.slice(1).map((g) => GLYPHS[g]?.glyph).join('')}</span>}
    </span>
  );
}

function InfoPanel({ state, view }: { state: GameState; view: PanelView }) {
  if (view?.type === 'glyph') {
    const g = GLYPHS[view.id];
    return (
      <div className="panel info">
        <h2><span className="big-glyph">{g.glyph}</span> {g.label}</h2>
        <p className="cat">{g.category} glyph</p>
        <h3>In alchemy</h3><p>{g.meaning}</p>
        <h3>In the game</h3><p>{g.gameUse}</p>
        <p className="src">{g.sourceRef}</p>
      </div>
    );
  }
  if (view?.type === 'occupation') {
    const o = OCC_MAP[view.id];
    return (
      <div className="panel info">
        <h2><span className="big-glyph">{o.emoji}</span> {o.name}</h2>
        <p className="cat">meeple · occupation · favours {o.affinity}</p>
        <h3>Who they are</h3><p>{o.meaning}</p>
        <h3>In the game</h3><p>{o.gameUse}</p>
        <p className="src">{o.sourceRef}</p>
      </div>
    );
  }
  if (view?.type === 'bead' && state.beads[view.id]) {
    const bead = state.beads[view.id]; const card = bead.cardId ? CARDS[bead.cardId] : undefined;
    const [r, c] = parseCell(view.id);
    return (
      <div className="panel info">
        <h2>Bead @ {r},{c}</h2>
        {card ? (
          <>
            <p className="bead-title">{card.name}</p><p>{card.text}</p><p className="src">{card.sourceRef}</p>
            {card.portal && PORTAL_MAP[card.portal] && (
              <a className="portal-link" href={PORTAL_MAP[card.portal].url} target="_blank" rel="noopener noreferrer">Explore the source · {PORTAL_MAP[card.portal].title} ↗</a>
            )}
          </>
        ) : <p className="muted">An uninfused bead.</p>}
        <h3>Attributes</h3>
        <p>{bead.glyphIds.length ? bead.glyphIds.map((g) => `${GLYPHS[g]?.glyph} ${GLYPHS[g]?.label}`).join(' · ') : '—'}</p>
      </div>
    );
  }
  return (
    <div className="panel info">
      <h2>The glyphs</h2>
      <p className="muted">Click any glyph, meeple, or bead to read it here. Glyphs are attributes —
        drag one onto a bead to complicate it, then watch the relations the system finds between neighbours.</p>
    </div>
  );
}

function ResultLines({ state }: { state: GameState }) {
  const w = winner(state);
  return (
    <>
      <ul className="results">{state.players.map((p) => <li key={p.id}>{p.name}: <b>{p.score}</b></li>)}</ul>
      {state.players.length > 1 && <p className="verdict">{w === 'tie' ? 'A perfect equilibrium — a tie.' : `${(w as { name: string }).name} achieves the higher synthesis.`}</p>}
    </>
  );
}

function Log({ lines }: { lines: string[] }) {
  return <div className="panel log"><h2>The play</h2><ol>{lines.slice(-16).map((l, i) => <li key={i}>{l}</li>)}</ol></div>;
}
function Tray({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="tray"><div className="tray-title">{title}</div><div className="tray-items">{children}</div></div>;
}
function Overlay({ children }: { children: React.ReactNode }) {
  return <div className="overlay"><div className="overlay-card">{children}</div></div>;
}
function PortalBar() {
  return (
    <div className="portalbar">
      <span className="portalbar-title">Knowledge portals · cards draw from these live archives:</span>
      <div className="portalbar-links">{PORTALS.map((p) => <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" title={p.blurb}>{p.title}</a>)}</div>
    </div>
  );
}
