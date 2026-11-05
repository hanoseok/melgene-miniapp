/* Christmas Personality Test (en)
 * 8 result ids (star, reindeer, bell, candy, candle, cookie, snowman, snowflake); questions[i].choices[j] follow xmastype-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: energy sparkle/cozy, style classic/playful, focus heart/spark).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Just for fun — not a psychological test or diagnosis.
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Christmas Personality Test – What’s Your Holiday Spirit?",
    "description": "Free Christmas personality test: 12 quick holiday-season questions, about 2 minutes, no sign-up. Find the festive character that matches you and your best match.",
    "ogTitle": "Christmas Personality Test 🎄 What’s your holiday spirit?",
    "ogDescription": "Twelve quick questions about parties, gifts, plans and cozy nights. Find the festive character that matches your personality."
  },
  "siteName": "Christmas Personality Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎄 A festive personality quiz",
    "h1Kicker": "Christmas Personality Test",
    "h1Html": "What’s your<br><em>holiday</em> spirit?",
    "hook": "Some people live for the big party, others for a quiet night with the lights on. Answer twelve quick questions about the holiday season and unwrap the festive character that matches you, plus who you get along with best.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🎁 12 questions",
    "start": "Unwrap my result →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Unwrapping your result…",
    "sub": "Shaking the box, reading the tag"
  },
  "result": {
    "title": "My Christmas personality: {name}",
    "metaDesc": "Christmas personality test result: {name}. {vibe} See your holiday traits, your perfect holiday, your best match and your playful rival.",
    "eyebrow": "Your Christmas personality is…",
    "traitsLabel": "What makes you you",
    "perfectLabel": "Your perfect holiday",
    "bestLabel": "Best match",
    "rivalLabel": "Playful rival",
    "disclaimer": "Just for fun! This quiz is not a psychological test or diagnosis. Everyone has a little of every holiday spirit, so enjoy your result as a festive conversation starter.",
    "sameShare": "{pct}% of people got this result",
    "shareText": "My Christmas personality is {name} {emoji} “{vibe}” What’s yours?",
    "ctaStrong": "A friend shared their Christmas personality",
    "ctaSub": "Which one are you? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My Christmas personality",
    "brand": "🎄 Christmas Personality Test",
    "defaultKicker": "A festive personality quiz",
    "defaultTitle": "What’s your holiday spirit?",
    "defaultDesc": "12 questions · 2 minutes · your festive character"
  },
  "faq": [
    {
      "q": "How is my result chosen?",
      "a": "Each question looks at one side of your holiday personality: how you like to spend your energy, whether you love traditions or surprises, and whether you shine most by caring for others or by following your own adventures. The combination of those three sides picks your result, and the same answers always give the same result."
    },
    {
      "q": "Is this a real psychological test?",
      "a": "No. It is a light-hearted quiz for fun, not a psychological assessment or diagnosis. Most people have a bit of every holiday mood in them, so enjoy your result and compare it with friends."
    },
    {
      "q": "What do the best match and the playful rival mean?",
      "a": "Your best match shares your taste but balances your energy, so you make a great team. Your playful rival sees the holidays in the opposite way on every side. That is often the friend who surprises you the most."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which result came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Christmas Personality Test",
    "description": "Privacy Policy for the Christmas Personality Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Christmas Personality Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 6, 2026."
      ]
    ],
    "back": "← Back to the Christmas Personality Test"
  },
  "questions": [
    {
      "q": "A friend texts: “Holiday party at my place on Friday!” You…",
      "choices": [
        "Reply “I’m in!” and ask who else is coming",
        "Go, but plan to slip out a bit early",
        "Suggest a small dinner with just a few of us instead",
        "Go and chat with whoever I end up next to"
      ]
    },
    {
      "q": "When do your holiday decorations go up?",
      "choices": [
        "Whenever the mood hits. Some years it’s just fairy lights on a plant",
        "The same weekend every year. It’s a ritual",
        "Around the usual time, more or less",
        "Late, and then I go all out in one evening"
      ]
    },
    {
      "q": "Gift shopping time. What’s your approach?",
      "choices": [
        "I ask around for hints so they get something they’ll use",
        "I make something myself or find something nobody else would think of",
        "I keep a list all year of things people said they wanted",
        "I pick what I’d love to get myself"
      ]
    },
    {
      "q": "It’s the first snow of the season! You…",
      "choices": [
        "Take a photo from the window, then back under the blanket",
        "Text the group chat: snowball fight, right now!",
        "Head out for a walk and see who’s around",
        "Make a hot drink and watch it fall in peace"
      ]
    },
    {
      "q": "What’s on the menu for your holiday dinner?",
      "choices": [
        "Mostly the classics, maybe one new side dish",
        "Something totally new. Hot pot? Tacos? Why not!",
        "The classics, but with a fun twist",
        "Exactly the family recipes. That’s the whole point"
      ]
    },
    {
      "q": "You have a free afternoon in December. You…",
      "choices": [
        "Try something new, like ice skating or a workshop",
        "Wander around the shops alone with music on",
        "Check if anyone wants to hang out",
        "Help a friend wrap gifts or decorate. It’s more fun together"
      ]
    },
    {
      "q": "A holiday song starts playing in a café. You…",
      "choices": [
        "Tap along and hum a little",
        "Sing along out loud. Someone has to start it",
        "Enjoy it in my head. Nobody needs to know",
        "Smile to myself and keep doing my thing"
      ]
    },
    {
      "q": "Your December calendar looks like…",
      "choices": [
        "Planned weeks ago and color-coded",
        "A few plans and a lot of “let’s see”",
        "The big dates are set, the rest is flexible",
        "Blank. The best nights are never planned"
      ]
    },
    {
      "q": "Your favorite part of the holidays is…",
      "choices": [
        "Finally having time for my own hobbies",
        "Catching up with people I haven’t seen in a while",
        "A trip, a new place or a brand-new experience",
        "Everyone I love around one table"
      ]
    },
    {
      "q": "It’s festive sweater day at work or school. You…",
      "choices": [
        "Wear a nice normal sweater and cheer the others on",
        "Wear something festive, but not too wild",
        "Add one tiny festive pin. That counts, right?",
        "Lights, tinsel and a pom-pom hat. Go big or go home"
      ]
    },
    {
      "q": "Holiday game night! What do you want to play?",
      "choices": [
        "Whatever new game someone brought",
        "Let’s make up our own game with silly rules!",
        "The same game we play every year. Tradition!",
        "A classic, maybe with a house rule or two"
      ]
    },
    {
      "q": "A new year is coming. What do you wish for most?",
      "choices": [
        "That the people I love are happy and healthy",
        "To go somewhere or learn something completely new",
        "To finally finish a project of my own",
        "More time with friends and family"
      ]
    }
  ],
  "types": {
    "star": {
      "name": "Tree-Top Star",
      "word": "tree-top star,tree topper",
      "vibe": "You light up the room and bring everyone together, every single year.",
      "keywords": ["Warm host", "Reliable", "Radiant"],
      "desc": "You are the one who makes the holidays happen. You send the group invite, keep the family traditions alive and make sure nobody spends the season alone. People come to you when they want it to feel like the holidays, and nothing makes you happier than a full table of smiling faces. Sometimes you carry a little too much, because you want every detail to be right for everyone. Let others hang a few decorations too. The glow is still yours.",
      "traits": ["You plan the get-together before anyone else thinks of it", "You keep the traditions everyone secretly loves", "You notice who is missing and invite them", "You can talk with anyone at the party"],
      "perfect": "A big dinner where every chair is taken and someone asks you to give the toast."
    },
    "reindeer": {
      "name": "Trusty Reindeer",
      "word": "reindeer",
      "vibe": "Full of energy and always on the move, you get things done and get everyone there on time.",
      "keywords": ["Energetic", "Dependable", "Go-getter"],
      "desc": "You are the engine of the season. You plan the route, carry the bags, book the tickets and still have energy for a winter hike or a night out. You like a good plan and you love a challenge, so the busiest month of the year is your time to shine. Friends know you will show up and make things happen. Just remember that the holidays are not a race. A slow morning with no to-do list can recharge you better than anything.",
      "traits": ["Your December has a plan, and the plan works", "You turn errands into a mini adventure", "You keep going when everyone else is tired", "You love an active day out in the cold"],
      "perfect": "A winter trip packed with things to see, followed by a well-earned feast."
    },
    "bell": {
      "name": "Jingle Bell",
      "word": "jingle bell,bell",
      "vibe": "Wherever you go, laughter follows. You turn any moment into a celebration.",
      "keywords": ["Cheerful", "Playful", "Friendly"],
      "desc": "You are pure holiday cheer. You start the sing-along, send the funniest messages to the group chat and can make a gloomy winter afternoon feel like a party. You do not need a big plan. A good mood and good people are enough. Everyone feels welcome around you, because your joy is about sharing, not showing off. On quieter days you may feel a little restless, so keep a few small surprises ready for yourself too.",
      "traits": ["You are the first to turn the music on", "You make strangers feel like old friends", "You love last-minute plans with your crew", "Your laugh is easy to recognize across the room"],
      "perfect": "A spontaneous party with friends, silly games and songs until late at night."
    },
    "candy": {
      "name": "Candy Cane",
      "word": "candy cane",
      "vibe": "Sweet with a twist. You keep life exciting with surprises and a little mischief.",
      "keywords": ["Playful", "Bold", "Surprising"],
      "desc": "You are sweet, but never boring. You are the one who suggests the new restaurant, the odd gift that turns out perfect or the late-night walk to see the lights. You love trying new things, and you add a fun, slightly cheeky twist to every tradition. People enjoy your company because they never know what you will come up with next. Sometimes your plans change faster than others can follow, so give your friends a little warning before the next big idea.",
      "traits": ["You put a twist on every tradition", "You are always up for something new", "Your gifts are unexpected and unforgettable", "You say yes first and plan later"],
      "perfect": "A surprise trip to a city you have never seen, with snow, lights and street food."
    },
    "candle": {
      "name": "Cozy Candle",
      "word": "candle",
      "vibe": "Calm, warm and steady. People feel at home the moment they are with you.",
      "keywords": ["Warm", "Gentle", "Steady"],
      "desc": "You bring quiet warmth to the season. You love familiar rituals, the same favorite movie, the same mug, the same people, and you make others feel safe and calm. Friends come to you when they need someone to listen, and you are always there, patient and kind. You do not need a crowd to feel the holiday spirit. A few close people and a peaceful evening are enough. Make sure someone takes care of you too, because you give a lot of warmth.",
      "traits": ["You are the best listener in any group", "You love small, familiar rituals", "Your home feels like a warm hug", "You remember the little things people tell you"],
      "perfect": "A quiet evening with your closest people, hot drinks and a favorite holiday movie."
    },
    "cookie": {
      "name": "Gingerbread Cookie",
      "word": "gingerbread",
      "vibe": "Homemade charm. You put patience and care into everything you make.",
      "keywords": ["Crafty", "Patient", "Thoughtful"],
      "desc": "You show love by making things: homemade treats, a hand-drawn card, a perfectly wrapped gift. You enjoy a calm afternoon spent on a project, and you take pride in doing things properly, the way they have always been done, or even a little better. You are not the loudest person in the room, but your work speaks for itself and people remember it. Your projects do not have to be perfect to be loved. The care you put into them is what people feel.",
      "traits": ["You would rather make a gift than buy one", "You treasure recipes and traditions passed down", "You stay calm and focused on long projects", "You have an eye for details others miss"],
      "perfect": "A slow afternoon in a kitchen that smells of spices, with music on and something in the oven."
    },
    "snowman": {
      "name": "Soft-Hearted Snowman",
      "word": "snowman",
      "vibe": "Gentle, goofy and kind. You melt for the people you love.",
      "keywords": ["Kind", "Goofy", "Easygoing"],
      "desc": "You are gentle and a little silly in the best way. You do not like pressure or big crowds, but with your favorite people you are the funniest one in the room. You go with the flow, enjoy small joys like a snow day or a messy board game, and you always have time for a friend who needs cheering up. People feel relaxed around you because you never judge. Just do not let others decide everything for you. Your wishes count too.",
      "traits": ["You are silly and relaxed with close friends", "You cheer people up without even trying", "You go with the flow and love small surprises", "You are kind even to people you just met"],
      "perfect": "A lazy snow day in pajamas, with friends, snacks and a game that nobody really wins."
    },
    "snowflake": {
      "name": "Dreamy Snowflake",
      "word": "snowflake",
      "vibe": "One of a kind. You dream your own dreams and walk your own path.",
      "keywords": ["Unique", "Imaginative", "Independent"],
      "desc": "There is nobody quite like you. You see the season in your own way, with your own playlist, your own little rituals and ideas nobody else would have. You recharge in quiet, and your imagination does its best work when you have time alone. You are not against the crowd, you just like to choose your moments. Friends love your original view of the world, so share your ideas more often. They are more welcome than you think.",
      "traits": ["You have a style that is completely your own", "You get your best ideas in quiet moments", "You notice beauty that others walk past", "You are happy in your own company"],
      "perfect": "A peaceful walk through a snowy city at night, headphones in and lights all around."
    }
  }
};
