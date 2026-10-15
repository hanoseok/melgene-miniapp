/* Teto or Egen Test (en)
 * 8 result ids (boldteto softteto tetoegen switch balance egenteto softegen boldegen) and question/choice order as in teto-core.js
 * (the scoring lives only there: every choice has a teto value 0–3). questions[i].choices[j] must stay in the same order as QUESTIONS[i].v[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own teto/egen % and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {teto} {egen} — keep them as-is when translating.
 * Tone: gender-neutral and kind. Teto = bold, direct, action energy; Egen = gentle, empathetic, sensitive energy. Anyone can be any type.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Teto or Egen Test: Which Energy Are You?",
    "description": "Take the Teto or Egen test: 12 everyday situations, 2 minutes, no sign-up. See your own teto vs egen percentage in this fun masculine or feminine energy test for anyone.",
    "ogTitle": "Teto or Egen Test ⚡ Which energy are you?",
    "ogDescription": "12 everyday situations, 2 minutes. Bold teto energy or gentle egen energy?"
  },
  "siteName": "Teto or Egen Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "⚡ The Korean viral test",
    "h1Kicker": "Teto or Egen Test",
    "h1Html": "Are you more <em>teto</em><br>or more egen?",
    "hook": "Bold, go-getter teto energy or warm, tender egen energy? Answer 12 everyday moments honestly and see your own energy mix.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "💬 12 moments",
    "start": "Find my energy →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Mixing your energy…",
    "sub": "Teto ↔ Egen meter calibrated"
  },
  "result": {
    "title": "My Teto-Egen type: {name}",
    "metaDesc": "Teto or Egen test result: {name}. {vibe}",
    "eyebrow": "Your energy type is",
    "gaugeLabel": "Your energy mix",
    "gaugeTeto": "Teto {pct}%",
    "gaugeEgen": "Egen {pct}%",
    "strengthsLabel": "Your strengths",
    "weaknessLabel": "Watch out for",
    "tipLabel": "Energy tip",
    "sameShare": "{pct}% of people got this type",
    "shareText": "My Teto-Egen type: {name} {emoji} “{vibe}” What's yours?",
    "shareTextPct": "My Teto-Egen type: {name} {emoji} (Teto {teto}% · Egen {egen}%) What's yours?",
    "ctaStrong": "A friend shared their energy type",
    "ctaSub": "Teto or egen? Find out in 2 minutes.",
    "bestLabel": "Best match",
    "rivalLabel": "Rival vibes",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My Teto-Egen type",
    "brand": "⚡ Teto or Egen Test",
    "defaultKicker": "Teto or Egen test",
    "defaultTitle": "Bold teto or gentle egen?",
    "defaultDesc": "12 everyday moments · 2 minutes"
  },
  "faq": [
    {
      "q": "What do “teto” and “egen” mean?",
      "a": "They are Korean internet slang. Teto comes from testosterone and describes bold, direct, action-first energy. Egen comes from estrogen and describes gentle, empathetic, sensitive energy. Here they are just two energy styles, and anyone of any gender can lean either way."
    },
    {
      "q": "How are my type and percentage calculated?",
      "a": "Every answer leans a little or a lot toward teto or egen. Your teto percentage is the share of teto points across your own answers, and how strongly you leaned decides your type. The same answers always give the same result."
    },
    {
      "q": "Is this test scientific?",
      "a": "No, it's just for fun. It doesn't measure hormones, gender or personality in any scientific way. Treat it as a playful mirror and a conversation starter with friends."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers and percentage are calculated in your browser and never stored. We only count, anonymously, which type came up, so we can show how common each one is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Teto or Egen Test",
    "description": "Privacy Policy for the Teto or Egen Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Teto or Egen Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers and your teto/egen percentage are calculated inside your browser and are never sent to or stored on our servers. We only count, anonymously, which result came up, so we can show how common each result is."
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
        "This policy is effective as of October 16, 2026."
      ]
    ],
    "back": "← Back to the Teto or Egen test"
  },
  "questions": [
    {
      "q": "Thirty minutes before you meet, your friend cancels.",
      "choices": [
        "I'm worried. I ask if everything's okay",
        "No problem. I instantly make other plans",
        "I say it's fine, but I'm a little hurt",
        "“Next time, tell me earlier,” then I get on with my day"
      ]
    },
    {
      "q": "The restaurant brings you the wrong dish.",
      "choices": [
        "I call the server over and ask for my order",
        "They look busy, so I quietly eat it",
        "I smile and say this looks great too, so they don't feel bad",
        "I taste it first and only speak up if it's way off"
      ]
    },
    {
      "q": "A whole weekend with zero plans. What do you do?",
      "choices": [
        "A cozy café, a good playlist and a book",
        "Gym, hike or a long run. I need to move",
        "Finally knock out my to-do list",
        "Rewatch a movie that always makes me cry"
      ]
    },
    {
      "q": "A friend tells you about something that's been bothering them.",
      "choices": [
        "I listen to the end and nod along",
        "I jump straight to how to fix it",
        "I feel it with them, and maybe tear up too",
        "I hear them out, then give honest advice"
      ]
    },
    {
      "q": "Your friend group is planning a trip.",
      "choices": [
        "I collect everyone's ideas and help us decide fast",
        "I make sure everyone's happy with the plan",
        "I take charge and build the whole itinerary",
        "I happily go wherever everyone wants"
      ]
    },
    {
      "q": "Your texting style is…",
      "choices": [
        "“k” “on my way” Short and to the point",
        "Lots of emojis, hearts and exclamation marks!!",
        "Clear and tidy, only what needs saying",
        "Normal sentences plus one cute emoji"
      ]
    },
    {
      "q": "Someone cuts in front of you in line.",
      "choices": [
        "Maybe they're in a rush. I let it go",
        "I quietly let the staff know",
        "I tell them right away: “The line starts back there”",
        "I grumble inside but say nothing"
      ]
    },
    {
      "q": "It's your best friend's birthday. Your gift is…",
      "choices": [
        "Something pretty that matches their taste",
        "A handwritten letter and a gift full of memories",
        "I ask what they need and get exactly that",
        "Something practical they'll use every day"
      ]
    },
    {
      "q": "You made a big mistake today.",
      "choices": [
        "Shake it off and try again right away",
        "Call a friend and talk it through",
        "Figure out what went wrong and make a plan",
        "Feel it fully: write it down and have a quiet night"
      ]
    },
    {
      "q": "Karaoke night with friends.",
      "choices": [
        "I pick a heartfelt ballad and pour my feelings into it",
        "One upbeat song, then I happily pass the mic",
        "I grab the mic and get the whole room going",
        "I clap, cheer and hype up everyone else"
      ]
    },
    {
      "q": "Movie night. You pick…",
      "choices": [
        "A twisty crime mystery",
        "A sweet romantic comedy",
        "An emotional drama that makes me cry",
        "Explosions, car chases, pure action"
      ]
    },
    {
      "q": "Which line sounds most like you?",
      "choices": [
        "“It's okay to take it slow”",
        "“Let's just do it”",
        "“I know how you feel”",
        "“I'll let the results talk”"
      ]
    }
  ],
  "types": {
    "boldteto": {
      "name": "Blazing Teto",
      "word": "blazing",
      "vibe": "Full speed ahead. Decides fast, acts faster.",
      "desc": "You don't wait for the perfect moment; you make it. When something needs doing, you're already halfway there while others are still talking about it. You say what you think, you keep your promises and you love a good challenge. People rely on your energy when things get stuck, and your honesty, even when it's a little blunt, is one of the kindest things about you.",
      "strengths": [
        "Quick, clear decisions",
        "Brave and straightforward",
        "Gets things moving"
      ],
      "weakness": "Sometimes you charge ahead before checking if everyone is ready to follow.",
      "tip": "Before you go full speed, ask one question: “How are you feeling about this?” It makes your fire warmer, not weaker."
    },
    "softteto": {
      "name": "Steady Teto",
      "word": "steady",
      "vibe": "Calm, reliable strength people lean on.",
      "desc": "You have teto energy, but you don't need to shout about it. You're the quiet, solid one: you keep your word, stay calm when plans fall apart and quietly fix what's broken. You'd rather show you care by doing something useful than by giving a speech. Friends call you when they need someone dependable, and you always pick up.",
      "strengths": [
        "Dependable and consistent",
        "Calm under pressure",
        "Practical problem-solver"
      ],
      "weakness": "You keep your own feelings so tidy that people forget to ask how you are.",
      "tip": "Let someone help you once in a while. Being relied on feels even better when it goes both ways."
    },
    "tetoegen": {
      "name": "Teto Shell, Egen Heart",
      "word": "shell",
      "vibe": "Bold on the outside, soft on the inside.",
      "desc": "At first glance you look confident and direct: you speak up, you get things done and you don't seem easily shaken. But the people close to you know the secret. Underneath, you're thoughtful and sensitive, and you notice far more than you let on. You might replay a conversation all night or quietly remember the little things a friend once mentioned. That mix of strong and tender is your charm.",
      "strengths": [
        "Confident yet caring",
        "Reads the room well",
        "Loyal to your people"
      ],
      "weakness": "You hide the soft side so well that you sometimes carry hurt alone.",
      "tip": "Show your soft side to one trusted person. It won't make you look less strong."
    },
    "switch": {
      "name": "The Plot Twist",
      "word": "plot twist",
      "vibe": "Full teto one minute, full egen the next.",
      "desc": "Nobody can predict you, and that's what makes you fun. You can lead the group with total confidence in the morning and cry at a movie trailer by night. You don't do “a little bit”: when you go teto, you go all in, and when you go egen, you feel everything. Friends love that you can be their hype person and their comfort person, depending on what the moment needs.",
      "strengths": [
        "Adapts to any situation",
        "Big energy in both directions",
        "Never boring"
      ],
      "weakness": "Your switches can surprise people who only know one side of you.",
      "tip": "Tell friends which mode you're in today. A quick heads-up saves a lot of confusion."
    },
    "balance": {
      "name": "Golden Balance",
      "word": "golden",
      "vibe": "Not too much, not too little. Just right.",
      "desc": "You sit right in the sweet spot between teto and egen. You can take charge when it's needed and step back when someone else should shine. You rarely go to extremes, which makes you easy to be around and great at keeping the peace. People trust your judgment because you see both sides, and you can turn an argument into a calm conversation.",
      "strengths": [
        "Sees both sides",
        "Calm and fair",
        "Easy to get along with"
      ],
      "weakness": "Staying in the middle can make big decisions take a while.",
      "tip": "When you're stuck between two options, pick the one that excites you a little more. You can't go far wrong."
    },
    "egenteto": {
      "name": "Egen Shell, Teto Heart",
      "word": "shell",
      "vibe": "Sweet on the outside, tough on the inside.",
      "desc": "People meet you and think “so gentle, so kind”, and they're right. But they often miss your core of steel. When something really matters, you can be stubborn, brave and surprisingly direct. You'll comfort a friend with a soft voice, then calmly tell the person who hurt them exactly what you think. That quiet backbone is your secret strength.",
      "strengths": [
        "Kind but firm",
        "Surprising inner strength",
        "Stands up for others"
      ],
      "weakness": "People underestimate you at first, and it can be tiring to keep proving them wrong.",
      "tip": "You don't have to choose between kind and strong. Saying “no” gently is still saying no."
    },
    "softegen": {
      "name": "Cozy Egen",
      "word": "cozy",
      "vibe": "A warm blanket in human form.",
      "desc": "Being around you just feels comfortable. You're a great listener, you remember what people like and you have a gift for making any space feel calm and safe. You don't need to be the loudest one in the room; your kindness speaks for itself. You enjoy small happy things, like a warm drink, a soft playlist or a long chat, and you share that coziness with everyone around you.",
      "strengths": [
        "Wonderful listener",
        "Warm and comforting",
        "Notices the little things"
      ],
      "weakness": "You say yes to everyone, even when you're running on empty.",
      "tip": "Put yourself on your own care list. Rest is not something you have to earn."
    },
    "boldegen": {
      "name": "Full-Heart Egen",
      "word": "full-heart",
      "vibe": "Feels everything, deeply and beautifully.",
      "desc": "Your heart is wide open. A sad song, a kind stranger or a friend's good news can move you instantly, and you're not afraid to show it. You understand people on a level that's hard to explain, and you often know someone is upset before they say a word. Your empathy, creativity and sense of beauty make the world around you softer and more colourful.",
      "strengths": [
        "Deep empathy",
        "Creative and expressive",
        "Makes people feel understood"
      ],
      "weakness": "You can soak up other people's moods like a sponge and end up drained.",
      "tip": "After caring for everyone, take a quiet moment just for yourself. Your heart needs recharging too."
    }
  }
};
