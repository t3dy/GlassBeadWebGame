// OPT-IN HOSTED CLAUDE ("deepen") — the hybrid counterpart to the in-browser WebLLM seam (llm.ts).
// Same contract: it only ever *rephrases* an already-grounded, cited suggestion in the active mode's
// voice; it never invents facts, and on any failure (off, no endpoint, network/key error) it returns
// the deterministic text UNCHANGED, so offline and guest play are never blocked. The Grounding Rule
// holds — Claude is handed the sourced observation and told to reword it, nothing more.
//
// WHY SERVERLESS: an Anthropic API key must never ship to the browser. The client POSTs to a small
// same-origin function (api/deepen.ts on Vercel) that holds the key server-side and proxies the call.
// Absent that function (e.g. the static GitHub Pages build), the fetch fails and we fall back — so the
// feature is simply dormant there, by design.

const FLAG = 'gbg_claude_optin_v1';
const ENDPOINT_KEY = 'gbg_claude_endpoint_v1';
const DEFAULT_ENDPOINT = '/api/deepen';

export const isClaudeEnabled = (): boolean => {
  try { return localStorage.getItem(FLAG) === '1'; } catch { return false; }
};
export const setClaudeEnabled = (on: boolean): void => {
  try { on ? localStorage.setItem(FLAG, '1') : localStorage.removeItem(FLAG); } catch { /* ignore */ }
};

// The endpoint is configurable so a self-hoster can point at their own proxy; defaults to same-origin.
export const claudeEndpoint = (): string => {
  try { return localStorage.getItem(ENDPOINT_KEY) || DEFAULT_ENDPOINT; } catch { return DEFAULT_ENDPOINT; }
};
export const setClaudeEndpoint = (url: string): void => {
  try { url ? localStorage.setItem(ENDPOINT_KEY, url) : localStorage.removeItem(ENDPOINT_KEY); } catch { /* ignore */ }
};

export interface DeepenCtx {
  a: string;
  b: string;
  modeVoice: string;
  op?: string;
}

/** Rephrase a grounded suggestion via the hosted Claude proxy. Returns the original `text` on any
 *  failure or when the feature is off, so callers can use the result unconditionally. A short timeout
 *  keeps a stalled network from blocking a move. */
export async function deepenSuggestion(text: string, ctx: DeepenCtx, timeoutMs = 12000): Promise<string> {
  if (!isClaudeEnabled() || typeof fetch !== 'function') return text;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const res = await fetch(claudeEndpoint(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, a: ctx.a, b: ctx.b, op: ctx.op ?? 'meets', modeVoice: ctx.modeVoice }),
      signal: controller?.signal,
    });
    if (!res.ok) return text;
    const data = (await res.json()) as { text?: string };
    const out = (data.text ?? '').trim();
    return out.length > 0 ? out : text;
  } catch {
    return text;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
