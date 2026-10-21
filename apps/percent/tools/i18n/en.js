/* Percentage Calculator — English (site root /, default + x-default)
 * Math lives in percent-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen: mode tabs → the chosen calculator card (results update as you type) → "Show my summary" → summary + shared end screen.
 * FAQ appears only in the shared end screen.
 * Placeholders in templates — keep them as-is when translating:
 *   {a} {b}  the two inputs (formatted numbers)      {pa} {pb}  the same inputs written as percentages (num.pct)
 *   {r} result   {pr} result as a percentage   {sr} signed result as a percentage   {spp} signed result in points (num.pp)
 *   {s} amount saved/added   {d} difference   {f} multiplier   {w} the common wrong answer   {base} |a| (change)   {rel} relative change
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Numbers always use Space Grotesk.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&display=swap',
    display: "'Outfit'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  // Number formats: pct = percentage, pp = percentage points. plus/minus = sign characters.
  num: { pct: '{n}%', pp: '{n} pp', plus: '+', minus: '−' },

  meta: {
    title: 'Percentage Calculator – % of, % Change, Discounts',
    description: 'Free percentage calculator: find X% of a number, what percent one number is of another, percent increase or decrease, sale prices, the original price and percentage points, with the formula shown.',
    ogTitle: 'Percentage Calculator 💯 Every % question, answered',
    ogDescription: '% of a number, % change, discounts, reverse percentages and percentage points, with the formula for each.',
  },
  siteName: 'Percentage Calculator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Percentage Calculator',
    h1Html: 'Percentages, <em>solved</em> as you type',
    hook: 'Pick what you want to know, type two numbers, and see the answer with the exact formula behind it.',
  },

  ui: {
    modesLabel: 'Choose a calculation',
    pctSuffix: '%',
    copy: 'Copy result',
    copied: 'Result copied',
    how: 'How it was calculated',
    waiting: 'Type both numbers and the answer appears here.',
    decimalHint: 'Decimals: “.” or “,” both work.',
    finish: 'Show my summary ✓',
    needOne: 'Get at least one result first, then open your summary.',
    localNote: 'Calculated on your device as you type. Nothing is sent or saved.',
    summaryTitle: 'Your results',
    summaryNote: 'These results live only on this page. Copy the ones you need.',
    again: 'Start over',
    live: 'Result: {text}',
    shareTitle: 'Percentage Calculator',
    shareText: 'Discounts, % change, % of a number: a quick percentage calculator that shows the formula 💯',
  },

  modes: {
    of: {
      tab: 'X% of Y',
      title: 'What is X% of a number?',
      desc: 'Tips, tax, commission, your share of a bill.',
      a: 'Percentage',
      b: 'Of the number',
      lead: '{pa} of {b} is',
      how: '{b} × {a} ÷ 100 = {r}',
      copy: '{pa} of {b} = {r}',
    },
    what: {
      tab: 'X is ?% of Y',
      title: 'X is what percent of Y?',
      desc: 'Test scores, progress, a part of a total.',
      a: 'The part (X)',
      b: 'The whole (Y)',
      lead: '{a} out of {b} is',
      how: '{a} ÷ {b} × 100 = {pr}',
      copy: '{a} is {pr} of {b}',
    },
    change: {
      tab: '% change',
      title: 'Percent change from A to B',
      desc: 'Prices, salaries, followers, sales.',
      a: 'From (old value)',
      b: 'To (new value)',
      lead: 'From {a} to {b}',
      up: 'An increase of {d}',
      down: 'A decrease of {d}',
      same: 'No change',
      how: '({b} − {a}) ÷ {base} × 100 = {sr}',
      copy: '{a} → {b}: {sr}',
    },
    adjust: {
      tab: 'Discount / raise',
      title: 'Take off or add a percentage',
      desc: 'Sale prices, price rises, tax added, pay raises.',
      a: 'Original value',
      b: 'Percentage',
      down: '− Decrease',
      up: '+ Increase',
      chips: 'Quick discount',
      leadDown: '{a} minus {pb} is',
      leadUp: '{a} plus {pb} is',
      saveDown: 'You save {s}',
      saveUp: 'That is {s} more',
      howDown: '{a} × (1 − {b} ÷ 100) = {a} − {s} = {r}',
      howUp: '{a} × (1 + {b} ÷ 100) = {a} + {s} = {r}',
      copyDown: '{a} − {pb} = {r} (you save {s})',
      copyUp: '{a} + {pb} = {r}',
    },
    reverse: {
      tab: 'Original value',
      title: 'Find the value before a % change',
      desc: 'The price before tax, before a sale or before a raise.',
      a: 'Value after the change',
      b: 'Percentage',
      down: '− After a decrease',
      up: '+ After an increase',
      leadDown: 'Before the {pb} decrease it was',
      leadUp: 'Before the {pb} increase it was',
      howDown: '{a} ÷ (1 − {b} ÷ 100) = {a} ÷ {f} = {r}',
      howUp: '{a} ÷ (1 + {b} ÷ 100) = {a} ÷ {f} = {r}',
      diff: 'Difference: {d}',
      wrongDown: 'Careful: {a} + {pb} = {w}, which is not the original.',
      wrongUp: 'Careful: {a} − {pb} = {w}, which is not the original.',
      copy: 'Original: {r} (now {a})',
    },
    points: {
      tab: 'Point gap (pp)',
      title: 'Percentage point difference',
      desc: 'Interest rates, polls, tax rates, conversion rates.',
      a: 'Old rate',
      b: 'New rate',
      lead: 'From {pa} to {pb}',
      rel: 'As a relative change: {rel}',
      relZero: 'A relative change from 0% cannot be calculated.',
      how: '{pb} − {pa} = {spp}',
      copy: '{pa} → {pb}: {spp}',
    },
  },

  errors: {
    badNum: 'Use digits only, with “.” or “,” for decimals.',
    divZero: 'The whole (Y) can’t be 0: nothing can be divided by zero.',
    fromZero: 'The old value can’t be 0: a change from zero has no percentage.',
    over100: 'For a decrease, use a percentage below 100%.',
    tooBig: 'That number is too large for this calculator.',
  },

  og: {
    brand: '💯 Percentage Calculator',
    kicker: '% of · % change · Discounts',
    title: 'Every percentage question, answered',
    desc: 'With the formula behind each result',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I calculate a percentage of a number?', a: 'Multiply the number by the percentage and divide by 100. For 15% of 200, that is 200 × 15 ÷ 100 = 30. The calculator shows this line under every result, so you can check it or repeat it on paper.' },
    { q: 'What is the difference between percent and percentage points?', a: 'Percentage points compare two rates by subtraction. If a rate goes from 4% to 6%, it rose by 2 percentage points, but by 50% in relative terms, because 2 is half of 4. Use the “Point gap” tab to see both numbers side by side.' },
    { q: 'Why doesn’t taking 20% off and adding 20% back give the original price?', a: 'Each percentage is taken from a different base. 100 minus 20% is 80, but 20% of 80 is only 16, so adding it back gives 96. To undo a discount, divide by 0.8 instead; the “Original value” tab does exactly that.' },
    { q: 'Can I type decimals with a comma?', a: 'Yes. Both “12.5” and “12,5” work, and thousands separators such as 1,250 or 1.250 are understood too. Results are rounded to at most 10 decimal places to hide tiny floating-point errors.' },
  ],

  privacy: {
    title: 'Privacy Policy | Percentage Calculator',
    description: 'Privacy Policy for Percentage Calculator: the numbers you type stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Percentage Calculator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The numbers you type are calculated only in your browser. They are not sent to our server and are not written into any link. The Service remembers only which calculation tab you used last, on your own device. When you use the share buttons, only the page address and a short text without your numbers are shared, and only with the people you choose.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and last calculation tab, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, calculations, star ratings). The numbers you calculate are never part of these counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 22, 2026.'],
    ],
    back: '← Back to Percentage Calculator',
  },
};
