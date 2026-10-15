/* Memory Match Game — English (site root /, default + x-default)
 * Rules live in memory-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + level picker + one short how-to line. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {pct} {time} {moves} {pairs} — keep them as-is when translating.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Memory Match Game – Halloween Card Flip',
    description: 'Play a free Memory Match Game online: flip the Halloween cards two at a time and find every pair. Easy, Normal and Hard levels, a timer and move count. No download.',
    ogTitle: 'Memory Match Game 🎃 Can you find every pair?',
    ogDescription: 'Pumpkins, ghosts and bats are hiding face down. Flip two cards at a time and test your memory.',
  },
  siteName: 'Memory Match Game',
  privacyLink: 'Privacy Policy',
  start: {
    badge: '🎃 Halloween card flip',
    h1Kicker: 'Memory Match Game',
    h1Html: 'Flip the cards,<br>find every <em>pair</em>',
    hook: 'Pumpkins, ghosts and bats are hiding face down. Turn over two cards at a time and remember where everything is.',
    how: 'Flip two cards · same picture = a pair',
    levelLabel: 'Choose a level',
    levels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
    start: 'Start →',
  },
  play: {
    time: 'Time',
    moves: 'Moves',
    pairs: 'Pairs',
    boardAria: 'Memory board. Flip two cards to find a matching pair.',
    aDown: 'Card {n}, face down',
    paused: 'Paused · tap to continue',
  },
  result: {
    done: 'All pairs found!',
    sec: 'sec',
    movesLabel: 'Moves',
    accLabel: 'Accuracy',
    best: 'Best: {t}',
    newBest: 'New best time!',
    top: 'Top {n}%',
    beat: 'Faster than {pct}% of players',
    beatAll: 'Faster than every other time so far',
    others: 'Compared with {n} other times on this level',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: 'Halloween Memory Match – how sharp is your memory?',
    shareText: 'I found all {pairs} pairs in {time} s with {moves} moves 🎃 Can you beat me?',
  },
  og: {
    brand: '🃏 Memory Match Game',
    defaultKicker: 'Free Halloween memory game',
    defaultTitle: 'Can you find every pair?',
    defaultDesc: 'Flip two cards · remember · match',
  },
  faq: [
    {
      q: 'How do I play the Memory Match Game?',
      a: 'All cards start face down. Tap one card, then a second one. If both show the same picture they stay open as a pair; if not, they turn back over after a moment. Find every pair to finish. The clock starts with your first card.',
    },
    {
      q: 'What counts as a move, and how is accuracy worked out?',
      a: 'Every time you turn over two cards, that is one move. Accuracy is the number of pairs divided by your moves, so finding all pairs without a single miss would be 100%. Mistakes do not add time, but they do cost moves.',
    },
    {
      q: 'What is the difference between the levels?',
      a: 'Easy has 12 cards (6 pairs), Normal has 16 cards (8 pairs) and Hard has 24 cards (12 pairs). The cards and pictures are shuffled again every round, and your best time is kept separately for each level.',
    },
    {
      q: 'What happens if I switch to another app?',
      a: 'The timer stops and the cards are covered so nobody can peek. Tap the board when you come back and the round carries on from where you left off.',
    },
    {
      q: 'Where does the “Top %” number come from?',
      a: 'When you finish, your level and rounded time are compared with the real times of other players on the same level. If there are no other times to compare with yet, the comparison is simply not shown.',
    },
  ],
  privacy: {
    "title": "Privacy Policy | Memory Match Game",
    "description": "Privacy Policy for the Memory Match Game: anonymous times, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Memory Match Game (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When you finish a round, only your level and finishing time (rounded to a tenth of a second) are sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
      ],
      [
        "2. Cookies and similar technologies",
        "The Service may use cookies and your browser’s local storage to remember your language and your best times, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do."
      ],
      [
        "3. Advertising (Google AdSense)",
        "The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google Ad Settings</a>."
      ],
      [
        "4. Statistics",
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished games, star ratings). None of this identifies you personally."
      ],
      [
        "5. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "6. Effective date",
        "This policy is effective as of October 16, 2026."
      ]
    ],
    "back": "← Back to the Memory Match Game"
  },
};
