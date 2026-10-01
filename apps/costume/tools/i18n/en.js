/* Halloween Costume Quiz — English (site root /, default + x-default)
 * Same 8 costume ids and question/choice order as costume-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as costume-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a costume or quote a question.
 * types.<id>.word = the plain costume word(s) in this language (comma-separated) — only used by the spoiler check.
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
    title: 'Halloween Costume Quiz: What Should I Be for Halloween?',
    description: 'What Halloween costume should I be? Take this free Halloween costume quiz: 12 party moments, about 2 minutes, no sign-up — get a costume that fits your personality, plus tips.',
    ogTitle: 'Halloween Costume Quiz 🎃 What should you be this year?',
    ogDescription: 'A free 2-minute quiz. Answer 12 Halloween party moments and find the costume that matches your personality.',
  },
  siteName: 'Halloween Costume Quiz',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎃 Costume fitting room',
    h1Kicker: 'Halloween Costume Quiz',
    h1Html: 'What should I be<br>this <em>Halloween</em>?',
    hook: 'Still staring at an empty costume bag? Twelve little party moments will pick the look that fits the real you.',
    metaTime: '⏱️ About 2 minutes',
    metaCount: '🦇 12 questions',
    start: 'Find my costume →',
  },

  quiz: {
    backAria: 'Previous question',
    progressAria: 'Progress',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Raiding the costume closet…',
    sub: 'Trying on a few looks for you',
  },

  result: {
    title: 'Halloween Costume Quiz: I should be the {name}',
    eyebrow: 'This Halloween, you should be',
    strengthsLabel: 'Your party powers',
    tipsLabel: 'How to pull it off',
    bestLabel: 'Best buddy',
    rivalLabel: 'Friendly rival',
    sameShare: '{pct}% of players got this costume',
    shareText: 'My Halloween costume is the {name} {emoji} — “{vibe}” What should you be?',
    ctaStrong: 'A friend shared their Halloween costume',
    ctaSub: 'What should you be? It takes 2 minutes.',
    retry: 'Take the quiz again',
  },

  og: {
    eyebrow: 'My Halloween costume',
    brand: '🎃 Halloween Costume Quiz',
    defaultKicker: 'Halloween Costume Quiz',
    defaultTitle: 'What should you be this Halloween?',
    defaultDesc: '12 party moments · about 2 minutes',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'How does the costume quiz pick my result?', a: 'Each answer adds points to a couple of costumes, and the one with the most points wins. Ties are settled by a fixed rule, so the same answers always give the same costume.' },
    { q: 'Can I really make the costume myself?', a: 'Yes. Every result comes with simple tips that use things most people already have at home, plus a few cheap extras. No sewing skills needed.' },
    { q: 'What if I don’t like my result?', a: 'Take it again! Your result depends only on how you answer today, and a different party mood can bring out a different look. Or pair up with your best buddy for a group costume.' },
    { q: 'Are my answers saved?', a: 'No. Your answers are scored in your browser and never stored. We only count, anonymously, which costume came up, so we can show how common each result is.' },
  ],

  privacy: {
    title: 'Privacy Policy | Halloween Costume Quiz',
    description: 'Privacy Policy for the Halloween Costume Quiz — how we use cookies, advertising and anonymous statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Halloween Costume Quiz (the "Service") respects your privacy and processes only the minimum information necessary, as described below.',
    sections: [
      ['1. Information we collect', 'You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which costume came up, so we can show how common each result is.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work properly if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'We keep anonymous daily totals (page views, completed quizzes, ratings) to improve the Service. These totals do not identify you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 2, 2026.'],
    ],
    back: '← Back to the costume quiz',
  },

  questions: [
    { q: 'A Halloween party invite just landed. Your first thought?', choices: [
      'Finally. I’ve been planning my look for weeks.',
      'Who’s hosting? I’ll bring snacks and a playlist.',
      'Do I have to dress up… or can I come comfy?',
      'I’m making my own costume. Store-bought is boring.',
    ] },
    { q: 'At the costume shop, you head straight for…', choices: [
      'The rack of velvet capes and glitter',
      'The bargain bin. Anything goes!',
      'Ears, tails and tiny accessories',
      'The DIY corner: bandages, face paint, tape',
    ] },
    { q: 'You walk into the party. First move?', choices: [
      'Find the dance floor',
      'Say hi to everyone and introduce people',
      'Pick a quiet corner and people-watch',
      'Head straight for the snack table',
    ] },
    { q: 'Ding-dong! Trick-or-treaters at the door. You…', choices: [
      'Dance at the door while handing out candy',
      'Hide behind the door and jump out. Boo!',
      'Give each kid a little handmade treat bag',
      'Ask for a trick first. Fair is fair.',
    ] },
    { q: 'The DJ plays a song you love. You…', choices: [
      'Dance like nobody’s watching. Instantly.',
      'Glide in slowly with dramatic moves',
      'Nod along from the couch, snack in hand',
      'Pull your shy friend onto the floor',
    ] },
    { q: 'Group photo time! Where are you?', choices: [
      'Front and center, best angle ready',
      'Peeking in from the very edge',
      'Pulling a silly face in the back row',
      'Fixing everyone’s hair and outfits first',
    ] },
    { q: 'Someone says, “Let’s tell scary stories.” You…', choices: [
      'Already have a chilling one ready',
      'Grab the arm next to you and listen with one eye shut',
      'Turn it into a comedy halfway through',
      'Quietly slip off to the kitchen',
    ] },
    { q: 'The snack table is calling. You grab…', choices: [
      'A bit of everything. Then seconds.',
      'The one weird dish nobody else dares to try',
      'Only the prettiest dessert on the table',
      'Plates for your friends before yourself',
    ] },
    { q: 'At midnight, the lights suddenly go out. You…', choices: [
      'Switch on your phone light and calm everyone down',
      'Make a spooky noise to mess with people',
      'Stay perfectly still. You see fine in the dark.',
      'Keep eating. Darkness changes nothing.',
    ] },
    { q: 'Costume contest! Which award would you win?', choices: [
      'Most Elegant',
      'Most Creative',
      'Crowd Favorite',
      'Cutest',
    ] },
    { q: 'You visit a haunted house. You’re the one who…', choices: [
      'Leads the group and cheers everyone on',
      'Strolls through calmly, totally unimpressed',
      'Screams the loudest and laughs the most',
      'Studies the props: “How did they make that?”',
    ] },
    { q: 'The morning after the party, you are…', choices: [
      'Still asleep. Wake me at sunset.',
      'Tidying up and returning everyone’s lost stuff',
      'Already planning next year’s party',
      'Melted into the couch, totally drained',
    ] },
  ],

  types: {
    vampire: {
      name: 'Velvet Vampire',
      word: 'vampire',
      vibe: 'Effortlessly elegant, a little dramatic, and the star of every night.',
      desc: 'You were born for the night shift. You love a good entrance, you know your best angle, and you can turn a plain evening into a scene from a movie. People are drawn to your quiet confidence and that hint of mystery. You take style seriously, but you also take care of the people in your circle — once you’re loyal, you’re loyal forever.',
      strengths: ['Magnetic charm', 'Flawless style', 'Owns the night'],
      tips: ['A black outfit plus a cape (a dark bedsheet works) instantly says “count of the castle”.', 'Slick your hair back and add a touch of red at the corner of the lips.', 'Plastic fangs and a dramatic slow bow when you arrive.'],
    },
    witch: {
      name: 'Moonlight Witch',
      word: 'witch',
      vibe: 'Clever, creative and always brewing a brilliant plan.',
      desc: 'Your mind is a cauldron of ideas. You’d rather make something original than copy what everyone else is doing, and you usually have a plan B, C and D. You’re independent and a little mischievous, with a sharp wit that keeps conversations interesting. Friends come to you when they need a smart solution — or a spell of good advice.',
      strengths: ['Brilliant ideas', 'Independent spirit', 'Sharp wit'],
      tips: ['A pointy hat and a long dark dress or coat are all you need to start.', 'Carry a broom or a mug labeled “potion” as your signature prop.', 'Add star stickers, purple lipstick or a stuffed black cat on your shoulder.'],
    },
    ghost: {
      name: 'Bedsheet Ghost',
      word: 'ghost',
      vibe: 'Shy-cute, cozy and secretly the funniest one in the room.',
      desc: 'You don’t need the spotlight to have a great time. You prefer cozy clothes, a few close friends and watching the party from a comfortable spot. People may underestimate you at first, but your quiet observations and sneaky jokes catch everyone off guard. You’re gentle, kind, and the kind of friend who makes others feel safe.',
      strengths: ['Gentle kindness', 'Sneaky humor', 'Great observer'],
      tips: ['One white bedsheet with two eye holes. Classic, comfy and done in five minutes.', 'Add sunglasses or a tiny hat to make it unmistakably yours.', 'Carry a little sign that says “boo” for the cutest photos.'],
    },
    zombie: {
      name: 'Party Zombie',
      word: 'zombie',
      vibe: 'Easygoing, always hungry and impossible to stop once you get going.',
      desc: 'You go with the flow and rarely let anything stress you out. Give you good snacks, comfy shoes and your favorite people, and you’re happy. You may move slowly in the morning, but once you’re in, you’re all in — and nothing can stop you. Friends love your relaxed vibe and how loyal you are to your crew.',
      strengths: ['Totally chill', 'Unstoppable stamina', 'Loyal to the crew'],
      tips: ['Grab old clothes, rip a few holes and rub in some coffee grounds for “dirt”.', 'Gray face paint plus dark eyeshadow around the eyes does the trick.', 'Walk slowly with your arms out and groan for snacks.'],
    },
    blackcat: {
      name: 'Midnight Black Cat',
      word: 'cat',
      vibe: 'Cool, curious and mysterious — affection only for the chosen few.',
      desc: 'You do things your own way, at your own pace. You’re curious about everything but show interest only when you really feel it. People find you a bit mysterious, and that’s exactly how you like it. Behind the cool look, you’re playful and sweet with the people who earn your trust — and you always land on your feet.',
      strengths: ['Effortlessly cool', 'Endless curiosity', 'Always lands on its feet'],
      tips: ['An all-black outfit with a cat-ear headband is instantly recognizable.', 'Draw a little nose and whiskers with eyeliner.', 'Pin a tail made of a black sock or tights to your back.'],
    },
    mummy: {
      name: 'Cozy Mummy',
      word: 'mummy',
      vibe: 'Patient, caring and the friend who holds everyone together.',
      desc: 'You’re the one who quietly makes sure everyone’s okay. You remember the small things, you fix what’s broken, and you’re ready with a bandage — literally or emotionally. You’re patient and steady, with an old-soul charm and a love for classic, timeless things. People feel calmer just being around you.',
      strengths: ['Endless patience', 'Big caring heart', 'Rock-solid reliable'],
      tips: ['Wrap white gauze or strips of an old sheet over a white outfit.', 'Leave one eye peeking out and let a few ends dangle loose.', 'Dust the wraps with tea or coffee for an ancient look.'],
    },
    pumpkin: {
      name: 'Pumpkin King',
      word: 'pumpkin',
      vibe: 'Warm, bright and the heart of the party — king or queen of Halloween.',
      desc: 'You light up every room like a lantern. You love bringing people together, you remember everyone’s name, and you make sure nobody feels left out. Parties feel more alive when you’re there, and you’re often the one who organizes them. Your warmth is contagious — people leave your side feeling a little brighter.',
      strengths: ['Born host', 'Contagious warmth', 'Brings everyone together'],
      tips: ['An orange top or hoodie with a jack-o’-lantern face cut from black felt.', 'Top it with a green leafy headband or a little crown.', 'Carry a candy bucket and hand out treats to everyone.'],
    },
    skeleton: {
      name: 'Dancing Skeleton',
      word: 'skeleton',
      vibe: 'Goofy, honest and always the first one on the dance floor.',
      desc: 'You’re here for a good time, and it shows. You make people laugh without even trying, and your energy pulls everyone onto the dance floor. You’re refreshingly honest — what people see is what they get, right down to the bone. Life feels lighter around you, because you never take yourself too seriously.',
      strengths: ['Instant mood booster', 'Bare-bones honesty', 'Fearless dancer'],
      tips: ['Black clothes plus white tape or fabric paint for bones.', 'Paint a skull face: white base, black eye circles and stitched teeth.', 'Practice one silly dance move — rattling is required.'],
    },
  },
};
