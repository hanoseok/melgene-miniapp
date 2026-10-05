/* Which Animal Are You? (en)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Which Animal Are You? Animal Personality Test",
    "description": "Which animal are you? Take this quick animal personality test: 8 everyday scenarios, 2–3 minutes, no sign-up. Find the animal that matches your personality, plus your best match and tips.",
    "ogTitle": "Which Animal Are You? 🦊 Animal personality test",
    "ogDescription": "A quick 2-minute quiz. Answer 8 everyday scenarios and meet the animal that matches your personality."
  },
  "siteName": "Which Animal Are You?",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🦊 Animal personality quiz",
    "h1Kicker": "Which animal are you?",
    "h1Html": "Which animal<br>are <em>you</em> most like?",
    "hook": "A canceled plan, a midnight call, a party full of strangers… a few everyday moments reveal the wild side of your personality.",
    "metaTime": "⏱️ 2–3 minutes",
    "metaCount": "🐾 8 questions",
    "start": "Find my animal →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Following your tracks…",
    "sub": "Matching your answers to an animal"
  },
  "result": {
    "title": "Which Animal Are You? I’m the {name}",
    "eyebrow": "The animal you’re most like",
    "strengthsLabel": "Your superpowers",
    "tipsLabel": "Tips for your animal side",
    "bestLabel": "Best match",
    "rivalLabel": "Rival",
    "sameShare": "{pct}% of players got this animal",
    "shareText": "I’m the {name} {emoji} — “{vibe}” Which animal are you?",
    "ctaStrong": "A friend shared their animal",
    "ctaSub": "Which animal are you? 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My animal is",
    "brand": "🦊 Which Animal Are You?",
    "defaultKicker": "Animal personality test",
    "defaultTitle": "Which animal are you?",
    "defaultDesc": "8 everyday scenarios · 2–3 minutes"
  },
  "faq": [
    {
      "q": "How does the test pick my animal?",
      "a": "Each answer adds points to a couple of animals, and the one with the most points wins. Ties are settled by a fixed rule, so the same answers always give the same result."
    },
    {
      "q": "Is this a scientific personality test?",
      "a": "No, it’s just for fun. The questions are based on everyday habits and moods, not a psychological diagnosis — take it as a playful mirror."
    },
    {
      "q": "What do “best match” and “rival” mean?",
      "a": "Your best match is the animal that naturally balances yours. Your rival is the one you clash with most often, which can also mean the most sparks."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are scored in your browser and never stored. We only count, anonymously, which animal came up, so we can show how common each result is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Which Animal Are You?",
    "description": "Privacy Policy for “Which Animal Are You?” — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Which Animal Are You? (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which animal came up, so we can show how common each result is."
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
        "This policy is effective as of October 6, 2026."
      ]
    ],
    "back": "← Back to the animal test"
  },
  "questions": [
    {
      "q": "Your weekend plans just got canceled. You…",
      "choices": [
        "Text your closest friends and see who’s free",
        "Finally settle in with a book or a documentary",
        "Try something random: a new café, a new park, whatever",
        "Throw together a dinner and invite everyone. You’re hosting!"
      ]
    },
    {
      "q": "A big group project lands on your desk. You…",
      "choices": [
        "Take it one slow, steady step at a time",
        "Keep the vibe good and do your part at your own pace",
        "Set a clear goal and aim for the best result",
        "Make sure everyone feels heard and comfortable first"
      ]
    },
    {
      "q": "A friend calls you at midnight, upset. You…",
      "choices": [
        "Cheer them up with jokes until they laugh",
        "Help them build a clear plan to fix it",
        "Say “I’m on my way” and show up in 20 minutes",
        "Stay on the phone, calm and comforting, as long as it takes"
      ]
    },
    {
      "q": "You walk into a party where you only know one person. You…",
      "choices": [
        "Stay close to your friend, smile, and wait for people to come over",
        "Walk in like you own the place and greet everyone",
        "Watch the room first, then chat with whoever looks interesting",
        "Find a comfy corner near the snacks and stay there"
      ]
    },
    {
      "q": "Pick your dream trip.",
      "choices": [
        "A cozy resort: sleep in, eat well, do nothing",
        "A road trip with your best friends, bonding at every stop",
        "Flower-filled countryside or a cabin in the forest",
        "A quiet old town full of museums, bookshops and stories"
      ]
    },
    {
      "q": "A sudden problem pops up. You…",
      "choices": [
        "Get focused, find the fastest route and solve it",
        "Laugh it off, improvise and make it fun",
        "Take a deep breath, grab a snack and let it work itself out",
        "Step up and take charge right away"
      ]
    },
    {
      "q": "Your friends would describe you as…",
      "choices": [
        "The gentle one who notices how everyone feels",
        "The driven one who always has a goal",
        "The loyal one who always has their back",
        "The fun one who makes every plan better"
      ]
    },
    {
      "q": "Your perfect evening ends with…",
      "choices": [
        "Everyone cheering at a night you made unforgettable",
        "Good food, good people and laughing with no rush",
        "A deep late-night talk under the stars",
        "Early bed, phone off and a very long sleep"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "Loyal Wolf",
      "word": "wolf",
      "vibe": "Fiercely loyal, and your pack always comes first.",
      "desc": "You’re the friend who shows up. Once someone is in your circle, you protect them, back them up and never forget what they did for you. You may look serious at first, but around your people you’re warm, funny and deeply devoted. Your pack is lucky to have you.",
      "strengths": [
        "Unshakable loyalty",
        "Protective heart",
        "Team spirit"
      ],
      "tips": [
        "Let others help you too; you don’t have to carry the whole pack.",
        "Say “no” sometimes. Loyalty doesn’t mean agreeing to everything.",
        "Make room for new people; your circle can grow without losing its warmth."
      ]
    },
    "owl": {
      "name": "Wise Owl",
      "word": "owl",
      "vibe": "Quietly observant, and always thinking three steps deeper.",
      "desc": "You’d rather watch, listen and understand before you speak. People come to you for thoughtful advice, and you’re at your best in deep late-night conversations. You love learning and notice the details everyone else misses. Sometimes you overthink, but your insight is a real gift.",
      "strengths": [
        "Sharp insight",
        "Great listener",
        "Curious mind"
      ],
      "tips": [
        "Share your ideas before they feel perfect; people want to hear them.",
        "When your mind is racing, write it down or take a walk instead of replaying it.",
        "Schedule some fun that has no point at all. Your brain deserves recess."
      ]
    },
    "otter": {
      "name": "Playful Otter",
      "word": "otter",
      "vibe": "Pure fun, big smiles and a talent for making any day better.",
      "desc": "You turn ordinary moments into games. You’re curious, friendly and almost impossible to be sad around. You make friends everywhere you go and keep the mood light even when things get messy. Underneath the jokes, you simply want everyone to enjoy themselves together.",
      "strengths": [
        "Instant good vibes",
        "Easy friendships",
        "Fearless fun"
      ],
      "tips": [
        "Take a quiet minute now and then; not every feeling needs a joke.",
        "Finish one small thing before starting the next adventure.",
        "Tell people when you’re really struggling. They’d love to be there for you."
      ]
    },
    "lion": {
      "name": "Bold Lion",
      "word": "lion",
      "vibe": "Confident, warm-hearted and born to lead the room.",
      "desc": "You step up when others hesitate. You have presence, courage and a generous streak, and people naturally follow your energy. You love big moments and make sure your people feel celebrated. At your best, you lead by lifting everyone around you.",
      "strengths": [
        "Natural leadership",
        "Big-hearted courage",
        "Contagious confidence"
      ],
      "tips": [
        "Pass the spotlight sometimes; quiet voices often have the best ideas.",
        "Ask before you take charge. Help works best when it’s invited.",
        "Rest is part of being strong. Even kings nap."
      ]
    },
    "panda": {
      "name": "Chill Panda",
      "word": "panda",
      "vibe": "Easygoing, kind and the calm in every storm.",
      "desc": "You go with the flow and help everyone around you relax. You enjoy good food, good company and unhurried days. You rarely start drama and you’re remarkably hard to rattle. People love how safe and comfortable you are to be around.",
      "strengths": [
        "Calm presence",
        "Easygoing kindness",
        "Enjoys the little things"
      ],
      "tips": [
        "Say what you want out loud; you’re allowed to have a favorite, too.",
        "Pick one small goal each week to stretch yourself.",
        "Don’t let “whatever’s fine” hide what you really feel."
      ]
    },
    "eagle": {
      "name": "Driven Eagle",
      "word": "eagle",
      "vibe": "Focused, independent and always aiming higher.",
      "desc": "You see the big picture and go after it. You set goals, make plans and hold yourself to a high standard. You like to be independent and you solve problems fast. Your ambition inspires people, and you quietly hope to find someone who can keep up with your pace.",
      "strengths": [
        "Clear focus",
        "Independent spirit",
        "Fast problem-solver"
      ],
      "tips": [
        "Celebrate the wins along the way, not just at the summit.",
        "Hand off something this week. Trust can take you farther than speed.",
        "Check in on how others feel; progress is better when it’s shared."
      ]
    },
    "sloth": {
      "name": "Cozy Sloth",
      "word": "sloth",
      "vibe": "Slow, steady and a pro at enjoying life.",
      "desc": "You know the secret others forget: there’s no prize for rushing. You protect your peace, love your comforts and take things one gentle step at a time. You’re patient, unbothered and quietly wise about what really matters. Your calm is a gift in a hurried world.",
      "strengths": [
        "Deep patience",
        "Peaceful mindset",
        "Master of comfort"
      ],
      "tips": [
        "Start before you feel ready; small steps still count.",
        "Tell friends your plans early so they can work around your pace.",
        "Try one new thing a month. Cozy and curious can go together."
      ]
    },
    "deer": {
      "name": "Gentle Deer",
      "word": "deer",
      "vibe": "Soft-hearted, graceful and tuned in to everyone’s feelings.",
      "desc": "You notice the small things: a shift in someone’s mood, a lonely person in the corner. You’re gentle, sensitive and quietly kind, with a love for beautiful, peaceful places. You may flinch at conflict, but your empathy makes you someone people trust with their feelings.",
      "strengths": [
        "Deep empathy",
        "Graceful kindness",
        "Eye for beauty"
      ],
      "tips": [
        "Your feelings matter as much as theirs; speak up early, even softly.",
        "Recharge with nature or music after busy days.",
        "You’re allowed to say “I need a moment” without explaining."
      ]
    }
  }
};
