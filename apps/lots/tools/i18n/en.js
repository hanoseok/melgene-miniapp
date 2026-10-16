/* Draw Lots — English (site root /, default + x-default)
 * Logic lives in lots-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (start screen) → draw (grid of folded slips, pass the phone) → end (who got what + shared end screen).
 * FAQ appears only in the shared end screen.
 * Placeholders like {n} {k} {w} {b} {win} {blank} {sum} {name} {who} {label} {date} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons/slip labels, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Slip numbers always use Courier Prime.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap',
    display: "'Alfa Slab One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Draw Lots Online – Pick a Paper Slip',
    description: 'Draw lots online like pulling paper slips from a hat: pass the phone, everyone taps a folded slip and sees winner or blank. Custom prizes, names and a who-got-what summary.',
    ogTitle: 'Draw Lots 🎟️ Pass the phone, pick a slip',
    ogDescription: 'Folded paper slips, fair crypto shuffle, winners and blanks or your own prizes. See who got what at the end.',
  },
  siteName: 'Draw Lots',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Draw Lots',
    h1Html: 'Pass the phone,<br><em>pick a slip</em>',
    hook: 'Fold the slips, hand the phone around and let each person unfold their fate. Who buys the coffee? Who goes first?',
  },

  ui: {
    countLabel: 'How many slips?',
    countDec: 'One fewer',
    countInc: 'One more',
    countNote: 'Slips follow the names: {n}',
    namesBtn: '+ Add names (optional)',
    namesLabel: 'Who is drawing?',
    namesPh: 'One name per line\nEmma\nLiam\nNoah',
    namesHint: 'With names, there is one slip per person and each turn shows whose it is.',
    modeLabel: 'What’s on the slips?',
    modeSimple: 'Winners & blanks',
    modeCustom: 'Custom prizes',
    winnersLabel: 'Winning slips',
    winLabel: 'Winner',
    blankLabel: 'Blank',
    simplePreview: '{w} × {win} · {b} × {blank}',
    kindsHint: 'Write what each slip says and how many of it. The total must match the number of slips.',
    kindPh: 'e.g. Buys coffee',
    kindCountAria: 'Number of slips',
    kindRemove: 'Remove',
    kindWin: 'Celebrate this one',
    kindAdd: '+ Add a prize',
    fillBlank: 'Fill rest with Blank',
    total: '{sum} of {n} slips',
    customExample: [
      { l: 'Buys coffee', n: 1, w: true },
      { l: 'Does the dishes', n: 1, w: false },
    ],
    hideLabel: 'Hide each result after viewing',
    hideHint: 'Best for passing the phone: nobody sees earlier slips.',
    fxLabel: 'Confetti for winners',
    start: 'Fold the slips 🎟️',
    fair: 'Shuffled once with crypto random · nothing leaves your browser',
    recentTitle: 'Recent setups',
    recentClear: 'Clear',
    recentSlips: '{n} slips',
    recentNames: '{n} names',
  },

  errors: {
    countRange: 'Choose between 2 and 50 slips.',
    namesTooFew: 'Add at least 2 names, or clear the names box.',
    namesTooMany: 'Up to 50 people can draw ({n} names entered).',
    winnersRange: 'Winning slips must be between 1 and {n}.',
    kindsEmpty: 'Add at least one prize.',
    kindsTooMany: 'You can use up to 10 kinds of slips.',
    kindLabel: 'Every prize needs a name.',
    kindCount: 'Each prize needs at least one slip.',
    kindDup: '“{label}” is listed twice.',
    totalMismatch: 'Your prizes add up to {sum} slips, but there are {n}. Change the counts or tap “Fill rest”.',
    badLink: 'This result link is broken or incomplete, so nothing is shown from it.',
  },

  draw: {
    progress: '{k}/{n} drawn',
    turnName: '{name}’s turn',
    turnNum: 'Person {k}’s turn',
    pick: 'Tap any folded slip',
    gridAria: 'Folded paper slips',
    slipAria: 'Slip {k}, folded',
    slipTaken: 'Slip {k}, taken',
    passName: 'Pass the phone to {name}',
    passNext: 'Pass the phone to the next person',
    passHint: 'Earlier results are hidden.',
    ready: 'I’m ready',
    gotName: '{name} got',
    gotNum: 'Person {k} got',
    winTag: '🎉 Lucky you!',
    blankTag: 'Better luck next time',
    next: 'Next person',
    seeResults: 'See the results',
    finish: 'Finish now',
    finishConfirm: 'Tap again to finish',
    live: '{who}: {label}',
  },

  result: {
    heading: 'Who got what',
    sharedBadge: '🎟️ Shared draw result',
    sharedNote: 'Drawn on {date}. This is the original result saved in the link. Opening it never draws again.',
    slipsTag: '{n} slips',
    drawnTag: '{k} drawn',
    leftover: '{n} slips were left undrawn.',
    byPrize: 'By prize',
    nobody: 'nobody yet',
    personNum: 'Person {k}',
    copy: 'Copy as text',
    copied: 'Result copied',
    copyLink: 'Copy link',
    linkCopied: 'Link copied. Anyone who opens it sees this exact draw.',
    edit: 'Change setup',
    again: 'Draw again',
    makeOwn: 'Make my own draw',
    textTitle: '🎟️ Draw Lots result',
    textLeftover: 'Not drawn: {n}',
    shareTitle: 'Draw Lots',
    shareText: 'Pass the phone and draw folded paper lots 🎟️',
  },

  og: {
    brand: '🎟️ Draw Lots',
    kicker: 'Pass the phone · pick a slip',
    title: 'Draw lots with folded paper slips',
    desc: 'Winners, blanks or your own prizes, fairly shuffled',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the draw really fair?', a: 'Yes. When you fold the slips, they are shuffled once with your browser’s cryptographic random generator (crypto.getRandomValues) using rejection sampling and a Fisher–Yates shuffle. Every slip’s content is fixed at that moment, so it doesn’t matter who picks first or which slip they tap.' },
    { q: 'How do I keep results secret when passing the phone?', a: 'Leave “Hide each result after viewing” on. After a person sees their slip and taps Next person, a pass-the-phone screen covers everything and taken slips stay closed, so the next person can’t see what came before.' },
    { q: 'Can I write my own prizes or penalties?', a: 'Choose Custom prizes and add up to 10 kinds of slips, such as Buys coffee, First place or Sing a song, each with a count. The counts must add up to the number of slips; Fill rest with Blank tops it up for you.' },
    { q: 'How do I share the result with the group?', a: 'On the results screen, tap Copy as text to paste a who-got-what list into a chat, or Copy link. The link stores the result itself, so anyone who opens it sees the same draw and nothing is drawn again.' },
  ],

  privacy: {
    title: 'Privacy Policy | Draw Lots',
    description: 'Privacy Policy for Draw Lots: slips, names and results stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Draw Lots (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The slips, prize names, participant names and results you enter are processed only in your browser and are not sent to our server. Your last 5 setups are kept in your browser’s local storage on your device, and you can delete them at any time with the Clear button. When you copy a result link, the prizes, names and results are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and recent setups, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, draws started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 17, 2026.'],
    ],
    back: '← Back to Draw Lots',
  },
};
