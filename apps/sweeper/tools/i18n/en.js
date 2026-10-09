/* Minesweeper — English (site root /, default + x-default)
 * Rules live in sweeper-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to + difficulty picker. FAQ appears only in the shared end screen.
 * Placeholders: {t} {n} {pct} {time} {diff} — keep them as-is when translating.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    display: "'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Minesweeper – Free Online Mine Game',
    description: 'Play Minesweeper online: reveal every safe square, flag the mines and beat the clock on Beginner, Intermediate or Expert. Your first tap is always safe. Free, no download.',
    ogTitle: 'Minesweeper 💣 How fast can you clear the field?',
    ogDescription: 'Classic mine-sweeping puzzle in your browser: three sizes, a safe first tap and a clock to beat.',
  },
  siteName: 'Minesweeper',
  privacyLink: 'Privacy Policy',
  start: {
    badge: '💣 Classic puzzle · 3 levels',
    h1Kicker: 'Minesweeper',
    h1Html: 'Clear the field,<br>dodge every <em>mine</em>',
    hook: 'Numbers tell you how many mines hide next door. Think it through, flag the dangerous squares and clear the board before the clock runs away.',
    how: { reveal: 'Tap to reveal', flag: 'Hold to flag', chord: 'Tap a number to clear' },
    facts: 'Your first tap is always safe',
    diffLabel: 'Choose a level',
    diffs: { beginner: 'Beginner', intermediate: 'Medium', expert: 'Expert' },
    start: 'Start game →',
  },
  play: {
    mines: 'Mines',
    time: 'Time',
    digMode: 'Dig',
    flagMode: 'Flag',
    boardAria: 'Minesweeper board. Tap a square to reveal it, hold or use flag mode to mark a mine.',
    paused: 'Paused · tap to resume',
    aHidden: 'Hidden square',
    aFlag: 'Flagged square',
    aMine: 'Mine',
    aNum: '{n} mines nearby',
  },
  result: {
    win: 'Field cleared!',
    lose: 'Boom!',
    sec: 'sec',
    timeLabel: 'Time',
    clearedLabel: 'Cleared',
    best: 'Best: {t}',
    newBest: 'New best time!',
    top: 'Top {n}%',
    beat: 'Faster than {pct}% of players',
    beatAll: 'Faster than every other time so far',
    others: 'Compared with {n} other times',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: 'Minesweeper – can you clear the field?',
    shareWin: 'I cleared {diff} Minesweeper in {time} seconds 💣 Can you beat me?',
    shareLose: 'I got {pct}% of the {diff} Minesweeper field before boom 💥 Can you do better?',
  },
  og: {
    brand: '💣 Minesweeper',
    defaultKicker: 'Free puzzle game',
    defaultTitle: 'Can you clear the field?',
    defaultDesc: 'Flag the mines · beat the clock',
  },
  faq: [
    {
      q: 'How do I play Minesweeper?',
      a: 'Tap a square to reveal it. A number shows how many of the eight squares around it hide a mine. Use the numbers to work out where the mines are, flag them, and reveal every square that is not a mine to win.',
    },
    {
      q: 'How do I place a flag on a phone?',
      a: 'Press and hold a square for a moment, or switch the Dig / Flag button above the board to flag mode and tap. On a computer you can also right-click or press F on a focused square.',
    },
    {
      q: 'What does tapping a number do?',
      a: 'If you have flagged as many squares around a number as the number says, tapping it reveals all the remaining squares around it at once. If a flag was wrong, that square explodes, so check first.',
    },
    {
      q: 'Is my first tap really safe?',
      a: 'Yes. Mines are placed only after your first tap, and never on or right next to that square, so the first move always opens up some space. The timer starts with that tap and pauses when you leave the tab.',
    },
  ],
  privacy: {
    "title": "Privacy Policy | Minesweeper",
    "description": "Privacy Policy for Minesweeper: anonymous times, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Minesweeper (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When you win a game, only your level and finishing time (rounded to half a second) are sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of October 10, 2026."
      ]
    ],
    "back": "← Back to Minesweeper"
  },
};
