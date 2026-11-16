/* Pros and Cons Scale — English (site root /, default + x-default)
 * Logic lives in proscons-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: start (question + mode, ad at the bottom) → board (live balance scale + lists) → end (verdict + shared end screen).
 * pts: plural forms of "point" (one/few/many/other — Intl.PluralRules). board.chips: 8 generic topic labels, no full sentences.
 * Placeholders like {n} {pts} {pct} {name} {a} {b} {w} {left} {right} {topic} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800&display=swap',
    display: "'Fraunces'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Pros and Cons List – Decision Maker',
    description: 'Free pros and cons list maker: weigh each point from 1 to 3, watch a balance scale tip and see which side wins and by how much. Works for yes/no and A or B choices.',
    ogTitle: 'Pros and Cons Scale ⚖️ Which way does it tip?',
    ogDescription: 'List the pros and cons, weigh each one, and watch the scale decide with you.',
  },
  siteName: 'Pros and Cons Scale',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Pros and Cons List',
    h1Html: 'Put your decision <em>on the scale</em>',
    hook: 'Write down the pros and cons, give each a weight, and watch which way it tips.',
  },

  pts: { one: 'point', few: 'points', many: 'points', other: 'points' },

  start: {
    questionLabel: 'What are you deciding? (optional)',
    questionPh: 'e.g. Should I take the new job?',
    modeLabel: 'What kind of decision?',
    modeSingle: 'Should I do it?',
    modeAb: 'A or B?',
    modeSingleHint: 'One option: pros on one side, cons on the other.',
    modeAbHint: 'Two options, each with pros and cons. A’s cons add weight to B, and B’s cons to A.',
    aLabel: 'Option A',
    aPh: 'e.g. Stay',
    bLabel: 'Option B',
    bPh: 'e.g. Move',
    go: 'Start weighing ⚖️',
    draftNote: 'Your draft on this device has {n} {pts}.',
    fresh: 'Start fresh',
    local: 'Your list stays on this device. Nothing is uploaded.',
  },

  board: {
    defaultSingle: 'Should I do it?',
    defaultAb: '{a} or {b}?',
    aDefault: 'A',
    bDefault: 'B',
    pros: 'Pros',
    cons: 'Cons',
    prosFor: 'Pros of {name}',
    consFor: 'Cons of {name}',
    addPh: 'Add a point…',
    add: 'Add',
    addLabel: 'New point: {list}',
    ideas: 'Stuck? Tap a topic to start a point',
    chips: ['Cost', 'Time', 'Health', 'Fun', 'People', 'Stress', 'Growth', 'Risk'],
    chipFormat: '{topic}: ',
    weightLabel: 'Weight {w} of 3',
    remove: 'Remove',
    emptyList: 'Nothing here yet.',
    full: 'This side is full (12 points).',
    scaleLabel: 'Balance scale: {left} on the left, {right} on the right',
    weigh: 'Weigh it ⚖️',
    needPoint: 'Add at least one point first.',
    back: '← Change the question',
    readonlyBadge: '⚖️ Shared scale',
    readonlyNote: 'A friend sent you this scale. Look it over, then edit your own copy to add points or change weights.',
    editCopy: 'Edit a copy ✏️',
  },

  result: {
    verdictPros: 'Pros win by {n} {pts} ({pct}%)',
    verdictCons: 'Cons win by {n} {pts} ({pct}%)',
    verdictWin: '{name} wins by {n} {pts} ({pct}%)',
    tie: 'Dead even: {left} to {right}',
    tieHint: 'The list can’t split it. Flip a fair coin and notice how you feel about the answer.',
    flip: 'Flip a coin 🪙',
    coinYes: 'The coin says: go for it',
    coinNo: 'The coin says: skip it',
    coinAb: 'The coin picked {name}',
    topPros: 'Heaviest pros',
    topCons: 'Heaviest cons',
    topFor: 'Strongest for {name}',
    tagPro: '+ {name}',
    tagCon: '− {name}',
    note: 'This is a thinking tool, not a judge. If the verdict feels wrong, that gut feeling is worth listening to as well.',
    copyLink: 'Copy link',
    linkCopied: 'Link copied. Your friend will see this scale and can edit a copy.',
    linkTooLong: 'The list is too long for a link, so the plain page link was copied.',
    save: 'Save as image',
    saved: 'Image saved',
    fileName: 'pros-and-cons',
    edit: 'Edit the list',
    again: 'New decision ⚖️',
    againShared: 'Weigh my own decision ⚖️',
    sharedBadge: '⚖️ Shared scale',
    shareTitle: 'Pros and Cons Scale',
    shareText: 'Help me decide: here is my pros and cons scale ⚖️',
    cardBrand: '⚖️ Pros and Cons Scale',
  },

  errors: {
    badLink: 'This scale link is broken or incomplete, so nothing is shown from it.',
  },

  og: {
    brand: '⚖️ Pros and Cons Scale',
    kicker: 'Should I? · A or B?',
    title: 'Put your decision on the scale',
    desc: 'Weigh each point and watch it tip',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How is the result calculated?', a: 'Each point counts as its weight: 1, 2 or 3. The pros and cons are added up and the difference is the margin. The percentage is the winning side’s share of all the weight on the scale. In A or B mode, A’s cons add weight to B’s side and B’s cons to A’s side.' },
    { q: 'What weight should I give a point?', a: 'Use 1 for nice-to-have details, 2 for things that clearly matter and 3 for the points you would struggle to live without. If everything is a 3, ask yourself which ones you would give up first.' },
    { q: 'What happens on a tie?', a: 'The scale shows it as dead even. You can flip a fair coin, drawn with your browser’s cryptographic random generator. Many people find that their reaction to the coin tells them what they really wanted.' },
    { q: 'Is my list saved or uploaded?', a: 'Your draft is kept only in this browser’s local storage on this device, and nothing is sent to our server. A share link carries the list inside the link itself, so only people you send it to can see it.' },
  ],

  privacy: {
    title: 'Privacy Policy | Pros and Cons Scale',
    description: 'Privacy Policy for Pros and Cons Scale: your lists stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Pros and Cons Scale (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The question, options and points you type are processed only in your browser and are not sent to our server. Your draft is kept in your browser’s local storage on your device. When you copy a scale link, the list is written into the link itself and is shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, decisions started and finished). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of November 17, 2026.'],
    ],
    back: '← Back to Pros and Cons Scale',
  },
};
