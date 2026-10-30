/* Tournament Bracket Maker — English (site root /, default + x-default)
 * Logic lives in bracket-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (title, entries 2–64, seeding, mode, create) → play (head-to-head cards in pick mode, full bracket, tools)
 *          → champion card + shared end screen.
 * Placeholders like {n} {m} {k} {d} {h} {name} {title} — keep them as-is when translating.
 * ui.rOf may use {n} (players left, e.g. 16) or {h} (half of it, e.g. 8 for "1/8 de finale").
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
    title: 'Tournament Bracket Maker – Random Draw Online',
    description: 'A tournament bracket maker for 2 to 64 names or items: a fair random draw with byes handled for you. Pick winners match by match or print the bracket as an image. No sign-up.',
    ogTitle: 'Tournament Bracket Maker 🏆 Who takes the crown?',
    ogDescription: 'Type your own names or items, draw a fair bracket and pick the winners one match at a time.',
  },
  siteName: 'Tournament Bracket Maker',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Tournament Bracket Maker',
    h1Html: 'Your names, <em>one champion</em>',
    hook: 'Type anything — players, teams, snacks, movies. Draw a fair bracket and find out who wins it all.',
  },

  ui: {
    optional: '(optional)',
    resumeText: 'Bracket in progress: {title}',
    resumeBtn: 'Continue',
    titleLabel: 'Bracket title',
    titlePh: 'Friday ping-pong cup',
    itemsLabel: 'Entries',
    itemsPh: 'One per line\nPizza\nTacos\nSushi\nBurgers',
    itemsHint: '2 to 64 entries, one per line. Duplicates are removed.',
    count: '{n} entries',
    dupes: '{d} duplicate(s) removed',
    seedLabel: 'Seeding',
    seedRandom: '🎲 Random draw',
    seedOrder: '📋 Keep my order',
    modeLabel: 'How do you want to play?',
    modePick: 'Pick winners',
    modePickHint: 'Two cards at a time. Tap the one you like more.',
    modeDraw: 'Just draw the bracket',
    modeDrawHint: 'For real matches. Tap winners in the bracket later.',
    create: 'Make the bracket 🏆',
    fair: 'Drawn on this device with crypto random · entries never leave your browser',
    titleDefault: 'My tournament',
    meta: '{n} entries · {m} matches',
    matchOf: 'Match {k} of {n}',
    tapWinner: 'Tap the winner',
    vs: 'VS',
    pickAria: 'Pick {name} as the winner',
    rFinal: 'Final',
    rSemi: 'Semifinals',
    rQuarter: 'Quarterfinals',
    rOf: 'Round of {n}',
    bye: 'bye',
    tbd: 'TBD',
    advance: 'bye →',
    bracketTitle: 'Bracket',
    drawHint: 'Tap a name to send it to the next round.',
    undo: '↩️ Undo',
    png: '🖼️ Save PNG',
    copyText: '📋 Copy as text',
    shareLink: '🔗 Copy link',
    newBracket: '✏️ New bracket',
    champion: 'Champion',
    toastText: 'Bracket copied as text',
    toastLink: 'Link copied. It opens this exact bracket.',
    linkTooLong: 'This bracket is too long for a link. Save a PNG instead.',
    pngDone: 'Bracket image saved',
    pngFail: 'Could not make the image on this browser.',
    pngBrand: 'Melgene Apps · Tournament Bracket Maker',
    liveCreated: 'Bracket ready with {n} entries.',
    liveChampion: '{name} is the champion!',
    liveUndo: 'Last pick undone.',
  },

  errors: {
    tooFew: 'Add at least 2 entries.',
    tooMany: 'Up to 64 entries ({n} entered).',
    badLink: 'This bracket link is broken. Make a new bracket below.',
  },

  result: {
    kicker: '🏆 Champion',
    summary: '{title} · {n} entries · {m} matches',
    again: 'Reshuffle & play again 🎲',
    shareTitle: 'Tournament Bracket Maker',
    shareText: '{name} won my “{title}” bracket 🏆',
    shareTextPlain: 'Make a fair tournament bracket from your own list 🏆',
  },

  og: {
    brand: '🏆 Tournament Bracket Maker',
    kicker: 'Your list · fair random draw',
    title: 'Who takes the crown?',
    desc: 'Pick winners one match at a time',
  },

  faq: [
    { q: 'How does the random draw work? Is it fair?', a: 'The app shuffles your entries with the browser’s cryptographic random generator (crypto.getRandomValues) using a Fisher–Yates shuffle with rejection sampling, so every possible order is exactly as likely as any other. Nobody, not even you, decides who meets whom.' },
    { q: 'What is a bye?', a: 'A bracket needs 2, 4, 8, 16, 32 or 64 places. If you have, say, 6 entries, two places stay empty, and the entries facing an empty place go straight to the next round. Byes are spread across the bracket and two byes never meet.' },
    { q: 'Can I keep my own order instead of a random draw?', a: 'Yes. Choose Keep my order and your list becomes the seeding: the first entry is seed 1, the second is seed 2, and so on. Top seeds meet low seeds first and receive any byes.' },
    { q: 'Can I undo a pick or change a winner?', a: 'Tap Undo to take back your last pick, or tap the other name in an earlier match. Any later results that depended on that match are cleared, so the bracket always stays consistent.' },
    { q: 'Are my entries sent anywhere?', a: 'No. Your list and picks stay in this browser so you can come back later. A copied link carries the bracket inside the address itself and is only seen by people you send it to.' },
  ],

  privacy: {
    title: 'Privacy Policy | Tournament Bracket Maker',
    description: 'Privacy Policy for Tournament Bracket Maker: entries and brackets stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Tournament Bracket Maker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The entries and bracket title you type are processed only in your browser and are not sent to our server. Your last list and the bracket in progress may be kept in your browser’s local storage on your device. When you copy a bracket link, the bracket is written into the link itself and is shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, brackets started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 30, 2026.'],
    ],
    back: '← Back to Tournament Bracket Maker',
  },
};
