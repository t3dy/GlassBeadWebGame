// GAME MODES — themed "ways to play" the Glass Bead Game, each a collaborative project type or
// conversation style. A mode sets (a) how many moves each collaborator gets, (b) the *verb* of a
// move, and (c) the system's **customized interaction prompts**: when two beads are related, the
// system speaks in the mode's voice, asking a mode-appropriate question about their synthesis.
//
// Modes subdivide by GENRE (e.g. Novel → Science Fiction; Bong Session → Philosophical; Video Game →
// Roguelike). A genre refines the prompts; with no genre chosen, the mode's own base prompts apply.
//
// Prompt templates use slots: {a} {b} = the two beads' names; {op} = the relation/operation gloss.

export interface Genre {
  id: string;
  name: string;
  tagline: string;
  prompts: string[]; // genre-specific interaction prompts (override the mode's base prompts)
}

export interface GameMode {
  id: string;
  name: string;
  kind: string;          // the collaborative form / conversation style
  moveVerb: string;      // what a single move is called in this mode
  movesPerPlayer: number;
  invocation: string;    // shown when the mode begins
  voice: string;         // describes how the system prompts in this mode
  prompts: string[];     // base interaction-prompt templates (used when no genre is chosen)
  genres: Genre[];
}

const g = (id: string, name: string, tagline: string, prompts: string[]): Genre => ({ id, name, tagline, prompts });

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
      '{a} {op} {b}. Dwell on the figure this makes in the growing crystal of insight.',
      'What third thing is born when {a} weds {b}?',
    ],
    genres: [
      g('counterpoint', 'Counterpoint of Opposites', 'reconcile two hostile principles', [
        'Take {a} and {b} as hostile principles — law and freedom — and develop them until they resolve into one chord.',
        'Where is the still point at which {a} and {b} cease to oppose and begin to mirror?',
      ]),
      g('fugue', 'The Fugue', 'theme, inversion, return', [
        'State {a} as a theme; let {b} be its inversion. Where do the voices cross?',
        'Carry {a} through {b} as a subject through a stretto. What returns, transformed?',
      ]),
      g('ascent', 'The Ascent', 'climb the eight circuits', [
        'Read {a} → {b} as a climb of the circuits, from the bodily toward the non-local. Which rung is this?',
        'What in {a} must die so that {b} can be born on the next circuit up?',
      ]),
      g('maybe', 'Maybe Logic', 'hold every model as provisional', [
        'Hold {a} {op} {b} as merely *probable*. What reality tunnel would read it otherwise?',
        'State the link of {a} and {b} in E-Prime — without the word “is.” What changes?',
      ]),
    ],
  },
  {
    id: 'novel',
    name: 'The Novel',
    kind: 'collaborative long-form fiction',
    moveVerb: 'draft a scene',
    movesPerPlayer: 30,
    invocation: 'Open on a place and a year. We are writing a novel together; every bead is a character, a setting, or a fate.',
    voice: "Like a novelist's notebook, the system prompts for scene, desire, obstacle, and the turn.",
    prompts: [
      'A scene: {a} encounters {b}. Whose desire drives it, and what stands in the way?',
      'Give {a} a wound that {b} reopens. Write the line of dialogue that lands.',
      'Whose point of view narrates the meeting of {a} and {b} — and what do they get wrong?',
    ],
    genres: [
      g('historical', 'Historical', 'the pressure of a real age', [
        'Anchor {a} and {b} to a documented year. What pressure of the age forces their meeting?',
        'What object in the room betrays the period when {a} confronts {b}?',
      ]),
      g('scifi', 'Science Fiction', 'an idea and its consequence', [
        'Make {a} a technology and {b} its unforeseen consequence. What world results?',
        'Extrapolate {a} {op} {b} one century on. Who pays the price?',
      ]),
      g('gothic', 'Gothic', 'the past that will not stay buried', [
        'Let {a} haunt {b}. What past crime seeps through the walls?',
        'Render {a} and {b} so the house itself seems the third character.',
      ]),
      g('noir', 'Hardboiled Noir', 'everyone is lying, and it’s raining', [
        '{a} hires, double-crosses, or kills {b}. Who is lying — and what is the rain doing?',
        'End the chapter on the thing {a} learns too late about {b}.',
      ]),
      g('magical-realism', 'Magical Realism', 'the impossible stated as fact', [
        'State the impossible thing about {a} as plain fact, and let {b} fail to be surprised.',
        'Let {a} and {b} share one quiet miracle the whole village agrees not to mention.',
      ]),
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
      'End on {b}. What earlier detail of {a} must you plant so the ending lands?',
      'If the gun is {a}, when does {b} fire it?',
    ],
    genres: [
      g('literary', 'Literary', 'the quiet epiphany', ['Find the small, ordinary moment in which {a} reveals {b} — and the life behind it.']),
      g('horror', 'Horror', 'dread, accreting', ['Let the wrongness of {a} accrete around {b} until the last line names it.']),
      g('fable', 'Fable', 'a moral with a sting', ['Tell {a} and {b} as a fable whose moral is not the one you expected.']),
      g('flash', 'Flash Fiction', 'a whole world in 300 words', ['Give the entire arc of {a} and {b} in a single, turning paragraph.']),
    ],
  },
  {
    id: 'poem',
    name: 'Poem',
    kind: 'lyric composition',
    moveVerb: 'set a line',
    movesPerPlayer: 14,
    invocation: 'Fourteen turns, or as many as the breath allows. Sound and image before sense.',
    voice: 'The system prompts for metaphor, music, and the leap between unlike things.',
    prompts: [
      'Make {a} the vehicle and {b} the tenor of one metaphor.',
      '{a} {op} {b}: render it as an image with no abstraction at all.',
      'What does {a} become by the poem’s end that {b} made it?',
    ],
    genres: [
      g('sonnet', 'Sonnet', 'the turn at the volta', ['Place {a} in the octave and {b} after the volta. What turns between them?']),
      g('haiku', 'Haiku', 'a season-word and a cut', ['Set {a} against {b} with a cutting-word between, and a season hidden in one.']),
      g('beat', 'Beat / Howl', 'the long ecstatic breath', ['Let {a} and {b} pour out in one long unpunctuated breath of the holy and the wrecked.']),
      g('psalm', 'Hymn / Psalm', 'address the divine', ['Address {a} as the divine and {b} as the supplicant. What is the prayer?']),
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
      'Balance the weight of {a} against {b}. What small mark restores the composition?',
    ],
    genres: [
      g('allegory', 'Renaissance Allegory', 'figures that personify', ['Let {a} and {b} personify two virtues or vices; what gesture binds them in the picture?']),
      g('surreal', 'Surrealism', 'dream-logic juxtaposition', ['Place {a} beside {b} with the impossible calm of a dream. What does the juxtaposition mean?']),
      g('abstract', 'Abstract', 'pure form and colour', ['Reduce {a} and {b} to mass, line, and colour. What tension holds the field?']),
      g('symbolist', 'Symbolist', 'mood over depiction', ['Paint not {a} and {b} but the mood between them. What veil hangs over the scene?']),
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
      'Find the one anecdote where {a} and {b} collide and the character stands exposed.',
      'What did {b} cost {a}? Account for it honestly.',
    ],
    genres: [
      g('hagiography', 'Hagiography', 'the saint’s virtues', ['Tell how {a} prefigured the sanctity that {b} fulfilled. (And note what the legend omits.)']),
      g('expose', 'Tell-All', 'the buried scandal', ['Reveal the thing about {a} and {b} the authorized biography would never print.']),
      g('intellectual', 'Intellectual Biography', 'the life of an idea', ['Trace how the idea in {a} grew, through {b}, into the work the subject is known for.']),
      g('tragic', 'Tragic Arc', 'the flaw that undoes', ['Make {a} the gift and {b} the same gift turned fatal. Where is the reversal?']),
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
      'What is the strongest objection {b} poses to your reading of {a}? Concede or rebut.',
      'Situate {a} and {b} in the existing literature. What gap do they jointly fill?',
    ],
    genres: [
      g('analytic', 'Analytic Philosophy', 'define, argue, object', ['Define {a} precisely, then test whether {b} is necessary, sufficient, or neither.']),
      g('theory', 'Critical Theory', 'power and ideology', ['Whose interests does the pairing of {a} and {b} serve? Read it against the grain.']),
      g('history-of-science', 'History of Science', 'the experiment in context', ['Reconstruct the moment {a} met {b} in the laboratory or the archive. What did contemporaries miss?']),
      g('close-reading', 'Close Reading', 'the text itself', ['Read the single passage where {a} and {b} touch. What does the form do that the paraphrase cannot?']),
    ],
  },
  {
    id: 'film-critique',
    name: 'Withering Film Critique',
    kind: 'caustic criticism',
    moveVerb: 'land a barb',
    movesPerPlayer: 10,
    invocation: 'Lights up. We are here to bury it, wittily. Each bead is a choice the film made, and will answer for.',
    voice: 'Erudite and gleefully merciless, the system prompts for the precise, quotable evisceration.',
    prompts: [
      'Skewer the way {a} is yoked to {b} — name the cliché it mistakes for depth.',
      'Grant {a} one genuine virtue, the better to mourn what {b} does to it.',
      'Write the one-line pull-quote that ensures no one sees this on your account.',
    ],
    genres: [
      g('auteurist', 'Auteurist', 'the director’s fingerprints', ['Find the director’s signature in {a} — and the lazy self-parody it becomes by {b}.']),
      g('ideological', 'Ideological', 'what the film smuggles', ['Expose what {a} and {b} quietly want you to believe. Refuse it, with style.']),
      g('camp', 'Camp / So-Bad-It’s-Good', 'gleeful celebration of failure', ['Celebrate the sublime wrongness of {a} colliding with {b}. Why is this trash transcendent?']),
      g('formalist', 'Formalist', 'shot, cut, sound', ['Indict the editing that joins {a} to {b}. What does the cut betray?']),
    ],
  },
  {
    id: 'bong-session',
    name: 'Dorm-Room Bong-Hit Bull Session',
    kind: 'free-associative riffing',
    moveVerb: 'take a hit & riff',
    movesPerPlayer: 8,
    invocation: 'Somebody find the lighter. Okay okay but like… what if every bead is, like, connected, man?',
    voice: 'Loose, grandiose, and free-associative: the system prompts for the cosmic leap and the 3 a.m. revelation.',
    prompts: [
      'Whoa — what if {a} and {b} are, like, the *same thing*? Run with it.',
      'Connect {a} to {b} to pizza in three moves. Go.',
      'Is {a} kinda the {b} of, like, *everything*? Why is no one talking about this?',
    ],
    genres: [
      g('philosophical', 'Philosophical', 'but what *is* it, really', [
        'But like… what *is* {a}, really? And is {b} even real, man, or just a word for {a}?',
        'If a tree is {a} and no one hears {b}, does the universe still, like, *care*?',
      ]),
      g('conspiracy', 'Conspiracy', 'wake up, sheeple', [
        '{a} and {b}? That’s the Illuminati. The fnords were in front of you the whole time.',
        'Follow the money from {a} to {b}. Bet it ends at the same five families.',
      ]),
      g('cosmic', 'Cosmic / Psychedelic', 'higher vibrations', [
        'Dude, {a} is just {b} on a higher vibration of the same energy. We’re all {a}.',
        'What if death is just {a} logging out and {b} is the loading screen?',
      ]),
      g('pop-culture', 'Pop-Culture Deep Dive', 'the lore goes deep', [
        'Okay but {a} is *basically* the {b} of the whole franchise. Hear me out.',
        'Ranked: is {a} a top-tier {b}, or mid? Defend it like your GPA depends on it.',
      ]),
    ],
  },
  {
    id: 'video-game',
    name: 'Video Game',
    kind: 'collaborative game design',
    moveVerb: 'design a system',
    movesPerPlayer: 16,
    invocation: 'Boot the machine. Each bead is a mechanic, a level, a character, or a system; design the loop together.',
    voice: 'The system prompts like a game designer — core loops, verbs, progression, and what the player learns by failing.',
    prompts: [
      'What is the core loop that connects {a} to {b}?',
      '{a} {op} {b}: is this a mechanic, a reward, or a wall?',
      'What does the player learn the first time {a} meets {b}?',
    ],
    genres: [
      g('roguelike', 'Roguelike', 'permadeath and the next run', [
        '{a} is the run; {b} is the boss that ends it. What does permadeath teach the next attempt?',
        'Make {a} a procedurally-placed reward and {b} the risk that guards it. Is the gamble fair?',
      ]),
      g('visual-novel', 'Visual Novel', 'branching choices', [
        'Branch on {a}: which choice leads to {b}, and which to the bad ending?',
        'What affection or trust stat does choosing {a} over {b} quietly change?',
      ]),
      g('open-world', 'Open-World RPG', 'regions, factions, quests', [
        '{a} is a region, {b} a faction. What side-quest binds them — and which one breaks the world?',
        'Hide {b} as emergent reward for the player who truly explores {a}.',
      ]),
      g('soulslike', 'Soulslike', 'lore told by the world', [
        '{a} guards the path to {b}. What lore is told only by the environment and item descriptions?',
        'What hard-won pattern must the player learn to turn {a} from a wall into {b}, a door?',
      ]),
      g('puzzle', 'Puzzle Box', 'mechanism and insight', [
        '{a} is the mechanism, {b} the locked door. What single insight is the key?',
        'Teach the rule of {a} wordlessly, so the player feels clever solving {b}.',
      ]),
    ],
  },
];

export const MODE_MAP: Record<string, GameMode> = Object.fromEntries(MODES.map((m) => [m.id, m]));
export const DEFAULT_MODE_ID = 'magister';

// Stable string hash so a given pairing always draws the same prompt (re-rolls when op/genre differ).
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Compose the system's customized interaction prompt for relating bead `a` to bead `b`, in the given
 *  mode and (optionally) genre. With a genre, its prompts override the mode's base prompts. */
export function composeModePrompt(modeId: string, a: string, b: string, op = 'meets', genreId?: string): string {
  const mode = MODE_MAP[modeId] ?? MODE_MAP[DEFAULT_MODE_ID];
  const genre = genreId ? mode.genres.find((x) => x.id === genreId) : undefined;
  const pool = genre && genre.prompts.length ? genre.prompts : mode.prompts;
  const tmpl = pool[hash(`${a}|${op}|${genreId ?? ''}|${b}`) % pool.length];
  return tmpl.replace(/\{a\}/g, a).replace(/\{b\}/g, b).replace(/\{op\}/g, op);
}

export const genresOf = (modeId: string): Genre[] => (MODE_MAP[modeId] ?? MODE_MAP[DEFAULT_MODE_ID]).genres;
