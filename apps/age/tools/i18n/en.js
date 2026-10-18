/* Age Calculator — English (site root /, default + x-default)
 * Date math lives in age-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (birth date + "as of" date + Calculate); the result cards and the shared end screen appear under it.
 * FAQ appears only in the shared end screen.
 * Plural objects ({ one, other } …) must have every CLDR plural category of the language (Intl.PluralRules).
 * Placeholders like {n} {date} {weekday} {days} — keep them as-is when translating.
 * korea: Korean age comparison card, shown only where show = true (Korean). Other languages keep empty strings.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Numbers always use Baloo 2.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  // Order of the birth date selects: ymd | mdy | dmy
  dateOrder: 'mdy',

  meta: {
    title: 'Age Calculator – How Old Am I Exactly?',
    description: 'Free age calculator: enter your date of birth to get your exact age in years, months and days, a countdown to your next birthday, days lived, the weekday you were born and your zodiac signs.',
    ogTitle: 'Age Calculator 🎂 How old am I, exactly?',
    ogDescription: 'Your exact age in years, months and days, plus your birthday countdown and the days you have lived.',
  },
  siteName: 'Age Calculator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Age Calculator',
    h1Html: 'How old am I, <em>exactly</em>?',
    hook: 'Pick your birthday and see your age down to the day, how long until the next party, and how many days you have already lived.',
  },

  ui: {
    birthLabel: 'Date of birth',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    asOfLabel: 'Age on this date (optional)',
    asOfHint: 'Leave empty to use today. Pick another date to see how old you were, or will be.',
    todayBtn: 'Today',
    compute: 'Calculate my age 🎂',
    localNote: 'Calculated on your device with your local date. Nothing is sent or saved.',
  },

  result: {
    asOf: 'As of {date}',
    ageLabel: 'Your age',
    big: { one: '{n} year old', other: '{n} years old' },
    y: { one: '{n} year', other: '{n} years' },
    m: { one: '{n} month', other: '{n} months' },
    d: { one: '{n} day', other: '{n} days' },
    sep: ', ',
    born: 'Born on a {weekday}',
    nextTitle: 'Next birthday',
    nextIn: { one: '{n} day to go', other: '{n} days to go' },
    turning: 'You will turn {n}',
    birthdayToday: 'Happy birthday! 🎉',
    turnedToday: 'You turn {n} today',
    leapNote: 'Born on 29 February: in years without a 29 February, this calculator counts 28 February as your birthday.',
    totalsTitle: 'You have lived',
    totals: { days: 'Days', weeks: 'Weeks', months: 'Months', hours: 'Hours' },
    weeksRest: '{w} wk {d} d',
    hoursNote: 'Hours are whole days × 24, counted from the start of your birthday.',
    signsTitle: 'Your birthday at a glance',
    weekdayLabel: 'Weekday',
    zodiacLabel: 'Star sign',
    animalLabel: 'Chinese zodiac',
    zodiac: { aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer', leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio', sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces' },
    animals: { rat: 'Rat', ox: 'Ox', tiger: 'Tiger', rabbit: 'Rabbit', dragon: 'Dragon', snake: 'Snake', horse: 'Horse', goat: 'Goat', monkey: 'Monkey', rooster: 'Rooster', dog: 'Dog', pig: 'Pig' },
    milestonesTitle: 'Milestones',
    msDays: '{n} days old',
    msRound: 'Turning {n}',
    msToday: 'Today!',
    msPassed: 'Reached',
    again: 'Calculate another age',
    live: 'Result: {label}',
    shareTitle: 'Age Calculator',
    shareText: 'I have lived {days} days 🎂 How many days have you lived?',
  },

  errors: {
    noDate: 'Choose the year, month and day you were born.',
    badDate: 'That day does not exist in that month. Check the day.',
    future: 'That birthday is after the date you are counting to. Check the year or the “age on this date” field.',
    tooOld: 'That would be more than 130 years. Please check the year.',
    badAsOf: 'Pick a date between 1900 and 2199 for “age on this date”.',
  },

  korea: {
    show: false,
    title: '',
    man: '',
    manHint: '',
    yeon: '',
    yeonHint: '',
    counting: '',
    countingHint: '',
    unit: '',
    note: '',
  },

  og: {
    brand: '🎂 Age Calculator',
    kicker: 'Years · Months · Days',
    title: 'How old are you, exactly?',
    desc: 'Exact age, birthday countdown and days lived',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How is my exact age worked out?', a: 'Your age goes up by one on each birthday. The months and days are counted from your last birthday, month by month, and if a month is shorter than your birth day (for example the 31st), its last day counts as your monthly date. All dates use your device’s calendar, so time zones and daylight saving never shift the result.' },
    { q: 'I was born on 29 February. When is my birthday?', a: 'In leap years it is 29 February. In other years this calculator celebrates on 28 February, so you turn a year older on the last day of February. Some countries use 1 March for legal purposes, so check local rules for paperwork.' },
    { q: 'Can I see how old I was on a past date?', a: 'Yes. Fill in “age on this date” with any day from 1900 to 2199 and the calculator shows your age, total days and next birthday as of that day. Leave it empty to count to today.' },
    { q: 'Is my birth date stored anywhere?', a: 'No. The calculation happens only in your browser. Your birth date is not sent to a server, not saved on the device and not added to the link when you share.' },
  ],

  privacy: {
    title: 'Privacy Policy | Age Calculator',
    description: 'Privacy Policy for Age Calculator: your birth date stays in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Age Calculator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The birth date and the “age on this date” you enter are calculated only in your browser. They are not sent to our server, not stored on your device and not written into any link. When you use the share buttons, only the page address and a short text with the number of days lived are shared, and only with the people you choose.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, calculations, star ratings). Birth dates and ages are never part of these counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 19, 2026.'],
    ],
    back: '← Back to Age Calculator',
  },
};
