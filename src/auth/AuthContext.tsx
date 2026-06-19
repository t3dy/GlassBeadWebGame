import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase, isCloudConfigured } from '../store/supabase';
import {
  fetchProfile, signIn as apiSignIn, signOut as apiSignOut, signUp as apiSignUp,
  type Profile, type SignUpInput,
} from './authClient';
import { initSync, teardownSync } from '../store/sync';
import type { GameState } from '../engine/types';

type AuthStatus = 'loading' | 'authed' | 'guest';

interface AuthValue {
  configured: boolean;
  status: AuthStatus;
  profile: Profile | null;
  /** A board pulled from the cloud on login; App applies it then calls clearCloudGame(). */
  cloudGame: GameState | null;
  clearCloudGame: () => void;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(isCloudConfigured ? 'loading' : 'guest');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cloudGame, setCloudGame] = useState<GameState | null>(null);
  const lastUserId = useRef<string | null>(null);

  // When a user becomes active, load their profile + sync their data.
  async function onSignedIn(userId: string) {
    if (lastUserId.current === userId) return;
    lastUserId.current = userId;
    setProfile(await fetchProfile(userId));
    const game = await initSync(userId);
    if (game) setCloudGame(game);
    setStatus('authed');
  }

  function onSignedOut() {
    lastUserId.current = null;
    teardownSync();
    setProfile(null);
    setStatus('guest');
  }

  useEffect(() => {
    if (!supabase) return; // guest mode: nothing to wire
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) void onSignedIn(data.session.user.id);
      else setStatus('guest');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) void onSignedIn(session.user.id);
      else onSignedOut();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthValue>(() => ({
    configured: isCloudConfigured,
    status,
    profile,
    cloudGame,
    clearCloudGame: () => setCloudGame(null),
    signIn: apiSignIn,
    signUp: async (input) => { await apiSignUp(input); await apiSignIn(input.username, input.password); },
    signOut: apiSignOut,
  }), [status, profile, cloudGame]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
