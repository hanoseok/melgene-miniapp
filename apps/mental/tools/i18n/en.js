/* Mental Strength Test (en)
 * 8 result ids (silk, ember, pearl, oak, jelly, wave, bamboo, diamond); questions[i].choices[j] follow mental-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: bounce slow/quick, calm stormy/steady, self absorb/trust;
 *  side 0 = the soft side, side 1 = the sturdy side). Results are "materials": none is bad, soft ones get real strengths too.
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own score ({n}) and the real server share ({pct}).
 * Honesty: just for fun — not a clinical assessment or psychological test. No clinical wording in questions.
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
    "title": "Mental Strength Test – How Tough Is Your Mind? (Fun Quiz)",
    "description": "Mental strength test and mental toughness quiz: 12 everyday mini-crises, 2 minutes, no sign-up. Get your own score and the material that matches your mind.",
    "ogTitle": "Mental Strength Test 🛡️ How tough is your mind?",
    "ogDescription": "Twelve everyday mini-crises. Get your own mental strength score and meet the material that matches you. A fun quiz, not a clinical assessment."
  },
  "siteName": "Mental Strength Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🛡️ A mental toughness quiz",
    "h1Kicker": "Mental Strength Test",
    "h1Html": "Missed alarm, harsh words?<br>How <em>tough</em> is your mind?",
    "hook": "Everyone has bad days. Some of us shrug them off by lunch, others need a quiet evening to recover. Face twelve everyday mini-crises and get your own mental strength score, plus the material that matches the way your mind bends, bounces and holds.",
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
    "text": "Testing your mental material…",
    "sub": "Measuring bounce, calm and confidence"
  },
  "result": {
    "title": "My mental material: {name}",
    "metaDesc": "Mental strength test result: {name}. {vibe} See your strengths, tips, recharge ritual, best match and opposite type.",
    "eyebrow": "Your mind is made of…",
    "gaugeTitle": "Your mental strength score",
    "gaugeLow": "Sensitive",
    "gaugeHigh": "Rock-solid",
    "gaugeNote": "Calculated from your own twelve answers: bouncing back quickly, staying calm under pressure and trusting your own judgment raise the score. It is not compared with anyone else.",
    "scoreFmt": "{n}",
    "bandLow": "Your answers show a soft, sensitive side. You feel things deeply, so give yourself extra rest after tough days.",
    "bandMid": "Your answers sit in the balanced zone: you wobble now and then, and you usually find your feet again.",
    "bandHigh": "Your answers show a sturdy mind that stays steady when everyday things go wrong.",
    "traitsLabel": "Your strengths",
    "tipsLabel": "Tips for you",
    "perfectLabel": "Your recharge ritual",
    "bestLabel": "Best match",
    "rivalLabel": "Opposite type",
    "disclaimer": "Just for fun! This quiz is for fun, not a clinical assessment or a psychological test. It looks at a few everyday habits and cannot diagnose anything. If you are going through a hard time, talking to someone you trust or to a professional really helps.",
    "sameShare": "{pct}% of people got this result",
    "shareText": "My mind is made of {name} {emoji} “{vibe}” How tough is yours?",
    "ctaStrong": "A friend shared their mental material",
    "ctaSub": "How tough is your mind? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My mental material",
    "brand": "🛡️ Mental Strength Test",
    "defaultKicker": "A mental toughness quiz",
    "defaultTitle": "How tough is your mind?",
    "defaultDesc": "12 mini-crises · 2 minutes · your own score"
  },
  "faq": [
    {
      "q": "What does mental strength mean in this test?",
      "a": "Here it means three everyday habits: how quickly you bounce back after a bad moment, how calm you stay when things go wrong, and how much you trust your own judgment when others criticize you. It is not about being cold or never feeling upset."
    },
    {
      "q": "How is my result chosen?",
      "a": "Each situation looks at one of the three habits. The combination of the three picks the material that matches you, and the same answers always give the same result."
    },
    {
      "q": "Where does my mental strength score come from?",
      "a": "It is calculated only from your own answers. Every choice adds a little to the soft side or the sturdy side, and stronger answers count a bit more. It is not compared with anyone else."
    },
    {
      "q": "Is a low score a bad thing?",
      "a": "Not at all. A softer score often goes with empathy, care and noticing things others miss. Every material has strengths, and habits like rest, routines and kind self-talk can make anyone feel steadier over time."
    },
    {
      "q": "Is this a clinical or psychological assessment?",
      "a": "No. This quiz is for fun, not a clinical assessment or a psychological test, and it cannot diagnose anything. Your answers are calculated in your browser and are not stored; we only count anonymously which result came up."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Mental Strength Test",
    "description": "Privacy Policy for the Mental Strength Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Mental Strength Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 14, 2026."
      ]
    ],
    "back": "← Back to the Mental Strength Test"
  },
  "questions": [
    {
      "q": "Yesterday was a truly awful day. The next morning…",
      "choices": [
        "It still hangs over me. I need a few days to shake it off",
        "I’m a bit gloomy at breakfast, but fine by lunch",
        "New day, clean slate. I barely think about it",
        "I’m okay, but it keeps replaying in my head"
      ]
    },
    {
      "q": "Your alarm didn’t go off. You have 20 minutes to get out the door. You…",
      "choices": [
        "Take a deep breath, make a quick plan and leave on time",
        "Panic completely, run in circles and forget my keys",
        "Feel my heart racing, but get ready, a little messily",
        "Grumble, text that I might be a few minutes late and hurry"
      ]
    },
    {
      "q": "You show up with a new haircut. A friend says: “Hmm… interesting.” You…",
      "choices": [
        "Laugh it off, but check the mirror a few extra times",
        "Don’t mind. I like it, and that’s what counts",
        "Start looking up how fast hair grows back",
        "Ask what they mean, but stay happy with it"
      ]
    },
    {
      "q": "Plans you were really looking forward to get canceled at the last minute.",
      "choices": [
        "Disappointed for an hour, then I find something else to do",
        "It ruins my mood for the whole weekend",
        "I sulk on the sofa for the rest of the evening",
        "Oh well! I text someone else or enjoy a free night"
      ]
    },
    {
      "q": "Right before your presentation, your laptop suddenly dies. You…",
      "choices": [
        "Feel my hands shake, but try to talk without slides",
        "Stay calm, borrow a laptop and open my backup file",
        "Take a second, then present from memory as best I can",
        "Go blank. Everything I prepared is suddenly gone"
      ]
    },
    {
      "q": "Your boss or teacher hands back your work covered in red notes. You…",
      "choices": [
        "Take what’s useful and keep my confidence",
        "Feel a sting, but know I’m still good at this",
        "Fix everything, but start doubting myself a little",
        "Replay every comment all night. Maybe I’m just bad at this"
      ]
    },
    {
      "q": "Something you worked hard on fails spectacularly: the cake collapses, the test goes badly. You…",
      "choices": [
        "Stay quiet for the rest of the day, then try again later",
        "Don’t want to try that again for a long time",
        "Laugh, take a photo and try again tomorrow",
        "Groan, grab a snack, take a short walk and feel fine"
      ]
    },
    {
      "q": "On the way to an important appointment, your train stops between stations. You…",
      "choices": [
        "Check the time every ten seconds, my stomach in knots",
        "Feel a bit tense, but message ahead and wait",
        "Keep sighing and refreshing the train app",
        "Shrug, put on music and let them know I’ll be late"
      ]
    },
    {
      "q": "You share an idea in the group chat. Nobody replies for an hour. You think…",
      "choices": [
        "“A bit awkward, but they’re probably just busy”",
        "“Did that sound weird?” and reread my message",
        "Nothing much. I still think it’s a good idea",
        "“They must think it’s dumb.” I want to delete it"
      ]
    },
    {
      "q": "You lose badly at a game night with friends. You…",
      "choices": [
        "Laugh and immediately demand a rematch",
        "Smile, but it bugs me a little on the way home",
        "Feel annoyed for one round, then let it go",
        "Honestly keep thinking about it for days"
      ]
    },
    {
      "q": "Three deadlines suddenly land on the same day. You…",
      "choices": [
        "Feel stressed, but make a list and get going",
        "Set priorities and do one thing at a time. I’ve got this",
        "Freeze and scroll my phone because it all feels like too much",
        "Jump between tasks a bit chaotically, but get there"
      ]
    },
    {
      "q": "You’re making a big decision and everyone has an opinion. You…",
      "choices": [
        "Ask everyone and change my mind after each conversation",
        "Listen, then follow my gut. It’s my life",
        "Take their advice on board, but make the final call myself",
        "Lean toward what most people think is best"
      ]
    }
  ],
  "types": {
    "silk": {
      "name": "Silk Thread",
      "word": "silk",
      "vibe": "Soft to the touch and quick to feel everything, yet stronger than anyone expects.",
      "keywords": ["Sensitive", "Caring", "Perceptive"],
      "desc": "You feel things deeply. A sharp comment, a canceled plan or a chaotic morning can stay with you for a while, and you need quiet time to smooth yourself out again. But that same sensitivity is what makes you so good with people: you notice moods, remember small details and know exactly what a friend needs to hear. Like silk, you look delicate, yet you hold together far better than people think. The trick is to treat yourself as gently as you treat others.",
      "traits": ["You sense how others feel", "You are kind without being asked", "You notice details others miss", "You hold on even when it is hard"],
      "tips": ["Give yourself a calm evening after a rough day, without guilt", "Write down one thing you did well each night"],
      "perfect": "A warm bath, soft music and a long chat with the one friend who always gets you."
    },
    "ember": {
      "name": "Glowing Ember",
      "word": "ember",
      "vibe": "You flare up fast and cool down slowly, but your own inner fire never goes out.",
      "keywords": ["Passionate", "Honest", "Determined"],
      "desc": "When something goes wrong, you feel it with your whole body: sparks fly, and the heat can last a while. Yet underneath the flames there is a steady glow of self-belief. Criticism does not change who you are, and you rarely let other people decide what you are worth. You care intensely about the things that matter to you, which makes you a loyal friend and a fierce supporter. Your growth area is letting the heat settle before you react, so your fire warms instead of burns.",
      "traits": ["You know what you stand for", "You fight for the people you love", "You speak honestly", "You keep going after setbacks"],
      "tips": ["Count to ten, or take a walk, before you reply", "Let a bad day end at midnight instead of carrying it over"],
      "perfect": "A long run or a loud playlist in the car, then a calm cup of tea at home."
    },
    "pearl": {
      "name": "Quiet Pearl",
      "word": "pearl",
      "vibe": "Calm and polished on the outside, quietly turning every grain of trouble into something beautiful.",
      "keywords": ["Calm", "Gentle", "Reflective"],
      "desc": "People admire how composed you look in a crisis, and you really are good at keeping your head. On the inside, though, you take words to heart and need time to process them. Instead of throwing them back, you wrap them in layer after layer of thought, the way a pearl forms around a grain of sand. That makes you wise, patient and very easy to trust. Just remember that your own opinion deserves as much respect as anyone else’s.",
      "traits": ["You stay calm when others panic", "You think before you react", "You learn from every experience", "You are a safe person to talk to"],
      "tips": ["Say what you think out loud, even if it is not polished yet", "Ask yourself what you believe before asking others"],
      "perfect": "A slow walk by the water, a notebook and an afternoon with nowhere to be."
    },
    "oak": {
      "name": "Old Oak",
      "word": "oak",
      "vibe": "Deep roots and a steady trunk. Storms shake your branches, never your core.",
      "keywords": ["Steady", "Grounded", "Reliable"],
      "desc": "You do not panic easily, and you trust your own judgment even when everyone around you has a different opinion. When a real storm hits, you may need time to grow back the leaves you lost, because you take setbacks seriously. But your roots are deep, and people lean on you precisely because you do not bend with every gust of wind. You are the friend who stays calm at the airport when the flight is canceled. Make sure you let others shelter you sometimes too.",
      "traits": ["You stay calm in chaos", "You trust your own judgment", "You are someone people rely on", "You keep your promises"],
      "tips": ["Admit when something hurt, instead of just pushing through", "Try something new without needing it to be perfect"],
      "perfect": "A quiet morning in nature, a good breakfast and a day with no surprises."
    },
    "jelly": {
      "name": "Wobbly Jelly",
      "word": "jelly",
      "vibe": "You wobble a lot when life pokes you, but you always spring back into shape.",
      "keywords": ["Bouncy", "Open", "Lovable"],
      "desc": "Little things can shake you: a late train, a strange look, a comment you were not expecting. You wobble, you worry, maybe you ask a friend for reassurance. And then, surprisingly fast, you are back to your cheerful self. That bounce is your superpower. You are open about your feelings, easy to be around and rarely hold a grudge. As you collect more proof that you always recover, the wobbles will get smaller, so keep track of how often you have already bounced back.",
      "traits": ["You are back on your feet in no time", "You are open about your feelings", "You forgive easily", "You bring lightness to a room"],
      "tips": ["Before you ask others, ask yourself what you think", "Pause and breathe slowly when panic starts"],
      "perfect": "A funny movie, a sweet treat and a friend who laughs at all the same things."
    },
    "wave": {
      "name": "Rolling Wave",
      "word": "wave",
      "vibe": "You crash loudly, then rise again in seconds, always heading in your own direction.",
      "keywords": ["Lively", "Bold", "Resilient"],
      "desc": "When something goes wrong, everyone knows it: you react quickly and loudly. But just as quickly, the wave rolls back and you are ready for the next one. You believe in yourself, you do not take criticism too personally and you rarely stay down for long. That energy makes you exciting to be around and great in a crisis that needs fast action. Your challenge is the moment before the crash: a few seconds of calm can save you, and the people near you, a lot of splashing.",
      "traits": ["You bounce back fast", "You believe in your own ideas", "You take action quickly", "You make life exciting"],
      "tips": ["Breathe out slowly before reacting to bad news", "Check in on friends who need longer to recover than you"],
      "perfect": "A swim, a dance or a bike ride, anything that lets all that energy move."
    },
    "bamboo": {
      "name": "Bending Bamboo",
      "word": "bamboo",
      "vibe": "You bend with every wind and spring right back, calm, flexible and growing fast.",
      "keywords": ["Flexible", "Calm", "Open-minded"],
      "desc": "Pressure does not easily knock you over, and bad moments rarely stick to you. You stay calm, adapt and get back up. You also listen closely to what others say, sometimes a bit too closely: feedback can make you bend far before you decide what you really think. That openness is a strength, because you learn quickly and grow fast. Just remember that the strongest bamboo still has deep roots. Your own voice deserves a place in every decision.",
      "traits": ["You adapt to change easily", "You stay calm under pressure", "You learn from feedback", "You recover quickly"],
      "tips": ["Decide what you think before asking for opinions", "Say no now and then, just to practice"],
      "perfect": "A peaceful morning stretch, green tea and a tidy desk with a clear plan for the day."
    },
    "diamond": {
      "name": "Bright Diamond",
      "word": "diamond",
      "vibe": "Pressure only makes you shine. Calm, quick to recover and sure of yourself.",
      "keywords": ["Tough", "Confident", "Composed"],
      "desc": "Missed alarms, harsh feedback, canceled plans: you take them in stride. You stay calm when things go wrong, bounce back quickly and trust your own judgment, so it takes a lot to scratch your surface. People often come to you when they need someone steady. Your challenge is a gentle one: being tough does not mean you have to handle everything alone, and feelings are not a weakness. Even a diamond needs polishing, so let people support you now and then.",
      "traits": ["You stay calm in a crisis", "You recover quickly from setbacks", "You trust yourself", "You steady the people around you"],
      "tips": ["Be patient with friends who need more time to recover", "Share a worry now and then instead of hiding it"],
      "perfect": "A challenge you have been looking forward to, followed by a well-earned lazy evening."
    }
  }
};
