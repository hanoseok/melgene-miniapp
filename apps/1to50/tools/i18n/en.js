/* 1 to 50 Game — English (site root /, default + x-default)
 * Rules live in 1to50-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to + mode picker. FAQ appears only in the shared end screen.
 * Placeholders: {t} {s} {n} {pct} {time} {max} — keep them as-is when translating.
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
    title: '1 to 50 Game – Number Touch Speed Test',
    description: 'Play the 1 to 50 game online: tap the numbers in order as fast as you can and beat your best time to 0.01 s. Classic 1–50 or quick 1–25 mode. Free, no download.',
    ogTitle: '1 to 50 Game 🔢 How fast can you tap 1 to 50?',
    ogDescription: 'Find and tap every number in order, from 1 to 50. A quick test of focus and finger speed.',
  },
  siteName: '1 to 50 Game',
  privacyLink: 'Privacy Policy',
  start: {
    badge: '🔢 Number touch · speed test',
    h1Kicker: '1 to 50 Game',
    h1Html: 'Tap 1 to 50<br>as <em>fast</em> as you can',
    hook: 'The numbers are scattered across the grid. Find the next one, tap it, and keep going until you reach the end. Your eyes have to be quicker than your fingers.',
    how: { order: 'Tap in order from 1', swap: 'New numbers pop up', penalty: 'Wrong tap +0.5 s' },
    facts: '3-2-1 countdown · timed to 0.01 s',
    modeLabel: 'Choose a mode',
    modes: { classic: 'Classic', quick: 'Quick' },
    start: 'Start →',
  },
  play: {
    next: 'Next',
    time: 'Time',
    progress: 'Done',
    go: 'GO!',
    boardAria: '1 to 50 board. Tap the numbers in order, starting from 1.',
    paused: 'Paused · tap to continue',
    aBlank: 'Cleared square',
  },
  result: {
    done: 'All done!',
    sec: 'sec',
    mistakesLabel: 'Wrong taps',
    perLabel: 'Per number',
    best: 'Best: {t}',
    newBest: 'New best time!',
    penNote: 'Includes +{s} s for wrong taps',
    top: 'Top {n}%',
    beat: 'Faster than {pct}% of players',
    beatAll: 'Faster than every other time so far',
    others: 'Compared with {n} other times',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: '1 to 50 Game – how fast are you?',
    shareText: 'I tapped 1 to {max} in {time} seconds 🔢 Can you beat me?',
  },
  og: {
    brand: '🔢 1 to 50 Game',
    defaultKicker: 'Free speed game',
    defaultTitle: 'How fast can you tap 1 to 50?',
    defaultDesc: 'Find the next number · beat the clock',
  },
  faq: [
    {
      q: 'How do I play the 1 to 50 game?',
      a: 'After a 3-2-1 countdown, a 5 by 5 grid shows the numbers 1 to 25 in random places. Tap 1, then 2, then 3 and so on. In Classic mode each square you clear shows a new number from 26 to 50, so you keep going until you tap 50.',
    },
    {
      q: 'What happens if I tap the wrong number?',
      a: 'The square shakes and 0.5 seconds are added to your time, so guessing does not pay off. Tapping an empty square does nothing. Your result shows how many wrong taps you made.',
    },
    {
      q: 'What is the difference between Classic and Quick?',
      a: 'Classic goes all the way from 1 to 50 and is the usual way to compare times. Quick stops at 25 and every cleared square stays empty, which makes it a short warm-up and works like a Schulte table.',
    },
    {
      q: 'Where does the “Top %” number come from?',
      a: 'When you finish, your mode and rounded time are compared with the real times of other players in the same mode. If there are no other times to compare with yet, the comparison is simply not shown.',
    },
  ],
  privacy: {
    "title": "Privacy Policy | 1 to 50 Game",
    "description": "Privacy Policy for the 1 to 50 Game: anonymous times, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "1 to 50 Game (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When you finish a game, only your mode and finishing time (rounded to a tenth of a second) are sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of October 14, 2026."
      ]
    ],
    "back": "← Back to the 1 to 50 Game"
  },
};
