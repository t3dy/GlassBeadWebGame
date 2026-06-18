import { useEffect, useState } from 'react';
import { applyMove, cellId, createGame, emptyCount, parseCell, triadEndsThrough, winner } from './engine/engine';
import type { CellId, GameState } from './engine/types';
import { GLYPH_BANK, GLYPHS } from './engine/glyphBank';
import { TILE_DEFS, TILES } from './engine/tiles';
import { CARDS } from './data/seedDeck';
import { PORTALS, PORTAL_HUB, PORTAL_MAP } from './data/portals';
import { localStore } from './store/dataStore';

type Selection =
  | { kind: 'card'; id: string }
  | { kind: 'glyph'; id: string }
  | { kind: 'tile'; id: string }
  | null;

export default function App() {
  const [state, setState] = useState<GameState | null>(() => localStore.load());
  const [sel, setSel] = useState<Selection>(null);
  const [inspect, setInspect] = useState<CellId | null>(null);

  useEffect(() => {
    if (state) localStore.save(state);
  }, [state]);

  if (!state) return <Setup onStart={(n) => setState(createGame(n))} />;

  const active = state.players[state.active];

  function start(n: number) {
    setState(createGame(n));
    setSel(null);
    setInspect(null);
  }
  function dispatch(m: Parameters<typeof applyMove>[1]) {
    setState((s) => (s ? applyMove(s, m) : s));
  }

  function handleCell(cell: CellId) {
    if (!state || state.phase !== 'play') return;
    const bead = state.beads[cell];
    if (bead) {
      if (sel?.kind === 'glyph') dispatch({ kind: 'applyGlyph', glyphId: sel.id, cell });
      else setInspect(cell);
      return;
    }
    if (state.tiles[cell]) return;
    if (sel?.kind === 'card') {
      dispatch({ kind: 'infuse', cardId: sel.id, cell });
      setSel(null);
    } else if (sel?.kind === 'tile') {
      dispatch({ kind: 'layTile', tileId: sel.id, cell });
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>The Glass Bead Game</h1>
        <a className="hub-link" href={PORTAL_HUB.url} target="_blank" rel="noopener noreferrer">
          part of the {PORTAL_HUB.title} ↗
        </a>
        <div className="scores">
          {state.players.map((p) => (
            <span key={p.id} className={`score ${p.id === state.active && state.phase !== 'over' ? 'turn' : ''}`}>
              {p.name}: <b>{p.score}</b>
            </span>
          ))}
        </div>
        <div className="controls">
          <button className="btn gold" disabled={state.phase !== 'play'} onClick={() => dispatch({ kind: 'endTurn' })}>
            ☽ End turn · draw to {state.handSize}
          </button>
          <button className="btn" disabled={state.phase === 'over'} onClick={() => dispatch({ kind: 'concludeGame' })}>
            Conclude
          </button>
          <button className="btn ghost" onClick={() => start(state.players.length)}>New</button>
          <span className="legal">deck {state.deck.length} · cells left {emptyCount(state)} · triads {state.triads.length}</span>
        </div>
        {state.lastReadout && state.phase === 'play' && <div className="readout">✦ {state.lastReadout}</div>}
      </header>

      <main className="layout">
        <section className="board-wrap">
          <Board state={state} sel={sel} inspect={inspect} onCell={handleCell} />
        </section>
        <aside className="side">
          <Inspector state={state} cell={inspect} />
          <Log lines={state.log} />
        </aside>
      </main>

      <footer className="trays">
        <Tray title={`Hand · ${active.name} · cards to infuse`}>
          {active.hand.map((id, i) => {
            const card = CARDS[id];
            const on = sel?.kind === 'card' && sel.id === id;
            return (
              <button key={`${id}-${i}`} className={`card ${on ? 'active' : ''}`} disabled={state.phase !== 'play'}
                title={`${card.text} — ${card.sourceRef}`} onClick={() => setSel(on ? null : { kind: 'card', id })}>
                <span className="card-glyphs">{card.glyphs.map((g) => GLYPHS[g]?.glyph).join(' ')}</span>
                <span className="card-name">{card.name}</span>
                <span className="card-cls">{card.cls}</span>
              </button>
            );
          })}
          {active.hand.length === 0 && <span className="muted">Hand empty — end the turn to draw.</span>}
        </Tray>

        <Tray title="Glyph bank · always available">
          {GLYPH_BANK.map((g) => {
            const on = sel?.kind === 'glyph' && sel.id === g.id;
            return (
              <button key={g.id} className={`glyph ${on ? 'active' : ''}`} disabled={state.phase !== 'play'}
                title={`${g.label} — ${g.sourceRef}`} onClick={() => setSel(on ? null : { kind: 'glyph', id: g.id })}>
                {g.glyph}
              </button>
            );
          })}
        </Tray>

        <Tray title="Process tiles · relate two beads">
          {TILE_DEFS.map((t) => {
            const on = sel?.kind === 'tile' && sel.id === t.id;
            return (
              <button key={t.id} className={`tile ${on ? 'active' : ''}`} disabled={state.phase !== 'play'}
                title={`${t.operation} — ${t.gloss}`} onClick={() => setSel(on ? null : { kind: 'tile', id: t.id })}>
                <span className="tile-glyph">{t.glyph}</span>
                <span className="tile-op">{t.operation}</span>
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
        A contemplative game of synthesis. Infuse glass beads with significance from cards, qualify
        them with alchemical glyphs, and relate two beads through a process tile to form a triad —
        scoring most when you reconcile opposites and span disciplines.
      </p>
      <div className="overlay-controls">
        <button className="btn gold big" onClick={() => onStart(1)}>Play solo</button>
        <button className="btn big" onClick={() => onStart(2)}>Two-player hot-seat</button>
      </div>
      <p className="muted">One device, taking turns. Hands are hidden between turns.</p>
    </div>
  );
}

function Board({ state, sel, inspect, onCell }: { state: GameState; sel: Selection; inspect: CellId | null; onCell: (c: CellId) => void }) {
  const hide = state.phase === 'handoff';
  const rows = [];
  for (let r = 0; r < state.size; r++) {
    const cells = [];
    for (let c = 0; c < state.size; c++) {
      const id = cellId(r, c);
      const bead = state.beads[id];
      const tile = state.tiles[id];
      const empty = !bead && !tile;
      const canTile = empty && sel?.kind === 'tile' && triadEndsThrough(state, id).length > 0;
      const canInfuse = empty && sel?.kind === 'card';
      const cls = ['cell', bead ? 'has-bead' : '', tile ? 'has-tile' : '', inspect === id ? 'inspected' : '', canTile ? 'cue-tile' : '', canInfuse ? 'cue-infuse' : ''].join(' ');
      cells.push(
        <button key={id} className={cls} onClick={() => onCell(id)} aria-label={`cell ${id}`}>
          {bead && <BeadGlyph state={state} cell={id} />}
          {tile && <span className="tileface">{TILES[tile.tileId]?.glyph}</span>}
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
    <span className={`bead p${bead.owner}`} title={card ? `${card.name} — ${card.text}` : 'a bead'}>
      <span className="bead-main">{main}</span>
      {bead.glyphIds.length > 1 && <span className="bead-extra">{bead.glyphIds.slice(1).map((g) => GLYPHS[g]?.glyph).join('')}</span>}
    </span>
  );
}

function Inspector({ state, cell }: { state: GameState; cell: CellId | null }) {
  if (!cell || !state.beads[cell]) return <div className="panel"><h2>Bead</h2><p className="muted">Select a bead to read its significance.</p></div>;
  const bead = state.beads[cell];
  const card = bead.cardId ? CARDS[bead.cardId] : undefined;
  const [r, c] = parseCell(cell);
  return (
    <div className="panel">
      <h2>Bead @ {r},{c}</h2>
      {card ? (
        <>
          <p className="bead-title">{card.glyphs.map((g) => GLYPHS[g]?.glyph).join(' ')} {card.name}</p>
          <p>{card.text}</p>
          <p className="src">{card.sourceRef}</p>
          {card.portal && PORTAL_MAP[card.portal] && (
            <a className="portal-link" href={PORTAL_MAP[card.portal].url} target="_blank" rel="noopener noreferrer">
              Explore the source · {PORTAL_MAP[card.portal].title} ↗
            </a>
          )}
        </>
      ) : <p className="muted">An uninfused bead.</p>}
      <h3>Glyphs applied</h3>
      <p>{bead.glyphIds.length ? bead.glyphIds.map((g) => `${GLYPHS[g]?.glyph} ${GLYPHS[g]?.label.split(' — ')[0]}`).join(' · ') : '—'}</p>
    </div>
  );
}

function ResultLines({ state }: { state: GameState }) {
  const w = winner(state);
  return (
    <>
      <ul className="results">
        {state.players.map((p) => (<li key={p.id}>{p.name}: <b>{p.score}</b> · {state.triads.filter((t) => t.by === p.id).length} triads</li>))}
      </ul>
      {state.players.length > 1 && <p className="verdict">{w === 'tie' ? 'A perfect equilibrium — a tie.' : `${(w as { name: string }).name} achieves the higher synthesis.`}</p>}
    </>
  );
}

function Log({ lines }: { lines: string[] }) {
  return <div className="panel log"><h2>The play</h2><ol>{lines.slice(-14).map((l, i) => <li key={i}>{l}</li>)}</ol></div>;
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
      <div className="portalbar-links">
        {PORTALS.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" title={p.blurb}>{p.title}</a>
        ))}
      </div>
    </div>
  );
}
