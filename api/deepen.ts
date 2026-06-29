// SERVERLESS "DEEPEN" PROXY (Vercel Edge function). Holds the Anthropic key server-side and rewords an
// already-grounded Glass Bead Game suggestion in the active mode's voice. It is deliberately minimal:
// it forwards ONE sourced observation and a strict instruction to rephrase — never to add facts. The
// client (src/engine/claudeDeepen.ts) treats any failure as "fall back to the deterministic text", so
// this endpoint is optional: absent a key, it returns 503 and the game plays on unchanged.
//
// Deploy: set ANTHROPIC_API_KEY (and optionally CLAUDE_DEEPEN_MODEL) in the host's env. Honours the
// Grounding Rule: max_tokens is small, temperature modest, and the system prompt forbids new claims.

export const config = { runtime: 'edge' };

interface DeepenBody {
  text?: string;
  a?: string;
  b?: string;
  op?: string;
  modeVoice?: string;
}

const MODEL = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env?.CLAUDE_DEEPEN_MODEL ?? 'claude-opus-4-8';

function env(name: string): string | undefined {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const key = env('ANTHROPIC_API_KEY');
  if (!key) return json({ error: 'deepen disabled: no key configured' }, 503);

  let body: DeepenBody;
  try { body = (await req.json()) as DeepenBody; } catch { return json({ error: 'bad json' }, 400); }

  const text = (body.text ?? '').trim();
  const a = (body.a ?? '').slice(0, 120);
  const b = (body.b ?? '').slice(0, 120);
  if (!text) return json({ error: 'missing text' }, 400);

  const system =
    `You are the voice of a Glass Bead Game. ${body.modeVoice ?? ''} ` +
    `Rephrase the player's grounded observation about a pairing of two symbols in one or two ` +
    `evocative sentences, in that voice. Absolute rule: do NOT add any facts, names, dates, titles, ` +
    `or claims beyond what the observation already states. Stay faithful and contemplative. Output ` +
    `only the rephrasing, no preamble.`;
  const user = `Pairing: "${a}" and "${b}".\nObservation to rephrase: ${text}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        temperature: 0.7,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    if (!r.ok) return json({ error: `upstream ${r.status}` }, 502);
    const data = (await r.json()) as { content?: Array<{ type: string; text?: string }> };
    const out = (data.content ?? []).filter((c) => c.type === 'text').map((c) => c.text ?? '').join('').trim();
    return json({ text: out || text });
  } catch {
    return json({ error: 'upstream error' }, 502);
  }
}
