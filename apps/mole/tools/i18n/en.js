/* Whack-a-Mole — English (site root /, default + x-default)
 * Rules and scoring live in mole-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {score} — keep them as-is when translating.
 * result.tiers = 6 rank titles from the lowest to the highest score.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Whack-a-Mole – Play Free Online Game',
    description: 'Play Whack-a-Mole online: tap the moles as they pop out of the holes, dodge the bombs and beat the clock in 30 seconds. Free, no download.',
    ogTitle: 'Whack-a-Mole 🔨 How many can you hit in 30 seconds?',
    ogDescription: 'Tap the moles, dodge the bombs, earn a rank. A quick whack-a-mole game right in your browser.',
  },
  siteName: 'Whack-a-Mole',
  privacyLink: 'Privacy Policy',
  start: {
    badge: '🔨 Reflex game · 30 seconds',
    h1Kicker: 'Whack-a-Mole',
    h1Html: 'How many moles<br>can you <em>whack</em>?',
    hook: 'Moles pop out of the holes faster and faster. Tap them before they hide, but leave the bombs alone!',
    how: { tap: 'Tap the moles', avoid: 'Skip the bombs', goal: 'Earn a rank' },
    facts: 'One round · 30 seconds · just tap',
    start: 'Start whacking →',
  },
  play: {
    score: 'Score',
    best: 'Best',
    time: 'Time',
    boardAria: 'Whack-a-Mole board with nine holes. Tap the moles that pop up and avoid the bombs.',
    timeUp: 'Time’s up!',
  },
  result: {
    timeUp: 'Time’s up!',
    points: 'points',
    best: 'Best: {n}',
    newBest: 'New best!',
    hits: 'Moles whacked',
    bombs: 'Bombs hit',
    tiers: ['Sleepy Mole', 'Garden Rookie', 'Hammer Hand', 'Mole Hunter', 'Lightning Whacker', 'Mole Master'],
    top: 'Top {n}%',
    beat: 'Higher than {pct}% of players',
    beatAll: 'Higher than every other score so far',
    others: 'Compared with {n} other scores',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: 'Whack-a-Mole – 30-second challenge',
    shareText: 'I scored {score} points in Whack-a-Mole 🔨 Can you beat me?',
  },
  og: {
    brand: '🔨 Whack-a-Mole',
    defaultKicker: 'Free 30-second game',
    defaultTitle: 'How many moles can you whack?',
    defaultDesc: 'Tap fast · dodge the bombs',
  },
  faq: [
    {
      q: 'How do I play Whack-a-Mole?',
      a: 'Tap the moles that pop out of the holes: 10 points each, 30 for a golden mole. Tapping a bomb costs you 20 points, so let it pass. You have 30 seconds and the moles get faster as the round goes on.',
    },
    {
      q: 'What happens after 30 seconds?',
      a: 'The round ends by itself and shows your score and your rank title. Your best score is saved in this browser only.',
    },
    {
      q: 'Do I lose points for tapping an empty hole?',
      a: 'No, only bombs take points away. But moles stay up for a very short time, so be quick.',
    },
    {
      q: 'Is the top % real?',
      a: 'Yes. When a round ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown.',
    },
  ],
  privacy: {
    title: 'Privacy Policy | Whack-a-Mole',
    description: 'Privacy Policy for the Whack-a-Mole: anonymous scores, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Whack-a-Mole (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. When a game ends, only your score (rounded to the nearest 10 points) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your best score, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished games, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 6, 2026.'],
    ],
    back: '← Back to Whack-a-Mole',
  },
};
