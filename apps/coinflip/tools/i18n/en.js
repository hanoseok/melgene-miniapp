/* Coin Flip — English (site root /, default + x-default)
 * Coin & dice logic lives in coinflip-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {n} {name} — keep them as-is when translating.
 * count / countDice: plural forms for Intl.PluralRules (one/few/many/other as the language needs; "other" is required).
 * tool.sideA / sideB: default names of the two sides (max 12 characters, the user can change them).
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons (Nunito: Latin ext, Vietnamese, Cyrillic),
  // sans = optional body font, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Coin Flip: Heads or Tails Online',
    description: 'Can’t decide? Flip a coin online, heads or tails, and let chance choose. Rename the two sides to anything you like, or roll one to three dice. Free, no sign-up.',
    ogTitle: 'Coin Flip 🪙 Heads or Tails & Dice Roller',
    ogDescription: 'Flip a coin or roll the dice and let chance decide.',
  },
  siteName: 'Coin Flip',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🪙 The fairest tie-breaker',
    h1Kicker: 'Coin Flip',
    h1Html: 'Heads or tails?<br>Let the <em>coin</em> decide',
    hook: 'Name your two options, flip the coin and go with whatever lands. Or roll a few dice instead.',
    facts: 'Coin and dice · rename the sides · a fair flip every time',
    start: 'Toss it →',
  },

  tool: {
    title: 'Toss it',
    tabCoin: 'Coin',
    tabDice: 'Dice',
    namesLabel: 'Name the two sides',
    namesHint: 'Heads and tails by default. Change them to your own options, like Pizza and Sushi.',
    sideA: 'Heads',
    sideB: 'Tails',
    fieldA: 'Name of side one',
    fieldB: 'Name of side two',
    throwCoin: 'Flip the coin 🪙',
    diceLabel: 'How many dice?',
    rollDice: 'Roll the dice 🎲',
  },

  count: { one: '{n} flip this session', other: '{n} flips this session' },
  countDice: { one: '{n} roll this session', other: '{n} rolls this session' },

  result: {
    titleCoin: 'It landed on',
    titleDice: 'You rolled',
    sum: 'Total {n}',
    tallyTitle: 'This session',
    tallySide: '{name} {n}',
    againCoin: 'Flip again',
    againDice: 'Roll again',
    change: 'Back to the toss',
    shareTitle: 'Coin Flip – Heads or Tails',
    shareTextCoin: 'I flipped a coin and it landed on {name} 🪙',
    shareTextDice: 'I rolled the dice and got {n} 🎲',
  },

  og: {
    brand: '🪙 Coin Flip',
    kicker: 'Heads or tails · coin & dice',
    title: 'Heads or tails?',
    desc: 'Flip the coin or roll the dice · one fair toss decides',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How does the coin flip work?', a: 'Name your two sides if you like, then tap flip. The result is drawn first and the coin spins to show it, so what you see is always the real outcome. Switch to the Dice tab to roll one to three six-sided dice.' },
    { q: 'Is the flip really fair?', a: 'Yes. The result comes from your browser’s cryptographic random generator (crypto.getRandomValues) with rejection sampling, so heads and tails are exactly as likely, and every die face has the same chance. The animation is only for show.' },
    { q: 'Can I use my own options instead of heads and tails?', a: 'Yes. Type any two names into the boxes above the coin, for example Pizza and Sushi, and the result shows the winner’s name. Leave a box empty to get the default name back.' },
    { q: 'What do the counts at the end mean?', a: 'They only count what you have thrown on this page since you opened it, including how often each side came up. They reset when you reload and are never sent anywhere.' },
  ],

  privacy: {
    title: 'Privacy Policy | Coin Flip',
    description: 'Privacy Policy for Coin Flip: your side names stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Coin Flip (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The side names you type and your results are processed only in your browser and are not sent to our server. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, throws, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 5, 2026.'],
    ],
    back: '← Back to Coin Flip',
  },
};
