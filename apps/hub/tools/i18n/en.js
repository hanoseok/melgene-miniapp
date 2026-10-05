/* Melgene Apps portal (hub) — English (default language, site root /).
 * privacy.introHtml and privacy.sections bodies are raw HTML; everything else is plain text.
 * ui is used by script.js and inlined into the page as window.PAGE_I18N.
 * No spoilers: curation copy describes each app's mood, never its actual questions or results. */
module.exports = {
  siteName: 'Melgene Apps',
  // Header wordmark: 'Melgene' + small badge (must equal shared STRINGS.en.brandBadge).
  brand: { word: 'Melgene', badge: 'Apps' },
  // --font-sans / --font-display for this language (Gabarito covers Latin incl. é ü ñ œ).
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Free Mini Games & Personality Tests | Melgene Apps',
    description:
      'Free mini games and personality tests that open right in your browser. No download, no sign-up, and each mini app takes about a minute.',
    ogTitle: 'Melgene Apps: free mini games & personality tests',
    ogDescription: 'Mini games, personality tests and more. No download, no sign-up: tap one and play in a minute.',
  },
  homeAria: 'Melgene Apps home',
  // Small visible <h1> under the header: brand + the search term people actually type.
  h1: 'Free mini games & personality tests',
  // "Today's Mini Apps" carousel. id = SITE_CONFIG.SITES id, one entry per app; the page shows 6 random of the 10 newest SITES apps, so every one of those 10 needs an entry here.
  curation: {
    h2: 'Today’s Mini Apps',
    items: [
      {
        id: 'mole',
        kicker: 'Reflex game',
        headline: 'Whack the moles, dodge the bombs',
        blurb: 'Tap the moles before they hide. 30 seconds, one rank.',
      },
      {
        id: 'nickname',
        kicker: 'Make it yourself',
        headline: 'Find a nickname that fits you',
        blurb: 'Pick a vibe and get a fresh nickname in one tap.',
      },
      {
        id: 'coinflip',
        kicker: 'Can\'t decide?',
        headline: 'Heads or tails? Roll the dice',
        blurb: 'Flip a coin or roll up to three dice, fair every time.',
      },
      {
        id: 'invite',
        kicker: 'Make it yourself',
        headline: 'Make a Halloween party invitation',
        blurb: 'Add the party details, pick a theme, then save or share it.',
      },
      {
        id: 'lunch',
        kicker: 'Can\'t decide?',
        headline: 'Spin the reel for today\'s meal',
        blurb: 'Pick a meal and a mood and let the slot machine choose.',
      },
      {
        id: 'merge',
        kicker: 'Quick game',
        headline: 'Drop, match, merge, grow',
        blurb: 'Two of a kind merge into something bigger. Don\'t overflow the jar!',
      },
      {
        id: 'costume',
        kicker: 'Personality quiz',
        headline: 'Who will you be this Halloween?',
        blurb: 'Answer a few situations and get the costume that fits you.',
      },
      {
        id: 'ghost',
        kicker: 'Make it yourself',
        headline: 'Build your own little ghost',
        blurb: 'Pick a shape, a face and a hat, then save it or send it.',
      },
      {
        id: 'team',
        kicker: 'Split into teams',
        headline: 'Fair random teams in one tap',
        blurb: 'Type the names, pick how many teams and shuffle.',
      },
      {
        id: 'lovestyle',
        kicker: 'Personality quiz',
        headline: 'What kind of partner are you?',
        blurb: 'Ten little dating moments, two minutes. See how you love.',
      },
      {
        id: 'animal',
        kicker: 'Personality quiz',
        headline: 'Which animal are you?',
        blurb: 'Eight everyday moments, two minutes. Meet your wild side.',
      },
      {
        id: 'game2048',
        kicker: 'Puzzle game',
        headline: 'Slide, merge, reach 2048',
        blurb: 'Swipe the tiles and combine matching numbers. Halloween edition.',
      },
      {
        id: 'aura',
        kicker: 'Personality quiz',
        headline: 'What color is your aura?',
        blurb: 'Answer a few everyday moments and see the glow you give off.',
      },
      {
        id: 'candy-catch',
        kicker: 'Quick game',
        headline: 'Catch the falling candy',
        blurb: 'Slide your pumpkin bucket, dodge the spooky stuff, chain combos.',
      },
    ],
  },
  browse: {
    h2: 'All mini apps',
    searchLabel: 'Search mini apps',
    searchPlaceholder: 'Search mini apps',
    catLabel: 'Categories',
    sortLabel: 'Sort by',
  },
  ui: {
    cats: { all: 'All', game: 'Games', test: 'Personality Tests', create: 'Create', vote: 'Vote' },
    sorts: { popular: 'Popular', rating: 'Top rated', newest: 'Newest' },
    totalHtml: 'Played <strong>{n} times</strong> so far',
    play: 'Play now',
    newBadge: 'NEW',
    plays: '{n} plays',
    ratingAria: 'Rated {avg} out of 5 from {votes} ratings',
    prev: 'Previous pick',
    next: 'Next pick',
    goTo: 'Show pick {n}',
    count: '{n} apps',
    countOne: '1 app',
    emptyCat: 'No mini apps in this category yet.',
    emptySearch: 'Nothing matches “{q}”. Try another word or browse them all.',
    reset: 'Show all',
  },
  faqTitle: 'FAQ',
  // Visible at the bottom of the portal (+ FAQPage JSON-LD). Short, spoiler-free.
  faq: [
    [
      'What is Melgene Apps?',
      'Melgene Apps is a free collection of mini apps: quick mini games, personality tests and apps that turn a few answers into something of your own. Each one takes about a minute and opens right in your browser.',
    ],
    [
      'Do I need to download anything or sign up?',
      'No. Every mini game and test is a web page that works on phones, tablets and computers, so you can send a link and your friends can play right away. If you play often, choose “Add to Home Screen” in your browser menu to keep it like an app.',
    ],
    [
      'Do you collect personal data?',
      'No. We never ask for your name, email or phone number. Hearts, ratings and play counts are anonymous totals per app, and a share link stores only the answers needed to show that result.',
    ],
    [
      'How often are new mini apps added?',
      'We keep adding new games and personality tests based on what’s trending. New apps wear a NEW badge for two weeks and come first when you sort by Newest.',
    ],
  ],
  privacyLink: 'Privacy Policy',
  og: {
    h1Html: 'Free mini games &amp;<br>personality tests',
    tag: 'No download. No sign-up. Just play.',
  },
  privacy: {
    title: 'Privacy Policy | Melgene Apps',
    description: 'Privacy Policy for Melgene Apps: advertising (Google AdSense), anonymous play counts, hearts and ratings, cookies and browser storage.',
    h1: 'Privacy Policy',
    introHtml:
      'Melgene Apps (the “Service”) is a collection of mini apps you can use without an account. We respect your privacy and process only the minimum information needed to run the Service, as described below.',
    sections: [
      [
        '1. Information we don’t collect',
        'The Service never asks for or collects personal information such as your name, email, phone number or an account. What you enter in each mini app is processed in your own browser by default.',
      ],
      [
        '2. Anonymous counts: plays, hearts and ratings (Supabase)',
        'To show play counts, hearts and ratings, we store only the following in Supabase (a database service): running totals per mini app (plays and hearts), star ratings (1–5) per mini app, and daily totals per date, mini app and language (page views, completed plays and whether an ad was shown). So that the same visit isn’t counted twice within 30 seconds, the server briefly keeps a one-way hash of your IP address and deletes it automatically, usually within a day. To count each browser’s rating once, your browser keeps a random identifier and the server stores only a one-way hash of it. When you create a share link, we store only the answers needed to show that result to whoever opens it. None of this is used to identify you.',
      ],
      [
        '3. Advertising (Google AdSense Auto ads)',
        'The Service shows ads through Google AdSense Auto ads, which means Google chooses where ads appear. Google and its partners may use cookies to show ads based on your interests. You can review and change personalized ad settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.',
      ],
      [
        '4. Analytics (Google Analytics)',
        'The Service may use Google Analytics (GA4) for visitor statistics and to improve the Service. This data is used only for statistics and does not identify you personally.',
      ],
      [
        '5. Cookies and browser storage',
        'Settings such as your language, the category and sort you last used, and the ratings you gave are saved only in your browser (localStorage, plus a cookie that remembers your language). You can delete or block cookies and site data in your browser settings at any time.',
      ],
      ['6. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['7. Effective date', 'This policy is effective as of September 26, 2026.'],
    ],
    back: '← Back to Melgene Apps',
  },
};
