/* BMI Calculator — English (site root /, default + x-default)
 * Math lives in bmi-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen: units → height/weight (results update as you type) → optional age/sex → Asian cutoffs toggle
 *   → "Show my summary" → summary + shared end screen. FAQ appears only in the shared end screen.
 * scales.who.labels = 6 WHO bands. scales.alt = this language's "Asian cutoffs" scale (bmi-core ALT_SCALE:
 *   ko kr 6 bands · ja jp 6 · zh cn 4 · every other language asia 5) — labels must match that band count.
 * Placeholders — keep them as-is: {n} number · {min} {max} range ends · {bmi} {cat} in live/summary lines · {w} weight with unit
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

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'BMI Calculator – Body Mass Index for Adults (kg or lb)',
    description: 'Free BMI calculator for adults: enter height and weight in cm/kg or ft/in/lb to see your body mass index, its WHO category on a color scale and the healthy weight range for your height.',
    ogTitle: 'BMI Calculator ⚖️ Your BMI and healthy weight range',
    ogDescription: 'Body mass index in cm/kg or ft/lb, WHO and Asian cutoffs, and the healthy weight range for your height.',
  },
  siteName: 'BMI Calculator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'BMI Calculator',
    h1Html: 'Your body mass index, <em>as you type</em>',
    hook: 'Enter your height and weight to see your BMI on a color scale, plus the healthy weight range for your height.',
  },

  ui: {
    unitsLabel: 'Units',
    metric: 'cm · kg',
    imperial: 'ft · lb',
    height: 'Height',
    weight: 'Weight',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ Age and sex (optional)',
    less: '− Hide age and sex',
    age: 'Age',
    years: 'yrs',
    sex: 'Sex',
    sexNone: 'Not set',
    female: 'Female',
    male: 'Male',
    asiaToggle: 'Asian cutoffs',
    yourBmi: 'Your BMI',
    waiting: 'Enter your height and weight and your BMI appears here.',
    scaleLabel: 'BMI scale',
    rangeTitle: 'Healthy weight for your height',
    toLose: 'About {w} above the healthy range',
    toGain: 'About {w} below the healthy range',
    inRange: 'You are inside the healthy range.',
    under18: 'This is an adult calculator (18+). For children and teens, BMI is read on age- and sex-specific growth charts, so the category above does not apply.',
    senior: 'Over 65, a slightly higher BMI is often considered fine. Your doctor can tell you what suits you.',
    sexNote: 'Adult BMI cutoffs are the same for women and men, although women usually carry more body fat at the same BMI.',
    disclaimerTitle: 'Before you read too much into it',
    disclaimer: [
      'BMI is a quick screening number, not a diagnosis or medical advice.',
      'It cannot tell muscle from fat, so athletes and very muscular people may score high.',
      'It does not apply during pregnancy, and this calculator is for adults 18 and over.',
    ],
    decimalHint: 'Decimals: “.” or “,” both work.',
    finish: 'Show my summary ✓',
    needOne: 'Enter your height and weight first.',
    localNote: 'Calculated on your device. Nothing you type is sent or saved.',
    summaryTitle: 'Your BMI summary',
    summaryNote: 'This summary lives only on this page. Nothing is stored.',
    sumScale: 'Scale',
    sumRange: 'Healthy range',
    again: 'Start over',
    live: 'BMI {bmi}, {cat}',
    shareTitle: 'BMI Calculator',
    shareText: 'Check your BMI and the healthy weight range for your height in seconds ⚖️',
  },

  scales: {
    who: {
      name: 'WHO',
      note: 'World Health Organization adult categories.',
      labels: ['Underweight', 'Healthy weight', 'Overweight', 'Obesity class 1', 'Obesity class 2', 'Obesity class 3'],
    },
    alt: {
      name: 'Asia-Pacific',
      note: 'WHO Asia-Pacific cutoffs (2000): health risks start at a lower BMI for many people of Asian descent.',
      labels: ['Underweight', 'Healthy weight', 'Overweight (at risk)', 'Obesity class 1', 'Obesity class 2'],
    },
  },

  errors: {
    badNum: 'Use digits only, with “.” or “,” for decimals.',
    heightRange: 'Please check the height: it should be between 50 and 272 cm (1 ft 8 in to 8 ft 11 in).',
    weightRange: 'Please check the weight: it should be between 10 and 650 kg (22 to 1,433 lb).',
    inchRange: 'Inches should be below 12. Put whole feet in the first box.',
    ageRange: 'Age should be a whole number between 2 and 120.',
  },

  og: {
    brand: '⚖️ BMI Calculator',
    kicker: 'Height · Weight · BMI',
    title: 'Where do you sit on the BMI scale?',
    desc: 'With the healthy weight range for your height',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How is BMI calculated?', a: 'BMI is your weight in kilograms divided by your height in meters squared. At 170 cm and 65 kg that is 65 ÷ (1.7 × 1.7) ≈ 22.5. In US units the same thing is 703 × pounds ÷ inches squared, and this calculator converts for you.' },
    { q: 'What is a healthy BMI for adults?', a: 'The World Health Organization calls 18.5 to 24.9 a healthy weight, 25 to 29.9 overweight and 30 or more obesity. Many Asian health bodies use lower cutoffs, such as 23 for overweight, which you can switch on with the Asian cutoffs toggle.' },
    { q: 'Why can my BMI be high if I am fit?', a: 'BMI only looks at weight and height, so it cannot see whether the weight is muscle or fat. Athletes and people who lift often land in the overweight band while being lean. A waist measurement or a body composition test tells you more.' },
    { q: 'Can I use it for children or during pregnancy?', a: 'No. Children and teens under 18 need age- and sex-specific growth charts, and weight gain during pregnancy follows its own guidelines. For those cases, ask a doctor or midwife.' },
  ],

  privacy: {
    title: 'Privacy Policy | BMI Calculator',
    description: 'Privacy Policy for BMI Calculator: your height, weight and age stay in your browser, plus cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'BMI Calculator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The height, weight, age and sex you enter are calculated only in your browser. They are not sent to our server, not stored and not written into any link. The Service remembers only which units you used last (metric or US), on your own device. When you use the share buttons, only the page address and a short text without your numbers are shared, and only with the people you choose.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and units, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, calculations, star ratings). Your body measurements are never part of these counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 24, 2026.'],
    ],
    back: '← Back to BMI Calculator',
  },
};
