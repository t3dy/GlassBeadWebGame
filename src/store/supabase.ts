import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase client — the shared "crystal" backend (auth + per-user storage).
// LOCAL-FIRST: if the two VITE_ env vars are absent, `supabase` is null and the
// whole app runs in guest mode with no network (see docs/DEPLOYMENT.md).

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/** True when both env vars are present, so cloud login + sync are available. */
export const isCloudConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isCloudConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
