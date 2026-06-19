import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { useSyncStatus } from './useSyncStatus';
import type { SyncStatus } from '../store/sync';

const SYNC_LABEL: Record<SyncStatus, string> = {
  offline: '', idle: '☁ Synced', syncing: '⟳ Saving…', saved: '✓ Saved', error: '⚠ Sync error',
};

/** Top navigation: account (sign in/up / sign out), the sync chip, and the Saves entry. */
export function NavBar({ onOpenSaves }: { onOpenSaves: () => void }) {
  const { configured, status, profile, signOut } = useAuth();
  const sync = useSyncStatus();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <nav className="navbar">
      <span className="navbar-brand">Glass Bead Game</span>
      <span className="navbar-spacer" />

      {status === 'authed' && (
        <>
          {SYNC_LABEL[sync] && <span className={`sync-chip sync-${sync}`}>{SYNC_LABEL[sync]}</span>}
          <button className="btn ghost sm" onClick={onOpenSaves}>⛬ Saves</button>
          <span className="navbar-user">▣ {profile?.username ?? 'player'}</span>
          <button className="btn ghost sm" onClick={() => void signOut()}>Sign out</button>
        </>
      )}

      {status === 'guest' && configured && (
        <button className="btn gold sm" onClick={() => setAuthOpen(true)}>Sign in</button>
      )}

      {status === 'guest' && !configured && (
        <span className="navbar-user" title="Cloud accounts are not configured; your work saves to this browser only.">
          Guest · local only
        </span>
      )}

      {status === 'loading' && <span className="navbar-user">…</span>}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </nav>
  );
}
