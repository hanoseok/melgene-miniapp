/* New Year Fortune Test (en)
 * The year comes from newyear-core.js (YEAR) — never type it by hand.
 * 8 result ids (voyage festival summit adventure nest bond seed pause);
 * questions[i].choices[j] follow newyear-core.js QUESTIONS[i].w[j] (the [new things/steady, together/me-time, plan/flow] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the year, the lucky month (core) and the real server share.
 * Light and positive only: no health/medical claims, no financial or investment advice, nothing deterministic. Just for fun.
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": `${Y} New Year Fortune Test – Your Keyword`,
    "description": `Take the ${Y} New Year fortune test: 11 quick questions, about 2 minutes, no sign-up. Get your keyword for the year, a lucky color, month and item. Just for fun.`,
    "ogTitle": `${Y} New Year Fortune Test 🌅 What’s your keyword for the year?`,
    "ogDescription": `Eleven light questions about how you’d like to spend ${Y}. Find your keyword, lucky color, lucky month and lucky item.`
  },
  "siteName": `${Y} New Year Fortune Test`,
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": `🌅 Hello, ${Y}`,
    "h1Kicker": `${Y} New Year Fortune Test`,
    "h1Html": `What will ${Y}<br>be <em>about</em> for you?`,
    "hook": "A fresh calendar, a first sunrise and a whole year of blank pages. Answer eleven light questions about how you like to live, and discover the keyword, lucky charms and little fortunes waiting in your new year.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 questions",
    "start": "Reveal my year →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Watching the first sunrise…",
    "sub": "Writing your fortune for the new year"
  },
  "result": {
    "title": `My ${Y} keyword: {name}`,
    "metaDesc": `${Y} New Year fortune test result: {name}. {vibe} See your lucky color, lucky month, lucky item and a light fortune for the year.`,
    "eyebrow": `Your keyword for ${Y}`,
    "colorLabel": "Lucky color",
    "monthLabel": "Lucky month",
    "itemLabel": "Lucky item",
    "gaugeLabel": "Where your answers leaned",
    "axes": [
      ["New things", "Steady"],
      ["Together", "Me time"],
      ["Planner", "Go with the flow"]
    ],
    "fortuneLabel": "Your year at a glance",
    "areas": {
      "work": "Work & study",
      "money": "Money mood",
      "love": "People & love",
      "self": "Self-care"
    },
    "tipLabel": "A small resolution to try",
    "buddyLabel": "Great match",
    "rivalLabel": "Friendly opposite",
    "disclaimer": "Just for fun. Your keyword, lucky charms and fortunes are playful ideas for the new year, not predictions and not health, money or life advice.",
    "sameShare": "{pct}% of people got this keyword",
    "shareText": `My ${Y} keyword is {name} {emoji} “{vibe}” What’s yours?`,
    "ctaStrong": "A friend shared their new year fortune",
    "ctaSub": `What will ${Y} be about for you? Find out in 2 minutes.`,
    "retry": "Take the test again"
  },
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "og": {
    "eyebrow": `My keyword for ${Y}`,
    "brand": `🌅 ${Y} New Year Fortune Test`,
    "defaultKicker": "A light new year quiz",
    "defaultTitle": `What will ${Y} be about for you?`,
    "defaultDesc": "11 questions · 2 minutes · lucky charms"
  },
  "faq": [
    {
      "q": "How is my keyword chosen?",
      "a": "Every answer nudges three scales: trying new things or keeping a steady rhythm, time with people or time for yourself, and planning ahead or going with the flow. Your keyword is where those three meet, and the same answers always give the same result."
    },
    {
      "q": "Is this a real prediction of my year?",
      "a": "No. The keyword, lucky color, lucky month, lucky item and the little fortunes are playful ideas, not predictions. Nobody can know how a year will go. Use your result as a fun way to think about what you would like to do."
    },
    {
      "q": "Can I take it again and get something else?",
      "a": "Yes. If you answer differently, you can land on a different keyword. Many people take it again later in the year, when their mood or plans have changed."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which keyword came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": `Privacy Policy | ${Y} New Year Fortune Test`,
    "description": `Privacy Policy for the ${Y} New Year Fortune Test — how we use cookies, advertising and anonymous statistics.`,
    "h1": "Privacy Policy",
    "introHtml": "The New Year Fortune Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of October 29, 2026."
      ]
    ],
    "back": "← Back to the New Year Fortune Test"
  },
  "questions": [
    {
      "q": "It’s ten minutes to midnight on New Year’s Eve. Where are you?",
      "choices": [
        "On the sofa with your favorite people, snacks out, no plan at all",
        "At the countdown party you organized for your friends weeks ago",
        "At home on your own, writing next year’s goals in a fresh notebook",
        "Somewhere new on a last-minute solo trip, watching strangers celebrate"
      ]
    },
    {
      "q": "A brand-new planner for the year lands on your desk. What goes on the first page?",
      "choices": [
        "A wish list of fun things to try with friends. Dates can wait",
        "Nothing yet. You’ll write in it when the mood strikes",
        "Everyone’s birthdays and the family get-togethers, first thing",
        "One big personal goal, broken down month by month"
      ]
    },
    {
      "q": "The first sunrise of the year. How do you greet it?",
      "choices": [
        "Alarm set, warm drink in hand, watching quietly from your window",
        "On a spontaneous early train to a place you’ve never been",
        "Leading a group hike to a hilltop, route and snacks all planned",
        "Still up with friends after the party, and you catch it by chance"
      ]
    },
    {
      "q": "Your resolution for the year is most likely to be…",
      "choices": [
        "Learn a new skill, with a schedule and a progress tracker",
        "Call or visit the people you love on a regular rhythm",
        "Say yes to more invitations and see where they lead",
        "No big resolutions. Just be a little kinder to yourself"
      ]
    },
    {
      "q": "A new project comes up at work or school. You…",
      "choices": [
        "Grab the part nobody has tried yet and figure it out as you go",
        "Join a team you like and help out wherever you’re needed",
        "Take the part you know well and do it carefully on your own",
        "Offer to lead it and draw up a plan together with everyone"
      ]
    },
    {
      "q": "A little unexpected money comes your way, like a gift or a small bonus.",
      "choices": [
        "Put it toward a planned get-together or gifts for your family",
        "Treat your friends to something fun, right there and then",
        "Tuck it away and forget about it until you need it",
        "Spend it on a class or gear for something new you’ve been planning"
      ]
    },
    {
      "q": "A free weekend with nothing on the calendar. What happens?",
      "choices": [
        "You plan a day trip for a group to a place none of you knows",
        "You tidy up, prep the week ahead and enjoy the calm",
        "You wander alone through a neighborhood you’ve never explored",
        "You text your friends “come over?” and let the day unfold"
      ]
    },
    {
      "q": "At a new year gathering, someone you’ve never met sits next to you.",
      "choices": [
        "Smile, keep it light and quietly enjoy the food",
        "Ask about their work. There might be something to learn for your own goals",
        "Introduce them to everyone and start a game",
        "Make sure they feel welcome and invite them to the next gathering"
      ]
    },
    {
      "q": "After a busy stretch, you feel a bit worn out. How do you recharge?",
      "choices": [
        "Call a close friend and chat about nothing for hours",
        "Try something completely new on a whim, just for you",
        "Organize a weekend getaway with friends, itinerary included",
        "Block out a quiet evening: early night, a good book, a cup of tea"
      ]
    },
    {
      "q": "Halfway through the year, an unexpected opportunity knocks.",
      "choices": [
        "Weigh it carefully, then go for it with a clear plan",
        "Let it pass. You’re happy with the pace you have",
        "Talk it over with the people closest to you before deciding",
        "Jump right in and bring a friend along for the ride"
      ]
    },
    {
      "q": "Picture next New Year’s Eve. What would make you proudest?",
      "choices": [
        "A notebook full of small habits you actually kept",
        "A big goal your whole team reached together",
        "A year full of warm moments with the people you love",
        "A pile of stories from things you tried for the very first time"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "The Grand Voyage",
      "word": "voyage",
      "vibe": "You set the course, and your crew is happy to sail with you.",
      "desc": "This could be a year of setting sail. You like new horizons, but you never leave the harbor without a map, and you rarely travel alone. People trust your plans because you think of everyone on board. Big shared goals suit you this year: a team project, a group trip, a challenge you take on with friends. Keep the course, but enjoy the view along the way.",
      "keywords": ["Bold plans", "Teamwork", "New horizons"],
      "color": "Ocean blue",
      "item": "A paper map of a place you want to visit",
      "fortune": {
        "work": "A good year to start something bigger than you could do alone. Your ability to organize people may open interesting doors.",
        "money": "Saving toward one shared goal, like a trip or a celebration, may feel more motivating than saving for its own sake.",
        "love": "People gather around you. Remember to ask your crew how they are doing, not only how the plan is going.",
        "self": "Schedule your rest the way you schedule everything else. Even captains need a quiet night in port."
      },
      "tip": "Write down one adventure you want to share with someone this year, and pick the month together."
    },
    "festival": {
      "name": "The Bright Festival",
      "word": "festival",
      "vibe": "You turn ordinary days into little celebrations.",
      "desc": "Your year could feel like one long festival with many small stages. You love trying new things, and you love doing them with other people, preferably without too much planning. Your energy brings people together and makes a dull Tuesday feel like a party. This year may reward your openness with new friends and unexpected invitations. Just leave a little room in your calendar to catch your breath.",
      "keywords": ["Joyful", "Sociable", "Spontaneous"],
      "color": "Sunny coral",
      "item": "A bunch of colorful balloons",
      "fortune": {
        "work": "Fresh ideas come easily when you brainstorm with others. A playful approach might solve a problem that serious faces couldn’t.",
        "money": "Fun shared moments matter to you. A small treat jar for outings with friends might keep both your wallet and your mood happy.",
        "love": "Your circle could grow this year. Someone you meet by chance may become a good friend.",
        "self": "Balance the busy weeks with a few slow evenings. Your sparkle shines brighter when you are rested."
      },
      "tip": "Plan one small celebration for no reason at all, and invite someone you’d like to know better."
    },
    "summit": {
      "name": "The High Summit",
      "word": "summit",
      "vibe": "One clear goal, one steady climb, one great view at the top.",
      "desc": "This year looks like a mountain you have chosen to climb. You like a real challenge, you like to prepare well, and you’re happy to focus on your own path. Step by step, you could make visible progress on something that matters to you: a skill, a project, a personal record. You don’t need an audience, but the view from the top will be worth sharing. Celebrate the small camps along the way.",
      "keywords": ["Focused", "Determined", "Well prepared"],
      "color": "Pine green",
      "item": "A pair of comfortable sneakers",
      "fortune": {
        "work": "Deep focus is your strength. A long-term project or a new skill could grow steadily with your patient effort.",
        "money": "Clear goals help you here too. Knowing what you are saving for may make small choices easier.",
        "love": "You might be busy with your climb, so a short message to an old friend could mean more than you think.",
        "self": "Rest days are part of every good climb. Plan them as seriously as your training days."
      },
      "tip": "Choose one goal for the year and mark three small checkpoints on your calendar."
    },
    "adventure": {
      "name": "The Open Road",
      "word": "open road",
      "vibe": "No map, no problem. Every turn is a new story.",
      "desc": "Your year could feel like a road trip without a fixed destination. You follow your curiosity, you enjoy your own company and you’re happy to change direction when something interesting appears. That freedom leads you to places and ideas other people miss. This may be a year of firsts: a new city, a new hobby, a new way of seeing things. Keep a notebook handy, because you will want to remember the detours.",
      "keywords": ["Curious", "Free-spirited", "Independent"],
      "color": "Sunset orange",
      "item": "A light backpack",
      "fortune": {
        "work": "Unusual paths may suit you. Trying a method nobody has used yet could lead to your best ideas.",
        "money": "Experiences matter more to you than things. A small travel jar might turn wishes into real trips.",
        "love": "You meet interesting people on the way. Let a few of them into your story for longer than one chapter.",
        "self": "Your freedom is your energy. Make sure you also have a cozy place to come back to."
      },
      "tip": "Try one completely new thing each season, and write a single line about how it felt."
    },
    "nest": {
      "name": "The Warm Nest",
      "word": "warm nest",
      "vibe": "You build a home where everyone feels welcome.",
      "desc": "This year may be about building something warm and lasting. You like a steady rhythm, you care deeply about the people around you, and you prepare thoughtfully so everyone feels looked after. Your home, your team or your group of friends could become a place where people love to gather. Small traditions you start this year, like a monthly dinner or a shared photo album, might become the ones you keep for years.",
      "keywords": ["Caring", "Reliable", "Thoughtful"],
      "color": "Warm beige",
      "item": "A softly scented candle",
      "fortune": {
        "work": "People rely on your steady hand. Organizing and supporting others could be where you shine brightest.",
        "money": "Planning for comfort suits you. Setting a little aside for shared moments at home may feel deeply satisfying.",
        "love": "Your relationships may grow deeper rather than wider. A long conversation could matter more than a big party.",
        "self": "You take care of everyone, so make sure someone takes care of you too. It is fine to say yes to help."
      },
      "tip": "Start one small tradition with the people you love, like a monthly meal or a yearly photo."
    },
    "bond": {
      "name": "The Kindred Circle",
      "word": "kindred circle",
      "vibe": "The best moments of your year will have familiar faces in them.",
      "desc": "Your year could be colored by good company. You enjoy a relaxed pace, you listen well and you like to let plans happen naturally with the people you love. Friends feel at ease with you, and old connections may come back in lovely ways. This may be a year of long talks, shared meals and laughter you will still remember next winter. Keep your door and your heart open.",
      "keywords": ["Warm", "Easygoing", "Loyal"],
      "color": "Cherry pink",
      "item": "A stack of handwritten cards",
      "fortune": {
        "work": "Good relationships with colleagues or classmates could make everything easier. Your kindness is a real strength.",
        "money": "Sharing feels better than owning. Small thoughtful gifts may bring more joy than big purchases.",
        "love": "An old friendship might bloom again, or a new one could feel like you’ve known each other forever.",
        "self": "Time with others recharges you, but quiet moments help you hear your own wishes too."
      },
      "tip": "Send one handwritten note each month to someone who made your life brighter."
    },
    "seed": {
      "name": "The Patient Seed",
      "word": "patient seed",
      "vibe": "Small steps every day, and something beautiful grows.",
      "desc": "This year might be a year of quiet growth. You prefer a steady rhythm, you like your own space and you enjoy planning small, sensible steps. Nothing about it is flashy, but by next winter you may be surprised at how much has grown: a habit that stuck, a skill that bloomed, a calmer routine. Your patience is your secret power this year. Water your seeds a little every day.",
      "keywords": ["Patient", "Consistent", "Calm"],
      "color": "Fresh mint",
      "item": "A small habit notebook",
      "fortune": {
        "work": "Consistency may beat speed this year. Small daily progress could add up to something you are proud of.",
        "money": "Gentle routines suit you, like a simple monthly check-in with your own spending.",
        "love": "You may not have the biggest circle, but the people in it will know they can count on you.",
        "self": "A simple routine, a tidy corner and an early night may be all you need to feel at your best."
      },
      "tip": "Pick one tiny daily habit, small enough to do even on your laziest day."
    },
    "pause": {
      "name": "The Gentle Pause",
      "word": "gentle pause",
      "vibe": "A slower year, a softer heart, and room to breathe.",
      "desc": "Your year may be about slowing down in the best way. You like a calm pace, you value time for yourself and you are happy to let life unfold without forcing it. That is not doing nothing: it is the space where new ideas quietly appear. This may be a year to enjoy simple pleasures, a good book, a long walk, a cozy evening, and to notice what truly makes you happy.",
      "keywords": ["Peaceful", "Reflective", "Gentle"],
      "color": "Lavender",
      "item": "A soft, cozy scarf",
      "fortune": {
        "work": "A calm mind can see clearly. Taking a moment before you decide might help you choose the right path.",
        "money": "Simple joys cost little. You may find that the things you love most are already close at hand.",
        "love": "Quiet company suits you. One or two close friends could make your year feel full.",
        "self": "This is your year to rest without guilt. Slow mornings and quiet evenings are well deserved."
      },
      "tip": "Keep one evening a week completely free, just for doing what you feel like."
    }
  }
};
