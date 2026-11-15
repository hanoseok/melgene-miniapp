/* Party Personality Test (en)
 * 8 result ids (confidant, earlybird, snack, memory, spark, host, dj, captain); questions[i].choices[j] follow partytype-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: energy cozy/buzz, focus people/scene, style flow/plan).
 * None of the types is negative: every one is a role a good party needs.
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own energy score ({n}) and the real server share ({pct}).
 * Honesty: just for fun — not a clinical assessment or psychological test.
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
    "title": "Party Personality Test – What Kind of Party Guest Are You?",
    "description": "Party personality test: 12 moments at a get-together, 2 minutes, no sign-up. Find out what kind of party guest you are and get your own party energy score.",
    "ogTitle": "Party Personality Test 🎉 What kind of party guest are you?",
    "ogDescription": "Twelve moments at a get-together. Discover your party personality and your own party energy score. A fun quiz, not a clinical assessment."
  },
  "siteName": "Party Personality Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎉 A quiz for party season",
    "h1Kicker": "Party Personality Test",
    "h1Html": "Holiday parties, birthdays, game nights:<br>what kind of <em>guest</em> are you?",
    "hook": "Every good get-together needs a mix of people. Some light up the room, some make sure nobody feels left out, and some quietly keep the whole night running. Walk through twelve moments at a party and find out which role is truly yours.",
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
    "text": "Reading the room…",
    "sub": "Checking your energy, focus and party style"
  },
  "result": {
    "title": "My party personality: {name}",
    "metaDesc": "Party personality test result: {name}. {vibe} See your strengths, party tips, ideal get-together, best buddy and opposite type.",
    "eyebrow": "At a party, you are…",
    "gaugeTitle": "Your party energy",
    "gaugeLow": "Cozy",
    "gaugeHigh": "Full volume",
    "gaugeNote": "Calculated only from your own answers about arriving, music, late nights and the morning after. It is not compared with anyone else.",
    "scoreFmt": "{n}",
    "bandLow": "You enjoy parties at a gentle volume: good company, a comfy seat and real conversations.",
    "bandMid": "You can turn the volume up or down depending on the crowd and your mood.",
    "bandHigh": "You love the buzz: music up, people everywhere, and the night is still young.",
    "traitsLabel": "Your party strengths",
    "tipsLabel": "Party tips for you",
    "perfectLabel": "Your ideal get-together",
    "bestLabel": "Best buddy",
    "rivalLabel": "Opposite type",
    "disclaimer": "Just for fun! This quiz is for fun, not a clinical assessment or a psychological test. It looks at a few party habits and cannot tell you who you are. Every type makes a party better.",
    "sameShare": "{pct}% of people got this result",
    "shareText": "My party personality is {name} {emoji} “{vibe}” What kind of guest are you?",
    "ctaStrong": "A friend shared their party personality",
    "ctaSub": "What kind of party guest are you? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My party personality",
    "brand": "🎉 Party Personality Test",
    "defaultKicker": "A quiz for party season",
    "defaultTitle": "What kind of party guest are you?",
    "defaultDesc": "12 party moments · 2 minutes · your own energy score"
  },
  "faq": [
    {
      "q": "What does this party personality test look at?",
      "a": "Three party habits: how much buzz you enjoy, whether your attention goes to people or to the scene around you (music, food, photos, games), and whether you like to plan ahead or go with the flow."
    },
    {
      "q": "How is my result chosen?",
      "a": "Each moment looks at one of the three habits. The combination of all three picks your party personality, and the same answers always give the same result."
    },
    {
      "q": "Where does my party energy score come from?",
      "a": "It is calculated only from your own answers to the energy questions. Livelier answers raise it and cozier answers lower it. It is not compared with anyone else."
    },
    {
      "q": "Is a quiet party style a bad thing?",
      "a": "Not at all. Calm guests often have the best conversations and make others feel at ease. A great party needs every kind of guest, from the loudest to the quietest."
    },
    {
      "q": "Is this a clinical or psychological assessment?",
      "a": "No. This quiz is for fun, not a clinical assessment or a psychological test. Your answers are calculated in your browser and are not stored; we only count anonymously which result came up."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Party Personality Test",
    "description": "Privacy Policy for the Party Personality Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Party Personality Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 16, 2026."
      ]
    ],
    "back": "← Back to the Party Personality Test"
  },
  "questions": [
    {
      "q": "You walk through the door. The party is already going. You…",
      "choices": [
        "Slip in quietly and look for one familiar face",
        "Say hi to a few people and grab a drink",
        "Make an entrance: “I’m here! Let’s get this started!”",
        "Greet the host, then settle into a comfy spot"
      ]
    },
    {
      "q": "The party is slow to warm up. What do you reach for first?",
      "choices": [
        "The speaker. The right playlist fixes everything",
        "The person standing alone by the wall. I introduce them around",
        "The nearest little group, so I can join the chat",
        "The snack table. Good food gets people talking"
      ]
    },
    {
      "q": "An invitation for Saturday lands in the group chat. You…",
      "choices": [
        "Reply “probably!” and see how the week goes",
        "RSVP right away, set a reminder and offer to bring something",
        "Decide on the day. Maybe I’ll just show up",
        "Say yes and check what time I should arrive"
      ]
    },
    {
      "q": "Someone turns up the music and the dancing (or karaoke) begins. You…",
      "choices": [
        "Join in after a song or two",
        "Happily cheer everyone on from the sofa",
        "Sway a little at the edge of the room",
        "I’m first up. Hand me the mic!"
      ]
    },
    {
      "q": "You find yourself at the snack table. You…",
      "choices": [
        "Chat with whoever is next to me",
        "Taste everything and secretly rank the best dish",
        "Fill a plate with a bit of everything and admire the spread",
        "Make a plate for a friend who is stuck in a long conversation"
      ]
    },
    {
      "q": "Someone shouts: “Let’s play a game!” You…",
      "choices": [
        "Already have three games ready, rules included",
        "Suggest one I know well and help set it up",
        "Play along with whatever gets picked",
        "Invent a silly new game on the spot"
      ]
    },
    {
      "q": "It’s midnight. Someone calls out: “Next stop, round two!” You…",
      "choices": [
        "Tempting… but I’ll probably head home",
        "Home, pajamas, bed. Tonight was already perfect",
        "Obviously! I’m already ordering the ride",
        "Sure, for one more hour"
      ]
    },
    {
      "q": "Time for the group photo! You…",
      "choices": [
        "Make sure nobody is left out of the frame",
        "Suggest a spot with nicer light",
        "Squeeze in next to my favorite people",
        "Grab the camera, direct the poses and take twenty shots"
      ]
    },
    {
      "q": "It’s getting late. When do you leave?",
      "choices": [
        "Around the time I planned, give or take",
        "Whenever I feel like it",
        "I chose my exit time before I arrived, and I stick to it",
        "No idea. Let’s see where the night goes"
      ]
    },
    {
      "q": "The next morning, the group chat wakes up. You…",
      "choices": [
        "Flood it with photos, voice notes and “When’s the next one?”",
        "Drop a few hearts and smile at the photos",
        "Post my favorite picture with a funny caption",
        "Read every message quietly from under the blanket"
      ]
    },
    {
      "q": "A friend of a friend you’ve never met joins your group. You…",
      "choices": [
        "Show them where the best snacks are",
        "Pull them straight into the game that’s going on",
        "Ask them a dozen questions. I want their whole story",
        "Smile, introduce myself and include them in the chat"
      ]
    },
    {
      "q": "The food delivery is an hour late and everyone is hungry. You…",
      "choices": [
        "Improvise: let’s cook something with whatever’s in the fridge",
        "No problem. I already had a backup plan",
        "Check the app and suggest a backup option",
        "Shrug and keep chatting. It will come"
      ]
    }
  ],
  "types": {
    "confidant": {
      "name": "Cozy Confidant",
      "word": "confidant",
      "vibe": "You find one great person, one comfy corner and the best conversation of the night.",
      "keywords": ["Warm", "Good listener", "Genuine"],
      "desc": "While the music gets louder, you are usually somewhere a little quieter, deep in a conversation that nobody wants to end. You are not there to impress a crowd. You are there for real connection, and people feel it. Friends tell you things they have never said out loud, and new acquaintances leave your corner feeling truly heard. You go with the flow, so the best talks often happen by surprise. Every party needs a calm harbor, and that harbor is you.",
      "traits": ["You make people feel heard", "You turn small talk into real talk", "You remember the little details", "You stay calm in a busy room"],
      "tips": ["Say hello to one new person early, while the room is still quiet", "Take a short breather outside when the noise gets to be too much"],
      "perfect": "A small dinner with candles, good food and four friends who love to talk until late."
    },
    "earlybird": {
      "name": "Happy Early Bird",
      "word": "early bird",
      "vibe": "You arrive on time, make every minute count and leave at the happiest moment.",
      "keywords": ["Thoughtful", "Reliable", "Balanced"],
      "desc": "You know exactly what makes a night great for you, and you plan it that way. You show up when you said you would, often with a small gift for the host. You spend your time on real conversations and warm hellos, then you leave while you are still smiling, with a proper goodbye to everyone. People love that you are always there and always in a good mood. You never stay past your best, which is why your friends never get the grumpy version of you.",
      "traits": ["You are always on time", "You know your limits and respect them", "You say warm hellos and goodbyes", "You make hosts feel appreciated"],
      "tips": ["Let friends know your plan to leave early, so nobody worries", "Now and then, stay for one extra round when the night is special"],
      "perfect": "An afternoon get-together or an early dinner that ends with happy hugs and a good night’s sleep."
    },
    "snack": {
      "name": "Snack Scout",
      "word": "scout",
      "vibe": "You know where the best bites are and quietly make every party a little tastier.",
      "keywords": ["Curious", "Easygoing", "Joyful"],
      "desc": "The moment you arrive, you have already scouted the snack table, found the best dish and figured out which dip disappears first. You enjoy parties through all your senses: the food, the smells, the music in the background, the twinkly lights. You do not need the spotlight, and you are happy to wander, taste and chat with whoever is next to you at the buffet. Your easygoing joy is contagious, and your food tips are legendary. Everyone wants to stand next to you at the snack table.",
      "traits": ["You notice the small pleasures", "You are easy to be around", "You bring good vibes without trying", "You always find the best dish"],
      "tips": ["Bring one homemade snack. It is the easiest conversation starter", "Use the snack table to say hi to someone new"],
      "perfect": "A potluck where everyone brings a dish, with soft music and plenty of time to try everything."
    },
    "memory": {
      "name": "Memory Keeper",
      "word": "memory keeper",
      "vibe": "You capture the best moments and turn a fun night into memories everyone keeps.",
      "keywords": ["Observant", "Creative", "Organized"],
      "desc": "You see the party a little differently from everyone else, like a story unfolding. You notice the moment someone laughs so hard they cry, the perfect light on the cake and the group hug at the end. Your camera is ready, and you know exactly when to suggest a photo. The next day, it is your neatly shared album that everyone saves. You may not be the loudest person in the room, but you are the reason the night lives on.",
      "traits": ["You notice beautiful moments", "You are creative with details", "You keep things organized", "You make sure memories last"],
      "tips": ["Hand the camera to someone else, so you are in the photos too", "Put the phone down for one song and simply enjoy the moment"],
      "perfect": "A themed party with fairy lights, a photo corner and a shared album the next morning."
    },
    "spark": {
      "name": "Mood Maker",
      "word": "mood maker",
      "vibe": "You walk in and the room lights up. Your energy gets everyone laughing.",
      "keywords": ["Energetic", "Funny", "Spontaneous"],
      "desc": "When you arrive, the party gets louder in the best way. You talk to everyone, laugh easily and pull shy guests into the fun without making them feel awkward. You never need a plan: give you a room full of people and something great will happen. Your stories become legends, and your laugh can be heard from the kitchen. People feel braver and freer when you are around, and that is a rare gift. Just remember that some guests recharge in quieter ways.",
      "traits": ["You get people laughing", "You make shy guests feel welcome", "You keep the energy high", "You turn any moment into fun"],
      "tips": ["Check in with quieter friends one on one", "Drink a glass of water between rounds to keep the energy going"],
      "perfect": "A big, loud birthday bash with lots of friends, music and stories that start with “You won’t believe this…”"
    },
    "host": {
      "name": "Heart Host",
      "word": "heart host",
      "vibe": "You make sure every glass is full and every guest feels at home.",
      "keywords": ["Caring", "Welcoming", "Attentive"],
      "desc": "Whether it is your party or not, you naturally act like the host. You greet new arrivals, introduce people who would get along and notice when someone is standing alone. You plan ahead, so there are always enough cups, chairs and good snacks. People leave a gathering with you feeling truly welcome. You bring the energy, and you also take care of the people. Make sure you get to enjoy the party too, not just run it.",
      "traits": ["You make everyone feel welcome", "You connect people who would get along", "You notice who needs something", "You plan the details nobody sees"],
      "tips": ["Let a friend take over the hosting for half an hour", "Sit down with a plate of food yourself. You deserve it"],
      "perfect": "A cozy house party you host yourself, with a full table, a warm playlist and friends from every part of your life."
    },
    "dj": {
      "name": "Vibe DJ",
      "word": "dj",
      "vibe": "You set the soundtrack, read the room and know exactly when to turn it up.",
      "keywords": ["Expressive", "Bold", "Trend-savvy"],
      "desc": "You feel the mood of a room like music. When the party drags, you are the one who changes the playlist, starts the singalong or turns the lights down for dancing. You do not need a plan; you follow the energy and push it in the right direction. People love that you always know the right song for the moment. You are at your best when the room is moving, and you have a gift for making ordinary nights feel like a festival.",
      "traits": ["You read the room instantly", "You lift the mood with music", "You are bold and expressive", "You turn nights into events"],
      "tips": ["Take requests now and then. Everyone loves hearing their song", "Save one slow song for the people who want to talk"],
      "perfect": "A dance party with a great sound system, colorful lights and friends who sing every chorus."
    },
    "captain": {
      "name": "Party Captain",
      "word": "captain",
      "vibe": "Games, timing, the plan B: you keep the whole party running smoothly.",
      "keywords": ["Organized", "Energetic", "Fair"],
      "desc": "You love a good party and you love making one happen. You organize the date, plan the games, explain the rules and keep track of the scores. When the food is late, you already have a backup plan. Your energy is high, and you put it into making the night fun for everyone. Friends trust you with the big gatherings, from year-end parties to birthday trips. Leave a little room for surprises too, because some of the best moments are never on the schedule.",
      "traits": ["You turn ideas into real plans", "You keep games fair and fun", "You stay calm when plans change", "You bring people together"],
      "tips": ["Let one part of the evening be completely unplanned", "Hand out small jobs so you can join the fun too"],
      "perfect": "A big game night with teams, prizes and a perfectly timed schedule, plus one surprise you did not plan."
    }
  }
};
