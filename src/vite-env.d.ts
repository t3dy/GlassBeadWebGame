/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Absent → app runs local-only (guest mode). */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon key (public by design; security comes from RLS). */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
