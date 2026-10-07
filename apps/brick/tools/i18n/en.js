/* Brick Breaker — English (site root /, default + x-default)
 * Rules and physics live in brick-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {score} — keep them as-is when translating.
 * result.tiers = 6 rank titles from the lowest to the highest score.
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
    title: 'Brick Breaker – Free Online Breakout Game',
    description: 'Play Brick Breaker online: bounce the ball off your paddle, smash the neon bricks and clear faster and faster stages with three lives. Free, no download.',
    ogTitle: 'Brick Breaker 🧱 How many stages can you clear?',
    ogDescription: 'Classic breakout in neon: one paddle, one ball, three lives. Play right in your browser.',
  },
  siteName: 'Brick Breaker',
  privacyLink: 'Privacy Policy',
  start: {
    badge: '🧱 Arcade classic · 3 lives',
    h1Kicker: 'Brick Breaker',
    h1Html: 'Smash every<br><em>neon</em> brick',
    hook: 'Keep the ball in play with your paddle and clear the wall. Every stage gets a little faster.',
    how: { move: 'Drag to move', smash: 'Break bricks', catch: 'Grab power-ups' },
    facts: 'Touch, mouse or ← → keys',
    start: 'Start game →',
  },
  play: {
    score: 'Score',
    stage: 'Stage',
    lives: 'Lives',
    boardAria: 'Brick Breaker field. Move the paddle to bounce the ball and break the bricks.',
    launch: 'Tap to launch',
    stageClear: 'Stage {n}',
    lifeLost: 'Ball lost!',
    gameOver: 'Game over',
    wide: 'Wide paddle!',
    multi: 'Multi-ball!',
  },
  result: {
    gameOver: 'Game over',
    points: 'points',
    best: 'Best: {n}',
    newBest: 'New best!',
    stage: 'Stage reached',
    bricks: 'Bricks broken',
    tiers: ['Rookie Bouncer', 'Arcade Regular', 'Wall Wrecker', 'Neon Smasher', 'Paddle Wizard', 'Breakout Legend'],
    top: 'Top {n}%',
    beat: 'Higher than {pct}% of players',
    beatAll: 'Higher than every other score so far',
    others: 'Compared with {n} other scores',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: 'Brick Breaker – neon arcade',
    shareText: 'I scored {score} points in Brick Breaker 🧱 Can you beat me?',
  },
  og: {
    brand: '🧱 Brick Breaker',
    defaultKicker: 'Free arcade game',
    defaultTitle: 'How far can you smash?',
    defaultDesc: 'One paddle · one ball · 3 lives',
  },
  faq: [
    {
      q: 'How do I play Brick Breaker?',
      a: 'Drag on the field (or move the mouse, or use the arrow keys) to slide the paddle and bounce the ball into the bricks. Tap or press Space to launch the ball. Clear every brick to move on to the next stage.',
    },
    {
      q: 'How do I aim the ball?',
      a: 'Where the ball lands on the paddle decides its angle: the middle sends it straight up, the edges send it off to the side.',
    },
    {
      q: 'What do the falling capsules do?',
      a: 'Some broken bricks drop a capsule. Catch it with the paddle for a wider paddle for a while, or for extra balls.',
    },
    {
      q: 'When does the game end?',
      a: 'You have three lives. When the last ball falls past the paddle you lose one, and the game ends when none are left. Your best score is saved in this browser only.',
    },
  ],
  privacy: {
    title: 'Privacy Policy | Brick Breaker',
    description: 'Privacy Policy for Brick Breaker: anonymous scores, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Brick Breaker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. When a game ends, only your score (rounded to the nearest 20 points) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your best score, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished games, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 8, 2026.'],
    ],
    back: '← Back to Brick Breaker',
  },
};
