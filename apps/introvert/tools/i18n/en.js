/* Introvert or Extrovert Test (en)
 * 8 result ids (recharger, teapot, observer, chameleon, host, cheer, connector, butterfly); questions[i].choices[j] follow introvert-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: recharge solo/people, circle close/wide, voice inward/outward;
 *  side 0 = the introvert side, side 1 = the extrovert side). This is a spectrum of social energy — never use personality-type letter codes or brand names of other type systems.
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own introvert/extrovert bar ({n}) and the real server share ({pct}).
 * Honesty: just for fun — not a clinical assessment or diagnosis.
 * Placeholders: {name} {emoji} {vibe} {pct} {n}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Introvert Extrovert Test – Where Does Your Energy Come From?",
    "description": "Free introvert extrovert test: 12 everyday situations, 2 minutes, no sign-up. See where you sit on the social energy spectrum and your energy character.",
    "ogTitle": "Introvert or Extrovert Test ⚡ Where does your energy come from?",
    "ogDescription": "Twelve quick everyday situations. See your own introvert/extrovert balance and meet your social energy character. A fun quiz, not a clinical assessment."
  },
  "siteName": "Introvert Extrovert Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "⚡ A social energy quiz",
    "h1Kicker": "Introvert Extrovert Test",
    "h1Html": "Quiet night in or big night out?<br>Where does your <em>energy</em> come from?",
    "hook": "Some people recharge on the sofa, others in a crowd, and most of us are somewhere in between. Answer twelve everyday situations and see your own spot on the introvert–extrovert spectrum, plus the social energy character that fits you.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "💭 12 questions",
    "start": "Start the test →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Measuring your social battery…",
    "sub": "Counting quiet nights and loud ones"
  },
  "result": {
    "title": "My social energy type: {name}",
    "metaDesc": "Introvert extrovert test result: {name}. {vibe} See your strengths, tips, your best match and your opposite type.",
    "eyebrow": "Your social energy type is…",
    "ieTitle": "Your introvert / extrovert balance",
    "ieIntro": "Introvert side",
    "ieExtro": "Extrovert side",
    "ieNote": "Calculated from your own twelve answers: recharging alone, a close circle and thinking before speaking count toward the introvert side; the opposite choices count toward the extrovert side.",
    "pctFmt": "{n}%",
    "leanIntro": "Your answers lean toward the introvert side.",
    "leanExtro": "Your answers lean toward the extrovert side.",
    "leanAmbi": "You’re right in the ambivert zone, drawing energy from both sides.",
    "traitsLabel": "Your strengths",
    "tipsLabel": "Tips for you",
    "perfectLabel": "Your perfect day",
    "bestLabel": "Best match",
    "rivalLabel": "Opposite type",
    "disclaimer": "Just for fun! This quiz is for fun, not a clinical assessment. It looks at a few everyday social habits and cannot diagnose anything. Introversion and extroversion are a spectrum, and most people move along it depending on the day.",
    "sameShare": "{pct}% of people got this result",
    "shareText": "My social energy type is {name} {emoji} “{vibe}” Are you more introvert or extrovert?",
    "ctaStrong": "A friend shared their social energy type",
    "ctaSub": "Introvert, extrovert or in between? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My social energy type",
    "brand": "⚡ Introvert Extrovert Test",
    "defaultKicker": "A social energy quiz",
    "defaultTitle": "Introvert or extrovert?",
    "defaultDesc": "12 situations · 2 minutes · your own balance"
  },
  "faq": [
    {
      "q": "What is the difference between an introvert and an extrovert?",
      "a": "It is mostly about energy. People on the introvert side tend to recharge with quiet and time alone, while people on the extrovert side tend to feel energized by company and activity. It is not the same as being shy or outgoing, and it says nothing about how kind or capable you are."
    },
    {
      "q": "What is an ambivert?",
      "a": "An ambivert sits near the middle of the spectrum and can enjoy both busy and quiet time, depending on the day. Many people fall somewhere in this middle zone, which is why your result shows your own balance bar and not just a single label."
    },
    {
      "q": "How is my result chosen?",
      "a": "Each situation looks at one of three habits: how you recharge, whether you prefer a close circle or a wide one, and whether you think before speaking or think out loud. The combination of the three picks your type, and the same answers always give the same result."
    },
    {
      "q": "Where does the introvert/extrovert percentage come from?",
      "a": "It is calculated only from your own answers. Every choice adds a little to the introvert side or the extrovert side, and stronger answers count a bit more. It is not compared with anyone else."
    },
    {
      "q": "Is this a clinical assessment?",
      "a": "No. This quiz is for fun, not a clinical assessment or diagnosis. Your answers are calculated in your browser and are not stored; we only count anonymously which result came up."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Introvert or Extrovert Test",
    "description": "Privacy Policy for the Introvert or Extrovert Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Introvert or Extrovert Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers are calculated inside your browser and are never sent to or stored on our servers. We only count, anonymously, which result came up, so we can show how common each result is."
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
        "This policy is effective as of November 10, 2026."
      ]
    ],
    "back": "← Back to the Introvert or Extrovert Test"
  },
  "questions": [
    {
      "q": "It’s Friday night after a long, busy week. What sounds best?",
      "choices": [
        "Phone on silent, a blanket and a show. Just me",
        "A quick dinner with one or two friends, then home",
        "Text the group: who’s out tonight? I need people!",
        "A quiet night in, maybe a short call with someone close"
      ]
    },
    {
      "q": "Your birthday is coming up. How do you want to celebrate?",
      "choices": [
        "A big party. Invite everyone, friends of friends welcome",
        "Dinner with my two or three closest people",
        "A small get-together with a handful of good friends",
        "A relaxed hangout with people from different parts of my life"
      ]
    },
    {
      "q": "In a meeting or class, someone asks: “Any ideas?” You…",
      "choices": [
        "Wait a moment, then share once my thought is clear",
        "Jump in right away and figure it out as I talk",
        "Stay quiet and send my idea later, properly written out",
        "Toss out a rough idea and build on what others say"
      ]
    },
    {
      "q": "The day after a big party or wedding, you feel…",
      "choices": [
        "A bit tired, but happy to meet a friend for coffee",
        "Completely drained. I need a whole day alone to recover",
        "Fine, but I’ll keep the day calm and quiet",
        "Still buzzing. Who wants to hang out again?"
      ]
    },
    {
      "q": "You’re at a party where you only know the person who invited you. You…",
      "choices": [
        "Find one interesting person and talk to them most of the night",
        "Introduce myself around. By the end I know half the room",
        "Join a group conversation and meet a few new people",
        "Stay close to the person I know, or help out in the kitchen"
      ]
    },
    {
      "q": "You’re alone in an elevator with a neighbor you barely know. You…",
      "choices": [
        "Start chatting about the weather, the building, anything",
        "Say hi and make a small comment",
        "Smile and nod, then watch the floor numbers",
        "Quietly hope neither of us has to say anything"
      ]
    },
    {
      "q": "You spend a whole free day alone at home. By evening you feel…",
      "choices": [
        "Nicely rested, though a short chat would be nice",
        "Perfect. Fully recharged, I could do this again tomorrow",
        "Restless. I was texting people by lunchtime",
        "Okay, but I’d rather have had someone around"
      ]
    },
    {
      "q": "What do your group chats look like?",
      "choices": [
        "One or two chats with my closest people, and that’s plenty",
        "Several groups, and I keep up with most of them",
        "A few groups, but I mostly talk in one",
        "So many: work, school, hobbies, old friends, all buzzing"
      ]
    },
    {
      "q": "When something is bothering you, how do you sort it out?",
      "choices": [
        "Talk it over with someone. It gets clearer as I talk",
        "Think it through first, then maybe share it",
        "Call a friend right away and talk until it makes sense",
        "Write it down or think quietly until I’ve worked it out"
      ]
    },
    {
      "q": "A friend texts at 6 p.m.: “Want to go out tonight?” You…",
      "choices": [
        "Yes! I’m already getting ready",
        "Maybe, if it’s low-key and not too late",
        "Sure, I’ve got a bit of energy left",
        "Not tonight. My social battery is empty"
      ]
    },
    {
      "q": "It’s your first week in a new club, class or team. You…",
      "choices": [
        "Chat with a few different people each time",
        "Learn everyone’s names and suggest a group hangout",
        "Find one person I click with and stick with them",
        "Slowly get to know a couple of people"
      ]
    },
    {
      "q": "You need to make plans with a friend. You’d rather…",
      "choices": [
        "Text, so I can think about what to say first",
        "Call. It’s faster, and I like hearing their voice",
        "Send a voice message",
        "Text, with a quick call only if needed"
      ]
    }
  ],
  "types": {
    "recharger": {
      "name": "Quiet Recharger",
      "word": "quiet recharger",
      "vibe": "Peace, quiet and a few people you love. You glow brightest after time alone.",
      "keywords": ["Calm", "Thoughtful", "Loyal"],
      "desc": "You know exactly what fills your battery: a quiet evening, your own space and time to think. You keep a small circle of people you truly trust, and with them you are warm, funny and deeply loyal. In conversations you listen first and speak when you have something worth saying, which is why your words carry weight. Busy days are fine, but you need a calm evening afterwards to feel like yourself again. That is not a weakness. It is simply how your energy works.",
      "traits": ["You listen with real attention", "You think before you speak", "You keep friendships for years", "You are comfortable in your own company"],
      "tips": ["Plan your quiet time like any other appointment", "Share one idea out loud before you polish it"],
      "perfect": "A rainy afternoon with a good book, a warm drink and a long message from your best friend."
    },
    "teapot": {
      "name": "Cozy Chatterbox",
      "word": "chatterbox",
      "vibe": "Quiet with the world, a nonstop talker with your favorite people.",
      "keywords": ["Warm", "Funny", "Genuine"],
      "desc": "Strangers might think you are quiet, but your close friends know the truth: once you feel at home, the stories never stop. You recharge in your own space and prefer a few close friends to a big crowd, yet you think out loud and love long, rambling conversations. You are the friend who calls to share one small thing and stays on the line for an hour. People feel relaxed with you because you are honest and easy to talk to. Just make sure you also get the quiet time you need afterwards.",
      "traits": ["You make close friends feel at home", "You tell stories that make people laugh", "You say what you really think", "You keep conversations flowing"],
      "tips": ["Let new people see your chatty side a little earlier", "Protect a quiet evening after a long catch-up"],
      "perfect": "A late-night talk on the sofa with your favorite person and snacks on the table."
    },
    "observer": {
      "name": "Gentle Observer",
      "word": "observer",
      "vibe": "You know lots of people and notice everything, quietly and kindly.",
      "keywords": ["Perceptive", "Easygoing", "Kind"],
      "desc": "You move easily through many different groups, yet you rarely need the spotlight. You enjoy being around people as long as you can step back, watch and listen. Because of that, you notice things others miss: who feels left out, who is tired, who needs a kind word. Friends from very different parts of life all feel they know you. Large events are fun for you in small doses, and afterwards you need quiet time to process everything you saw and heard.",
      "traits": ["You read the mood of a room", "You get along with many kinds of people", "You notice small details", "You stay calm in busy places"],
      "tips": ["Share what you notice. Your insights help others", "Leave events a little early when your battery runs low"],
      "perfect": "A friendly gathering where you can float between conversations, then a quiet walk home."
    },
    "chameleon": {
      "name": "Social Chameleon",
      "word": "chameleon",
      "vibe": "Life of the party one night, happy hermit the next. You adapt to every room.",
      "keywords": ["Flexible", "Expressive", "Balanced"],
      "desc": "You can chat with anyone, think out loud with ease and keep up with a wide circle of friends, but your battery still recharges best at home. That mix makes you a natural ambivert: lively and talkative when you are out, then happily quiet when you need to reset. People are sometimes surprised when you turn down an invitation, but you know your limits. You switch modes so smoothly that you fit in almost anywhere. Your skill is balance, so keep listening to what your energy tells you.",
      "traits": ["You fit into almost any group", "You can talk to anyone", "You know when you need a break", "You bring energy without burning out"],
      "tips": ["Say no to an invitation without feeling guilty", "Tell close friends when you are in quiet mode"],
      "perfect": "A fun night out with friends, followed by a slow, lazy morning all to yourself."
    },
    "host": {
      "name": "Cozy Gatherer",
      "word": "gatherer",
      "vibe": "You love company in small, warm doses: good food, close friends, real talk.",
      "keywords": ["Caring", "Steady", "Welcoming"],
      "desc": "Being with people fills your battery, but you like it cozy rather than loud. A dinner at home, a regular coffee date or a small trip with close friends makes you happiest. You listen carefully, think before you speak and remember what matters to the people you love. Friends know they can always come to you, because you create a calm, welcoming space. Big crowds can feel a bit much, but a table full of familiar faces is your favorite place in the world.",
      "traits": ["You make people feel welcome", "You remember the little things", "You keep friend groups together", "You listen without judging"],
      "tips": ["Let others host now and then so you can relax too", "Try a new group once in a while. You might love it"],
      "perfect": "A long dinner at home with close friends, candles on and nobody checking the time."
    },
    "cheer": {
      "name": "Inner-Circle Cheerleader",
      "word": "cheerleader",
      "vibe": "Loud, loyal and always cheering for your people. Your friends are your energy.",
      "keywords": ["Enthusiastic", "Loyal", "Encouraging"],
      "desc": "You get your energy from people, and you pour it right back into your favorite ones. You prefer a close crew to a huge crowd, and with them you are loud, funny and endlessly supportive. You think out loud, react with your whole face and send voice messages longer than most podcasts. When a friend has good news, you are the first to celebrate. When they have a hard day, you are the first to show up. Remember that it is okay to be cheered on too.",
      "traits": ["You lift people up when they are down", "You celebrate every win", "You keep the group chat alive", "You bring fun to every plan"],
      "tips": ["Ask for support when you need it, not only give it", "Leave a little silence so quieter friends can join in"],
      "perfect": "A road trip with your closest friends, the music loud and everyone singing along."
    },
    "connector": {
      "name": "Calm Connector",
      "word": "connector",
      "vibe": "You know everyone and bring them together, with a calm, thoughtful style.",
      "keywords": ["Trustworthy", "Diplomatic", "Sociable"],
      "desc": "People give you energy, and you know a lot of them. You enjoy meeting new people and keeping in touch with many groups, but you do it in a calm, thoughtful way. You listen, think and then say the right thing, which makes you great at introducing people who should know each other. Others trust you as a bridge between friends, teams and families. You rarely need the spotlight, because seeing people connect is reward enough. Just remember to keep some time for your own closest friendships too.",
      "traits": ["You connect people who should meet", "You stay calm in group discussions", "You keep in touch with many friends", "You choose your words with care"],
      "tips": ["Make time for one-on-one talks with your closest friends", "Share your own opinion even when the group disagrees"],
      "perfect": "A relaxed gathering where you introduce two friends who end up getting along brilliantly."
    },
    "butterfly": {
      "name": "Social Butterfly",
      "word": "butterfly",
      "vibe": "New faces, big plans and endless chats. People are your power source.",
      "keywords": ["Outgoing", "Energetic", "Spontaneous"],
      "desc": "You light up in a crowd. Meeting new people, making plans and chatting about everything gives you more energy than any nap could. Your calendar is full, your phone is always buzzing and you think best when you are talking things through. You make strangers feel like old friends within minutes and bring life to every room. Quiet days can make you restless, but they also help you recharge in a different way. Your warmth is a gift, so share it with the quiet people too.",
      "traits": ["You make friends anywhere", "You bring energy to any event", "You start conversations easily", "You turn ordinary days into plans"],
      "tips": ["Plan one slow evening a week to rest your voice", "Check in one-on-one with friends who don’t like crowds"],
      "perfect": "A festival, a big party or a new city full of people you have not met yet."
    }
  }
};
