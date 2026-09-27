/* Ladder Game — English (root, default + x-default)
 * Search terms: "ladder game", "random picker", "draw lots online", "amidakuji", "ghost leg".
 * page.* goes into static HTML via tools/gen-i18n.js; ui.* is inlined for ladder.js.
 */
module.exports = {
  siteName: 'Ladder Game',
  meta: {
    title: 'Ladder Game, Random Picker & Draw Lots | Melgene Apps',
    description: 'Who buys coffee? Where\'s lunch? Who does the dishes? This free online ladder game (a random picker for drawing lots, a.k.a. amidakuji) decides fairly in seconds — no install, no sign-up. Share the exact same ladder with a link.',
    ogTitle: 'Ladder Game — the fair way to decide anything, free in 1 minute',
    ogDescription: 'Enter names and outcomes, tap, and watch the path. A free online random picker — no install needed.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Jua&display=swap',
  app: {
    name: 'Ladder Game',
    currency: 'USD',
    description: 'A free online ladder game (amidakuji) for drawing lots: pick lunch, decide who buys coffee, assign chores, or set the turn order. Enter players and outcomes to get a fair, random ladder, then share the exact same ladder with a link.',
  },
  setup: {
    badge: '🪜 Free online',
    h1Html: 'Can\'t decide?<br>Let the <em>ladder game</em> pick',
    hook: 'Add names and outcomes, then let fate do the rest. Lunch spots, coffee runs, chores, turn order — settled fairly.',
    countLabel: 'Number of players',
    minusAria: 'Fewer players',
    plusAria: 'More players',
    presetLabel: 'Quick presets',
    presets: { lunch: '🍕 Lunch pick', coffee: '☕ Who buys coffee', clean: '🧹 Chores', order: '🔢 Turn order' },
    namesLabel: 'Players',
    resultsLabel: 'Outcomes',
    shuffle: '🔀 Shuffle',
    build: 'Build the ladder →',
  },
  play: {
    edit: '← Edit',
    rebuild: '🔁 New ladder',
    hint: 'Tap a player to trace their path',
    revealAll: 'Reveal all results',
    finalTitle: 'Final results',
  },
  privacyLink: 'Privacy Policy',

  // Short, spoiler-free FAQ shown only in the shared end screen (MG_FAQ)
  faq: [
    { q: 'Is the ladder game fair?', a: 'Yes. The rungs are placed randomly for every ladder and paths can never overlap, so no one can predict or rig the result.' },
    { q: 'Can I make a new ladder with the same players?', a: 'Tap "New ladder" to keep your players and outcomes but generate a brand-new random ladder.' },
    { q: 'How many players can join?', a: 'Anywhere from 2 to 10 players.' },
    { q: 'Does it work on my phone?', a: 'Yes. It\'s built for tapping, and the ladder automatically fits any screen size.' },
  ],

  ui: {
    defaultName: 'Player {n}',
    win: 'Winner 🎉',
    lose: 'Nope',
    coffeeWin: 'Buys coffee',
    coffeeLose: 'Safe',
    order: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    pools: {
      lunch: ['Pizza', 'Tacos', 'Burgers', 'Sushi', 'Ramen', 'Salad', 'Burritos', 'Pho', 'Sandwiches', 'Thai curry'],
      clean: ['Dishes', 'Vacuuming', 'Laundry', 'Trash', 'Bathroom', 'Groceries', 'Dusting', 'Mopping', 'Plants', 'Recycling'],
    },
    ariaName: 'Player name {n}',
    ariaResult: 'Outcome {n}',
    ariaTrace: 'Trace {name}\'s path',
    ariaHidden: 'Result slot {n}, not revealed yet',
    ariaRevealed: '{result} revealed',
    shareTitle: 'Check out this ladder game',
    shareText: 'I made a ladder — ride the exact same one and see where you land!',
    retryLabel: 'New ladder',
  },

  og: {
    badge: '🪜 Free online',
    title: 'Ladder Game',
    tag: 'Lunch picks, coffee runs & chores, decided fairly',
  },

  privacy: {
    title: 'Privacy Policy | Ladder Game',
    description: 'Privacy Policy for Ladder Game — how we use cookies, advertising, and analytics.',
    h1: 'Privacy Policy',
    introHtml: 'Ladder Game (the "Service") respects your privacy and processes only the minimum information necessary, as described below.',
    sections: [
      ['1. Information we collect', 'You can use the Service without signing up or logging in. The names and outcomes you enter are never stored on our servers; they are processed only inside your browser (local storage and the page URL). Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work properly if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Analytics (Google Analytics)', 'The Service may use Google Analytics (GA4) to understand visitor numbers and traffic sources so we can improve it. This data is used only for statistics and does not identify you personally.'],
      ['5. Share links', 'Links created with "Share" contain the player names and outcome text you typed, plus the ladder layout, encoded in the URL. We recommend not entering information that could identify someone personally.'],
      ['6. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['7. Effective date', 'This policy is effective as of January 1, 2026.'],
    ],
    back: '← Back to Ladder Game',
  },
};
