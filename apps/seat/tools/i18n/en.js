/* Random Seating Chart — English (site root /, default + x-default)
 * Logic lives in seat-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (names + classroom layout + optional rules + Shuffle); the chart and the shared end screen appear under it after a shuffle.
 * FAQ appears only in the shared end screen.
 * Placeholders like {n} {s} {r} {c} {name} {a} {b} {date} {max} — keep them as-is when translating.
 * sample = 20 common first names in this language (used by the "Example names" button).
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Random Seating Chart Generator for Classrooms',
    description: 'Free random seating chart generator for teachers: paste your class list, set rows and columns, block aisles, keep pairs apart, pin seats and shuffle fairly. Save as PNG or text.',
    ogTitle: 'Random Seating Chart 🪑 New seats in seconds',
    ogDescription: 'Paste names, set the room, shuffle fairly. Keep-apart pairs, fixed and front-row seats, PNG and link to share.',
  },
  siteName: 'Random Seating Chart',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Random Seating Chart',
    h1Html: 'New seats,<br><em>no arguments</em>',
    hook: 'Paste your class list, set up the room and shuffle. Fair for every student, ready for the board in seconds.',
  },

  ui: {
    namesLabel: 'Names',
    namesPh: 'One per line or separated by commas\nAva\nLiam\nOlivia\n…or just type 28 for seats 1 to 28',
    namesHint: 'Only a number? We’ll use 1 to that number. Up to 100 names.',
    sample: 'Example names',
    clear: 'Clear',
    namesCount: 'Names: {n}',
    seatsCount: 'Open seats: {n}',
    tooMany: 'Only the first {max} names are used.',
    layoutLabel: 'Classroom layout',
    rowsLabel: 'Rows',
    colsLabel: 'Seats per row',
    dec: 'One fewer',
    inc: 'One more',
    tapLabel: 'Tap a seat to',
    modeBlock: 'Leave empty',
    modePin: 'Pin a name',
    pinPick: 'Name to pin',
    pickName: 'Choose a name…',
    pinFirst: 'Choose a name to pin first.',
    mapHint: 'The front row is next to the teacher’s desk. Crossed-out seats stay empty, like an aisle.',
    seatAria: 'Row {r}, seat {c}',
    seatBlocked: 'empty',
    desk: 'Teacher’s desk',
    more: 'Seating rules (optional)',
    apartLabel: 'Keep apart',
    apartHint: 'These two won’t sit next to each other, not even diagonally.',
    apartAdd: 'Add pair',
    frontLabel: 'Front rows',
    frontHint: 'Seated in the first two rows, e.g. for eyesight or focus.',
    frontAdd: 'Add',
    pinnedLabel: 'Pinned seats',
    pinnedHint: 'Choose “Pin a name” above, then tap a seat on the map.',
    pinnedAt: '{name} · row {r}, seat {c}',
    remove: 'Remove {name}',
    none: 'None yet',
    shuffle: 'Shuffle seats 🪑',
    shuffling: 'Shuffling…',
    fair: 'Fair crypto shuffle · names never leave your browser',
  },

  errors: {
    noNames: 'Type at least one name, or a number of students.',
    tooMany: 'You can seat up to {max} students at once.',
    notEnoughSeats: '{n} students but only {s} open seats. Add rows or open some seats.',
    pinBlocked: '{name} is pinned to a seat that is set to stay empty.',
    pinTwice: '{name} is pinned to two seats.',
    pinSame: '{a} and {b} are pinned to the same seat.',
    pinNotFront: '{name} is pinned outside the front rows but is also on the front-row list.',
    frontFull: '{n} students need the front rows but only {s} seats are free there.',
    apartPinned: '{a} and {b} should be apart but are pinned side by side.',
    impossible: 'No seating fits every rule. Remove a keep-apart pair or a pin, or add seats.',
    samePair: 'Choose two different names.',
    badLink: 'This seating chart link is broken or incomplete, so nothing is shown from it.',
  },

  result: {
    heading: 'Your seating chart',
    sharedBadge: '🔗 Shared seating chart',
    sharedNote: 'Shuffled on {date}. This chart is saved in the link, so opening it never shuffles again.',
    viewLabel: 'View from',
    viewStudent: 'Students',
    viewTeacher: 'Teacher',
    skip: 'Skip ⏭',
    empty: 'empty',
    copy: 'Copy as text',
    copied: 'Seating chart copied as text',
    png: 'Save PNG',
    pngFile: 'seating-chart',
    pngSaved: 'Image saved',
    copyLink: 'Copy link',
    linkCopied: 'Link copied. Anyone who opens it sees this exact chart.',
    again: 'Shuffle again',
    makeOwn: 'Make my own chart',
    live: 'Seating chart ready: {n} students seated.',
    textTitle: 'Seating chart',
    textAisle: '—',
    shareTitle: 'Random Seating Chart',
    shareText: 'New seats for {n} students, shuffled fairly 🪑',
  },

  og: {
    brand: '🪑 Random Seating Chart',
    kicker: 'Rows · aisles · rules',
    title: 'Random seating chart in seconds',
    desc: 'Fair for every student, ready to print or share',
  },

  sample: ['Ava', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Mia', 'Elijah', 'Sophia', 'Lucas', 'Amelia', 'Mason', 'Harper', 'Leo', 'Ella', 'James', 'Chloe', 'Henry', 'Zoe', 'Jack'],

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is the seating really random and fair?', a: 'Yes. Seats are shuffled with your browser’s cryptographic random generator (crypto.getRandomValues) and an unbiased Fisher–Yates shuffle, so every student has the same chance at every allowed seat. The chart is fixed before the seats start flipping.' },
    { q: 'How do I keep two students apart?', a: 'Open “Seating rules”, pick two names under “Keep apart” and add the pair. They will never sit next to each other, including diagonally. If the room is too full for all your rules, you’ll be told which way to loosen them.' },
    { q: 'Can I give someone a fixed or front-row seat?', a: 'Yes. Choose “Pin a name”, pick the student and tap a seat to keep them there. Students on the front-row list always land in the first two rows. Everyone else is shuffled around them.' },
    { q: 'How do I share the chart with my class?', a: 'Save it as a PNG for slides or printing, copy it as a text table, or copy the link. The link stores the names and the exact layout, so it shows the same chart on any device without shuffling again.' },
  ],

  privacy: {
    title: 'Privacy Policy | Random Seating Chart',
    description: 'Privacy Policy for Random Seating Chart: student names stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Random Seating Chart (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The names you enter, your classroom layout and your seating charts are processed only in your browser and are never sent to our server. Your last list and layout are kept in your browser’s local storage on your device so they are ready next time, and you can remove them with the Clear button. When you copy a chart link, the names are written into the link itself and are shared only with the people you send it to, so avoid putting full names or other personal details in links you post publicly.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and your last layout, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, shuffles, star ratings). Names and charts are never part of these statistics, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 13, 2026.'],
    ],
    back: '← Back to Random Seating Chart',
  },
};
