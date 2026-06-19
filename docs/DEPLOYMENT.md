# Deployment

> **Live now:** the playable core is deployed to **GitHub Pages** via GitHub Actions
> (`.github/workflows/deploy.yml`: push to `main` → `npm ci` → `npm test` → `npm run build` →
> deploy). URL: **https://t3dy.github.io/GlassBeadWebGame/** . The Vite `base` defaults to root
> `/`; the Pages workflow injects `BASE_PATH=/GlassBeadWebGame/` so only the Pages build uses the
> project subpath. This is the simplest GitHub-native host and needs no extra accounts.
>
> The Vercel + Supabase plan below remains the path for when the **shared/online** features
> (collaborative play, the crystal) come online — those need a backend Pages can't provide.

## Vercel (Hobby) + Supabase (Free) — for the online phase

Hosting target decided 2026-06-18. The two services are **complementary**, not competing:

- **Vercel (Hobby/free)** hosts the **frontend** — the Vite/React app built to static output and
  served from Vercel's CDN. Account: `tedhand-2181s-projects`.
- **Supabase (free)** hosts the **shared backend** — Postgres + auth + realtime — as a separate
  service the browser talks to **directly** (anon key + Row-Level Security). See
  [DATA_MODEL](DATA_MODEL.md#shared-backend-supabase--phase-5).

This means **no Vercel serverless functions are required** for the shared crystal in Phase 5 — the
SPA calls Supabase from the client. Keep it that way unless a real need for a secret-bearing
server route appears (then add a single `/api` route; mind Hobby limits below).

## Vercel build settings (SPA)

- **Framework preset:** Vite. **Build:** `npm run build`. **Output dir:** `dist`.
- **Base path:** Vercel serves from root, so leave `BASE_PATH` **unset** — `vite.config.ts` defaults
  `base` to `/`. (Only the GitHub Pages workflow sets `BASE_PATH=/GlassBeadWebGame/`.)
- **SPA routing:** `vercel.json` (committed at repo root) keeps client routes from 404-ing on refresh:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Env vars** (Project → Settings → Environment Variables). Vite only exposes vars prefixed
  `VITE_` to the client, so these are *public by design* — never put secrets here:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`  ← anon key only; security comes from **RLS**, not from hiding it.
- Connect the GitHub repo for push-to-deploy (preview deploys per branch, production on `main`).

## Hobby-tier constraints to design within

- **Personal / non-commercial use** only (fine for this project).
- Generous static bandwidth; **serverless function** limits are tight (short max duration, limited
  count, no always-on). → Prefer the **client → Supabase** path; avoid heavy/long server routes.
- No private env access from the static bundle — anything secret must live in Supabase (RLS, edge
  functions) or a deliberately-added serverless route, **never** in `VITE_` vars.

## Security notes (carry into Phase 5)

- Client uses the **anon key** + **RLS policies**: published games world-readable; writes scoped to
  the authenticated owner. The **service-role key never reaches the browser or Vercel build.**
- Local-first still works with **no env vars at all** — `LocalDataStore` needs no network. Supabase
  config is read at runtime; if absent, the app stays in local-only mode gracefully.

## Turning on cloud accounts + sync (what you provision)

The auth + per-user persistence code ships **now** and runs in **guest mode** (local-only) until
these two env vars are set. To go live:

1. **Create a Supabase project** (account `tedhand-2181s-projects` → New project). Note the
   **Project URL** and **anon/public key** (Settings → API).
2. **Run the schema:** open the SQL editor and paste [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql)
   (creates `profiles`, `user_library`, `games` with owner-only RLS + a `username_available` check).
3. **Disable email confirmation:** Auth → Providers → Email → turn **Confirm email** *off*. The app
   uses username + password and maps usernames to synthetic `…@gbg.local` emails, which can't receive
   a confirmation link. (Email is collected optionally for future recovery and stored in `profiles`.)
4. **Set the env vars** locally in `.env` (copy from [`.env.example`](../.env.example)) and in Vercel
   (Project → Settings → Environment Variables): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
5. Reload — the nav bar now shows **Sign in**; new accounts auto-create a profile, and every card,
   glyph, pack, and board state auto-syncs (debounced) to the signed-in user.

What syncs: the **user library** (Print Shop cards/glyphs + packs) as one `user_library` row, and
**board states** as `games` rows (one flagged `is_current` auto-saves the live board; "Save as…"
branches named copies). Guest work is pushed up on first login if the cloud is empty, so nothing is lost.

## Where this lands in the plan

- **Phase 0:** add `vercel.json`; do a first deploy of the empty Green-Stone grid to confirm the
  pipeline (push → Vercel build → live URL).
- **Phase 5:** provision the Supabase project, set the two `VITE_` env vars in Vercel, ship
  `SupabaseDataStore`.
