import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/  (test config lives in vitest.config.ts)
// On `build` we serve from the GitHub Pages project path; dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/GlassBeadWebGame/' : '/',
  plugins: [react()],
}));
