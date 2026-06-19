import { useEffect, useState } from 'react';
import type { GameState } from '../engine/types';
import {
  listGames, loadGame, saveGameAs, renameGame, deleteGame, type GameSummary,
} from '../store/sync';

// SAVES BROWSER — the player's "spaces in memory": each board state can be saved
// under a name, reopened, renamed, or discarded. Cloud-backed; requires sign-in.

export function SavesModal({ current, onLoad, onClose }: {
  current: GameState | null;
  onLoad: (state: GameState) => void;
  onClose: () => void;
}) {
  const [games, setGames] = useState<GameSummary[] | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = () => listGames().then(setGames);
  useEffect(() => { void refresh(); }, []);

  async function doSaveAs() {
    if (!current) return;
    setBusy(true);
    await saveGameAs(name.trim() || 'Untitled', current);
    setName('');
    await refresh();
    setBusy(false);
  }

  async function doLoad(id: string) {
    setBusy(true);
    const state = await loadGame(id);
    setBusy(false);
    if (state) { onLoad(state); onClose(); }
  }

  async function doRename(g: GameSummary) {
    const next = prompt('Rename this game:', g.name);
    if (next && next !== g.name) { await renameGame(g.id, next); await refresh(); }
  }

  async function doDelete(g: GameSummary) {
    if (!confirm(`Delete "${g.name}"? This cannot be undone.`)) return;
    await deleteGame(g.id);
    await refresh();
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-card" style={{ maxWidth: 560, textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: 'center' }}>⛬ Saved games</h2>
        <p className="muted">Each game is its own space in memory. Auto-saving keeps your current
          board; use “Save as…” to branch a copy you can return to.</p>

        <div style={{ display: 'flex', gap: 8, margin: '10px 0 16px' }}>
          <input placeholder="Name this board…" value={name} onChange={(e) => setName(e.target.value)}
            style={{ flex: 1 }} disabled={!current} />
          <button className="btn gold" onClick={doSaveAs} disabled={!current || busy}>Save as…</button>
        </div>

        {games === null && <p className="muted">Loading…</p>}
        {games?.length === 0 && <p className="muted">No saved games yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
          {games?.map((g) => (
            <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
              border: '1px solid var(--brass)', borderRadius: 8 }}>
              <span style={{ flex: 1 }}>
                {g.name} {g.is_current && <span className="muted">· current</span>}
                <br /><span className="muted" style={{ fontSize: 11 }}>{new Date(g.updated_at).toLocaleString()}</span>
              </span>
              <button className="btn ghost sm" onClick={() => doLoad(g.id)} disabled={busy}>Open</button>
              <button className="btn ghost sm" onClick={() => doRename(g)}>Rename</button>
              <button className="btn ghost sm" onClick={() => doDelete(g)}>Delete</button>
            </div>
          ))}
        </div>

        <div className="overlay-controls" style={{ marginTop: 16 }}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
