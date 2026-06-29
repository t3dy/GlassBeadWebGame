// EXTRA INTERACTION PROMPTS — additional in-voice templates that enlarge each mode/genre's variety
// without bloating modes.ts. composeModePrompt() (modes.ts) merges these onto the mode's own base
// prompts and each genre's prompts, so adjacency suggestions don't repeat as quickly.
//
// PROVENANCE: the magister/novel/biography/article/video-game sets were drafted by an ultracode
// workflow (one narrative-designer agent per mode) and passed an adversarial paraphrase/grounding
// verifier (no invented facts; both {a} and {b} present; distinct from existing prompts). The remaining
// six modes are hand-authored to the same bar — the verifier flagged a paraphrase in each, so those
// specific beats were rewritten to a structurally distinct move. Slots: {a} {b} = bead names; {op} =
// the relation gloss. These are content-NEUTRAL templates (the Grounding Rule lives in the cards).

export interface ModePromptExtra {
  base: string[];
  genres: Record<string, string[]>;
}

export const EXTRA_PROMPTS: Record<string, ModePromptExtra> = {
  magister: {
    base: [
      'Set {a} beside {b} and listen: which of them is the question, and which the long-awaited answer?',
      'Let {a} and {b} sound together until the discord softens into a single sustained tone — name that tone.',
      'Trace the thread that runs unbroken from {a} through {b} into the crystal already laid down.',
    ],
    genres: {
      counterpoint: [
        'Pit {a} against {b} as thesis against thesis, then sustain both until neither yields and a third voice speaks.',
        'If {a} is the rising line and {b} the falling, find the bar in which they pass through one another untouched.',
      ],
      fugue: [
        'Let {a} enter, and answer it a fifth away with {b}; over which held note do the two subjects finally agree?',
        'Augment {a} until it moves at half the speed of {b}, and mark the measure where the slower truth is heard beneath the faster.',
      ],
      ascent: [
        'Set {a} on the lower circuit and {b} on the higher; what single rite carries the imprint from one to the next?',
        'Read {a} {op} {b} as a shedding of skin — name the older self that the climb from one to the other leaves behind.',
      ],
      maybe: [
        'Suppose {a} {op} {b} is true in this tunnel and false in the next; what would each observer swear they had seen?',
        'Grant {a} and {b} only the status of a useful guess, then ask what you would do differently if the guess were wrong.',
      ],
    },
  },
  novel: {
    base: [
      'Put {a} and {b} in a locked room with one secret between them. Who opens the door, and why too late?',
      '{a} wants something only {b} can withhold. Stage the scene where the asking finally happens.',
      'Begin the chapter with {b} already changed by {a}. What was the off-page night that did it?',
    ],
    genres: {
      historical: [
        'Let {a} {op} {b} turn on a letter that arrives weeks too late by the roads of the age.',
        'Stage the meeting of {a} and {b} at the exact hour the old order is giving way to the new.',
      ],
      scifi: [
        'Let {a} be the instrument and {b} the law of nature it was never meant to break. What does the crew discover?',
        'Set {a} against {b} aboard the last vessel; what scarce resource forces the choice between them?',
      ],
      gothic: [
        'Have {a} discover {b} sealed behind a door no living servant remembers locking.',
        'Let the weather lean on the house as {a} reads aloud the diary that names {b}.',
      ],
      noir: [
        '{a} follows {b} three blocks through the wet neon before the photograph changes everything.',
        'Open the scene with {a} already dead and {b} the only one not sweating; who pays you to ask why?',
      ],
      'magical-realism': [
        'Note the day {a} stopped casting a shadow, and how {b} simply set another place at the table.',
        'Let the rain fall only on {a} for a generation while {b} keeps the family ledger of it without comment.',
      ],
    },
  },
  biography: {
    base: [
      'Place {a} early and {b} late in the life; what carried, unspoken, across the years between?',
      'In public the subject claimed {a}; in private it was {b}. Stand in that gap and tell the truth.',
      'Of {a} and {b}, which is the telling detail a careful biographer keeps, and which the one everyone repeats?',
    ],
    genres: {
      hagiography: [
        'Show {a} as the trial the subject endured and {b} as the grace that answered it; what miracle does the faithful reader supply?',
        'Let {b} be the relic that {a} leaves behind, and tell what the pilgrims choose not to ask.',
      ],
      expose: [
        'Name the witness who watched {a} become {b} and was paid, or frightened, into silence.',
        'Behind the official version of {a} lies {b}; follow the redacted line until someone flinches.',
      ],
      intellectual: [
        'Date the moment {a} hardened into conviction and {b} became the heresy the subject could no longer entertain.',
        "Show {a} as the borrowed idea and {b} as the misreading that, owned at last, became the subject's own.",
      ],
      tragic: [
        'Let {a} be the early triumph that taught the subject to trust {b}, the instinct that would betray everyone.',
        'Mark the last hour {a} could still have undone {b}; show the subject choosing, blind, against it.',
      ],
    },
  },
  article: {
    base: [
      'State the operationalized hypothesis that {a} predicts {b}, then name the observation that would falsify it.',
      'By what method would you isolate {a} from {b} as variables, and what confound survives the controls?',
      'Concede the limitation of treating {a} as data for {b}; what does your argument forfeit by the concession?',
    ],
    genres: {
      analytic: [
        'Distinguish the sense in which {a} entails {b} from the sense in which it merely accompanies it; the equivocation is fatal.',
        'Construct the counterexample in which {a} holds and {b} fails, then repair the principle that linked them.',
      ],
      theory: [
        'Whose silence is the condition for {a} to appear as {b}? Name the excluded term the pairing depends on.',
        'Treat the naturalness of {a} as {b} as a symptom; historicize the interest that made it seem inevitable.',
      ],
      'history-of-science': [
        'Trace how {a} hardened into {b} once the instruments and the funding agreed; whose anomaly was quietly discarded?',
        'Recover the rejected rival explanation that fit {a} to {b} just as well, and ask why the discipline forgot it.',
      ],
      'close-reading': [
        'Attend to the one word linking {a} to {b}; let its etymology and its rhythm carry more than the argument admits.',
        'Mark where {a} and {b} are joined by ellipsis or caesura rather than by syntax; the gap is doing the work.',
      ],
    },
  },
  'video-game': {
    base: [
      'Prototype the verb that turns {a} into {b}: is it tap, hold, or release?',
      '{a} {op} {b}: where do you put the tutorial, and where do you let the player fail safe?',
      'Chart the difficulty curve from {a} to {b} — which spike makes the controller hit the floor?',
    ],
    genres: {
      roguelike: [
        'Offer {a} and {b} as a forced choice at the altar — which synergy snowballs, which bricks the build?',
        'Seed {a} into the starting kit and lock {b} behind an unlock; what death finally hands over the key?',
      ],
      'visual-novel': [
        'Save-scum from {a} back to {b}: which flag did the player miss the first time around?',
        '{a} {op} {b}: write the single line of dialogue that reroutes the whole route.',
      ],
      'open-world': [
        'Tag {a} on the map as a question mark; let {b} be the vista that answers it from a ridgeline.',
        "Let {a} be the radiant quest that never ends and {b} the handcrafted one that does — which respects the player's time?",
      ],
      soulslike: [
        'Place {a} as the bonfire and {b} as the fog wall — how far is the run-back, and is it fair?',
        '{a} {op} {b}: which boss tell, learned the hard way, finally makes the fight feel slow?',
      ],
      puzzle: [
        'Introduce {a} as a safe sandbox, then demand {b} once the player thinks they have mastered it.',
        '{a} {op} {b}: what red-herring affordance must you remove so the real solution clicks?',
      ],
    },
  },

  'short-story': {
    base: [
      'Spend {a} early and cheaply; let {b} reveal, in the last line, what it truly cost.',
      'Cut the scene that would explain {a}; let {b} carry the weight of the missing page.',
      'Give {a} and {b} to two characters who never share a room — only the reader sees both.',
    ],
    genres: {
      literary: [
        'Let the epiphany about {a} arrive a beat too late to save {b}.',
        'Find the ordinary chore during which {a} quietly becomes {b}.',
      ],
      horror: [
        'Repeat {a} three times, each time slightly wrong, until {b} is the difference no one will say aloud.',
        'Let {a} mimic {b} so exactly that the survivor can no longer tell which one came home.',
      ],
      fable: [
        'Give {a} a clever bargain with {b}; let the sting fall on the one who tells the tale.',
        'Let the animals all agree on {a}; let only {b} pay for the agreement.',
      ],
      flash: [
        'In a single breath turn {a} into {b}, and stop on the turn.',
        'Let the title do the work of {a} so the paragraph can be only {b}.',
      ],
    },
  },
  poem: {
    base: [
      'Let {a} be the sound and {b} the silence after it; where does the line break to make us hear both?',
      'Find the single image where {a} {op} {b}, then trust it to carry the whole poem unspoken.',
      'Leap from {a} to {b} across the white space, and let the reader fall the distance between.',
    ],
    genres: {
      sonnet: [
        'Build the case for {a} through the quatrains, then let the couplet undo it with {b}.',
        "Set {a} in the octave's argument; let {b} answer only after the volta turns.",
      ],
      haiku: [
        'Name {a} in three syllables and {b} in two; let the season hide in the gap between.',
        'Cut between {a} and {b} with one kireji, and let the cut alone carry the meaning.',
      ],
      beat: [
        'Begin every line with {a} until {b} arrives unbidden and breaks the chant.',
        'Catalogue the holy junk of {a} — the lost, the high, the wired — until {b} is the last item on the list.',
      ],
      psalm: [
        'Number your complaints against {a} as the psalmist did, then turn, in one verse, to praise {b}.',
        'Let {a} be the wilderness and {b} the manna; ask for it, and do not be ashamed to ask twice.',
      ],
    },
  },
  painting: {
    base: [
      'Underpaint the whole canvas in the hue of {a}, then let {b} break through in the highlights. What survives the layering?',
      'Lead the eye from {a} along a diagonal to {b}. Where does the gaze rest, and where is it refused?',
      'Crop the frame until {a} is half-cut at the edge and {b} holds the centre. What does the cropping confess?',
    ],
    genres: {
      allegory: [
        "Hand {a} an attribute the viewer must decode before {b}'s meaning unlocks.",
        'Stage {a} and {b} as a procession; what banner do they carry that names the virtue?',
      ],
      surreal: [
        'Scale {a} to the size of a house and {b} to the size of a thumb; let the room accept both.',
        'Melt the edge of {a} into {b} and paint the seam as if it had always been there.',
      ],
      abstract: [
        'Reduce {a} to a single weighted line and {b} to the field it divides.',
        'Let the colour of {a} vibrate against {b} until the border between them seems to move.',
      ],
      symbolist: [
        'Assign {a} a colour that means more than it shows, and let {b} be its faint, unplaceable perfume.',
        'Paint {a} as a door left half-open onto {b}; the threshold, not the room, is the subject.',
      ],
    },
  },
  'film-critique': {
    base: [
      'Note the exact frame where {a} curdles into {b} — and the smug pause that begs for applause that never comes.',
      '{a} {op} {b} is the kind of choice that wins awards from people who have never met a human being. Diagnose the delusion.',
      'Two hours to wed {a} to {b}, and the marriage is annulled by the third act. Read the eulogy.',
    ],
    genres: {
      auteurist: [
        "Trace {a} back through the director's earlier, better films until {b} reveals the well run dry.",
        'Grant the signature on {a}; then watch it forge itself, badly, onto {b}.',
      ],
      ideological: [
        '{a} {op} {b}: follow the money until the accident starts to look like a sales pitch.',
        'Name the comfortable lie {a} sells so that {b} can slide down smooth.',
      ],
      camp: [
        'Keep a straight face while {a} mistakes {b} for art; the funeral is funnier performed sober.',
        'Score {a} against {b} on the unintentional-laugh scale, and show your working.',
      ],
      formalist: [
        "Listen, don't look: what does the sound design do to {a} that the screenplay forbade for {b}?",
        'Hold on the one composition where {a} and {b} share the frame; the blocking already lost the argument.',
      ],
    },
  },
  'bong-session': {
    base: [
      "Okay okay hear me out — {a} is just {b} but it hasn't realized it yet, you know?",
      'Bro, every time you {op} {a} with {b} your brain does the thing. The *thing*. You feel that?',
      'Wait — who decided {a} and {b} were even different things? Like, who PROFITS from that, man?',
    ],
    genres: {
      philosophical: [
        "Wait wait — can you even *know* {a} if you don't already, secretly, know {b}?",
        "If {a} falls and there's no {b} around to notice, did the whole semester even happen?",
      ],
      conspiracy: [
        '{a} and {b} have the same number of letters if you squint. The fnords are in the *spaces*, man.',
        "They keep you staring at {a} so you never ask who's quietly running {b}. Screenshot this before it's gone.",
      ],
      cosmic: [
        'Close your eyes — {a} is just {b} buffering at a higher frame rate of the universe.',
        'What if every time we sleep, {a} downloads {b} and we wake up patched and never notice?',
      ],
      'pop-culture': [
        "Hot take: {a} is the {b} of its entire generation and the timeline isn't ready for it.",
        'Ranked, no skips: where does {a} land against {b} in the canon? Defend it past 3 a.m.',
      ],
    },
  },
  'court-patronage': {
    base: [
      'When {a} elevates {b}, name the rival who is thereby slighted, and who must be soothed.',
      'Reckon the ledger of {a} {op} {b}: which debt is paid in coin, which in loyalty, and which never repaid?',
      'Before the favour is granted, who must be flattered first so that {a} may even reach {b}?',
    ],
    genres: {
      letters: [
        'Compose the reply in which {a} refuses {b} so graciously that the door is left ajar.',
        'Send the request for {a} through three intermediaries; what does each take as a cut before it reaches {b}?',
      ],
      laboratory: [
        'Promise {a} as the marvel the patron may show visiting ambassadors; what proof must wait until the funds for {b} clear?',
        "Calibrate {a} to the patron's own nativity, so that {b} flatters the very stars he was born under.",
      ],
      'court-roguelike': [
        "Roll the season's intrigue: does {a} arrive as a gift, a summons, or a debt come due for {b}?",
        'Bank the favour earned from {a}; spend it on {b} now, or hoard it against the audit still to come?',
      ],
      kunstkammer: [
        'Order the cabinet: does {a} belong among the naturalia or the artificialia, and where does {b} unsettle the scheme?',
        'Acquire {a} to complete the set that {b} began; what gap in the collection does the pairing finally close?',
      ],
    },
  },
};
