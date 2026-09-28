/* Food Tournament (food world cup) — English (site root /, default + x-default)
 * Food ids, emoji and bracket logic live in food-cup-core.js; this file holds every visible string.
 * foods: the name people in this language actually use for that dish (ids are the same in every language —
 * server vote totals are shared across languages). Keep names short: they sit on half-width cards at 360px.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no food list, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {round} {n} {total} {pct} {food} {emoji} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons/VS (Unbounded: Latin ext, Vietnamese, Cyrillic),
  // name = food names on the cards (Oswald: Latin ext, Vietnamese, Cyrillic), sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Food Tournament – This or That Food Game',
    description: 'Food tournament: two dishes at a time, tap the one you’d rather eat until one champion is left. A this-or-that food game in about a minute. Free, no download.',
    ogTitle: 'Food Tournament 🏆 This or That Food Game',
    ogDescription: 'Two dishes, one pick, fifteen rounds. Which food will you crown?',
  },
  siteName: 'Food Tournament',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🍽️ This or that · food edition',
    h1Kicker: 'Food Tournament',
    h1Html: 'Which food takes<br>the <em>crown</em>?',
    hook: 'Two dishes, one choice. Keep picking until only your favorite is left.',
    facts: '16 foods · 15 picks · 1 min',
    start: 'Start the tournament →',
  },

  play: {
    rounds: { r16: 'Round of 16', qf: 'Quarterfinal', sf: 'Semifinal', f: 'Final' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Pick {n} of {total}',
    hint: 'Which would you rather eat?',
    vs: 'VS',
    pickAria: 'Pick {food}',
    same: '{pct}% picked the same',
  },

  result: {
    eyebrow: 'Your food champion',
    champPct: '{pct}% of players also crowned {food}',
    champFirst: 'You’re one of the first to finish — no stats yet.',
    fourTitle: 'Your final four',
    retry: 'Play again (new bracket)',
    shareTitle: 'Food Tournament – This or That Food Game',
    shareText: 'My food champion is {emoji} {food}! What’s yours?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Burger',
    sushi: 'Sushi',
    noodles: 'Ramen',
    chicken: 'Fried chicken',
    tacos: 'Tacos',
    pasta: 'Pasta',
    curry: 'Curry',
    dumplings: 'Dumplings',
    steak: 'Steak',
    hotpot: 'Hot pot',
    hotdog: 'Hot dog',
    friedrice: 'Fried rice',
    sandwich: 'Sandwich',
    stew: 'Paella',
    shrimp: 'Tempura',
  },

  og: {
    brand: '🏆 Food Tournament',
    defaultKicker: 'This or that · food edition',
    defaultTitle: 'Which food takes the crown?',
    defaultDesc: 'Two dishes at a time · one champion · about a minute',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How does the food tournament work?', a: 'Sixteen dishes are shuffled into a bracket. Each match shows two of them; tap the one you’d rather eat and it moves on. Round of 16, quarterfinals, semifinals and the final make 15 picks, and the last dish standing is your champion.' },
    { q: 'Are the percentages real?', a: 'Yes. Every pick is counted anonymously on our server, once per browser for each matchup. A percentage only appears once enough people have played that exact matchup; until then we show nothing instead of a made-up number.' },
    { q: 'Can I play again or share my result?', a: 'Play again as often as you like. Each round gets a new random bracket, so the matchups change. Use the share buttons to send your champion to friends and see what they pick.' },
    { q: 'Why these sixteen foods?', a: 'They are dishes people love all over the world, from street food to comfort food. The names follow what people in your language usually call them, but the dishes are the same everywhere, so the numbers compare players from every country.' },
  ],

  privacy: {
    title: 'Privacy Policy | Food Tournament',
    description: 'Privacy Policy for Food Tournament: anonymous pick counts, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Food Tournament (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Your picks are sent to our server only as anonymous counts (which dish won which matchup, and which dish you crowned), with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and which matchups you already counted, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished tournaments, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of September 29, 2026.'],
    ],
    back: '← Back to the Food Tournament',
  },
};
