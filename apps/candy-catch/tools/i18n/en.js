/* Halloween Candy Catch — English (site root /, default + x-default)
 * Game rules, item ids and scoring live in candy-catch-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to (it is an action game). FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {score} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons/HUD numbers (must cover this language's script),
  // sans = optional body font, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Halloween Candy Catch Game – Free Arcade',
    description: 'Halloween candy catch game: slide your pumpkin bucket, catch falling candy, dodge spiders and ghosts and chain combos. 50 seconds, free, no download.',
    ogTitle: 'Halloween Candy Catch Game 🍬 How much can you catch?',
    ogDescription: 'Candy is raining from the sky. 50 seconds, 3 lives — how full can your bucket get?',
  },
  siteName: 'Halloween Candy Catch',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎃 Trick or treat · arcade',
    h1Kicker: 'Halloween Candy Catch Game',
    h1Html: 'How much candy<br>can you <em>catch</em>?',
    hook: 'It’s raining candy tonight. Fill your bucket before time runs out — but not everything falling is sweet.',
    how: { move: 'Drag or ← →', catch: 'Catch candy', avoid: 'Dodge the creepy ones' },
    facts: '50 seconds · 3 lives · combos',
    start: 'Start catching →',
  },

  play: {
    score: 'Score',
    time: 'Time',
    lives: 'Lives',
    livesAria: 'Lives left: {n}',
    combo: 'Combo ×{n}',
    pause: 'Pause',
    paused: 'Paused',
    resume: 'Resume',
    go: 'Go!',
    fieldAria: 'Game area. Drag, move the mouse or use the arrow keys to move the bucket.',
  },

  result: {
    timeUp: 'Time’s up!',
    outOfLives: 'Out of lives!',
    points: 'points',
    best: 'Best: {n}',
    newBest: 'New best!',
    caught: 'Candies caught',
    streak: 'Longest combo',
    top: 'Top {n}%',
    beat: 'Higher than {pct}% of players',
    beatAll: 'Higher than every other score so far',
    others: 'Compared with {n} other scores',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: 'Halloween Candy Catch Game',
    shareText: 'I scored {score} points in Halloween Candy Catch 🍬 Can you beat me?',
  },

  og: {
    brand: '🍬 Halloween Candy Catch',
    defaultKicker: 'Free Halloween arcade game',
    defaultTitle: 'How much candy can you catch?',
    defaultDesc: 'Slide the bucket · catch the candy · 50 seconds',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I play?', a: 'Drag your finger on the play area, move the mouse, or hold the ← → arrow keys to slide the pumpkin bucket. Catch the falling candy and stay away from the creepy things. A round lasts 50 seconds or until your three lives are gone.' },
    { q: 'How do points and combos work?', a: 'Every candy is worth points, and the rarer, fancier ones are worth more. Catch candies in a row to build a combo: the longer the streak, the bigger the multiplier. Missing a candy or catching something creepy resets it.' },
    { q: 'Is the top % real?', a: 'Yes. When a round ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown.' },
    { q: 'Why did the game stop by itself?', a: 'The game pauses automatically when you switch tabs or apps, so you never lose a life while you’re away. Tap Resume to carry on. Your best score is kept in this browser.' },
  ],

  privacy: {
    title: 'Privacy Policy | Halloween Candy Catch',
    description: 'Privacy Policy for Halloween Candy Catch: anonymous scores, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Halloween Candy Catch (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. When a round ends, only your score (rounded to the nearest 10 points) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your best score, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished rounds, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of September 30, 2026.'],
    ],
    back: '← Back to Halloween Candy Catch',
  },
};
