/* Hot Potato Game — English (site root /, default + x-default)
 * Logic lives in bomb-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (names or just play, fuse length, hints, missions, start) → play (bomb button, pass, pause) → boom → result + recent rounds + shared end screen.
 * FAQ appears only in the shared end screen. missions = penalty cards, shown one at a time after a boom only (never listed anywhere).
 * Placeholders like {n} {a} {b} {name} {p} {s} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons/names, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Hot Potato Game – Pass the Bomb Party Game',
    description: 'A hot potato game on your phone: tap the bomb, pass the phone and hope it doesn’t blow up in your hands. Secret random fuse, 2 to 12 players or no names at all. Free, no sign-up.',
    ogTitle: 'Hot Potato Game 💣 Don’t be holding it!',
    ogDescription: 'Tap the bomb, pass the phone, and pray the fuse lasts. Whoever holds it at the boom is out.',
  },
  siteName: 'Hot Potato Game',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Hot Potato Game',
    h1Html: 'Tap it, pass it,<br><em>don’t get caught</em>',
    hook: 'One phone, one secret fuse. Tap the bomb, hand it on, and hope it doesn’t go off in your hands.',
  },

  ui: {
    modeLabel: 'Who is playing?',
    modeFree: '🎲 Just play',
    modeNames: '👥 With names',
    namesLabel: 'Players in passing order',
    namesPh: 'One name per line, in passing order\nEmma\nLiam\nOlivia\nNoah',
    namesHint: '2 to 12 players. The bomb goes round in this order.',
    namesCount: '{n} players',
    fuseLabel: 'Fuse length',
    fuseShort: 'Short',
    fuseNormal: 'Normal',
    fuseLong: 'Long',
    fuseRange: '{a}–{b} s',
    hintsLabel: 'Show hints',
    hintsHint: 'The sparks on the fuse speed up as it burns down.',
    missionsLabel: 'Penalty mission card',
    missionsHint: 'A small, friendly challenge for whoever gets caught.',
    start: 'Light the fuse 💣',
    fair: 'The boom time is drawn with crypto random when you start and stays secret · names stay on your device',
    bannerShort: 'Short fuse · secret timer',
    bannerNormal: 'Normal fuse · secret timer',
    bannerLong: 'Long fuse · secret timer',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    stop: 'Stop',
    holding: '{name} has the bomb',
    holdingFree: 'Tap the bomb and pass the phone!',
    bombAria: 'Pass the bomb',
    passTo: '→ Give it to {name}!',
    passFree: '→ Pass it on!',
    passCount: 'Passes: {p}',
    playTip: 'Tap, then hand the phone to the next person. Quick!',
    pausedTitle: 'Paused',
    pausedText: 'The fuse stops while the game is in the background.',
    resume: 'Keep playing',
    boom: 'BOOM!',
    liveStart: 'The fuse is lit. Pass the bomb!',
  },

  errors: {
    namesTooFew: 'Add at least 2 names, or switch to Just play.',
    namesTooMany: 'Up to 12 players can play ({n} names entered).',
    badLink: 'This link is broken, so no names were loaded from it.',
  },

  result: {
    kicker: '💥 BOOM!',
    loserTitle: '💥 {name}',
    loserSub: '{name} was holding the bomb.',
    freeTitle: '💥 Caught!',
    freeSub: 'Whoever is holding the phone right now is out.',
    stats: 'Fuse {s} s · Passes {p}',
    missionTitle: 'Penalty mission',
    edit: 'Change players',
    shareNames: 'Copy link with these names',
    linkCopied: 'Link copied. It opens the same players, ready to play.',
    sharedNote: 'Players loaded from a shared link. Light the fuse when ready!',
    history: 'Recent rounds',
    historyClear: 'Clear',
    historyFree: '💥 No names',
    historyMeta: '{s} s · {p} passes',
    liveLoser: 'Boom! {name} was holding the bomb.',
    liveFree: 'Boom! Whoever holds the phone is out.',
    again: 'Play again 💣',
    shareTitle: 'Hot Potato Game',
    shareText: 'Tap the bomb, pass the phone, don’t get caught 💣',
  },

  // Penalty mission cards: family-friendly, short, shown one at a time after a boom. Never list them anywhere else.
  missions: [
    'Do your best robot dance for ten seconds.',
    'Sing the chorus of a song everyone knows.',
    'Tell everyone the funniest thing that happened to you this week.',
    'Talk like a TV news reporter until the next round.',
    'Do five jumping jacks while counting out loud.',
    'Give a genuine compliment to the person on your left.',
    'Make your silliest face and hold it for five seconds.',
    'Name five fruits in five seconds.',
    'Act out an animal until someone guesses it.',
    'Tell a joke, the cheesier the better.',
    'Speak only in slow motion until the next round.',
    'Give the group a dramatic thank-you speech, award-show style.',
  ],

  og: {
    brand: '💣 Hot Potato Game',
    kicker: 'Pass the phone · secret fuse',
    title: 'Pass the bomb before it blows',
    desc: 'Whoever holds it at the boom is out',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'When does the bomb go off? Is it fair?', a: 'The moment you light the fuse, the app draws the boom time with your browser’s cryptographic random generator (crypto.getRandomValues) and rejection sampling, evenly anywhere in the range you chose. It is never shown, so nobody, not even the person holding the phone, can know it.' },
    { q: 'Can I tell from the ticking how long is left?', a: 'Only roughly. The ticking and vibration speed up towards the end, but the curve, the top speed and a few fake rushes are shuffled every round, so the tempo makes it tense without giving the exact moment away.' },
    { q: 'What if I switch apps or the screen locks?', a: 'The fuse stops while the game is in the background and waits for you. Tap Keep playing when everyone is ready again, and it carries on from exactly where it stopped.' },
    { q: 'Do we have to type names?', a: 'No. Just play works without names: pass the phone round and whoever is holding it at the boom is out. With names, the screen shows who has the bomb and who gets it next, and the loser’s name appears on the result.' },
    { q: 'What are penalty mission cards?', a: 'An optional extra. After the boom, one small, friendly challenge appears for the person who got caught, like a quick dance or a compliment. Skip any card that someone isn’t comfortable with.' },
  ],

  privacy: {
    title: 'Privacy Policy | Hot Potato Game',
    description: 'Privacy Policy for Hot Potato Game: names and results stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Hot Potato Game (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names you enter are processed only in your browser and are not sent to our server. Your settings, your last list of names and your ten most recent results may be kept in your browser’s local storage on your device. When you copy a link with names, those names are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, rounds started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 24, 2026.'],
    ],
    back: '← Back to Hot Potato Game',
  },
};
