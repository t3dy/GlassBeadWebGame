// Type the large generated corpus JSON via an ambient module so tsc does not infer a 3.4MB literal
// type (and so the import type-checks without resolveJsonModule). Vite resolves the JSON natively.
declare module '*unified.corpus.json' {
  import type { UnifiedCorpus } from './types';
  const value: UnifiedCorpus;
  export default value;
}
