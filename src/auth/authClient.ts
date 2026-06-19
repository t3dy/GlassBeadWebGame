import { supabase, isCloudConfigured } from '../store/supabase';

// Auth: username + password (email optional). Supabase Auth is email-based, so a
// username is mapped to a synthetic email `<slug>@gbg.local`; login is always by
// username. A real email (if supplied) is stored in `profiles` for later recovery.

/** Synthetic-email domain for username-only accounts. Not a real mail domain. */
const SYNTH_DOMAIN = 'gbg.local';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
}

/** Allowed username: 3–24 chars, letters/digits/`_ - .`, must start alphanumeric. */
export function isValidUsername(name: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,23}$/.test(name.trim());
}

/** Lowercased, address-safe form of a username (used for the synthetic email). */
export function slugifyUsername(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
}

/** Deterministic synthetic login email for a username. */
export function usernameToEmail(name: string): string {
  return `${slugifyUsername(name)}@${SYNTH_DOMAIN}`;
}

function requireClient() {
  if (!supabase) throw new Error('Cloud accounts are not configured (running in guest mode).');
  return supabase;
}

export interface SignUpInput {
  username: string;
  password: string;
  email?: string;
}

/** Create an account, then its profile row. Returns the new profile. */
export async function signUp({ username, password, email }: SignUpInput): Promise<Profile> {
  const client = requireClient();
  const uname = username.trim();
  if (!isValidUsername(uname)) {
    throw new Error('Username must be 3–24 characters: letters, digits, and . _ - only.');
  }

  // Pre-check availability for a friendly message (also guarded by a unique index).
  const { data: available, error: rpcErr } = await client.rpc('username_available', { check_name: uname });
  if (rpcErr) throw new Error(rpcErr.message);
  if (available === false) throw new Error(`Username "${uname}" is already taken.`);

  const { data, error } = await client.auth.signUp({
    email: usernameToEmail(uname),
    password,
  });
  if (error) throw new Error(error.message);
  const user = data.user;
  if (!user) throw new Error('Sign-up did not return a user.');

  const profile: Profile = { id: user.id, username: uname, email: email?.trim() || null };
  const { error: profErr } = await client.from('profiles').insert(profile);
  if (profErr) throw new Error(profErr.message);
  return profile;
}

/** Log in by username + password. */
export async function signIn(username: string, password: string): Promise<void> {
  const client = requireClient();
  const { error } = await client.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** Fetch the profile row for a user id, or null. */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export { isCloudConfigured };
