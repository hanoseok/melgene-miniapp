/* Spin the Bottle — English (site root /, default + x-default)
 * Logic lives in bottle-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen: options (mode, names, no-repeat, mission cards) → table with the bottle → spin → result + history + shared end screen.
 * FAQ appears only in the shared end screen. prompts = built-in mission cards, shown one at a time after a spin only (never listed).
 * Placeholders like {n} {k} {r} {name} {deg} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons/names, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Spin the Bottle Online – Fair Party Picker',
    description: 'Spin the bottle online: put the phone in the middle of the table, add names around the circle and see who the bottle points at. Who goes first, who picks the song. Free, fair, no sign-up.',
    ogTitle: 'Spin the Bottle 🍾 Who is it going to be?',
    ogDescription: 'Phone in the middle, names around the table, one fair spin. Great for deciding who goes first at a party.',
  },
  siteName: 'Spin the Bottle',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Spin the Bottle',
    h1Html: 'Phone in the middle,<br><em>let the bottle decide</em>',
    hook: 'Who goes first? Who picks the next song? Who clears the table? Give it a spin.',
  },

  ui: {
    modeLabel: 'How do you want to play?',
    modeFree: 'Just spin',
    modeNames: 'With names',
    namesLabel: 'Who is at the table?',
    namesPh: 'One name per line, in seating order\nEmma\nLiam\nOlivia\nNoah',
    namesHint: '2 to 12 people. Type them in the order you sit, going clockwise.',
    namesCount: '{n} at the table',
    skipLabel: 'No repeats',
    skipHint: 'Everyone gets picked once before anyone is picked again.',
    promptsLabel: 'Mission card after each spin',
    promptsHint: 'A small, friendly challenge for whoever the bottle picks.',
    srcBuiltin: 'Surprise me',
    srcCustom: 'My own list',
    customLabel: 'Your missions',
    customPh: 'One per line\nDo your best robot dance\nTell us your favourite snack',
    customHint: 'Up to 30 lines. Cards come up one at a time.',
    stageAria: 'Bottle on the table. Tap or flick it to spin.',
    tapHint: 'Tap or flick the bottle',
    spin: 'Spin the bottle 🍾',
    spinning: 'Spinning…',
    fair: 'The result is picked fairly with crypto random before the bottle moves · names stay on your device',
  },

  errors: {
    namesTooFew: 'Add at least 2 names, or switch to Just spin.',
    namesTooMany: 'Up to 12 people fit around the table ({n} names entered).',
    promptsEmpty: 'Write at least one mission, or pick Surprise me.',
    badLink: 'This link is broken, so no names were loaded from it.',
  },

  result: {
    pointsAt: 'The bottle points at',
    freeTitle: 'Whoever it points at!',
    freeText: 'Look where the neck stopped. That person is up.',
    angle: '{deg}°',
    round: 'Round {r} · {k} of {n} picked',
    roundDone: 'Everyone has had a turn. The next spin starts round {r}.',
    promptTitle: 'Mission card',
    history: 'Last spins',
    historyFree: 'Spin',
    again: 'Spin again',
    reset: 'Start a new round',
    resetDone: 'New round, everyone is back in.',
    shareNames: 'Copy link with these names',
    linkCopied: 'Link copied. It opens this table with the same names.',
    sharedNote: 'Names loaded from a shared link. Ready to spin!',
    live: 'The bottle points at {name}',
    liveFree: 'The bottle stopped at {deg} degrees',
    shareTitle: 'Spin the Bottle',
    shareText: 'Put the phone in the middle and let the bottle decide 🍾',
  },

  // Built-in mission cards: family-friendly, short, one at a time after a spin. Never list them anywhere else.
  prompts: [
    'Sing one line of any song you like.',
    'Do your best impression of a cartoon character.',
    'Tell everyone the best thing that happened to you this week.',
    'Strike a superhero pose and hold it for five seconds.',
    'Say a tongue twister three times fast.',
    'Name three things you can see that are orange.',
    'Tell us your go-to snack and why it wins.',
    'Give the person on your left a genuine compliment.',
    'Act out an animal until someone guesses it.',
    'Do a dramatic slow-motion walk across the room.',
    'Tell a joke, the cheesier the better.',
    'Describe your dream Halloween costume in one sentence.',
  ],

  og: {
    brand: '🍾 Spin the Bottle',
    kicker: 'Phone in the middle · one fair spin',
    title: 'Spin the bottle, see who it picks',
    desc: 'Who goes first, who picks the song, who tidies up',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the spin really random and fair?', a: 'Yes. Before the bottle moves, the app picks the result with your browser’s cryptographic random generator (crypto.getRandomValues) and rejection sampling, so every seat has exactly the same chance. The spin animation, and how hard you flick the bottle, only show that result.' },
    { q: 'How do I put names around the bottle?', a: 'Choose With names and type 2 to 12 names, one per line, in the order you are sitting, going clockwise. They are placed evenly around the table, and the bottle stops pointing at one of them.' },
    { q: 'What does No repeats do?', a: 'With No repeats on, nobody is picked twice until everyone at the table has been picked once. Then a new round starts automatically, or you can start one yourself.' },
    { q: 'What are mission cards?', a: 'An optional extra: after each spin, a small friendly challenge appears for the person the bottle picked, like a quick impression or a compliment. Use the built-in cards or write your own list.' },
  ],

  privacy: {
    title: 'Privacy Policy | Spin the Bottle',
    description: 'Privacy Policy for Spin the Bottle: names and missions stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Spin the Bottle (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names and mission cards you enter are processed only in your browser and are not sent to our server. Your last list of names may be kept in your browser’s local storage on your device so it is ready next time. When you copy a link with names, those names are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, spins started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 19, 2026.'],
    ],
    back: '← Back to Spin the Bottle',
  },
};
