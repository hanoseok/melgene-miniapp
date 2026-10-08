/* Dice Roller — English (site root /, default + x-default)
 * Dice logic lives in dice-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * The app has one screen (settings + tray + Roll button); the shared end screen appears under it after the first roll.
 * FAQ appears only in the shared end screen.
 * Placeholders: {n} {dice} {values} {total} — keep them as-is when translating.
 * ui.dieLetter: the letter used in dice notation (2d6, d20). English and most languages use "d"; German uses "W".
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
    title: 'Roll a Dice Online – Dice Roller',
    description: 'Roll a dice online in one tap. Throw one to six dice at once, pick a classic d6 or d4, d8, d10, d12 and d20 for tabletop games, and see the total instantly. Fair, free, no sign-up.',
    ogTitle: 'Dice Roller 🎲 Roll a Dice Online',
    ogDescription: 'Roll one to six dice, d6 to d20, and see the total in a tap.',
  },
  siteName: 'Dice Roller',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Roll a Dice Online',
    h1Html: 'Shake, roll and<br>let the <em>dice</em> decide',
    hook: 'Pick how many dice and which kind, then roll. Board games, tabletop RPGs or settling who does the dishes.',
  },

  ui: {
    dieLetter: 'd',
    countLabel: 'How many dice?',
    typeLabel: 'Type of die',
    typeHint: 'd6 is the classic cube. d4 to d20 are for tabletop games.',
    roll: 'Roll the dice 🎲',
    rolling: 'Rolling…',
    keyHint: 'Tip: press Space to roll',
    idle: 'Ready when you are',
    total: 'Total {n}',
    trayLabel: 'Dice tray',
    live: 'You rolled {values}. Total {total}.',
    liveOne: 'You rolled {values}.',
    fair: 'Every face has exactly the same chance (crypto random)',
  },

  history: {
    title: 'Your last 10 rolls',
    note: 'Kept only while this page is open.',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: 'Roll again',
    shareTitle: 'Dice Roller – Roll a Dice Online',
    shareText: 'I rolled {dice} and got {values} = {total} 🎲',
    shareTextOne: 'I rolled {dice} and got {values} 🎲',
  },

  og: {
    brand: '🎲 Dice Roller',
    kicker: '1–6 dice · d4 to d20',
    title: 'Roll a dice online',
    desc: 'Tap once, see every die and the total',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the dice roller really random and fair?', a: 'Yes. Every result comes from your browser’s cryptographic random generator (crypto.getRandomValues) with rejection sampling, so no face is even slightly more likely than another. The result is decided before the animation starts; the tumbling is only for show.' },
    { q: 'How many dice can I roll at once?', a: 'From one to six dice per roll, all of the same type. The tray shows each die and the total, and the last ten rolls stay in a short list while the page is open.' },
    { q: 'What are d4, d8, d10, d12 and d20?', a: 'They are dice with 4, 8, 10, 12 and 20 sides, used in tabletop role-playing games such as Dungeons & Dragons. The number after the d is the number of faces, so a d20 gives 1 to 20 and 2d6 means two six-sided dice.' },
    { q: 'Can I use it for board games?', a: 'Of course. Use it when the dice are missing, when you need more dice than the box has, or when you play over a video call. Press Space on a keyboard to roll quickly.' },
  ],

  privacy: {
    title: 'Privacy Policy | Dice Roller',
    description: 'Privacy Policy for Dice Roller: your rolls stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Dice Roller (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Your dice settings and results are processed only in your browser and are not sent to our server. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, rolls, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 9, 2026.'],
    ],
    back: '← Back to Dice Roller',
  },
};
