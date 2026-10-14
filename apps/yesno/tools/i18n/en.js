/* Yes or No Generator — English (site root /, default + x-default)
 * Logic lives in yesno-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (question + mode + Ask button); the answer, this session's tally, recent answers and the shared end screen appear under it.
 * FAQ appears only in the shared end screen.
 * oracle: exactly 12 original answers — 0-3 positive, 4-7 neutral, 8-11 negative. Keep them short (they sit inside the orb).
 * Placeholders like {n} {answer} {date} {yes} {no} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Yes or No Generator – Yes or No Wheel & Oracle',
    description: 'Stuck on a decision? Type your question and the yes or no generator answers in seconds: plain yes or no, yes/no/maybe, a mystic orb reply or best of 3 and 5. Free, fair, no sign-up.',
    ogTitle: 'Yes or No Generator 🎱 Ask and the orb answers',
    ogDescription: 'Yes, no, maybe or a mystic orb reply. Fair random answers for every little dilemma.',
  },
  siteName: 'Yes or No Generator',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Yes or No Generator',
    h1Html: 'Ask anything.<br>The orb says <em>yes</em> or <em>no</em>',
    hook: 'Type the question you keep going back and forth on, pick a mode and let chance break the tie.',
  },

  ui: {
    questionLabel: 'Your question (optional)',
    questionPh: 'e.g. Should I order pizza tonight?',
    questionHint: 'Stays on this device. It only goes into a link if you share the answer.',
    modeLabel: 'How should the orb answer?',
    modes: {
      classic: 'Yes / No',
      maybe: 'Yes / No / Maybe',
      oracle: 'Mystic orb',
      best3: 'Best of 3',
      best5: 'Best of 5',
    },
    modeHints: {
      classic: 'A straight yes or no, 50:50.',
      maybe: 'Yes, no or maybe, one in three each.',
      oracle: 'One of 12 orb replies: some yes, some no, some “wait”.',
      best3: 'Flips until one side wins twice.',
      best5: 'Flips until one side wins three times.',
    },
    ask: 'Ask the orb 🔮',
    asking: 'The orb is thinking…',
    fair: 'Fair crypto random · just for fun, you make the call',
  },

  answers: { yes: 'YES', no: 'NO', maybe: 'MAYBE' },
  tones: { positive: 'Leaning yes', neutral: 'Wait and see', negative: 'Leaning no' },
  oracle: [
    'Go for it!',
    'The stars say yes',
    'Absolutely, no regrets',
    'Your gut already knows: yes',
    'Sleep on it first',
    'Ask me again tomorrow',
    'Talk it over, then decide',
    'The fog hasn’t lifted yet',
    'Not this time',
    'The stars say no',
    'Let this one go',
    'Hold off for now',
  ],

  result: {
    heading: 'The orb says',
    sharedBadge: '🔗 Shared answer',
    sharedNote: 'Answered on {date}. This is the original answer saved in the link. Opening it never asks again.',
    noQuestion: 'No question typed',
    bestOf: 'Best of {n}',
    score: '{yes} {a} : {b} {no}',
    flipYes: 'Y',
    flipNo: 'N',
    copyLink: 'Share this answer 🔗',
    linkCopied: 'Link copied with your question and answer',
    again: 'Ask again',
    askOwn: 'Ask it myself',
    live: 'Answer: {answer}',
    shareTitle: 'Yes or No Generator',
    shareText: 'I asked the yes or no orb and it said: {answer} 🎱',
  },

  tally: {
    title: 'This session',
    total: 'Answers: {n}',
  },

  history: {
    title: 'Recent answers',
    note: 'Your last 10 answers, saved on this device only.',
    clear: 'Clear',
  },

  errors: {
    badLink: 'This answer link is broken or incomplete, so nothing is shown from it.',
  },

  og: {
    brand: '🎱 Yes or No Generator',
    kicker: 'Yes · No · Maybe · Mystic orb',
    title: 'Ask a question, get a yes or no',
    desc: 'Fair random answers for every little dilemma',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How does the yes or no generator work?', a: 'Type a question if you like, pick a mode and tap Ask. The answer is decided first, then the orb spins or the flips play out to reveal it. Yes / No is 50:50, Yes / No / Maybe gives each a one-in-three chance, the mystic orb picks one of 12 replies, and best of 3 or 5 keeps flipping until one side has a majority.' },
    { q: 'Is the answer really random?', a: 'Yes. Every answer comes from your browser’s cryptographic random generator (crypto.getRandomValues) with rejection sampling, so no answer is even slightly more likely than another. The animation only shows a result that was already drawn.' },
    { q: 'Should I really follow what it says?', a: 'Only if you want to. It is a random answer made for fun, not advice or a prediction, so please don’t use it for health, money, legal or safety decisions. A handy trick: notice whether you feel relieved or disappointed when the answer appears. That feeling is often your real answer.' },
    { q: 'Is my question saved or sent anywhere?', a: 'Your question stays in your browser. Your last 10 answers are kept on this device so you can look back, and you can clear them at any time. The question only leaves your device if you tap “Share this answer”, which puts it inside the link you send.' },
  ],

  privacy: {
    title: 'Privacy Policy | Yes or No Generator',
    description: 'Privacy Policy for Yes or No Generator: your questions stay in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Yes or No Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The questions you type and the answers you get are processed only in your browser and are not sent to our server. Your last 10 answers, including the question, are kept in your browser’s local storage on your device, and you can clear them at any time with the Clear button. When you tap “Share this answer”, the question and answer are written into the link itself and are shared only with the people you send it to.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and recent answers, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, questions asked, star ratings). Your questions are never part of these counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 15, 2026.'],
    ],
    back: '← Back to Yes or No Generator',
  },
};
