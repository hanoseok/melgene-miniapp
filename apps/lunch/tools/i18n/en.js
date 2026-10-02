/* What Should I Eat? — English (site root /, default + x-default)
 * Picking logic lives in lunch-core.js; this file holds every visible string and the dish list for this language.
 * menus: dishes people in this language area really eat, each 'name|emoji|meals|moods'.
 *   meals letters: b breakfast, l lunch, d dinner, n late night   mood letters: h hearty, l light, s spicy, o solo-friendly (quick to eat alone)
 *   Every meal needs enough dishes, and every meal × mood needs at least one. Names max 22 characters.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {n} {name} — keep them as-is when translating.
 * count: plural forms for Intl.PluralRules (one/few/many/other as the language needs; "other" is required).
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons (Nunito: Latin ext, Vietnamese, Cyrillic),
  // sans = optional body font, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'What Should I Eat? Random Food Picker',
    description: 'Can’t decide what to eat? Pick breakfast, lunch, dinner or a late-night snack, tick a mood and spin the slot-machine reels for a random food pick. Skip dishes you don’t like. Free, no sign-up.',
    ogTitle: 'What Should I Eat? 🎰 Random Food Picker',
    ogDescription: 'Pick the meal and your mood, spin the reels and eat whatever lands.',
  },
  siteName: 'What Should I Eat?',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🍽️ Ending the “you pick” loop',
    h1Kicker: 'What Should I Eat?',
    h1Html: 'Let the <em>reels</em><br>pick your meal',
    hook: 'Choose the meal and your mood, pull the lever, and eat whatever the slot machine lands on.',
    facts: 'Breakfast to late night · everyday dishes · skip what you don’t like',
    start: 'Spin for a meal →',
  },

  pick: {
    title: 'What are we craving?',
    mealLabel: 'Which meal?',
    meals: { b: 'Breakfast', l: 'Lunch', d: 'Dinner', n: 'Late night' },
    moodLabel: 'Mood (optional)',
    moodHint: 'Tick any that fit. Nothing ticked means anything goes.',
    tags: { h: 'Hearty', l: 'Light', s: 'Spicy', o: 'Solo-friendly' },
    idle: '?',
    spin: 'Spin the reels 🎰',
    none: 'Nothing fits those moods. Try fewer mood tags.',
    noneLeft: 'You skipped every dish that fits. Bring them back to keep spinning.',
    skipped: '{n} skipped',
    reset: 'Bring back',
  },

  count: { one: '{n} dish in the running', other: '{n} dishes in the running' },

  result: {
    title: 'Today’s pick',
    again: 'Spin again',
    exclude: 'Not this one',
    change: 'Change mood',
    excluded: '{name} skipped.',
    shareTitle: 'What Should I Eat? – Random Food Picker',
    shareText: 'The slot machine says I’m eating {name} 🎰',
  },

  menus: [
    'Pancakes|🥞|b|h',
    'Scrambled Eggs & Toast|🍳|b|ho',
    'Bacon & Eggs|🥓|b|h',
    'Oatmeal|🥣|b|lo',
    'Avocado Toast|🥑|bl|lo',
    'Bagel & Cream Cheese|🥯|bl|o',
    'Breakfast Burrito|🌯|bl|hs',
    'Yogurt Parfait|🍨|bn|lo',
    'French Toast|🍞|b|h',
    'Cheeseburger|🍔|ldn|ho',
    'Pepperoni Pizza|🍕|ldn|h',
    'Caesar Salad|🥗|ld|lo',
    'Chicken Wings|🍗|dn|hs',
    'Street Tacos|🌮|ldn|so',
    'Burrito Bowl|🍚|ld|ho',
    'Mac & Cheese|🧀|ldn|h',
    'Turkey Sandwich|🥪|l|lo',
    'Chicken Noodle Soup|🍜|ld|l',
    'Steak & Fries|🥩|d|h',
    'BBQ Ribs|🍖|d|h',
    'Fried Chicken|🍗|ld|h',
    'Hot Dog|🌭|ln|o',
    'Spaghetti & Meatballs|🍝|ld|h',
    'Sushi Rolls|🍣|ld|l',
    'Pad Thai|🍜|ld|s',
    'Chicken Curry|🍛|ld|hs',
    'Ramen|🍜|ldn|hs',
    'Grilled Cheese|🥪|ldn|ho',
    'Poke Bowl|🥗|ld|l',
    'Fish & Chips|🐟|ld|h',
    'Chili|🌶️|ld|hs',
    'Nachos|🧀|n|hs',
    'Ice Cream|🍦|n|lo',
    'Popcorn|🍿|n|lo',
    'French Fries|🍟|ln|ho',
  ],

  og: {
    brand: '🍽️ What Should I Eat?',
    kicker: 'Pick a meal · pull the lever',
    title: 'What should I eat today?',
    desc: 'Breakfast to late night · one spin decides · skip what you don’t like',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How does the food picker work?', a: 'Choose breakfast, lunch, dinner or late night, tick any moods you feel like, and tap spin. The reels stop on one dish that fits, taken from a list of dishes people really eat.' },
    { q: 'Is the pick really random?', a: 'Yes. The dish is drawn with your browser’s cryptographic random generator (crypto.getRandomValues), so every dish that fits is equally likely. The spinning reels are just for show, and nobody can steer the result.' },
    { q: 'How do I get rid of a dish I don’t feel like?', a: 'Tap “Not this one” on the result. That dish is skipped while you keep spinning, and it comes back when you press “Bring back” or reload the page.' },
    { q: 'What do the mood tags do?', a: 'They narrow the list. With several tags on, a dish only needs to match one of them. Leave them all off to draw from every dish for that meal. Your last meal and moods are remembered only in this browser.' },
  ],

  privacy: {
    title: 'Privacy Policy | What Should I Eat?',
    description: 'Privacy Policy for What Should I Eat?: your choices stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'What Should I Eat? (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The meal and mood you choose are processed only in your browser and are not sent to our server. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your last meal and mood, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, spins, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 3, 2026.'],
    ],
    back: '← Back to What Should I Eat?',
  },
};
