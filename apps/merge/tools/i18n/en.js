/* Suika Game Halloween Merge — English (site root /, default + x-default)
 * Rules, tiers and scoring live in merge-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
 * tiers: names of the 11 pieces, smallest → biggest (same order as merge-core.js TIERS).
 * Placeholders: {n} {pct} {score} {name} — keep them as-is when translating.
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
    title: 'Suika Game Halloween Merge, Free Online',
    description: 'Suika Game with a Halloween twist: drop treats into the jar, merge matching pairs into bigger ones and grow a giant jack-o’-lantern. Free, no download.',
    ogTitle: 'Suika Game Halloween Merge 🎃 How big can you grow it?',
    ogDescription: 'Drop, match, merge. Keep the jar under the line and see how far up the chain you can go.',
  },
  siteName: 'Suika Game Halloween Merge',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎃 Halloween · merge puzzle',
    h1Kicker: 'Suika Game Halloween Merge',
    h1Html: 'How big can<br>your <em>merge</em> get?',
    hook: 'Drop treats into the jar. Two of the same touch and they merge into something bigger — just don’t let the pile spill over the line.',
    how: { aim: 'Aim and drop', match: 'Match two', line: 'Stay under the line' },
    facts: 'No timer · play at your own pace',
    start: 'Start merging →',
  },

  play: {
    score: 'Score',
    best: 'Best',
    next: 'Next',
    nextAria: 'Next piece: {name}',
    pause: 'Pause',
    paused: 'Paused',
    resume: 'Resume',
    full: 'Jar’s full!',
    chainAria: 'Merge chain from the smallest piece to the biggest',
    fieldAria: 'Game jar. Move or drag to aim, then release or click to drop. Arrow keys aim, Space drops.',
  },

  result: {
    full: 'The jar overflowed!',
    points: 'points',
    best: 'Best: {n}',
    newBest: 'New best!',
    biggest: 'Biggest piece',
    merges: 'Merges',
    top: 'Top {n}%',
    beat: 'Higher than {pct}% of players',
    beatAll: 'Higher than every other score so far',
    others: 'Compared with {n} other scores',
    comparing: 'Comparing with other players…',
    retry: 'Play again',
    shareTitle: 'Suika Game Halloween Merge',
    shareText: 'I scored {score} points in Suika Game Halloween Merge 🎃 Can you beat me?',
  },

  tiers: ['Candy corn', 'Candy', 'Lollipop', 'Chestnut', 'Apple', 'Mushroom', 'Bat', 'Ghost', 'Crystal ball', 'Pumpkin', 'Jack-o’-lantern'],

  og: {
    brand: '🎃 Suika Game Halloween Merge',
    defaultKicker: 'Free Halloween merge game',
    defaultTitle: 'How big can your merge get?',
    defaultDesc: 'Drop · match two · merge bigger',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I play?', a: 'Move your finger or mouse over the jar to aim, then let go (or click) to drop the piece. Arrow keys aim and Space drops. When two identical pieces touch, they merge into the next size up.' },
    { q: 'When is the game over?', a: 'There is no timer. The game ends when the pile stays above the dashed line near the top for about two seconds, so leave yourself room and plan your merges.' },
    { q: 'How does scoring work?', a: 'Every merge earns points, and bigger merges earn more. Chain reactions add up fast, so try to line up pieces that will merge one after another.' },
    { q: 'Is the top % real?', a: 'Yes. When a game ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown. The game also pauses by itself when you switch tabs.' },
  ],

  privacy: {
    title: 'Privacy Policy | Suika Game Halloween Merge',
    description: 'Privacy Policy for Suika Game Halloween Merge: anonymous scores, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Suika Game Halloween Merge (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. When a game ends, only your score (rounded to the nearest 10 points) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your best score, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished games, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 2, 2026.'],
    ],
    back: '← Back to Suika Game Halloween Merge',
  },
};
