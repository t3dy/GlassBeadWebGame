import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Node typing so this config compiles under tsc without @types/node.
declare const process: { env: Record<string, string | undefined> };

// https://vite.dev/config/  (test config lives in vitest.config.ts)
// Base path is host-dependent:
//   - Vercel / dev: served from root `/` (the default below).
//   - GitHub Pages: project path `/GlassBeadWebGame/`, injected via BASE_PATH
//     in .github/workflows/deploy.yml.
export default defineConfig(() => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
}));
