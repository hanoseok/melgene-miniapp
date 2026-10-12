/* Password Generator — English (site root /, default + x-default)
 * Logic lives in password-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (mode + options + Generate button); the result and the shared end screen appear under it after generating.
 * FAQ appears only in the shared end screen. Never put a generated password into share text or links.
 * Placeholders like {n} {bits} {time} {label} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Passwords always use JetBrains Mono.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Password Generator – Strong & Random, Free',
    description: 'Free password generator: create strong random passwords (4–64 characters) or memorable passphrases, see the real entropy and time to crack, and copy in one tap. Runs in your browser.',
    ogTitle: 'Password Generator 🔑 Strong, random, private',
    ogDescription: 'Random passwords and passphrases with honest strength in bits. Made on your device, never sent anywhere.',
  },
  siteName: 'Password Generator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Password Generator',
    h1Html: 'Strong passwords,<br><em>made right here</em>',
    hook: 'Pick a length and the kinds of characters, or switch to a passphrase of random words. One tap makes it, one tap copies it.',
  },

  ui: {
    modeLabel: 'What to make',
    modePassword: 'Password',
    modePassphrase: 'Passphrase',
    lengthLabel: 'Length',
    typesLabel: 'Characters to use',
    upper: 'Uppercase',
    lower: 'Lowercase',
    digits: 'Numbers',
    symbols: 'Symbols',
    similar: 'Skip look-alikes',
    similarHint: 'Leaves out 0 O 1 l I so the password is easier to read and type.',
    wordsLabel: 'Words',
    sepLabel: 'Separator',
    sep: { dash: 'Dash', dot: 'Dot', underscore: 'Underscore', space: 'Space' },
    capitalize: 'Capitalize',
    addNumber: 'Add a number',
    wordsHint: 'Words are picked from a built-in list of 2,048 English words.',
    countLabel: 'How many',
    countOne: 'Just one',
    countFive: 'Five at once',
    generate: 'Generate 🔑',
    generating: 'Generating…',
    local: 'Made on your device with crypto.getRandomValues · never sent anywhere',
    needType: 'Pick at least one kind of character.',
  },

  result: {
    heading: 'Your password',
    headingMany: 'Your passwords',
    headingPhrase: 'Your passphrase',
    headingPhrases: 'Your passphrases',
    copy: 'Copy',
    copyAria: 'Copy number {n}',
    copied: 'Copied to clipboard',
    copyFail: 'Couldn’t copy. Select the text and copy it yourself.',
    strengthLabel: 'Strength',
    strength: { weak: 'Weak', fair: 'Fair', strong: 'Strong', veryStrong: 'Very strong' },
    bits: '{bits} bits of entropy',
    crack: 'Time to crack: {time}',
    crackInstant: 'less than a second',
    crackForever: 'longer than the age of the universe',
    crackNote: 'Average for an offline attack at 10 billion guesses per second.',
    tips: {
      weak: 'Too easy to guess. Make it longer or add more kinds of characters.',
      fair: 'OK for low-risk logins. Add a few characters for anything important.',
      strong: 'Good for most accounts. Store it in a password manager.',
      veryStrong: 'Excellent. Keep it unique to one account and turn on 2FA too.',
    },
    again: 'Generate new ones',
    live: 'New result ready. Strength: {label}.',
    shareTitle: 'Password Generator',
    shareText: 'Make strong random passwords right in your browser. Nothing is sent anywhere 🔑',
  },

  og: {
    brand: '🔑 Password Generator',
    kicker: 'Passwords · passphrases · real strength',
    title: 'Strong random passwords in one tap',
    desc: 'Made on your device, never sent anywhere',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is it safe to use an online password generator?', a: 'This one never sends anything. Each password is made on your own device with the browser’s cryptographic random generator (crypto.getRandomValues), and it is not stored, logged or put into the page address. Close the tab and it is gone.' },
    { q: 'How long should my password be?', a: 'For important accounts, 16 random characters or a passphrase of 5 to 6 words is a good target. The meter shows the entropy in bits: aim for at least 60 bits, and 80 or more for email, banking and your password manager.' },
    { q: 'What is a passphrase and is it as strong?', a: 'A passphrase is a few random words joined together, like a short silly sentence. Each word from the 2,048-word list adds 11 bits, so six words beat most 10-character passwords and are far easier to type and remember.' },
    { q: 'How is the time to crack calculated?', a: 'It is the average time to guess the password by trying every combination at 10 billion guesses per second, a fast offline attack. It assumes the attacker knows the settings you used, so it is an honest estimate rather than a flattering one.' },
  ],

  privacy: {
    title: 'Privacy Policy | Password Generator',
    description: 'Privacy Policy for Password Generator: passwords are made and kept only in your browser; cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Password Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Passwords and passphrases are generated only in your browser with its built-in cryptographic random generator. They are never sent to our server or any other server, never saved in your browser’s storage, and never written into the page address or share links. When you copy one, it goes only to your device’s clipboard.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, generations, star ratings). These counters never include the passwords themselves, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 13, 2026.'],
    ],
    back: '← Back to Password Generator',
  },
};
