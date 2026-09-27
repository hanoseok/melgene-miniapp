/* Spin the Wheel — English (root, default locale)
 * Search term: "spin the wheel" / "wheel picker". Title = "{search term} | {brand}".
 * Same keys as the other locale files. ui.presets must keep the same keys and item counts in every language
 * (check-roulette.js verifies this). Preset items are 24 chars max (CORE.MAX_LABEL).
 * FAQ items are shown only inside the shared end screen (common.js), never as a standalone page section.
 */
module.exports = {
  siteName: 'Spin the Wheel',
  meta: {
    title: 'Spin the Wheel | Melgene Apps',
    description: 'Free online spin-the-wheel picker. Type your options and spin — no install, no sign-up, done in a minute. Weighted odds and a shareable link included.',
    ogTitle: 'Spin the Wheel — a free online wheel picker',
    ogDescription: 'Type your options and spin. Free, fair and ready in your browser in a minute.',
  },
  // Display face for the sign, hub and result (set per language: fontCss loads it, displayFont names it)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Spin the Wheel',
    description: 'A free online spin-the-wheel and random picker. Add 2 to 16 options with optional weights, spin, and the winner is chosen fairly with cryptographic randomness. Share a link to the exact same wheel.',
  },
  hero: {
    h1: 'Spin the Wheel',
    tagline: "Can't decide? Write it down and spin.",
  },
  wheel: {
    spin: 'Spin',
    spinAria: 'Spin the wheel',
    share: 'Share',
    fair: 'The winner is picked at random the moment you press spin. The wheel just slows down to land on it.',
  },
  history: {
    title: 'Spin history',
    clear: 'Clear history',
  },
  editor: {
    title: 'Options',
    presetsLabel: 'Quick start',
    presets: { lunch: '🍕 Lunch', dare: '🎤 Dares', duty: '🙋 Names', yesno: '👍 Yes / No', numbers: '🔢 1–10' },
    add: 'Add option',
    shuffle: 'Shuffle',
    weighted: 'Weighted odds',
    weightedHint: 'Higher numbers get a wider slice and win more often.',
    themeLabel: 'Colors',
  },
  result: {
    kicker: 'The wheel picked',
    again: 'Spin again',
    removeAgain: 'Remove this & spin again',
    close: 'Close',
  },
  // Shown only in the shared end screen (data-mg-end), as a collapsible accordion — never on the start screen.
  faq: [
    { q: 'Can the result be rigged?', a: 'No. The winner is drawn with cryptographic randomness the instant you press spin, and the wheel simply stops on it. Tap timing and the animation have no influence on the result.' },
    { q: 'How do weighted odds work?', a: "Each option's chance is its weight (1–5) divided by the total of all weights. With weights 2, 1 and 1, the first option wins 50% of the time and the others 25% each." },
    { q: 'How many options can I add?', a: 'From 2 up to 16. Each option can be up to 24 characters; long names shrink or trim with an ellipsis when a slice is narrow.' },
    { q: 'Can I send my wheel to someone?', a: 'Yes. Share creates a link with your options, weights and color theme encoded in the address — no server storage needed.' },
    { q: 'Do I need to install an app or sign up?', a: 'No. It runs right in any phone, tablet or desktop browser — no download, no account.' },
  ],
  privacyLink: 'Privacy Policy',

  ui: {
    itemN: 'Option {n}',
    wheelAria: 'Wheel with {n} slices: {list}',
    ariaItem: 'Option {n} name',
    ariaHandle: 'Reorder option {n} (arrow up/down)',
    ariaDelete: 'Delete option {n}',
    ariaWeight: 'Option {n} weight {w}, press to change',
    count: '{n}/{max}',
    maxReached: 'You can add up to {max} options',
    minReached: 'The wheel needs at least 2 options',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    announce: 'Result: {label}',
    historyItem: 'Spin {n}',
    restore: 'Put back {n} removed',
    loadedShare: 'Loaded the shared wheel',
    badShare: "Couldn't open that wheel link", // toast is one line (nowrap) — keep it short
    shareTitle: 'Spin my wheel',
    shareText: 'I made a wheel — give it a spin?',
    themes: { candy: 'Candy', macaron: 'Macaron', circus: 'Circus', jewel: 'Jewel' },
    presets: {
      lunch: ['Pizza', 'Tacos', 'Burgers', 'Sushi', 'Ramen', 'Salad', 'Sandwiches', 'Thai'],
      dare: ['Sing a chorus', '10 push-ups', 'Fake an accent', 'Buy the coffee', 'Tell a bad joke', 'Dance 15 seconds', 'Talk like a pirate', 'Do an impression'],
      duty: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Lucas'],
      yesno: ['Yes', 'No'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Free online',
    title: 'Spin the Wheel',
    tag: 'Lunch, names, dares. Type it and spin.',
  },

  privacy: {
    title: 'Privacy Policy | Spin the Wheel',
    description: 'Privacy policy for Spin the Wheel — how your options are stored, cookies, ads and analytics.',
    h1: 'Privacy Policy',
    introHtml: 'Spin the Wheel (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Your wheel options, weights, color theme and spin history are never sent to a server — they stay in your browser (local storage and the URL). Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ads Settings</a>.'],
      ['4. Analytics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that only keep daily totals per language (page views, spins, star ratings). None of this identifies you personally.'],
      ['5. Shared links', 'Links created with "Share" contain the option names, weights and color theme you entered, encoded in the URL. Please avoid entering personally identifiable information.'],
      ['6. Contact', 'For questions about this policy, please contact the operator of the Service.'],
      ['7. Effective date', 'This policy is effective as of September 27, 2026.'],
    ],
    back: '← Back to Spin the Wheel',
  },
};
