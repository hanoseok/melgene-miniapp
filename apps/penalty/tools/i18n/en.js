/* Penalty Card Flip — English (site root /, default + x-default)
 * Logic lives in penalty-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (start screen: hook + start button + ad) → settings (players, penalty count, penalty lines, names) → flip (grid of face-down cards) → end (who got what + shared end screen).
 * FAQ appears only in the shared end screen.
 * Placeholders like {n} {k} {done} {who} {text} {count} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap',
    display: "'Bungee'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Penalty Card Flip – Pick Party Forfeits Online',
    description: 'Free penalty card game for parties and drinks nights. Set how many players and penalty cards, then flip the face-down cards one by one to see who gets a forfeit. No sign-up.',
    ogTitle: 'Penalty Card Flip 🃏 Flip the cards, pick the forfeit',
    ogDescription: 'Fair random forfeit picker for party games, shuffled in your browser.',
  },
  siteName: 'Penalty Card Flip',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Penalty Card Flip',
    h1Html: 'Flip the cards,<br><em>draw the forfeit</em>',
    hook: 'One face-down card per player. A few hide a forfeit, the rest are safe. Who is it this round?',
  },

  ui: {
    playersLabel: 'How many players?',
    playersDec: 'One fewer player',
    playersInc: 'One more player',
    penaltyLabel: 'How many penalty cards?',
    penaltyDec: 'One fewer penalty card',
    penaltyInc: 'One more penalty card',
    penaltyHint: 'Starts at about one third of the players. Change it if you like.',
    itemsLabel: 'Forfeit lines',
    itemsHint: 'One forfeit per line. Penalty cards draw from this list in random order. Edit it freely.',
    itemsPh: 'Sing one song\nGive a toast',
    resetItems: 'Reset to sample forfeits',
    itemsCount: '{count} lines',
    namesBtn: '+ Add player names (optional)',
    namesLabel: 'Player names, in turn order',
    namesPh: 'Emma\nLiam\nNoah',
    namesHint: 'Leave it empty and the turns show as 1st, 2nd, 3rd. Fewer names than players is fine.',
    start: 'Shuffle the cards 🃏',
    begin: 'Start',
    setupTitle: 'Set up the round',
    fair: 'Shuffled once with crypto random · nothing leaves your browser',
  },

  errors: {
    playersRange: 'Choose between 2 and 12 players.',
    penaltiesRange: 'Penalty cards must be between 1 and the number of players.',
    itemsEmpty: 'Write at least one forfeit line.',
    itemsTooMany: 'Use up to 30 forfeit lines.',
    namesTooMany: 'There are more names than players. Remove a name or add a player.',
    badLink: 'This result link is broken or incomplete, so nothing is shown from it.',
  },

  draw: {
    progress: '{done}/{n} flipped',
    left: '{n} cards left',
    turn: 'Next turn: {who}',
    turnNum: 'Turn {k}',
    numbered: 'Player {k}',
    pick: 'Tap any face-down card. Every card was set when you shuffled.',
    gridAria: 'Face-down penalty cards',
    cardAria: 'Card {k}, face down',
    penaltyTag: 'Penalty!',
    safeTag: 'Safe',
    revealPenalty: '{who}: {text}',
    revealSafe: '{who} is safe this time',
    revealNone: 'Tap a card to reveal it.',
    flipAll: 'Flip all',
    reshuffle: 'Shuffle again',
    seeResults: 'See the results',
    done: 'All cards are flipped.',
    live: '{who}: {text}',
    liveSafe: '{who}: safe',
  },

  result: {
    heading: 'Who got the forfeit',
    sharedBadge: '🃏 Shared result',
    sharedNote: 'This is the result saved in the link. It is not shuffled again.',
    summary: '{k} penalty · {s} safe',
    summaryMany: '{k} penalties · {s} safe',
    listHead: 'Forfeits this round',
    safeList: 'Safe: {names}',
    copy: 'Copy as text',
    copied: 'Result copied',
    copyLink: 'Copy link',
    linkCopied: 'Link copied. Anyone who opens it sees this exact result.',
    again: 'Try it yourself',
    edit: 'Change settings',
    textTitle: '🃏 Penalty Card Flip result',
    textSafe: 'safe',
    shareTitle: 'Penalty Card Flip',
    shareText: 'Flip the cards and draw a party forfeit 🃏',
  },

  og: {
    brand: '🃏 Penalty Card Flip',
    kicker: 'Party forfeits · flip one card',
    title: 'Pick a party forfeit by flipping cards',
    desc: 'Random, fair and ready in seconds',
    sample: 'Sing one song',
  },

  // Sample forfeits: used on the settings screen (prefilled). The user edits them freely.
  defaults: [
    'Sing one song, chorus only',
    'Give a one-line toast',
    'Do one cute aegyo pose',
    'Pour water for the person on your left',
    'Dance the robot for 10 seconds',
    'Introduce yourself again in one more line',
    'Play a song picked by the person on your right',
    'Tell one joke about yourself',
    'Read the next sentence in a movie-trailer voice',
    'Guess the next person’s favorite song in one try',
  ],

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the shuffle really fair?', a: 'Yes. When you shuffle, the cards are placed once with your browser’s cryptographic random generator (crypto.getRandomValues), using rejection sampling and a Fisher–Yates shuffle. Every card is fixed at that moment, so it does not matter which card someone taps.' },
    { q: 'Who picks the forfeit text?', a: 'Each penalty card takes a line from your forfeit list in random order. If there are fewer lines than penalty cards, the shuffled list is used again. Edit the lines before you shuffle to match your group.' },
    { q: 'Can someone refuse a forfeit?', a: 'Yes. Forfeits are for fun and are always optional. If someone does not want to do one, the group can swap in a different line or pick a safer alternative together.' },
    { q: 'How do I share the result with the group?', a: 'On the results screen, tap Copy as text to paste the list into a chat, or Copy link. The link stores this exact result, so anyone who opens it sees the same cards without a new shuffle.' },
  ],

  privacy: {
    title: 'Privacy Policy | Penalty Card Flip',
    description: 'Privacy Policy for Penalty Card Flip: names, forfeit lines and results stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Penalty Card Flip (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The player names, forfeit lines and results you enter are processed only in your browser and are not sent to our server. Your last settings are kept in your browser’s local storage on your device. When you copy a result link, the names, forfeit lines and results are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, games started and finished). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of November 11, 2026.'],
    ],
    back: '← Back to Penalty Card Flip',
  },
};
