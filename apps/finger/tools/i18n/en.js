/* Finger Chooser — English (site root /, default + x-default)
 * Logic lives in finger-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (what to pick: 1 winner / several / teams, start) → pad (fingers or click dots, hold still, pick) → result + recent picks + shared end screen.
 * FAQ appears only in the shared end screen. Placeholders like {n} {t} {k} {c} {m} {name} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
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
    title: 'Finger Chooser – Random Picker for Groups',
    description: 'Finger chooser for your phone: everyone puts a finger on the screen and the app picks one at random. Pick several winners or split into fair teams. Free, no sign-up.',
    ogTitle: 'Finger Chooser 👆 Everyone touch, one gets picked',
    ogDescription: 'All fingers on the screen, hold still, and a fair random pick lights one up. Who pays? Who goes first?',
  },
  siteName: 'Finger Chooser',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Finger Chooser',
    h1Html: 'Everyone touch,<br><em>one gets picked</em>',
    hook: 'One phone in the middle of the table, one finger each. Hold still for a moment and the screen decides who pays, who goes first or who does the dishes.',
  },

  ui: {
    modeLabel: 'What should it pick?',
    modeOne: '👆 1 winner',
    modeN: '✌️ Several',
    modeTeams: '🎨 Teams',
    nLabel: 'How many winners?',
    nLess: 'Fewer',
    nMore: 'More',
    nValue: '{n} winners',
    teamsLabel: 'How many teams?',
    teamsValue: '{t} teams',
    start: 'Open the finger pad 👆',
    fair: 'Picked with crypto random at the moment of decision · up to 10 fingers · nothing is sent anywhere',
    bannerOne: 'Picks 1 finger',
    bannerN: 'Picks {n} fingers',
    bannerTeams: 'Makes {t} teams',
    settings: 'Settings',
    padAria: 'Finger pad: everyone touches here',
    waitTouch: 'Everyone, put one finger on the screen',
    waitClick: 'Click to add a dot for each player',
    needMore: '{c} in · need at least {m}',
    hold: 'Hold still…',
    picking: 'And it’s…',
    maxed: 'That’s the limit: 10 fingers',
    clickHint: 'Click a dot again to remove it, then press Go.',
    go: 'Go!',
    clear: 'Clear',
    liveCount: '{c} on the pad',
  },

  result: {
    kicker: '👆 The pad has spoken',
    titleOne: 'This one is it!',
    subOne: 'Picked 1 out of {k}. Look for the glowing circle.',
    titleN: '{n} picked!',
    subN: 'Picked {n} out of {k}. The glowing circles are in.',
    titleTeams: '{t} teams ready!',
    subTeams: '{k} players split into {t} teams by color.',
    teamLine: '{name}: {c}',
    teamNames: ['Red', 'Blue', 'Green', 'Yellow'],
    edit: 'Change settings',
    history: 'Recent picks',
    historyClear: 'Clear',
    historyOne: '1 of {k}',
    historyN: '{n} of {k}',
    historyTeams: '{k} into {t} teams',
    again: 'Pick again 👆',
    liveOne: 'Picked 1 out of {k}.',
    liveN: 'Picked {n} out of {k}.',
    liveTeams: 'Split into {t} teams.',
    shareTitle: 'Finger Chooser',
    shareText: 'Everyone touch the screen, one gets picked 👆',
  },

  og: {
    brand: '👆 Finger Chooser',
    kicker: 'One phone · everyone’s fingers',
    title: 'Everyone touch, one gets picked',
    desc: 'Who pays, who goes first, settled fairly',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How is the finger picked? Is it fair?', a: 'At the moment the pad decides, the app draws among the fingers on the screen using your browser’s cryptographic random generator (crypto.getRandomValues) with rejection sampling, so every finger has exactly the same chance. Colors are handed out in the order fingers arrive and have no effect on the result.' },
    { q: 'Why does it wait before picking?', a: 'It waits until nobody adds or lifts a finger for about two and a half seconds. If someone joins late or lets go, the countdown starts again, so nobody can sneak in or out at the last moment.' },
    { q: 'How many people can play?', a: 'Up to 10 fingers at once. Many phones only track 5 touches at the same time, so for big groups use the click mode on a tablet or computer, or play in two rounds.' },
    { q: 'How are teams made?', a: 'All fingers are shuffled with crypto random and dealt into the teams in turn, so team sizes differ by at most one and everyone is equally likely to land in any team. Each finger takes its team’s color.' },
    { q: 'Can I use it with a mouse?', a: 'Yes. On a computer, click once for each player to drop a dot, click a dot again to remove it, then press Go. The pick works exactly the same way.' },
  ],

  privacy: {
    title: 'Privacy Policy | Finger Chooser',
    description: 'Privacy Policy for Finger Chooser: touches stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Finger Chooser (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Touch positions are processed only in your browser while you play and are not stored or sent to our server. Your last settings may be kept in your browser’s local storage on your device. Recent results are kept only in memory and disappear when you close the page.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, rounds started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of November 1, 2026.'],
    ],
    back: '← Back to Finger Chooser',
  },
};
