import { defineConfig } from 'vitest/config';

// Engine tests are pure TS (no JSX) — no React plugin needed here.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
