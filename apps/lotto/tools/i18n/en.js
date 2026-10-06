/* Lotto Number Generator — English (site root /, default + x-default)
 * Draw logic lives in lotto-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {n} {numbers} {max} {pick} — keep them as-is when translating.
 * fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 * tool.presets / presetInfo: kr, euro, us, custom. result.extraNames: name of the second ball group (euro stars, US Powerball).
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: 'Lotto Number Generator: Random Lottery Numbers',
    description: 'Need lucky numbers? Pick Korea 6/45, a Euro-style 5/50 + 2 stars, US Powerball 5/69 + 1 or your own range, keep or skip numbers and draw up to five games. For fun only, no sign-up.',
    ogTitle: 'Lotto Number Generator 🎱 Random Lottery Numbers',
    ogDescription: 'Draw lucky lottery numbers for fun, up to five games at once.'
  },
  siteName: 'Lotto Number Generator',
  privacyLink: 'Privacy Policy',
  start: {
    badge: '🎱 Just for fun',
    h1Kicker: 'Lotto Number Generator',
    h1Html: 'Feeling <em>lucky</em>?<br>Draw your numbers',
    hook: 'Choose a game, keep or skip a few numbers and watch the balls roll out. Up to five games at once.',
    facts: 'Korea · Euro-style · Powerball · custom · entertainment only',
    start: 'Draw numbers →'
  },
  tool: {
    title: 'Set up your draw',
    presetLabel: 'Which game?',
    presets: {
      kr: 'Korea 6/45',
      euro: 'Euro 5/50 + 2',
      us: 'US Powerball',
      custom: 'Custom'
    },
    presetInfo: {
      kr: '6 numbers from 1 to 45',
      euro: '5 numbers from 1 to 50 + 2 stars from 1 to 12',
      us: '5 numbers from 1 to 69 + 1 Powerball from 1 to 26',
      custom: 'Choose how many numbers and the highest number'
    },
    pickLabel: 'Numbers to pick',
    maxLabel: 'Highest number',
    gamesLabel: 'How many games?',
    fixedLabel: 'Numbers to keep (optional)',
    fixedHint: 'Always included in every game, like 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Numbers to skip (optional)',
    excludeHint: 'Never drawn, like 4, 13',
    excludePh: '4, 13',
    draw: 'Draw the balls 🎱',
    drawing: 'Drawing…',
    machine: 'Balls tumbling in the drawing machine',
    note: 'For entertainment only. Every combination is equally likely, and this tool cannot predict or improve your chances of winning.',
    errors: {
      bad: 'Use whole numbers from 1 to {max}, separated by commas.',
      overlap: 'A number can’t be both kept and skipped.',
      tooMany: 'You can keep at most {pick} numbers.',
      notEnough: 'Too many numbers are skipped to draw {pick}.'
    }
  },
  result: {
    title: 'Your lucky numbers',
    game: 'Game {n}',
    extraNames: {
      euro: 'Stars',
      us: 'Powerball'
    },
    copy: 'Copy numbers 📋',
    copied: 'Numbers copied!',
    again: 'Draw again',
    change: 'Back to settings',
    disclaimer: 'For entertainment only. No prediction, no promise of winning.',
    shareTitle: 'Lotto Number Generator',
    shareText: 'My lucky numbers 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Lotto Number Generator',
    kicker: 'Lottery numbers · for fun',
    title: 'Feeling lucky?',
    desc: 'Pick a game and draw up to five sets of numbers'
  },
  faq: [
    {
      q: 'How do I draw my numbers?',
      a: 'Pick a game (Korea 6/45, Euro-style, US Powerball or your own range), choose how many games you want from one to five, then tap the draw button. The numbers are drawn first and the balls roll out in order, then every game is shown sorted.'
    },
    {
      q: 'Are the numbers really random?',
      a: 'Yes. They come from your browser’s cryptographic random generator (crypto.getRandomValues) with rejection sampling, so every allowed number is equally likely and there is no bias. The ball animation is only for show.'
    },
    {
      q: 'What do keep and skip numbers do?',
      a: 'Numbers you keep appear in every game, and the rest are drawn around them. Numbers you skip are never drawn. They apply to the main numbers only, not to the stars or the Powerball.'
    },
    {
      q: 'Does this raise my chances of winning?',
      a: 'No. In a real draw every combination is equally likely, and no tool can predict the result. This generator is just a fun way to pick numbers and makes no promises about winning.'
    }
  ],
  privacy: {
    title: 'Privacy Policy | Lotto Number Generator',
    description: 'Privacy Policy for Lotto Number Generator: your numbers stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Lotto Number Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      [
        '1. Information we collect',
        'The Service works without an account or login. The numbers you enter and the numbers drawn are processed only in your browser and are not sent to our server. Some information may be collected automatically while you use the Service, as described below.'
      ],
      [
        '2. Cookies and similar technologies',
        'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'
      ],
      [
        '3. Advertising (Google AdSense)',
        'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'
      ],
      [
        '4. Statistics',
        'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, draws, star ratings). None of this identifies you personally.'
      ],
      [
        '5. Contact',
        'If you have any questions about this Privacy Policy, please contact the site operator.'
      ],
      [
        '6. Effective date',
        'This policy is effective as of October 7, 2026.'
      ]
    ],
    back: '← Back to Lotto Number Generator'
  }
};
