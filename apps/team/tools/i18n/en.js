/* Random Team Generator — English (site root /, default + x-default)
 * Team ids, emoji, colors and the shuffle live in team-core.js; this file holds every visible string.
 * teams: fun team names (same ids in every language — share links store the id number, so the recipient sees them in their language).
 * sample: names people in this language commonly have (used by the "Sample names" button). Max 20 characters each.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no FAQ, no ad). FAQ appears only in the shared end screen.
 * Placeholders: {n} {k} {min} {max} {size} {name} {count} — keep them as-is when translating.
 * people: plural forms for Intl.PluralRules (one/few/many/other as the language needs; "other" is required).
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons/team names (Nunito: Latin ext, Vietnamese, Cyrillic),
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
    title: 'Random Team Generator – Split Names into Teams',
    description: 'Random team generator: paste names, pick the number of teams or people per team and shuffle into fair, balanced teams. Keep captains apart and share the exact result. Free, no sign-up.',
    ogTitle: 'Random Team Generator 🎲 Split Names into Teams',
    ogDescription: 'Paste the names, tap shuffle, get fair teams in seconds — and share the exact result.',
  },
  siteName: 'Random Team Generator',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎲 No more picking sides',
    h1Kicker: 'Random Team Generator',
    h1Html: 'Who ends up<br>on <em>your team</em>?',
    hook: 'Paste the names, tap shuffle and let pure chance split the group. No arguing.',
    facts: 'Up to 60 names · captains apart · shareable result',
    start: 'Make teams →',
  },

  input: {
    title: 'Who’s playing?',
    namesLabel: 'Names',
    namesHint: 'One per line or separated by commas. Put * before a captain.',
    placeholder: 'Emma\nLiam\n*Olivia\nNoah, Ava, James',
    sample: 'Sample names',
    clear: 'Clear',
    tooMany: 'Only the first {max} names are used.',
    needMore: 'Add at least 2 names.',
    modeLabel: 'Split by',
    modeTeams: 'Number of teams',
    modeSize: 'People per team',
    minus: 'Fewer',
    plus: 'More',
    previewEq: '{k} teams × {size}',
    previewRange: '{k} teams × {min}–{max}',
    leaders: 'Keep captains (*) on different teams',
    leadersCount: 'Captains marked: {n}',
    leadersNone: 'Mark captains with * before a name',
    shuffle: 'Shuffle into teams 🎲',
  },

  result: {
    shuffling: 'Shuffling…',
    title: 'Your teams',
    sharedTitle: 'Shared teams',
    sharedNote: 'Someone shared these teams with you.',
    captain: 'Captain',
    rename: 'New team names',
    again: 'Shuffle again',
    edit: 'Edit names',
    copy: 'Copy as text',
    copied: 'Teams copied!',
    makeOwn: 'Make my own teams',
    badShare: 'That link doesn’t work — make your own teams here.',
    shareTitle: 'Random Team Generator – Split Names into Teams',
    shareText: 'Here are our {k} random teams 🎲',
  },

  people: { one: '{n} person', other: '{n} people' },

  teams: {
    tiger: 'Team Tiger',
    eagle: 'Team Eagle',
    shark: 'Team Shark',
    wolf: 'Team Wolf',
    fox: 'Team Fox',
    panda: 'Team Panda',
    lion: 'Team Lion',
    owl: 'Team Owl',
    dolphin: 'Team Dolphin',
    bear: 'Team Bear',
    rabbit: 'Team Bunny',
    penguin: 'Team Penguin',
    dragon: 'Team Dragon',
    unicorn: 'Team Unicorn',
    octopus: 'Team Octopus',
    frog: 'Team Frog',
    koala: 'Team Koala',
    parrot: 'Team Parrot',
    bee: 'Team Bee',
    turtle: 'Team Turtle',
  },

  sample: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'James', 'Sophia', 'Lucas', 'Mia', 'Ethan', 'Chloe', 'Ben'],

  og: {
    brand: '🎲 Random Team Generator',
    kicker: 'Names in · teams out',
    title: 'Who ends up on your team?',
    desc: 'Fair random teams in seconds · captains apart · share the result',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I split names into teams?', a: 'Type or paste the names, one per line or separated by commas (up to 60). Choose how many teams you want, or how many people per team, then tap shuffle. Team sizes never differ by more than one person.' },
    { q: 'Is the shuffle really fair?', a: 'Yes. The names are mixed with your browser’s cryptographic random generator (crypto.getRandomValues) and a Fisher–Yates shuffle, so every possible split is equally likely. We can’t steer the result, and neither can anyone else.' },
    { q: 'How do captains work?', a: 'Put * before a name to mark a captain and switch on “Keep captains on different teams”. Captains are dealt out first, one per team, and everyone else is shuffled in after. If there are more captains than teams, some teams get two.' },
    { q: 'What does the share link contain?', a: 'The link itself carries the names and the exact teams, so whoever opens it sees the same result. Nothing is saved on our server. Your last list stays only in this browser so you don’t have to type it again.' },
  ],

  privacy: {
    title: 'Privacy Policy | Random Team Generator',
    description: 'Privacy Policy for Random Team Generator: names stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Random Team Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names you enter are processed only in your browser and are not sent to our server. If you share a result, the names and teams are written into the link itself, so anyone with the link can see them. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your last list of names, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, shuffles, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 1, 2026.'],
    ],
    back: '← Back to the Random Team Generator',
  },
};
