/* 2048 Game (Halloween edition) — English (site root /, default + x-default)
 * Rules and scoring live in game2048-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
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
    title: '2048 Game – Play Free Online, Halloween Edition',
    description: 'Play the classic 2048 game online with a Halloween twist: swipe or use the arrow keys, merge matching tiles and reach 2048. Free, no download.',
    ogTitle: '2048 Game 🎃 Can you reach 2048?',
    ogDescription: 'Swipe, merge, double up. A spooky little 2048 you can play right in your browser.',
  },
  siteName: '2048 Game',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎃 Halloween edition · number puzzle',
    h1Kicker: '2048 Game',
    h1Html: 'Can you reach<br><em>2048</em>?',
    hook: 'Slide the tiles. Two of the same number meet and merge into one — keep doubling up before the board fills.',
    how: { swipe: 'Swipe to slide', match: 'Merge the same', goal: 'Reach 2048' },
    facts: 'No timer · swipe or arrow keys',
    start: 'Start playing →',
  },

  play: {
    score: 'Score',
    best: 'Best',
    boardAria: 'Game board. Swipe or use the arrow keys to slide the tiles.',
    won: 'You made 2048!',
    keepGoing: 'Keep going',
    finish: 'Finish here',
    over: 'No moves left!',
  },

  result: {
    over: 'No moves left!',
    won: 'You reached 2048!',
    points: 'points',
    best: 'Best: {n}',
    newBest: 'New best!',
    biggest: 'Biggest tile',
    moves: 'Moves',
    top: 'Top {n}%',
    beat: 'Higher than {pct}% of players',
    beatAll: 'Higher than every other score so far',
    others: 'Compared with {n} other scores',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: '2048 Game – Halloween edition',
    shareText: 'I scored {score} points in the 2048 Game 🎃 Can you beat me?',
  },

  og: {
    brand: '🔢 2048 Game',
    defaultKicker: 'Free Halloween 2048',
    defaultTitle: 'Can you reach 2048?',
    defaultDesc: 'Swipe · merge · double up',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I play 2048?', a: 'Swipe on the board (or press the arrow keys) to slide every tile at once. When two tiles with the same number touch, they merge into one tile worth double. A new 2 or 4 appears after every move.' },
    { q: 'When is the game over?', a: 'There is no timer. The game ends when the board is full and no two neighbouring tiles match. If you make 2048 you can stop there or keep going for a bigger score.' },
    { q: 'How does scoring work?', a: 'Every merge adds the value of the new tile to your score, so bigger merges are worth more. Your best score is saved in this browser only.' },
    { q: 'Is the top % real?', a: 'Yes. When a game ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown.' },
  ],

  privacy: {
    title: 'Privacy Policy | 2048 Game',
    description: 'Privacy Policy for the 2048 Game: anonymous scores, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'The 2048 Game (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. When a game ends, only your score (rounded to the nearest 20 points) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your best score, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished games, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 4, 2026.'],
    ],
    back: '← Back to the 2048 Game',
  },
};
