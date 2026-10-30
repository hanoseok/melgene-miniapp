/* Goal Bingo Card Maker — English (site root /, default + x-default)
 * Logic lives in bingo-core.js; this file holds every visible string for this language.
 * hero.h1Html is inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * ui.lines = plural forms picked with Intl.PluralRules (keys one/few/many/other as needed, "other" always).
 * ideas = ~40 short goal ideas for "Fill empty with ideas" (natural for this language, ≤ 26 characters each).
 * Placeholders — keep them as-is: {n} {total} numbers · {year} year · {title} board title
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Goal Bingo Card Maker – 2027 Resolution Bingo',
    description: 'Free goal bingo card maker: write your 2027 resolutions on a 3×3, 4×4 or 5×5 bingo board, pick colours, save it as an image and stamp each goal you reach.',
    ogTitle: 'Goal Bingo Card Maker 🎯 Your 2027 on one board',
    ogDescription: 'Make a resolution bingo card, save it as an image and stamp goals as you hit them.',
  },
  siteName: 'Goal Bingo Card Maker',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Goal Bingo Card Maker',
    h1Html: 'Turn your new year into <em>a game of bingo</em>',
    hook: 'Write your goals in the squares, save a card worth posting, and stamp each one as you make it happen.',
  },

  ui: {
    sizeLabel: 'Board size',
    startBtn: 'Make my bingo card',
    continueBtn: 'Open my saved board',
    editH: 'Write your goals',
    titleLabel: 'Board title',
    defaultTitle: 'My {year} Bingo',
    freeLabel: 'Free centre square',
    free: 'FREE',
    themeLabel: 'Colours',
    cellLabel: 'Square {n}',
    cellPh: 'Type a goal',
    next: 'Next',
    filled: '{n}/{total} squares filled',
    ideas: '✨ Fill with ideas',
    shuffle: '🔀 Shuffle',
    clear: 'Clear all',
    done: 'Done – make my card',
    needAll: 'Fill every square first, or tap “Fill with ideas”.',
    doneH: 'Your bingo card',
    tapHint: 'Tap a square on the card when you reach that goal.',
    lines: { one: '{n} bingo line', other: '{n} bingo lines' },
    goalsDone: '{n} of {total} goals done',
    blackout: 'Blackout! Every goal done 🎉',
    download: 'Save image',
    link: 'Copy board link',
    linkCopied: 'Link copied. It opens this board with your stamps.',
    edit: 'Edit goals',
    sharedNote: 'Someone shared their bingo board with you. Make your own with the button below.',
    again: 'Make a new board',
    localNote: 'Your board is saved on this device only. Nothing is sent to a server.',
    imageAlt: 'Bingo card: {title}',
    saved: 'Image saved',
    shareTitle: 'Goal Bingo Card Maker',
    shareText: 'Make your own 2027 goal bingo card 🎯',
  },

  errors: {
    badLink: 'This board link could not be read. Start a new board instead.',
  },

  themes: { sunrise: 'Sunrise', mint: 'Mint', berry: 'Berry', night: 'Night', ocean: 'Ocean', paper: 'Paper' },

  ideas: [
    'Read 12 books', 'Run a 5K', 'Drink more water', 'Learn to cook 5 dishes', 'Save an emergency fund', 'Visit a new country',
    'Sleep before midnight', 'Call family weekly', 'Try a new hobby', 'Take a solo trip', 'Walk 10k steps a day', 'Learn basic Spanish',
    'Declutter my closet', 'Watch a sunrise', 'Start a journal', 'Go a week without sugar', 'Do a digital detox day', 'Volunteer once',
    'Finish an online course', 'Try yoga', 'Plant something', 'Write letters to friends', 'Cook a family recipe', 'Go camping',
    'Learn to swim better', 'Pay off a credit card', 'Take a dance class', 'Visit a museum', 'Do 30 push-ups', 'Bake bread from scratch',
    'Go to a concert', 'Make a new friend', 'Read the news less', 'Try 5 new restaurants', 'Learn an instrument', 'Have a picnic',
    'Give blood', 'Ask for a raise', 'Hike a mountain', 'Make a photo album',
  ],

  og: {
    brand: '🎯 Goal Bingo',
    kicker: '3×3 · 4×4 · 5×5',
    title: 'Your 2027 goals, one bingo card',
    desc: 'Write, save as an image, stamp as you go',
  },

  faq: [
    { q: 'How do I make a goal bingo card?', a: 'Pick a board size, give it a title and type one goal into each square. If you get stuck, tap Fill with ideas to drop suggestions into the empty squares, then edit them to fit your life. Tap Done to get your card.' },
    { q: 'Can I mark goals later in the year?', a: 'Yes. Your board is saved in this browser, so come back any time, tap Open my saved board and tap a square to stamp it. Complete a row, a column or a diagonal and it counts as a bingo line.' },
    { q: 'How do I post it on Instagram or print it?', a: 'Tap Save image to download a portrait card that fits Instagram and phone wallpapers. You can print the same image on A4 or letter paper and stick it on the fridge.' },
    { q: 'Does the board link share my goals?', a: 'Copy board link puts the board into the part of the link after #, which is never sent to a server. Only people you send the link to can see your goals and stamps.' },
  ],

  privacy: {
    title: 'Privacy Policy | Goal Bingo Card Maker',
    description: 'Privacy Policy for Goal Bingo Card Maker: your goals stay in your browser, plus cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Goal Bingo Card Maker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The title, goals and stamps you enter are processed only in your browser and are not sent to our server. Your board is kept in your browser’s local storage on your own device so you can come back and stamp goals later. If you use Copy board link, the board is written into the part of the link after “#”, which browsers do not send to servers; only the people you send the link to can see it. Saved images are created on your device.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your board, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, boards started and finished, star ratings). Your goals are never part of these counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 30, 2026.'],
    ],
    back: '← Back to Goal Bingo Card Maker',
  },
};
