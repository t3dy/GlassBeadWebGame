// GAME MODES — themed "ways to play" the Glass Bead Game, each a collaborative project type or
// conversation style. A mode sets (a) how many moves each collaborator gets, (b) the *verb* of a
// move, and (c) the system's **customized interaction prompts**: when two beads are related, the
// system speaks in the mode's voice, asking a mode-appropriate question about their synthesis. The
// default "Magister's Game" keeps the contemplative Hesse register; the others reframe the same
// bead-and-relation mechanic as novel, poem, painting, critique, etc.
//
// Prompt templates use slots: {a} {b} = the two beads' names; {op} = the relation/operation gloss.

export interface GameMode {
  id: string;
  name: string;
  kind: string;          // the collaborative form / conversation style
  moveVerb: string;      // what a single move is called in this mode
  movesPerPlayer: number;
  invocation: string;    // shown when the mode begins
  voice: string;         // describes how the system prompts in this mode
  prompts: string[];     // interaction-prompt templates (filled when beads are related)
}

export const MODES: GameMode[] = [
  {
    id: 'magister',
    name: "The Magister's Game",
    kind: 'contemplative synthesis (the classic Game)',
    moveVerb: 'place a bead',
    movesPerPlayer: 12,
    invocation: 'The board is clear as the sun. Play in silence; let each bead answer the last, and reconcile what seems opposed.',
    voice: 'The Magister Ludi speaks softly, inviting meditation on the counterpoint between symbols — no haste, no winning, only synthesis.',
    prompts: [
      'Meditate on {a} and {b}: in what hidden counterpoint do they answer one another?',
      'Hold {a} against {b} as law against freedom — what synthesis reconciles them?',
      '{a} {op} {b}. Dwell on the figure this makes in the growing crystal of insight.',
      'What third thing is born when {a} weds {b}?',
      'Trace the line from {a} to {b} through every discipline it must cross.',
    ],
  },
  {
    id: 'novel',
    name: 'Historical Novel',
    kind: 'collaborative long-form fiction',
    moveVerb: 'draft a scene',
    movesPerPlayer: 30,
    invocation: 'Open on a place and a year. We are writing a novel together; every bead is a character, a setting, or a fate.',
    voice: "Like a novelist's notebook, the system prompts for scene, desire, obstacle, and the turn — and for the period detail that makes it true.",
    prompts: [
      'A scene: {a} encounters {b}. Whose desire drives it, and what stands in the way?',
      'Make {b} the secret {a} has been keeping. How does it surface — and to whom?',
      'Chapter turn: {a} {op} {b}. What does the reader now understand that the characters do not?',
      'Give {a} a wound that {b} reopens. Write the line of dialogue that lands.',
      'Set {a} and {b} in a single charged room. What object betrays the era?',
      'Whose point of view narrates the meeting of {a} and {b} — and what do they get wrong?',
    ],
  },
  {
    id: 'short-story',
    name: 'Short Story',
    kind: 'single-arc fiction',
    moveVerb: 'add a beat',
    movesPerPlayer: 12,
    invocation: 'One arc, one change. Every bead must earn its place on the way to a single turn.',
    voice: 'Terse and Chekhovian: the system presses toward economy, the loaded detail, and a final reversal.',
    prompts: [
      'Compress {a} and {b} into one image that does the work of a page.',
      '{a} {op} {b}: what is the smallest gesture that changes everything?',
      'End on {b}. What earlier detail of {a} must you plant so the ending lands?',
      'Cut everything but {a}, {b}, and the silence between them. What remains?',
      'If the gun is {a}, when does {b} fire it?',
    ],
  },
  {
    id: 'poem',
    name: 'Poem',
    kind: 'lyric composition',
    moveVerb: 'set a line',
    movesPerPlayer: 14,
    invocation: 'Fourteen turns, or as many as the breath allows. Sound and image before sense.',
    voice: 'The system prompts for metaphor, music, and the leap between unlike things — and for the turn at the volta.',
    prompts: [
      'Make {a} the vehicle and {b} the tenor of one metaphor.',
      'Find the sound {a} and {b} share, and let it carry the line.',
      '{a} {op} {b}: render it as an image with no abstraction at all.',
      'What does {a} become by the poem’s end that {b} made it?',
      'Place {a} and {b} on either side of the volta. What turns?',
    ],
  },
  {
    id: 'painting',
    name: 'Painting',
    kind: 'visual composition',
    moveVerb: 'lay a passage',
    movesPerPlayer: 16,
    invocation: 'The canvas is primed. Compose in light, mass, and colour; the beads are figures and grounds.',
    voice: 'Like a painter, the system prompts for composition, palette, the eye’s path, and what is left unpainted.',
    prompts: [
      'Place {a} in the light and {b} in shadow. Where does the eye enter?',
      'What colour does {a} cast onto {b} where they meet?',
      '{a} {op} {b}: is this foreground or ground, figure or atmosphere?',
      'Leave the space between {a} and {b} unpainted. What does the negative shape say?',
      'Balance the weight of {a} against {b}. What small mark restores the composition?',
    ],
  },
  {
    id: 'biography',
    name: 'Biography',
    kind: 'a life rendered',
    moveVerb: 'set down a fact',
    movesPerPlayer: 20,
    invocation: 'A life, from a fixed point. Each bead is an event, an influence, or a contradiction in the subject.',
    voice: 'The system prompts for the telling detail, the formative influence, and the gap between the public and private person.',
    prompts: [
      'How did {a} shape {b} in the making of this life?',
      '{a} {op} {b}: what does this reveal that the subject would deny?',
      'Find the one anecdote where {a} and {b} collide and the character stands exposed.',
      'Set the public {a} against the private {b}. Which is the truer self?',
      'What did {b} cost {a}? Account for it honestly.',
    ],
  },
  {
    id: 'article',
    name: 'Scholarly Research Article',
    kind: 'academic argument',
    moveVerb: 'advance the argument',
    movesPerPlayer: 18,
    invocation: 'State the thesis. Each bead is a claim, a source, or a counter-example; assemble the apparatus.',
    voice: 'Dry, rigorous, and footnoted: the system prompts for evidence, method, and the strongest objection.',
    prompts: [
      'Frame {a} as the evidence for a claim about {b}. What is the warrant?',
      '{a} {op} {b}: restate it as a falsifiable hypothesis.',
      'What is the strongest objection {b} poses to your reading of {a}? Concede or rebut.',
      'Situate {a} and {b} in the existing literature. What gap do they jointly fill?',
      'Footnote the limitation: where does the link between {a} and {b} fail to hold?',
    ],
  },
  {
    id: 'film-critique',
    name: 'Withering Film Critique',
    kind: 'caustic criticism',
    moveVerb: 'land a barb',
    movesPerPlayer: 10,
    invocation: 'Lights up. We are here to bury it, wittily. Each bead is a choice the film made, and will answer for.',
    voice: 'Erudite and gleefully merciless, the system prompts for the precise, quotable evisceration — and the one honest virtue worth mourning.',
    prompts: [
      'Skewer the way {a} is yoked to {b} — name the cliché it mistakes for depth.',
      '{a} {op} {b}: a “bold choice,” or the laziest beat in the picture? Defend the knife.',
      'Grant {a} one genuine virtue, the better to mourn what {b} does to it.',
      'Write the one-line pull-quote that ensures no one sees this on your account.',
      'Whom is the pairing of {a} and {b} actually *for*? Follow the cynicism to its source.',
    ],
  },
  {
    id: 'bong-session',
    name: 'Dorm-Room Bong-Hit Bull Session',
    kind: 'free-associative riffing',
    moveVerb: 'take a hit & riff',
    movesPerPlayer: 8,
    invocation: 'Somebody find the lighter. Okay okay but like… what if every bead is, like, connected, man?',
    voice: 'Loose, grandiose, and free-associative: the system prompts for the cosmic leap and the 3 a.m. revelation (rigor strictly optional).',
    prompts: [
      'Whoa — what if {a} and {b} are, like, the *same thing*? Run with it.',
      '{a} {op} {b}… does that mean the government knew the whole time?',
      'Okay but if {a} is the universe, is {b} just the universe looking at itself? …dude.',
      'Connect {a} to {b} to pizza in three moves. Go.',
      'Is {a} kinda the {b} of, like, *everything*? Why is no one talking about this?',
    ],
  },
];

export const MODE_MAP: Record<string, GameMode> = Object.fromEntries(MODES.map((m) => [m.id, m]));
export const DEFAULT_MODE_ID = 'magister';

// Stable string hash so a given pairing always draws the same prompt within a mode (re-rolls when a
// different operation/relation is supplied via `op`).
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Compose the system's customized interaction prompt for relating bead `a` to bead `b` in `modeId`. */
export function composeModePrompt(modeId: string, a: string, b: string, op = 'meets'): string {
  const mode = MODE_MAP[modeId] ?? MODE_MAP[DEFAULT_MODE_ID];
  const tmpl = mode.prompts[hash(`${a}|${op}|${b}`) % mode.prompts.length];
  return tmpl.replace(/\{a\}/g, a).replace(/\{b\}/g, b).replace(/\{op\}/g, op);
}
