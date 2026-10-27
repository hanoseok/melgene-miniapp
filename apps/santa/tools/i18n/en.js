/* Secret Santa Generator — English (site root /, default + x-default)
 * Logic lives in santa-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (event, names, budget, date, exclusions, no 2-person loops, draw) → reveal (pass the phone: tap your name → confirm → open the gift box → hide)
 *          + organizer tools (personal links, full list behind a warning, done, draw again, edit) → done card + shared end screen.
 *          A personal link (#d=) opens one gift box for one person only.
 * FAQ appears only in the shared end screen. Never put an actual draw (who has whom) in any text.
 * Placeholders like {n} {k} {name} {a} {b} {d} {url} {date} — keep them as-is when translating.
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
    title: 'Secret Santa Generator – Draw Names Online',
    description: 'A Secret Santa generator for 3 to 30 people: draw names on one phone or send each person a private link. Add a budget, a date and couples who shouldn’t draw each other. Free, no sign-up.',
    ogTitle: 'Secret Santa Generator 🎁 Who are you buying for?',
    ogDescription: 'Draw names, pass the phone, and everyone secretly opens their own gift box. Nobody sees the whole list.',
  },
  siteName: 'Secret Santa Generator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Secret Santa Generator',
    h1Html: 'Draw names,<br><em>keep the secret</em>',
    hook: 'Type in the names, draw, then pass the phone around. Each person secretly sees only who they are buying for.',
  },

  ui: {
    optional: '(optional)',
    eventLabel: 'Event name',
    eventPh: 'Office Christmas party',
    namesLabel: 'Who is taking part?',
    namesPh: 'One name per line\nEmma\nLiam\nOlivia\nNoah',
    namesHint: '3 to 30 people, one per line or separated by commas.',
    namesCount: '{n} people',
    budgetLabel: 'Budget',
    budgetPh: 'e.g. $25',
    dateLabel: 'Exchange date',
    exclLabel: 'Pairs who shouldn’t draw each other',
    exclHint: 'For couples or housemates: neither of the two will draw the other.',
    exclA: 'First person',
    exclB: 'Second person',
    exclPick: 'Choose…',
    exclAdd: 'Add',
    exclRemove: 'Remove pair {a} and {b}',
    noPairsLabel: 'No 2-person swaps',
    noPairsHint: 'If A draws B, B won’t draw A back.',
    draw: 'Draw names 🎁',
    fair: 'Drawn on this phone with crypto random · names never leave your device',
    eventDefault: 'Secret Santa',
    budgetChip: '💰 {b}',
    dateChip: '📅 {d}',
    passTitle: 'Pass the phone around',
    passHint: 'Each person taps their own name and looks alone.',
    progress: '{k} of {n} have looked',
    seenMark: 'looked',
    confirmQ: 'Are you really {name}?',
    confirmSub: 'Only {name} should look at the next screen.',
    confirmYes: 'Yes, it’s me',
    againQ: '{name}, look again?',
    againSub: 'You have already looked. Make sure nobody is peeking.',
    cancel: 'Cancel',
    secretFor: '🎄 {name}, this box is for you',
    openHint: 'Tap the gift box to open it',
    openAria: 'Open the gift box',
    yourTarget: 'You are the Secret Santa for',
    secretNote: 'Keep it secret until the exchange!',
    hide: 'Got it, hide it',
    orgTitle: 'Organizer tools',
    linksBtn: '🔗 Make personal links',
    linksHint: 'Each link opens only that person’s gift box. Send it to them privately, one by one.',
    linkCopy: 'Copy link',
    linkCopied: 'Copied ✓',
    linkMsg: '🎁 {name}, your Secret Santa draw is ready. Open this link on your own: {url}',
    toastCopied: 'Link copied. Send it only to {name}.',
    doneBtn: '✅ Everyone has looked',
    allBtn: '👀 Show the full list',
    allTitle: 'Who drew whom',
    allHide: 'Hide list',
    allQ: 'Show the full list?',
    allSub: 'You will see who drew whom, so the surprise is gone for you.',
    allYes: 'Show it anyway',
    redraw: '🔄 Draw again',
    redrawQ: 'Draw again?',
    redrawSub: 'The current draw will be replaced. Anyone who already looked will need to look again.',
    redrawYes: 'Yes, draw again',
    edit: '✏️ Edit names',
    editQ: 'Edit the names?',
    editSub: 'The current draw will be cleared.',
    editYes: 'Clear and edit',
    liveDrawn: 'Names drawn. Pass the phone and let each person tap their own name.',
    linkFor: '🎁 {name}, a Secret Santa note for you',
  },

  errors: {
    namesTooFew: 'Add at least 3 names.',
    namesTooMany: 'Up to 30 people can take part ({n} names entered).',
    exclNeed: 'Type at least 2 names above first.',
    exclSame: 'Pick two different people.',
    exclDup: 'That pair is already on the list.',
    exclMax: 'You can add up to 40 pairs.',
    impossible: 'With these rules nobody can be matched. Remove a pair or turn off “No 2-person swaps”.',
    tooHard: 'These rules are too tight to draw fairly. Remove a pair or turn off “No 2-person swaps”.',
    badLink: 'This link is broken, so there is nothing to open. Ask the organizer for a new one.',
  },

  result: {
    kicker: '🎄 All set!',
    doneTitle: 'Everyone knows who to buy for',
    doneText: 'Keep it secret until the exchange, and have fun choosing!',
    linkDoneTitle: 'Shh, now go find a gift!',
    linkDoneText: 'Only you know who you drew. Keep it secret until the exchange.',
    again: 'Draw again 🎁',
    shareTitle: 'Secret Santa Generator',
    shareText: 'Draw Secret Santa names on one phone, nobody sees the full list 🎁',
  },

  og: {
    brand: '🎁 Secret Santa Generator',
    kicker: 'Draw names · pass the phone',
    title: 'Who are you buying for?',
    desc: 'Everyone peeks at their own gift box only',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How are names drawn? Is it fair?', a: 'The app shuffles everyone with your browser’s cryptographic random generator (crypto.getRandomValues) and keeps reshuffling until nobody has themselves and every rule is met. That way every valid result is exactly as likely as any other, and nobody, not even the organizer, chooses it.' },
    { q: 'How do we see the results without spoiling them?', a: 'Pass the phone around: each person taps their own name, confirms it is really them and opens their gift box alone, then hides it again. Or make personal links and send each person their own link, which opens only their gift box.' },
    { q: 'Can couples avoid drawing each other?', a: 'Yes. Add them as a pair who shouldn’t draw each other, and neither will draw the other. Turn on No 2-person swaps if you also don’t want two people buying for each other.' },
    { q: 'What if the rules make a draw impossible?', a: 'If no valid result exists, for example in a group of three with too many pairs, the app tells you before drawing so you can remove a pair or switch off the swap rule. It never quietly breaks a rule.' },
    { q: 'Are the names sent anywhere?', a: 'No. Names and the draw stay in this browser. A personal link carries only that one person’s result, lightly scrambled so it can’t be read at a glance, and goes only to whoever you send it to.' },
  ],

  privacy: {
    title: 'Privacy Policy | Secret Santa Generator',
    description: 'Privacy Policy for Secret Santa Generator: names and draws stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Secret Santa Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names, event name, budget and date you enter are processed only in your browser and are not sent to our server. Your last list of names and rules, and the current draw, may be kept in your browser’s local storage on your device until you start a new draw. When you copy a personal link, that one person’s result is written into the link itself and is shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, draws started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 28, 2026.'],
    ],
    back: '← Back to Secret Santa Generator',
  },
};
