/* What Coffee Are You? (en)
 * 8 result ids (espresso americano latte cappuccino mocha coldbrew flatwhite caramel) and question/choice order as in coffee-core.js
 * (the scoring lives only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].c[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.metaDesc = result page meta description. Placeholders: {name} {emoji} {vibe} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "What Coffee Are You? Coffee Personality Quiz",
    "description": "Take the what coffee are you quiz: 12 everyday situations, 2 minutes, no sign-up. Find out which coffee matches your personality, with strengths, tips and a best match.",
    "ogTitle": "What Coffee Are You? ☕ Coffee personality quiz",
    "ogDescription": "12 everyday questions, 2 minutes. Which coffee are you, really?"
  },
  "siteName": "What Coffee Are You?",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "☕ Coffee personality quiz",
    "h1Kicker": "What Coffee Are You?",
    "h1Html": "Which cup<br><em>matches you</em>?",
    "hook": "Some people are bold and quick, others smooth and slow. Answer 12 everyday questions and find out which coffee is your match.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✏️ 12 questions",
    "start": "Brew my result →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Grinding your answers…",
    "sub": "Almost ready to pour"
  },
  "result": {
    "title": "Coffee personality: I’m a {name}",
    "metaDesc": "Coffee personality result: {name}. {vibe}",
    "eyebrow": "Your coffee is",
    "strengthsLabel": "Your signature notes",
    "tipsLabel": "Brewing tips for you",
    "sameShare": "{pct}% of players got this coffee",
    "shareText": "I’m a {name} {emoji} — “{vibe}” What coffee are you?",
    "ctaStrong": "A friend shared their coffee",
    "ctaSub": "Which one are you? 2 minutes.",
    "bestLabel": "Best buddy",
    "rivalLabel": "Rival",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My coffee is",
    "brand": "☕ What Coffee Are You?",
    "defaultKicker": "Coffee personality quiz",
    "defaultTitle": "Which coffee are you?",
    "defaultDesc": "12 everyday questions · 2 minutes"
  },
  "faq": [
    {
      "q": "How is my coffee chosen?",
      "a": "Each answer adds points to the coffees it fits. The coffee with the most points at the end is your result. The same answers always give the same result."
    },
    {
      "q": "Is this a real personality test?",
      "a": "No, it’s just for fun. It looks at everyday habits and moods, not psychology research, so take it as a playful mirror rather than a diagnosis."
    },
    {
      "q": "Do I have to like coffee to take it?",
      "a": "Not at all. Tea lovers and non-drinkers get a result too. The quiz is about personality, not your taste in drinks."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are scored in your browser and never stored. We only count, anonymously, which result came up, so we can show how common each one is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | What Coffee Are You?",
    "description": "Privacy Policy for the What Coffee Are You? — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "What Coffee Are You? (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which result came up, so we can show how common each result is."
      ],
      [
        "2. Cookies and similar technologies",
        "The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work properly if you do."
      ],
      [
        "3. Advertising (Google AdSense)",
        "The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google Ad Settings</a>."
      ],
      [
        "4. Statistics",
        "We keep anonymous daily totals (page views, completed tests, ratings) to improve the Service. These totals do not identify you personally."
      ],
      [
        "5. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "6. Effective date",
        "This policy is effective as of October 10, 2026."
      ]
    ],
    "back": "← Back to the coffee quiz"
  },
  "questions": [
    {
      "q": "An open Saturday morning. What are you doing?",
      "choices": [
        "Up early: workout, errands, all done by 10",
        "Staying in bed with a warm breakfast and soft music",
        "Walking alone with headphones and no destination",
        "Brunch with friends, of course"
      ]
    },
    {
      "q": "The group chat can’t decide where to eat.",
      "choices": [
        "I pick a place and book it",
        "Anything’s fine with me, honestly",
        "Fire off ten ideas and hype everyone up",
        "Suggest the one spot I already researched"
      ]
    },
    {
      "q": "Your train is late and it’s pouring.",
      "choices": [
        "Check the backup route. I always have one",
        "Put on a moody playlist and watch the rain",
        "Shrug and enjoy a podcast",
        "Text a friend a dramatic live report"
      ]
    },
    {
      "q": "Your photo gallery is mostly…",
      "choices": [
        "Neatly framed shots with good light",
        "Sunsets, food and moments that hit me",
        "Group selfies and blurry party shots",
        "Random scenery and screenshots"
      ]
    },
    {
      "q": "A big deadline is coming.",
      "choices": [
        "Lock in and finish in one focused sprint",
        "Chip away a little every day",
        "Ask for help and take snack breaks",
        "Do my best work in the last hours, somehow"
      ]
    },
    {
      "q": "A friend shares some bad news.",
      "choices": [
        "Listen, hug and stay as long as needed",
        "Help them make a practical plan",
        "Cry along with them",
        "Stay calm and sit beside them quietly"
      ]
    },
    {
      "q": "Shopping for something to wear.",
      "choices": [
        "A few quality basics that go with everything",
        "The statement piece nobody else has",
        "Straight to what I need, out in ten minutes",
        "Whatever’s trending or my friends love"
      ]
    },
    {
      "q": "You walk into a party.",
      "choices": [
        "Work the room. I already know half of them",
        "Find one person for a deep corner chat",
        "Make a grand entrance",
        "Help the host with snacks and drinks"
      ]
    },
    {
      "q": "A free evening, home alone.",
      "choices": [
        "A sweet snack and a movie that makes me feel things",
        "Tidy up, light a candle, put on a record",
        "Dive into a hobby for hours",
        "Workout or side project, no time wasted"
      ]
    },
    {
      "q": "Choosing a gift for someone you love.",
      "choices": [
        "Something handwritten and heartfelt",
        "Something genuinely useful",
        "Something beautifully designed",
        "Something cozy they can curl up with"
      ]
    },
    {
      "q": "Someone disagrees with you.",
      "choices": [
        "Say what I think, clearly",
        "Smooth it over to keep the peace",
        "Explain my reasons calmly and carefully",
        "Win them over with charm"
      ]
    },
    {
      "q": "Pick a life motto.",
      "choices": [
        "Slow and steady wins",
        "Make it a good story",
        "The more, the merrier",
        "Follow your heart"
      ]
    }
  ],
  "types": {
    "espresso": {
      "name": "Espresso",
      "word": "espresso",
      "vibe": "Small, intense and always on time.",
      "desc": "You’re concentrated energy: decisive, direct and quick to get things done. You’d rather make a call in ten seconds than debate it for ten minutes. People may find you strong at first sip, but those close to you know the warmth underneath.",
      "strengths": [
        "Decisive in a flash",
        "Gets things done",
        "Honest and direct"
      ],
      "tips": [
        "Leave a little room for slow, unplanned moments.",
        "Soften a bold opinion with one friendly sentence.",
        "Rest counts as productive too."
      ]
    },
    "americano": {
      "name": "Americano",
      "word": "americano",
      "vibe": "Clear, reliable and easy to be around.",
      "desc": "You’re the dependable one: no fuss, no drama, just a steady presence that lasts. You keep a calm head, plan sensibly and make everyone around you feel at ease. Not flashy, yet everyone is glad when you show up.",
      "strengths": [
        "Steady and dependable",
        "Calm under pressure",
        "Easy to get along with"
      ],
      "tips": [
        "Say what you want now and then. People want to know.",
        "Try one small surprise this week.",
        "Your steadiness is a gift. Don’t hide it."
      ]
    },
    "latte": {
      "name": "Latte",
      "word": "latte",
      "vibe": "Soft, warm and a natural comforter.",
      "desc": "You’re gentle and caring, the one who notices when someone goes quiet. You blend into any group and smooth rough edges with a smile. Your kindness makes people feel at home, as long as you remember to look after yourself too.",
      "strengths": [
        "Warm listener",
        "Natural peacemaker",
        "Makes everyone comfortable"
      ],
      "tips": [
        "Say no kindly when you need to.",
        "Plan something just for you this week.",
        "Your opinion matters as much as the group’s."
      ]
    },
    "cappuccino": {
      "name": "Cappuccino",
      "word": "cappuccino",
      "vibe": "Lively, friendly and light as foam.",
      "desc": "You’re the social one with a bubbly, airy energy. You love people, plans and a good laugh, and you keep any conversation going. Under the fun there’s real balance: you know when to talk and when to listen.",
      "strengths": [
        "Social butterfly",
        "Cheerful energy",
        "Brings people together"
      ],
      "tips": [
        "Book a quiet evening to recharge.",
        "Check in one-on-one with a friend you haven’t caught up with.",
        "Don’t let the fun hide a worry. Share it."
      ]
    },
    "mocha": {
      "name": "Mocha",
      "word": "mocha",
      "vibe": "Sweet, romantic and full of feelings.",
      "desc": "You feel everything deeply and you’re not shy about it. You love sweet things, stories, music and the people in your life, and you give with your whole heart. Your creativity and warmth are a treat, as long as you leave room for your own comfort.",
      "strengths": [
        "Big-hearted",
        "Creative and expressive",
        "Thoughtful gift-giver"
      ],
      "tips": [
        "Write your feelings down before big decisions.",
        "Treat yourself without guilt.",
        "Invite logic into the chat when feelings run high."
      ]
    },
    "coldbrew": {
      "name": "Cold Brew",
      "word": "cold brew",
      "vibe": "Cool, calm and worth the wait.",
      "desc": "You take your time, and it shows: smooth, thoughtful and hard to rattle. You like your own space, think things through slowly and get richer the longer people know you. You don’t need the spotlight to leave an impression.",
      "strengths": [
        "Unshakably calm",
        "Deep thinker",
        "Independent spirit"
      ],
      "tips": [
        "Let people in a little sooner.",
        "Say your idea out loud before it’s perfect.",
        "Warm up your circle with one small invitation."
      ]
    },
    "flatwhite": {
      "name": "Flat White",
      "word": "flat white",
      "vibe": "Smooth, refined and quietly stylish.",
      "desc": "You value quality over quantity: a few good things, chosen well. You have an eye for detail, a clean sense of style and a balance others admire. You’re easygoing without being plain and polished without trying too hard.",
      "strengths": [
        "Great taste",
        "Balanced and composed",
        "Eye for detail"
      ],
      "tips": [
        "Messy is allowed. Try something imperfect.",
        "Share your recommendations. People trust your taste.",
        "Don’t wait for perfect to start."
      ]
    },
    "caramel": {
      "name": "Caramel Macchiato",
      "word": "macchiato",
      "vibe": "Sweet on top, layered underneath.",
      "desc": "You’re charming with a twist: a sweet first impression and surprising layers beneath. You have style, a sense of drama and a knack for making ordinary moments feel special. People are drawn to you, and the more they discover, the more they like.",
      "strengths": [
        "Natural charm",
        "Full of surprises",
        "Makes moments special"
      ],
      "tips": [
        "Let people see the layers under the sweetness.",
        "Keep one plan that’s about substance, not show.",
        "Thank the people behind the scenes."
      ]
    }
  }
};
