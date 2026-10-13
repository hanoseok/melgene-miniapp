/* Zombie Apocalypse Survival Test (en)
 * 8 result ids (leader strategist medic scavenger engineer lonewolf cheer lucky) and question/choice order as in zombie-core.js
 * (the scoring lives only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].c[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * types.<id>.forecast = a playful "survival forecast" line — words only, never a number or a fake statistic.
 * result.metaDesc = result page meta description. Placeholders: {name} {emoji} {vibe} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Rubik:wght@700;800&display=swap",
    "display": "'Rubik'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Zombie Apocalypse Survival Test: What's Your Role?",
    "description": "Take the zombie apocalypse survival test: 12 outbreak scenarios, 2 minutes, no sign-up. Find your survivor role, your strengths and your best partner for the end of the world.",
    "ogTitle": "Zombie Apocalypse Survival Test 🧟 What's your role?",
    "ogDescription": "12 outbreak scenarios, 2 minutes. Who would you be when the zombies come?"
  },
  "siteName": "Zombie Apocalypse Survival Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🧟 Halloween survival test",
    "h1Kicker": "Zombie Apocalypse Survival Test",
    "h1Html": "Who would you be<br>when the <em>zombies</em> come?",
    "hook": "The sirens are wailing and the group chat is on fire. Get through 12 outbreak scenarios and find out what role you'd play when it all goes down.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "📻 12 scenarios",
    "start": "Start surviving →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Day {n}"
  },
  "loading": {
    "text": "Checking your survival gear…",
    "sub": "Radio signal found"
  },
  "result": {
    "title": "My zombie apocalypse role: {name}",
    "metaDesc": "Zombie apocalypse survival test result: {name}. {vibe}",
    "eyebrow": "When the zombies come, you are",
    "forecastLabel": "Survival forecast",
    "strengthsLabel": "Survival skills",
    "weaknessLabel": "Weak spot",
    "tipLabel": "Survival tip",
    "sameShare": "{pct}% of survivors got this role",
    "shareText": "My zombie apocalypse role: {name} {emoji} “{vibe}” What would you be?",
    "ctaStrong": "A friend shared their survivor role",
    "ctaSub": "What would you be? 2 minutes.",
    "bestLabel": "Best partner",
    "worstLabel": "Worst partner",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My survivor role",
    "brand": "🧟 Zombie Survival Test",
    "defaultKicker": "Zombie apocalypse survival test",
    "defaultTitle": "Who would you be when the zombies come?",
    "defaultDesc": "12 outbreak scenarios · 2 minutes"
  },
  "faq": [
    {
      "q": "How is my survivor role chosen?",
      "a": "Each answer adds points to the roles it fits. The role with the most points after the last scenario is your result. The same answers always give the same result."
    },
    {
      "q": "Is this a real survival test?",
      "a": "No, it's just for fun. The scenarios are playful and the survival forecast is a joke, not a statistic. Please don't base your real emergency plans on it."
    },
    {
      "q": "Is it scary or gory?",
      "a": "Not at all. Think Halloween comedy, not horror movie: no blood, no jump scares, just silly outbreak situations and quick choices."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are scored in your browser and never stored. We only count, anonymously, which role came up, so we can show how common each one is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Zombie Apocalypse Survival Test",
    "description": "Privacy Policy for the Zombie Apocalypse Survival Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Zombie Apocalypse Survival Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of October 14, 2026."
      ]
    ],
    "back": "← Back to the survival test"
  },
  "questions": [
    {
      "q": "7 a.m. Your phone explodes with alerts: the zombie outbreak is real. First move?",
      "choices": [
        "Call everyone I know and set a meeting point",
        "Watch the news calmly and figure out what's going on",
        "Grab my bag and slip out before the streets fill up",
        "Hit snooze. It's probably fine… right?"
      ]
    },
    {
      "q": "You have five minutes to pack one bag. What goes in first?",
      "choices": [
        "The first-aid kit, obviously",
        "Canned food, water and a can opener",
        "Duct tape, a multitool and batteries",
        "A speaker and my favourite snacks"
      ]
    },
    {
      "q": "Time to pick a hideout.",
      "choices": [
        "A huge shopping mall: supplies on every floor",
        "A quiet cabin in the woods, just me",
        "The school gym, where lots of people can gather",
        "A rooftop I rig with alarms and solar panels"
      ]
    },
    {
      "q": "A group of strangers knocks and asks to join you.",
      "choices": [
        "Let them in and check if anyone is hurt",
        "Ask a few questions first, then decide",
        "Welcome them with a joke and hot cocoa",
        "Point them to a better hideout down the street"
      ]
    },
    {
      "q": "The group can't agree on the next move.",
      "choices": [
        "Step up and make the call",
        "Lay out three options with pros and cons",
        "Lighten the mood until everyone calms down",
        "Flip a coin. It's worked so far"
      ]
    },
    {
      "q": "Your friend has a suspicious scratch and swears it's from a cat.",
      "choices": [
        "Clean it, bandage it and keep an eye on them",
        "Believe them. Cats can be vicious",
        "Quietly prepare a plan B, just in case",
        "Hang a little bell on their door, just in case"
      ]
    },
    {
      "q": "It's your turn on night watch. How do you stay awake?",
      "choices": [
        "Tinker with the radio until I catch a signal",
        "Tell spooky stories to the other guard",
        "Count supplies and plan tomorrow's run",
        "I doze off, and somehow nothing ever happens on my shift"
      ]
    },
    {
      "q": "Food is running low.",
      "choices": [
        "Head out on a supply run to the supermarket",
        "Ration everything fairly so nobody goes hungry",
        "Start growing vegetables on the roof",
        "Slip out alone and come back with snacks"
      ]
    },
    {
      "q": "The radio crackles: there's a safe zone far, far away.",
      "choices": [
        "Plan the route, the stops and a backup",
        "Rally everyone and lead the trip",
        "Pack the medical supplies for the road",
        "Road trip! Windows down, music up"
      ]
    },
    {
      "q": "A slow, shuffling crowd of zombies blocks the road.",
      "choices": [
        "Check the map for a side road",
        "Sneak past alone. They won't even notice me",
        "Lure them away with a noisy gadget I built",
        "Wait it out and stumble onto a shortcut"
      ]
    },
    {
      "q": "A quiet afternoon in the hideout. What are you up to?",
      "choices": [
        "Teaching everyone basic first aid",
        "Searching the neighbour's garage for useful stuff",
        "Organising a talent show",
        "Winning every card game without really trying"
      ]
    },
    {
      "q": "Pick your survival motto.",
      "choices": [
        "Nobody gets left behind",
        "Patch them up and keep moving",
        "If you can't find it, you're not looking hard enough",
        "Travel light, trust your gut"
      ]
    }
  ],
  "types": {
    "leader": {
      "name": "The Captain",
      "word": "captain",
      "vibe": "Takes charge and keeps the group moving.",
      "forecast": "Still giving pep talks when the credits roll.",
      "desc": "When the sirens start, people look at you, and you don't flinch. You set the meeting point, split up the tasks and make the hard calls so nobody else has to. You're not bossy for fun; you just can't stand watching a group fall apart. With you up front, even a ragtag crew starts to feel like a team.",
      "strengths": [
        "Calm decision-maker",
        "Keeps everyone together",
        "Brave in a crisis"
      ],
      "weakness": "You try to carry every problem yourself and forget to sleep.",
      "tip": "Hand out jobs early. A crew with tasks panics less than a crew with questions."
    },
    "strategist": {
      "name": "The Mastermind",
      "word": "mastermind",
      "vibe": "Three plans ahead before anyone else has one.",
      "forecast": "Survives on maps, lists and a very good plan C.",
      "desc": "You don't run; you think. While others scream, you're already counting exits, reading the map and asking which bridge is still standing. Your plans have backups, and the backups have backups. People sometimes find you slow to move, but they always end up following your route.",
      "strengths": [
        "Sees the big picture",
        "Always has a backup plan",
        "Cool head under pressure"
      ],
      "weakness": "You can overthink until the moment to move has passed.",
      "tip": "A good plan today beats a perfect plan tomorrow. Pick a route and go."
    },
    "medic": {
      "name": "The Field Medic",
      "word": "medic",
      "vibe": "Keeps everyone patched up and breathing.",
      "forecast": "The one person no group ever wants to lose.",
      "desc": "You're the first to notice a limp, a cough or a friend who's gone quiet. You packed the first-aid kit before the snacks, and you stay steady when everyone else is shaking. Your kindness is practical: bandages, water and a calm voice. Every group you join gets a little tougher just because you're in it.",
      "strengths": [
        "Steady hands",
        "Notices everything",
        "Endlessly caring"
      ],
      "weakness": "You look after everyone else and forget your own scrapes.",
      "tip": "Pack extra socks. Dry feet are the most underrated survival gear."
    },
    "scavenger": {
      "name": "The Scavenger",
      "word": "scavenger",
      "vibe": "Finds what everyone needs, right when they need it.",
      "forecast": "Never runs out of snacks, batteries or tape.",
      "desc": "Abandoned malls are your treasure maps. You know which shelf still has batteries, which pharmacy everyone missed and how to get in and out before anything notices. You're quick, resourceful and a little proud of your finds. While others worry about tomorrow, you come back with a backpack full of it.",
      "strengths": [
        "Resourceful",
        "Quick on your feet",
        "Spots useful stuff anywhere"
      ],
      "weakness": "You take one risk too many for a jar of peanut butter.",
      "tip": "Always check the top shelf and the back room. Everyone else forgets them."
    },
    "engineer": {
      "name": "The Tinkerer",
      "word": "tinkerer",
      "vibe": "Turns junk into gadgets that save the day.",
      "forecast": "Will have hot showers and Wi-Fi running by week two.",
      "desc": "Give you duct tape, a car battery and an afternoon, and you'll build an alarm system, a solar charger or a slightly questionable drone. You see a broken thing and immediately wonder how to fix it. You're happiest in a quiet corner with your tools, and the whole group sleeps better because of what you build.",
      "strengths": [
        "Inventive problem-solver",
        "Handy with anything",
        "Patient and focused"
      ],
      "weakness": "You forget to eat when a project gets interesting.",
      "tip": "Learn to make a noise alarm from tin cans and string. Low-tech never runs out of battery."
    },
    "lonewolf": {
      "name": "The Lone Wolf",
      "word": "lone wolf, wolf",
      "vibe": "Quiet, quick and at your best on your own.",
      "forecast": "Spotted at every safe zone. Nobody knows how you got there.",
      "desc": "You travel light, trust your instincts and don't need a crowd to feel safe. While groups argue, you've already slipped down the back alley. You're not cold; you just know that fewer people means less noise. And when you do decide to help someone, they remember it forever.",
      "strengths": [
        "Self-reliant",
        "Stealthy and fast",
        "Trusts your gut"
      ],
      "weakness": "You wait far too long to ask for help.",
      "tip": "Travel light, but always carry a whistle. Even a lone wolf needs a way to call the pack."
    },
    "cheer": {
      "name": "The Morale Booster",
      "word": "morale",
      "vibe": "The reason the group still laughs on day thirty.",
      "forecast": "Gets the whole bunker singing by the end of the week.",
      "desc": "Supplies keep people alive, but you keep them going. You tell the stories, start the card games and find something funny even during a blackout. You notice when the mood drops and fix it with a joke or a song. You may not be the fastest runner, but every group you're in feels a little braver.",
      "strengths": [
        "Lifts every mood",
        "Brings people together",
        "Creative in tough times"
      ],
      "weakness": "Your laugh can be a bit loud when silence is needed.",
      "tip": "Bring a deck of cards. Morale is a survival resource too."
    },
    "lucky": {
      "name": "The Lucky One",
      "word": "lucky",
      "vibe": "Somehow, things always work out for you.",
      "forecast": "Slept through the first day of the outbreak. Classic.",
      "desc": "You don't always have a plan, yet somehow the door is unlocked, the car has fuel and the zombie trips right before it reaches you. You stay relaxed while others panic, and that calm is its own superpower. Friends joke that standing next to you is the safest place in town, and they might be right.",
      "strengths": [
        "Unshakably relaxed",
        "Great instincts",
        "Turns chaos into luck"
      ],
      "weakness": "Luck is not a plan, and your friends keep reminding you.",
      "tip": "Keep a spare key and a snack in every jacket. Luck favours the prepared."
    }
  }
};
