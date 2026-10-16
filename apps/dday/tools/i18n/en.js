/* D-Day Calculator — English (site root /, default + x-default)
 * Date math lives in dday-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (mode tabs + inputs + Calculate); the calendar card, milestones and the shared end screen appear under it.
 * FAQ appears only in the shared end screen.
 * Plural objects ({ one, other } …) must have every CLDR plural category of the language (Intl.PluralRules).
 * Placeholders like {n} {date} {y} {m} {d} {w} {label} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Numbers always use Unbounded.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap',
    display: "'Bricolage Grotesque'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  // Default for "count the start day as day 1" (Korean couples count it; most other places don’t)
  defaults: { day1: false },

  meta: {
    title: 'D-Day Calculator – Countdown & Days Until a Date',
    description: 'Free D-Day calculator: count down the days until any date, count days since a start date with milestones like day 100 and 1000, or add and subtract days. Live timer, shareable card.',
    ogTitle: 'D-Day Calculator 📅 How many days until…?',
    ogDescription: 'Count down to any date, track days since, and turn it into a card you can save or share.',
  },
  siteName: 'D-Day Calculator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'D-Day Calculator',
    h1Html: 'How many days <em>until</em>,<br>how many days <em>since</em>',
    hook: 'Count down to a trip, a birthday or a deadline, track days since a big moment, or jump forward any number of days.',
  },

  ui: {
    modeLabel: 'What do you want to count?',
    modes: { countdown: 'Countdown', since: 'Days since', math: 'Add days' },
    modeIcons: { countdown: '⏳', since: '💞', math: '±' },
    modeHints: {
      countdown: 'Days left until a date, shown as D-n, plus a live timer.',
      since: 'Days that have passed since a start date, with upcoming milestones.',
      math: 'Pick a date and move forward or back by any number of days.',
    },
    titleLabel: 'Title (optional)',
    titlePh: { countdown: 'e.g. Summer trip to Lisbon', since: 'e.g. Since we met', math: 'e.g. Visa deadline' },
    dateLabel: { countdown: 'Target date', since: 'Start date', math: 'From this date' },
    todayBtn: 'Today',
    presetsLabel: 'Quick picks',
    presets: { halloween: 'Halloween', christmas: 'Christmas', newyear: 'New Year’s Day', valentine: 'Valentine’s Day' },
    timeLabel: 'Time (optional)',
    timeHint: 'Leave empty to count to the start of the day.',
    day1Label: 'Count the start day as day 1',
    day1Hint: 'On: the start date itself is day 1, so day 100 comes one day earlier. Off: it counts full days passed.',
    directionLabel: 'Direction',
    after: '+ Days after',
    before: '− Days before',
    daysLabel: 'Number of days',
    daysUnit: 'days',
    emojiLabel: 'Card emoji',
    themeLabel: 'Card color',
    themes: { tomato: 'Tomato', mint: 'Mint', grape: 'Grape', ocean: 'Ocean', ink: 'Ink' },
    compute: 'Calculate 📅',
    localNote: 'Uses your device’s date and time zone. Nothing is sent to a server.',
    savedTitle: 'My D-days',
    savedNote: 'Up to 10, saved on this device only. Tap one to open it.',
    savedCount: '{n}/10',
    savedDelete: 'Delete',
  },

  result: {
    sharedBadge: '🔗 Shared D-day',
    sharedNote: 'Counted live in your own time zone. Make your own with the button at the bottom.',
    untitled: { countdown: 'My countdown', since: 'Our days', math: 'Date math' },
    dday: 'D-DAY',
    today: 'It’s today! 🎉',
    future: { one: '{n} day to go', other: '{n} days to go' },
    past: { one: '{n} day ago', other: '{n} days ago' },
    remaining: 'Time left',
    elapsed: 'Time since',
    units: { d: 'days', h: 'hrs', m: 'min', s: 'sec' },
    sinceDay1: 'Day {n}',
    sincePlain: { one: '{n} day', other: '{n} days' },
    sinceSub: 'since {date}',
    sinceStarts: { one: 'Starts in {n} day', other: 'Starts in {n} days' },
    ymd: '{y} yr {m} mo {d} d · {w} wk',
    milestonesTitle: 'Coming up',
    milestoneDay1: 'Day {n}',
    milestonePlain: '{n} days',
    anniv: { one: '{n} year', other: '{n} years' },
    milestoneToday: 'Today!',
    mathAfter: { one: '{n} day after {date}', other: '{n} days after {date}' },
    mathBefore: { one: '{n} day before {date}', other: '{n} days before {date}' },
    mathSame: 'Same day as {date}',
    fromToday: 'From today: {label}',
    savePng: 'Save image 🖼️',
    pngSaved: 'Image saved',
    copyLink: 'Copy card link 🔗',
    linkCopied: 'Card link copied. It opens live for anyone',
    saveList: 'Add to my D-days ⭐',
    savedToast: 'Saved on this device',
    savedDupe: 'Already in your list, moved to the top',
    savedFull: 'Saved. The oldest one was removed (10 max)',
    again: 'New D-day',
    makeOwn: 'Make my own D-day',
    live: 'Result: {label}',
    shareTitle: 'D-Day Calculator',
    shareText: 'Counting the days: {label} 📅',
  },

  errors: {
    noDate: 'Pick a date first.',
    badDate: 'Pick a date between 1900 and 2199.',
    badDays: 'Type a whole number of days from 0 to 99999.',
    badLink: 'This D-day link is broken or incomplete, so nothing is shown from it.',
  },

  og: {
    brand: '📅 D-Day Calculator',
    kicker: 'Countdown · Days since · Add days',
    title: 'How many days until your big day?',
    desc: 'Live countdown, day 100 milestones and a card to share',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How are the days counted?', a: 'The calculator compares calendar dates on your device, so “D-1” always means tomorrow and “D-DAY” means today, even across daylight saving changes or leap years. The live timer below counts the real hours, minutes and seconds to midnight of the target date, or to the time you set.' },
    { q: 'What does “count the start day as day 1” mean?', a: 'When it is on, the start date itself is day 1, the way Korean couples count their 100th day. When it is off, the counter shows how many full days have passed, so the start date is day 0. Switch it to match how you and your friends count.' },
    { q: 'What does a shared card show the other person?', a: 'The link carries only the title, date, mode, emoji and color you chose. It is checked when it opens and then counted again live on the other person’s device, in their own time zone, so they always see an up-to-date number.' },
    { q: 'Where are my saved D-days kept?', a: 'Only in this browser on this device, up to 10 of them. They are never sent to a server, and clearing your browser data removes them. To move one to another phone, use the card link.' },
  ],

  privacy: {
    title: 'Privacy Policy | D-Day Calculator',
    description: 'Privacy Policy for D-Day Calculator: your dates stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'D-Day Calculator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The titles and dates you enter are calculated only in your browser and are not sent to our server. D-days you save are kept in your browser’s local storage on your device (up to 10), and you can delete them at any time. When you copy a card link, the title, date and card style are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and saved D-days, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, calculations, star ratings). Your titles and dates are never part of these counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 17, 2026.'],
    ],
    back: '← Back to D-Day Calculator',
  },
};
