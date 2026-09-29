/* Aura Color Test — English (site root /, default + x-default)
 * Same 8 aura ids and question/choice order as aura-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as aura-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq never name an aura color or quote a question.
 * types.<id>.word = the plain color word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = title/button font stack,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Aura Color Test – What Color Is Your Aura?',
    description: 'What color is your aura? Take this free aura color test: 12 everyday questions, about 2 minutes, no sign-up. Discover the glow your energy gives off.',
    ogTitle: 'Aura Color Test ✨ What Color Is Your Aura?',
    ogDescription: 'A free 2-minute aura quiz. Answer 12 everyday questions and see the color your energy gives off.',
  },
  siteName: 'Aura Color Test',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '✨ Aura reading',
    h1Kicker: 'Aura Color Test',
    h1Html: 'What color is<br>your <em>aura</em>?',
    hook: 'Everyone gives off a glow. Twelve little moments from ordinary life will show which one is yours.',
    metaTime: '⏱️ About 2 minutes',
    metaCount: '🔮 12 questions',
    start: 'Read my aura →',
  },

  quiz: {
    backAria: 'Previous question',
    progressAria: 'Progress',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Reading your aura…',
    sub: 'Letting the colors settle',
  },

  result: {
    title: 'Aura Color Test: my aura is {name}',
    eyebrow: 'Your aura color is',
    strengthsLabel: 'Your glow powers',
    othersLabel: 'How others see you',
    bestLabel: 'Best match',
    clashLabel: 'Clashing aura',
    sameShare: '{pct}% of players share this aura',
    shareText: 'My aura is {name} {emoji} — “{vibe}” What color is yours?',
    ctaStrong: 'A friend shared their aura with you',
    ctaSub: 'What color is yours? It takes 2 minutes.',
    retry: 'Take the test again',
  },

  og: {
    eyebrow: 'My aura color',
    brand: '✨ Aura Color Test',
    defaultKicker: 'Aura Color Test',
    defaultTitle: 'What color is your aura?',
    defaultDesc: '12 everyday questions · about 2 minutes',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'How does the aura color test work?', a: 'Each answer adds points to a couple of aura colors, and the color with the most points is your result. Ties are settled by a fixed rule, so the same answers always give the same aura.' },
    { q: 'What is an aura, anyway?', a: 'In popular spirituality an aura is a glow of energy around a person, and each color is linked to a mood and personality. This quiz is a playful take on that idea — for fun and self-reflection, not science.' },
    { q: 'Can my aura color change?', a: 'Yes. Your result depends only on how you answer today, so a different mood or a new chapter in life can bring out a different color. Retake it whenever you like.' },
    { q: 'Are my answers saved?', a: 'No. Your answers are scored in your browser and never stored. We only count, anonymously, which aura came up, so we can show how common each result is.' },
  ],

  privacy: {
    title: 'Privacy Policy | Aura Color Test',
    description: 'Privacy Policy for the Aura Color Test — how we use cookies, advertising and anonymous statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Aura Color Test (the "Service") respects your privacy and processes only the minimum information necessary, as described below.',
    sections: [
      ['1. Information we collect', 'You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which aura color came up, so we can show how common each result is.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work properly if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'We keep anonymous daily totals (page views, completed tests, ratings) to improve the Service. These totals do not identify you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of September 30, 2026.'],
    ],
    back: '← Back to the aura test',
  },

  questions: [
    { q: 'A slow Saturday morning, nothing planned. How does it start?', choices: [
      'A sunrise run. I need to move first.',
      'I text friends: “Road trip? Leaving in an hour.”',
      'Watering my plants, then a stroll to the market',
      'Coffee, a notebook and complete silence',
    ] },
    { q: 'A friend texts: “Hey… can we talk?” You…', choices: [
      'Call right away. Whatever it is, I’m here.',
      'Listen first, then help sort out what to do',
      'Show up with snacks and a plan to make them laugh',
      'Send a long, heartfelt message and a song that fits',
    ] },
    { q: 'You walk into a party where you barely know anyone.', choices: [
      'Ten minutes later I’m chatting with half the room',
      'I’m the one who gets everyone laughing',
      'I find one person and we talk for hours in a corner',
      'I start a game and get everyone to join',
    ] },
    { q: 'You get to live anywhere for a year. You pick…', choices: [
      'A little cottage at the edge of a forest',
      'A quiet town by the sea',
      'A cozy attic studio full of art supplies',
      'Right in the middle of a buzzing big city',
    ] },
    { q: 'The group project is due tomorrow and nothing’s done.', choices: [
      'I take charge and split up the tasks. Let’s go.',
      'I make a step-by-step plan so nobody panics',
      'Late at night, I come up with the idea that saves it',
      'I check who’s stressed and make sure everyone’s okay',
    ] },
    { q: 'You can have one superpower. Which one?', choices: [
      'Reading minds',
      'Teleporting anywhere, anytime',
      'Healing any wound or heartache',
      'Making anyone smile instantly',
    ] },
    { q: 'What fills most of your phone’s photo gallery?', choices: [
      'Selfies and group photos with people I love',
      'Skies, flowers, trees — nature everywhere',
      'Strange angles, moody light, little works of art',
      'Places I’ve been and adventures I’ve had',
    ] },
    { q: 'Stress is piling up. What helps?', choices: [
      'Tidying up and writing a clear to-do list',
      'A hard workout until my head is clear',
      'Time alone to think it all through',
      'Funny videos and snacks. Worry later.',
    ] },
    { q: 'What do people usually think when they first meet you?', choices: [
      '“Confident. A bit intense.”',
      '“So warm and sweet.”',
      '“Calm. I can trust this person.”',
      '“Mysterious. Unlike anyone else.”',
    ] },
    { q: 'Which gift would make you happiest?', choices: [
      'A plant or something handmade',
      'Tickets to a show with my best friends',
      'A rare book or a beautiful notebook',
      'A surprise weekend trip',
    ] },
    { q: 'An argument is starting. You…', choices: [
      'Stay calm and look for what’s fair',
      'Say sorry first. Peace matters more.',
      'Crack a joke to break the tension',
      'Step back and think about it later',
    ] },
    { q: 'Pick the motto that sounds most like you.', choices: [
      'Life’s an adventure — say yes!',
      'Grow slowly, root deeply.',
      'Dream it first, then make it real.',
      'Love out loud.',
    ] },
  ],

  types: {
    red: {
      name: 'Ruby Red',
      word: 'red',
      vibe: 'Pure fire: bold, driven and fully alive.',
      desc: 'Your aura burns bright and warm. You’re a doer — when something matters to you, you move first and think on the way. Challenges wake you up rather than scare you off, and your energy pulls people along with you. You feel everything strongly, from excitement to frustration, and you don’t hide it. That honesty is exactly what makes people trust you.',
      strengths: ['Fearless drive', 'Contagious energy', 'Honest and direct'],
      others: 'People see you as the spark in the room — the one who gets things started and says what everyone else is thinking.',
    },
    orange: {
      name: 'Sunset Orange',
      word: 'orange',
      vibe: 'Warm, spontaneous and always up for an adventure.',
      desc: 'Your aura glows like a sunset on a summer road trip. You love new places, new people and saying “why not?” You make friends easily, and your stories are always the best at the table. Routine bores you, so you keep life colorful with plans nobody else would think of. Underneath the fun is a generous heart that loves sharing good times.',
      strengths: ['Adventurous spirit', 'Makes friends anywhere', 'Brings the fun'],
      others: 'People see you as the friend who turns an ordinary day into a story — easygoing, social and full of surprises.',
    },
    yellow: {
      name: 'Golden Yellow',
      word: 'yellow, gold',
      vibe: 'Sunshine on legs: cheerful, curious and bright.',
      desc: 'Your aura is pure daylight. You’re optimistic, playful and endlessly curious, always picking up new ideas and hobbies. You can find the funny side of almost anything, and your laugh is famous among your friends. You like keeping things light, but you’re also smart and quick — you learn fast and share what you learn with everyone.',
      strengths: ['Natural optimism', 'Quick, curious mind', 'Lifts every mood'],
      others: 'People see you as a ray of sunshine — the one who makes hard days lighter just by showing up.',
    },
    green: {
      name: 'Emerald Green',
      word: 'green',
      vibe: 'Grounded, caring and quietly growing.',
      desc: 'Your aura feels like a forest after rain: calm, fresh and alive. You care deeply about the people and things around you, and you’d rather build something that lasts than chase a quick win. You notice what others need and help without making a fuss. Balance matters to you — a walk outside, a good meal and people you love can fix almost anything.',
      strengths: ['Steady and patient', 'Natural caregiver', 'Keeps things balanced'],
      others: 'People see you as a safe place — reliable, kind and the one they call when they need grounding.',
    },
    blue: {
      name: 'Ocean Blue',
      word: 'blue',
      vibe: 'Calm waters, deep loyalty, honest words.',
      desc: 'Your aura is as calm as the sea on a clear day. You stay steady when things get messy, and you choose your words carefully. Truth and trust mean a lot to you — you keep your promises and expect the same. You may not be the loudest in the room, but when you speak, people listen, because they know you mean it.',
      strengths: ['Calm under pressure', 'Deeply loyal', 'Thoughtful communicator'],
      others: 'People see you as the most trustworthy person they know — peaceful, fair and always honest.',
    },
    indigo: {
      name: 'Midnight Indigo',
      word: 'indigo',
      vibe: 'Intuitive, deep and a step ahead.',
      desc: 'Your aura shimmers like the sky just after midnight. You sense things before anyone says them, and you often know how a story ends before it starts. You love big questions, quiet time and conversations that go deep. You’re independent and a bit private, but the few people who truly know you get a friend with rare insight.',
      strengths: ['Sharp intuition', 'Deep thinker', 'Sees the big picture'],
      others: 'People see you as wise beyond your years — quiet, perceptive and a little hard to read.',
    },
    violet: {
      name: 'Mystic Violet',
      word: 'violet, purple',
      vibe: 'A dreamer with a vision nobody else can see.',
      desc: 'Your aura swirls with imagination. You see the world as it could be, not just as it is, and your head is full of ideas, stories and plans. You’re drawn to art, music and anything unusual. Ordinary rules don’t always fit you, and that’s fine — your unique way of seeing things inspires the people around you.',
      strengths: ['Big imagination', 'Original ideas', 'Inspires others'],
      others: 'People see you as one of a kind — creative, a little mysterious and full of surprising ideas.',
    },
    pink: {
      name: 'Rose Pink',
      word: 'pink',
      vibe: 'Soft heart, big love, gentle strength.',
      desc: 'Your aura is warm and tender like the first light of spring. You love openly and make people feel seen, whether it’s remembering a birthday or noticing when someone’s quiet. Kindness comes naturally to you, and you believe small gestures can change someone’s whole day. You’re gentle, but don’t mistake that for weak — your heart is your strength.',
      strengths: ['Endless kindness', 'Deep empathy', 'Makes people feel loved'],
      others: 'People see you as sweet and comforting — the friend whose hug fixes everything.',
    },
  },
};
