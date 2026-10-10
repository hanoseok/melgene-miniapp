/* Random Number Generator — English (site root /, default + x-default)
 * Logic lives in randnum-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (range + options + Draw button); the result, recent draws and the shared end screen appear under it after a draw.
 * FAQ appears only in the shared end screen.
 * Placeholders like {n} {min} {max} {nums} {date} {label} {list} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Digits always use JetBrains Mono.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Random Number Generator – Pick Numbers Online',
    description: 'Free random number generator: pick one or up to 1,000 numbers between any minimum and maximum, with or without repeats. Exclude numbers, sort, copy and share a giveaway result link.',
    ogTitle: 'Random Number Generator 🔢 Pick numbers online',
    ogDescription: 'Any range, up to 1,000 numbers, no repeats if you like. Fair crypto random with a shareable result link.',
  },
  siteName: 'Random Number Generator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Random Number Generator',
    h1Html: 'Pick a number,<br><em>any</em> number',
    hook: 'Set a range, choose how many and draw. Raffles, giveaways, classroom picks or deciding who goes first.',
  },

  ui: {
    presetsLabel: 'Quick ranges',
    minLabel: 'From',
    maxLabel: 'To',
    countLabel: 'How many numbers?',
    countDec: 'One fewer',
    countInc: 'One more',
    dupLabel: 'Allow repeats',
    sortLabel: 'Sort results',
    more: 'More options',
    excludeLabel: 'Exclude numbers',
    excludePh: 'e.g. 4, 13, 20-25',
    excludeHint: 'Separate with commas or spaces. Write 20-25 to skip a whole run.',
    titleLabel: 'Draw title (optional)',
    titlePh: 'e.g. Friday raffle',
    draw: 'Draw numbers 🔢',
    drawing: 'Drawing…',
    fair: 'Unbiased crypto random · nothing leaves your browser',
  },

  errors: {
    minInvalid: 'Enter a whole number in “From”.',
    maxInvalid: 'Enter a whole number in “To”.',
    outOfLimit: 'Numbers must stay between −1,000,000,000 and 1,000,000,000.',
    minGtMax: '“From” can’t be bigger than “To”.',
    countInvalid: 'Draw at least one number.',
    countTooBig: 'You can draw up to 1,000 numbers at once.',
    notEnough: 'Only {n} different numbers are available. Allow repeats or draw fewer.',
    allExcluded: 'Every number in this range is excluded.',
    excludeBad: 'Couldn’t read these exclusions: {list}',
    excludeTooMany: 'You can exclude up to 1,000 numbers.',
    badLink: 'This result link is broken or incomplete, so nothing is shown from it.',
  },

  result: {
    heading: 'Your numbers',
    headingOne: 'Your number',
    sharedBadge: '🎁 Shared result',
    range: '{min} to {max}',
    countTag: '×{n}',
    noRepeat: 'No repeats',
    repeat: 'Repeats allowed',
    sorted: 'Sorted',
    excluded: '{n} excluded',
    sharedNote: 'Drawn on {date}. This is the original result saved in the link. Opening it never draws again.',
    copy: 'Copy numbers',
    copied: 'Numbers copied',
    copyLink: 'Copy result link',
    linkCopied: 'Link copied. Anyone who opens it sees this exact draw.',
    again: 'Draw again',
    drawOwn: 'Draw my own numbers',
    live: 'Result: {nums}',
    more: '+{n} more',
    shareTitle: 'Random Number Generator',
    shareText: 'I drew {nums} ({min} to {max}) 🔢',
    shareTextLabel: '{label}: {nums} ({min} to {max}) 🔢',
  },

  history: {
    title: 'Recent draws',
    note: 'Your last 10 draws, saved on this device only.',
    clear: 'Clear',
  },

  og: {
    brand: '🔢 Random Number Generator',
    kicker: 'Any range · up to 1,000 numbers',
    title: 'Pick random numbers online',
    desc: 'Fair, unbiased and easy to share for giveaways',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is this random number generator really fair?', a: 'Yes. Every number comes from your browser’s cryptographic random generator (crypto.getRandomValues) with rejection sampling, so no number in the range is even slightly more likely than another. The result is fixed before the rolling animation starts.' },
    { q: 'How do I draw numbers without repeats?', a: 'Leave “Allow repeats” off. Each number can then come up only once per draw, like names pulled from a hat. If you ask for more numbers than the range holds, you’ll be asked to widen the range or draw fewer.' },
    { q: 'How does the result link work for a giveaway?', a: 'After a draw, tap “Copy result link”. The numbers, the range, your options and the time of the draw are stored inside the link itself. Anyone who opens it sees that exact result marked as shared, and nothing is drawn again.' },
    { q: 'Can I use negative numbers or a huge range?', a: 'Yes. Both ends can go from −1,000,000,000 to 1,000,000,000, and you can draw up to 1,000 numbers at a time. You can also exclude specific numbers or runs such as 20-25.' },
  ],

  privacy: {
    title: 'Privacy Policy | Random Number Generator',
    description: 'Privacy Policy for Random Number Generator: your draws stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Random Number Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Your settings and drawn numbers are processed only in your browser and are not sent to our server. Your last 10 draws are kept in your browser’s local storage on your device, and you can clear them at any time with the Clear button. When you copy a result link, the numbers are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and recent draws, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, draws, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 11, 2026.'],
    ],
    back: '← Back to Random Number Generator',
  },
};
