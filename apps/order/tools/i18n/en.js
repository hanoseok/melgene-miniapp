/* Random Order Picker — English (site root /, default + x-default)
 * Logic lives in order-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: input (first screen: names or numbers, preset, reveal direction, shuffle, ad) → reveal (numbered cards one by one) → end (full 1st→Nth list + shared end screen).
 * presets[]: 4 entries, same order in every language (0 any, 1 presentations, 2 game turns, 3 chores). They only change the heading.
 * Placeholders like {n} {k} {max} {who} {heading} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Random Order Picker – Shuffle Names Into a Fair Order',
    description: 'Free random order generator: paste names or use numbers 1 to N and get a fair 1st-to-last order for presentations, game turns or chores. No sign-up, nothing uploaded.',
    ogTitle: 'Random Order Picker 🔢 Who goes first?',
    ogDescription: 'Shuffle a list of names into a fair order, then reveal it one card at a time.',
  },
  siteName: 'Random Order Picker',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Random Order Picker',
    h1Html: 'Who goes <em>first?</em>',
    hook: 'Type the names, shuffle once, and reveal the whole order from 1st to last.',
  },

  ui: {
    presetLabel: 'What is the order for?',
    modeLabel: 'Names or numbers',
    modeNames: 'Names',
    modeNumbers: 'Numbers 1–N',
    namesLabel: 'Names, one per line',
    namesPh: 'Emma\nLiam\nOlivia\nNoah',
    namesHint: 'Paste a list from a chat or sheet. Commas also split names.',
    namesCount: '{n} / {max}',
    clear: 'Clear',
    numbersLabel: 'How many?',
    numbersDec: 'One fewer',
    numbersInc: 'One more',
    numbersHint: 'Shuffles the numbers 1 to N. Handy for seat or ticket numbers.',
    numberItem: '#{n}',
    fromLabel: 'Reveal the order',
    fromFirst: 'From 1st',
    fromLast: 'From last',
    shuffle: 'Shuffle the order 🔀',
    fair: 'Shuffled once with crypto random · names never leave your browser',
  },

  presets: [
    { label: 'Any order', heading: 'The random order' },
    { label: 'Presentations', heading: 'Presentation order' },
    { label: 'Game turns', heading: 'Turn order' },
    { label: 'Chores', heading: 'Chore rota' },
  ],

  errors: {
    namesFew: 'Enter at least 2 names, one per line, or switch to numbers.',
    namesMany: 'Use up to 40 names.',
    numbersRange: 'Choose a number from 2 to 40.',
    badLink: 'This order link is broken or incomplete, so nothing is shown from it.',
  },

  reveal: {
    progress: '{k} of {n} revealed',
    tapHint: 'Tap the card or press Next. The order was fixed when you shuffled.',
    first: 'Reveal ▶',
    next: 'Next ▶',
    done: 'See the full order',
    auto: 'Auto play',
    autoStop: 'Pause',
    showAll: 'Show all',
    soFar: 'Revealed so far',
    live: 'Number {k}: {who}',
  },

  result: {
    sharedBadge: '🔢 Shared order',
    sharedNote: 'This is the order saved in the link. It is not shuffled again.',
    summary: '{n} in order, 1st to last',
    copy: 'Copy as text',
    copied: 'Order copied',
    copyLink: 'Copy link',
    linkCopied: 'Link copied. Anyone who opens it sees this exact order.',
    linkTooLong: 'The list is too long for a link, so the plain page link was copied.',
    edit: 'Change names',
    again: 'Shuffle again 🔀',
    againShared: 'Shuffle my own 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Random Order Picker',
    shareText: 'Here is our order, picked at random 🔢',
  },

  og: {
    brand: '🔢 Random Order Picker',
    kicker: 'Presentations · game turns · chores',
    title: 'Who goes first? Shuffle a fair order',
    desc: 'Names in, 1st to last out, in seconds',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the order really random?', a: 'Yes. When you press shuffle, your browser’s cryptographic random generator (crypto.getRandomValues) runs a Fisher–Yates shuffle with rejection sampling, so every possible order is equally likely. The whole order is fixed at that moment; the card reveal only shows it.' },
    { q: 'How is this different from picking a winner?', a: 'A winner picker stops after one name. This tool ranks everyone from 1st to last, which is what you need for presentation slots, game turns, a speaking list or a chore rota.' },
    { q: 'Should I reveal from first or from last?', a: 'From 1st is quickest when people need to get ready. From last builds suspense, because the person who goes first is revealed at the very end.' },
    { q: 'Are the names stored or sent anywhere?', a: 'No. The names stay in your browser. Your last list is kept in this device’s local storage so you can reuse it, and a share link carries the order only to the people you send it to.' },
  ],

  privacy: {
    title: 'Privacy Policy | Random Order Picker',
    description: 'Privacy Policy for Random Order Picker: names and orders stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Random Order Picker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names or numbers you enter and the order they are shuffled into are processed only in your browser and are not sent to our server. Your last list is kept in your browser’s local storage on your device. When you copy an order link, the order is written into the link itself and is shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, rounds started and finished). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of November 15, 2026.'],
    ],
    back: '← Back to Random Order Picker',
  },
};
