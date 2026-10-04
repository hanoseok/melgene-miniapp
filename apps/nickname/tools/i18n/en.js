/* Nickname Generator — English (site root /, default + x-default)
 * Combining logic lives in nickname-core.js; this file holds every visible string and the word lists for this language.
 * words: per mood { adj: [...], noun: [...] }. Adjectives may list gender forms 'masc/fem/neut' (one form = same for all);
 *   nouns may end with '|m', '|f' or '|n' (default m). Each mood needs at least 12 adjectives and 12 nouns.
 * style: camel = capitalise each word and join them (SleepyOtter); order = 'adj-noun' | 'noun-adj'; nameSep = joiner before the typed name.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {n} {nick} — keep them as-is when translating.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Nickname Generator – Cute & Cool Names',
    description: 'Need a nickname or username? Pick a vibe (cute, cool, funny, dreamy or mysterious), add your name if you like and get a random nickname in one tap. Spin again until it fits, then copy it. Free, no sign-up.',
    ogTitle: 'Nickname Generator ✨ Cute & Cool Names',
    ogDescription: 'Pick a vibe, add your name and get a nickname you can copy in one tap.',
  },
  siteName: 'Nickname Generator',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🏷️ Out of name ideas?',
    h1Kicker: 'Nickname Generator',
    h1Html: 'Find a nickname<br>that’s <em>yours</em>',
    hook: 'Choose a vibe, toss in your name if you want, and get a nickname made just for you.',
    facts: 'Cute, cool, funny, dreamy · mixes in your name · copy in one tap',
    start: 'Make my nickname →',
  },

  make: {
    title: 'What’s your vibe?',
    moodLabel: 'Pick a vibe',
    moods: { cute: 'Cute', cool: 'Cool', funny: 'Funny', dreamy: 'Dreamy', mystic: 'Mysterious' },
    nameLabel: 'Your name or letters (optional)',
    nameHint: 'We’ll mix it into the nickname. Up to 12 characters, stays in your browser.',
    namePlaceholder: 'e.g. Mia',
    numbers: '＋ Add numbers',
    poolCount: 'Combinations in this vibe: {n}+',
    make: 'Make my nickname 🎲',
  },

  result: {
    title: 'Your nickname',
    copy: 'Copy nickname',
    copied: 'Copied!',
    copyFail: 'Couldn’t copy. Select the nickname and copy it by hand.',
    again: 'Make another',
    change: 'Change vibe',
    shareTitle: 'Nickname Generator',
    shareText: 'The nickname generator gave me “{nick}” ✨',
  },

  style: { camel: true, order: 'adj-noun', nameSep: '_' },

  words: {
    cute: {
      adj: ['fluffy', 'squishy', 'tiny', 'sweet', 'cuddly', 'bubbly', 'sparkly', 'snuggly', 'peachy', 'fuzzy', 'giggly', 'cozy'],
      noun: ['bunny', 'kitten', 'puppy', 'panda', 'mochi', 'marshmallow', 'cupcake', 'duckling', 'peach', 'bean', 'pudding', 'koala'],
    },
    cool: {
      adj: ['neon', 'turbo', 'silent', 'rapid', 'frosty', 'atomic', 'savage', 'midnight', 'chrome', 'royal', 'electric', 'blazing'],
      noun: ['wolf', 'falcon', 'viper', 'rider', 'blade', 'storm', 'tiger', 'comet', 'titan', 'hawk', 'racer', 'ninja'],
    },
    funny: {
      adj: ['sleepy', 'grumpy', 'wobbly', 'clumsy', 'sneaky', 'chonky', 'derpy', 'soggy', 'bonkers', 'goofy', 'lazy', 'cranky'],
      noun: ['potato', 'noodle', 'pickle', 'waffle', 'penguin', 'llama', 'toast', 'meatball', 'walrus', 'burrito', 'goblin', 'hamster'],
    },
    dreamy: {
      adj: ['starry', 'cloudy', 'misty', 'velvet', 'lunar', 'pastel', 'drifting', 'glowing', 'silky', 'hazy', 'golden', 'serene'],
      noun: ['moon', 'cloud', 'aurora', 'stardust', 'lullaby', 'horizon', 'petal', 'galaxy', 'whisper', 'daydream', 'sunrise', 'meadow'],
    },
    mystic: {
      adj: ['hollow', 'cryptic', 'veiled', 'phantom', 'obsidian', 'twilight', 'haunted', 'hidden', 'forgotten', 'wicked', 'ashen', 'arcane'],
      noun: ['raven', 'specter', 'oracle', 'enigma', 'cipher', 'wraith', 'shade', 'sphinx', 'relic', 'rune', 'ember', 'nightfall'],
    },
  },

  og: {
    brand: '🏷️ Nickname Generator',
    kicker: 'Pick a vibe · get a name',
    title: 'Find a nickname that’s yours',
    desc: 'Cute, cool, funny or dreamy · mixes in your name · copy in one tap',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How does the nickname generator work?', a: 'Pick a vibe, optionally type your name or a few letters, and tap make. The tool joins an adjective and a noun from that vibe’s word list, and mixes in your letters if you gave any.' },
    { q: 'Is the nickname really random?', a: 'Yes. Words are drawn with your browser’s cryptographic random generator (crypto.getRandomValues), so every word in the list is equally likely. The flicker before the result is just for show.' },
    { q: 'Can I put my own name in?', a: 'Yes, up to 12 characters. A name, initials or any letters work. What you type is used only in your browser and is never sent anywhere or saved.' },
    { q: 'Could someone else get the same nickname?', a: 'It’s possible, because each vibe has hundreds of combinations. If a game or service says the nickname is taken, make another one or switch on “Add numbers”.' },
  ],

  privacy: {
    title: 'Privacy Policy | Nickname Generator',
    description: 'Privacy Policy for Nickname Generator: the name you type stays in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Nickname Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The name or letters you type and the vibe you choose are processed only in your browser and are not sent to our server. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your last vibe, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, nicknames made, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 5, 2026.'],
    ],
    back: '← Back to Nickname Generator',
  },
};
