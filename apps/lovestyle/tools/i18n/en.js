/* Love Style Test — English (site root /, default + x-default)
 * Same 8 love-style ids and question/choice order as lovestyle-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as lovestyle-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a love style / animal or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = title/button font stack,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Love Style Test: What’s My Dating Type?',
    description: 'What kind of partner are you? Take this quick love style test: 10 dating moments, 2–3 minutes, no sign-up. Find your dating type, your best match and your love tips.',
    ogTitle: 'Love Style Test 💘 What’s your dating type?',
    ogDescription: 'A quick 2-minute quiz. Answer 10 little dating moments and discover the kind of partner you really are.',
  },
  siteName: 'Love Style Test',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '💘 Dating personality quiz',
    h1Kicker: 'Love Style Test',
    h1Html: 'What kind of partner<br>are you <em>in love</em>?',
    hook: 'Texting habits, first dates, little fights… Ten everyday dating moments reveal the cute character hiding in your heart.',
    metaTime: '⏱️ 2–3 minutes',
    metaCount: '💌 10 questions',
    start: 'Find my love style →',
  },

  quiz: {
    backAria: 'Previous question',
    progressAria: 'Progress',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Reading your heart…',
    sub: 'Matching your answers to a love style',
  },

  result: {
    title: 'Love Style Test: I’m the {name}',
    eyebrow: 'In love, you are the',
    strengthsLabel: 'Your love charms',
    tipsLabel: 'Love tips for you',
    bestLabel: 'Best match',
    rivalLabel: 'Rival',
    sameShare: '{pct}% of players got this love style',
    shareText: 'My love style is the {name} {emoji} — “{vibe}” What’s yours?',
    ctaStrong: 'A friend shared their love style',
    ctaSub: 'What kind of partner are you? 2 minutes.',
    retry: 'Take the test again',
  },

  og: {
    eyebrow: 'My love style',
    brand: '💘 Love Style Test',
    defaultKicker: 'Love Style Test',
    defaultTitle: 'What kind of partner are you?',
    defaultDesc: '10 dating moments · 2–3 minutes',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'How does the love style test pick my result?', a: 'Each answer adds points to a couple of love styles, and the one with the most points wins. Ties are settled by a fixed rule, so the same answers always give the same result.' },
    { q: 'Is this a scientific personality test?', a: 'No, it’s just for fun. The questions are based on everyday dating habits, not a psychological diagnosis — take it as a playful mirror, not a verdict.' },
    { q: 'What do “best match” and “rival” mean?', a: 'Your best match is the style that naturally balances yours. Your rival is the one you clash with most often — which can also mean the most sparks.' },
    { q: 'Are my answers saved?', a: 'No. Your answers are scored in your browser and never stored. We only count, anonymously, which love style came up, so we can show how common each result is.' },
  ],

  privacy: {
    title: 'Privacy Policy | Love Style Test',
    description: 'Privacy Policy for the Love Style Test — how we use cookies, advertising and anonymous statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Love Style Test (the "Service") respects your privacy and processes only the minimum information necessary, as described below.',
    sections: [
      ['1. Information we collect', 'You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which love style came up, so we can show how common each result is.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work properly if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'We keep anonymous daily totals (page views, completed tests, ratings) to improve the Service. These totals do not identify you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 4, 2026.'],
    ],
    back: '← Back to the love style test',
  },

  questions: [
    { q: 'Your crush texts you first. You…', choices: [
      'Reply in three seconds, with five emojis',
      'Wait a little. Don’t want to look too eager.',
      'Send a teasing reply that leaves them curious',
      'Ask how their day went, and remember every detail',
    ] },
    { q: 'First date! Where do you suggest?', choices: [
      'A cute café with pretty desserts and soft music',
      'Somewhere quiet where we can really talk',
      'An arcade or board-game café. Let’s play!',
      'Something new: a night market, a hike, a day trip',
    ] },
    { q: 'Their birthday is coming up. Your plan?', choices: [
      'A surprise party with all their friends',
      'Something stylish they would never expect',
      'A handwritten letter and a scrapbook of our memories',
      'A goofy gift that keeps them laughing for days',
    ] },
    { q: 'Your partner had an awful day. You…', choices: [
      'Sit next to them quietly. No words needed.',
      'Show up with their favorite food and fix what you can',
      'Listen all night and remember every word',
      'Take them on a spontaneous drive to clear their head',
    ] },
    { q: 'How much do you like to text when dating?', choices: [
      'All day! From good morning to good night',
      'A steady check-in or two. Calls are better.',
      'Long, sweet messages full of hearts',
      'Now and then. I’d rather share stories in person.',
    ] },
    { q: 'You had a small fight. You…', choices: [
      'Need some time alone before talking',
      'Act fine, but drop hints until they notice',
      'Apologize first, even if it wasn’t really your fault',
      'Crack a joke to break the ice',
    ] },
    { q: 'What makes your heart skip a beat?', choices: [
      'When their face lights up the moment they see me',
      'When we laugh at the same silly thing',
      'When they say “let’s go somewhere” on a whim',
      'When they respect my space and still choose me',
    ] },
    { q: 'Your ideal weekend together?', choices: [
      'Dressing up, a trendy restaurant, cute photos',
      'Cooking at home and fixing things together',
      'A picnic with flowers and a sunset',
      'Our usual spot, our usual order. Cozy routine.',
    ] },
    { q: 'When you start to like someone, you…', choices: [
      'Can’t hide it at all. Everyone knows by day two.',
      'Play it cool and let them come to you',
      'Like them quietly for a long, long time',
      'Ask them out right away. Life is short!',
    ] },
    { q: 'What matters most to you in a relationship?', choices: [
      'Trust, and space to be myself',
      'Feeling safe and taken care of',
      'Romance and little anniversaries',
      'Being best friends who can talk about anything',
    ] },
  ],

  types: {
    puppy: {
      name: 'Golden Retriever Lover',
      word: 'retriever,puppy,dog',
      vibe: 'All in, all heart, and the happiest one to see you every single time.',
      desc: 'When you love someone, the whole world knows it. You text first, you show up early, and you never play games — your feelings are written all over your face. Your energy makes your partner feel like the most important person on earth. Just remember to take care of yourself too, so your big heart never runs out of battery.',
      strengths: ['Pure devotion', 'Contagious joy', 'Zero mind games'],
      tips: ['Not every slow reply means something is wrong — give them a little room to miss you.', 'Plan one day just for yourself each week; it makes your time together even brighter.', 'Ask what kind of affection they like best, then shower them in exactly that.'],
    },
    cat: {
      name: 'Secretly Sweet Cat',
      word: 'cat',
      vibe: 'Cool on the outside, soft on the inside — affection only for the chosen one.',
      desc: 'You don’t fall fast, and you definitely don’t fall loudly. You need your own space and time, and you can look a little distant at first. But once someone earns your trust, you show a sweet, playful side that only they get to see. Your love is quiet, loyal and very real.',
      strengths: ['Calm independence', 'Loyal once trusted', 'Secret sweetness'],
      tips: ['Say one honest “I missed you” out loud — it means the world coming from you.', 'Tell your partner you need alone time, so they don’t mistake it for coldness.', 'Small gestures count: remembering their coffee order is your love language.'],
    },
    fox: {
      name: 'Charming Fox',
      word: 'fox',
      vibe: 'Witty, stylish and always one step ahead in the game of hearts.',
      desc: 'You know how to make an impression. Clever texts, a perfect outfit, the right amount of mystery — people find you irresistible. You love the thrill of romance and keep things exciting with surprises. Underneath the charm, you want someone who can keep up with you and still see the real you.',
      strengths: ['Magnetic charm', 'Great taste', 'Keeps the spark alive'],
      tips: ['Mix the push-and-pull with plain honesty; clear signals build trust fast.', 'Let your partner see you on a lazy, no-makeup day — real is attractive.', 'Your surprises are legendary; ask for theirs in return.'],
    },
    bear: {
      name: 'Big Teddy Bear',
      word: 'bear,teddy',
      vibe: 'Steady, warm and the safest hug in the world.',
      desc: 'You show love through actions, not big speeches. You fix things, you feed people, and you’re always there when it counts. You may not be the flashiest romantic, but your partner never has to wonder where they stand. Being with you feels like coming home.',
      strengths: ['Rock-solid reliable', 'Love in action', 'Big warm heart'],
      tips: ['Put your feelings into words now and then — “I’m proud of you” goes a long way.', 'Plan one surprise date that’s pure fun, not practical.', 'Let your partner take care of you sometimes, too.'],
    },
    bunny: {
      name: 'Romantic Bunny',
      word: 'bunny,rabbit',
      vibe: 'A dreamer who remembers every date, every song and every little anniversary.',
      desc: 'Love, for you, is a movie — and you want every scene to be beautiful. You notice tiny details, write heartfelt messages and treasure every memory. You feel things deeply, which makes you incredibly caring, and sometimes a little sensitive. The right person will cherish your tenderness.',
      strengths: ['Heartfelt romance', 'Remembers everything', 'Deeply caring'],
      tips: ['When something hurts, say it gently instead of waiting for them to guess.', 'Not everyone shows love with grand gestures; look for the quiet ones too.', 'Keep a shared photo album — it’s your superpower.'],
    },
    penguin: {
      name: 'Devoted Penguin',
      word: 'penguin',
      vibe: 'Slow to start, but once you love, it’s one person, for keeps.',
      desc: 'You take your time before opening your heart, and you never rush things. But when you choose someone, you’re in it for the long haul. You listen closely, remember what matters and stay loyal through every season. Your love is gentle, patient and the kind people dream about.',
      strengths: ['One true loyalty', 'Patient listener', 'Steady and gentle'],
      tips: ['Don’t wait too long to show interest — a small first step can change everything.', 'Share your own worries, not just theirs; love goes both ways.', 'Try one new date idea each month to keep your cozy routine fresh.'],
    },
    hamster: {
      name: 'Bestie Hamster',
      word: 'hamster',
      vibe: 'Your partner is also your best friend, and every date turns into a laugh.',
      desc: 'For you, the best relationships start as friendships. You love playing games, sharing snacks and laughing until your stomach hurts. You’re easy to be around and bring a light, playful energy to love. The serious talks can feel awkward, but your honesty and fun keep your bond strong.',
      strengths: ['Endless fun', 'Easy to talk to', 'Friendship first'],
      tips: ['Mix in a little romance now and then — candles beat comedy once in a while.', 'When things get serious, stay in the conversation instead of joking it away.', 'Keep your inside jokes alive; they’re the glue of your relationship.'],
    },
    dolphin: {
      name: 'Free-Spirited Dolphin',
      word: 'dolphin',
      vibe: 'Adventurous, spontaneous and always ready for the next great date idea.',
      desc: 'You love freedom, new places and saying yes to adventure. Dating you means road trips, random plans and stories to tell. You bring energy and curiosity into every relationship, and you need a partner who enjoys the ride. Freedom matters to you, but the right person makes you want to come back home.',
      strengths: ['Adventurous spirit', 'Full of new ideas', 'Brave in love'],
      tips: ['Balance spontaneous plans with a few steady rituals your partner can count on.', 'Check in before big adventures; not everyone loves surprises.', 'Share your dreams; making plans together is its own adventure.'],
    },
  },
};
