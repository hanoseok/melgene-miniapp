/* Animal Race Picker — English (site root /, default + x-default)
 * Logic lives in race-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Screens: setup (mode, number of runners, a name per lane, start) → race (countdown, lanes) → result + recent races + shared end screen.
 * FAQ appears only in the shared end screen. Placeholders like {n} {k} {name} — keep them as-is when translating.
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
    title: 'Animal Race Picker – Random Race to Pick a Winner',
    description: 'A random race picker with animals: type 2 to 10 names, each one runs on its own lane. First place wins, or last place buys the coffee. Fair random, free, no sign-up.',
    ogTitle: 'Animal Race Picker 🏁 Who buys the coffee?',
    ogDescription: 'Type the names, line up the animals and let the race decide. First place wins, or last place pays.',
  },
  siteName: 'Animal Race Picker',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Animal Race Picker',
    h1Html: 'Can’t decide?<br><em>Let the animals race for it</em>',
    hook: 'Who buys the coffee? Who goes first? Put everyone on a lane and watch the race.',
  },

  ui: {
    modeLabel: 'How do we decide?',
    modeWin: '🏆 1st place wins',
    modeLose: '☕ Last place pays',
    countLabel: 'Runners',
    countValue: '{n} runners',
    less: 'Fewer runners',
    more: 'More runners',
    namesLabel: 'Who is racing?',
    namesHint: 'Leave a lane empty to use its default name. The animal is just for fun and doesn’t change anyone’s chances.',
    playerN: 'Player {n}',
    nameAria: 'Name for lane {n}',
    start: 'Start the race 🏁',
    fair: 'The finish order is drawn fairly with crypto random before the race starts · names stay on your device',
    trackAria: 'Race track',
    go: 'GO!',
    bannerWin: '🏆 First across the line wins',
    bannerLose: '☕ Last one in pays',
    liveStart: 'Three, two, one, go! The race is on.',
  },

  errors: {
    tooFew: 'You need at least 2 runners.',
    tooMany: 'Up to 10 runners fit on the track.',
    badLink: 'This link is broken, so no names were loaded from it.',
  },

  result: {
    winKicker: 'And the winner is',
    winTitle: '{name} wins! 🏆',
    winSub: 'First across the finish line.',
    loseKicker: 'Last across the line',
    loseTitle: '{name} came last',
    loseSub: 'Bad luck! This round of coffee is on {name} ☕',
    rankingTitle: 'Finish order',
    tagWin: 'Winner',
    tagLose: 'Pays ☕',
    edit: 'Change names',
    shareNames: 'Copy link with these names',
    linkCopied: 'Link copied. It opens the same runners, ready to race.',
    sharedNote: 'Runners loaded from a shared link. Ready when you are!',
    history: 'Recent races',
    historyClear: 'Clear',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} runners',
    liveWin: '{name} wins the race.',
    liveLose: '{name} finished last.',
    again: 'Race again 🏁',
    shareTitle: 'Animal Race Picker',
    shareText: 'Can’t decide? Let the animals race for it 🏁',
  },

  og: {
    brand: '🏁 Animal Race Picker',
    kicker: 'Random race picker · 2 to 10 runners',
    title: 'Let the animals race to decide',
    desc: 'First place wins, or last place buys the coffee',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the race really random and fair?', a: 'Yes. When you press start, the full finish order is drawn with your browser’s cryptographic random generator (crypto.getRandomValues), using rejection sampling and a Fisher–Yates shuffle. Every possible order has exactly the same chance; the race you watch only acts it out.' },
    { q: 'Does the animal or the lane change my chances?', a: 'No. Animals are handed out by lane just for fun. A rabbit is no faster than a turtle here, and lane 1 has the same odds as lane 10.' },
    { q: 'Why are the finishes always so close?', a: 'For the fun of it. After the order is drawn, the animation adds sprints, stumbles and a tight finish at the spot that matters, first place or last place depending on the mode. The drama never changes the order.' },
    { q: 'Can I send the same runners to friends?', a: 'Yes. Copy link with these names puts the names and the mode in the link, never a result. Whoever opens it runs a brand new race. Your recent results are kept only on this device.' },
  ],

  privacy: {
    title: 'Privacy Policy | Animal Race Picker',
    description: 'Privacy Policy for Animal Race Picker: names and results stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Animal Race Picker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names you enter are processed only in your browser and are not sent to our server. Your last list of names and your ten most recent results may be kept in your browser’s local storage on your device. When you copy a link with names, those names are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, races started and finished, star ratings). None of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 22, 2026.'],
    ],
    back: '← Back to Animal Race Picker',
  },
};
