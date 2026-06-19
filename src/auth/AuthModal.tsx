import { useState } from 'react';
import { useAuth } from './AuthContext';

// Sign in / sign up. Username + password; email is optional (for future recovery).
// Grounding: framed as entering the Order of players — Hesse's Castalia.

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === 'in') await signIn(username, password);
      else await signUp({ username, password, email: email || undefined });
      onClose();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'in' ? 'Enter Castalia' : 'Join the Order'}</h2>
        <p className="muted">
          {mode === 'in'
            ? 'Sign in to carry your beads, cards, and games across devices.'
            : 'Choose a name for the play. Your work saves to the shared crystal.'}
        </p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, textAlign: 'left' }}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus
              autoComplete="username" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'} required />
          </label>
          {mode === 'up' && (
            <label>
              Email <span className="muted">(optional — for recovery)</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
          )}
          {err && <p style={{ color: '#a02000', margin: 0 }}>{err}</p>}
          <div className="overlay-controls">
            <button type="submit" className="btn gold" disabled={busy}>
              {busy ? '…' : mode === 'in' ? 'Sign in' : 'Create account'}
            </button>
            <button type="button" className="btn ghost" onClick={onClose} disabled={busy}>Cancel</button>
          </div>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          {mode === 'in' ? 'New here? ' : 'Already enrolled? '}
          <button className="btn ghost sm" type="button" onClick={() => { setErr(null); setMode(mode === 'in' ? 'up' : 'in'); }}>
            {mode === 'in' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
