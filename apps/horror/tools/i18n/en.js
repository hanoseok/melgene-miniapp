/* Horror Movie Survival Test (en)
 * 8 result ids (leader skeptic comic curious strategist researcher final runner);
 * questions[i].choices[j] follow horror-core.js QUESTIONS[i].w[j] (the [brave/cautious, head/gut, team/solo] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the movie minute (core) and the real server share.
 * PG only: no gore, no weapons, no real violence. Just for fun (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct} {m} {total}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap",
    "display": "'Playfair Display'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Horror Movie Survival Test – Would You Survive?",
    "description": "Take the horror movie survival test: 11 classic spooky scenes, about 2 minutes, no sign-up. Find out which character you'd be and how long you'd last. Just for fun.",
    "ogTitle": "Horror Movie Survival Test 🎃 Would you make it to the credits?",
    "ogDescription": "A Halloween quiz with 11 classic horror-movie moments. Which character would you be, and how long would you last?"
  },
  "siteName": "Horror Movie Survival Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎃 Halloween movie night",
    "h1Kicker": "Horror Movie Survival Test",
    "h1Html": "Would you make it<br>to the <em>credits</em>?",
    "hook": "A door creaks, the candles flicker and the music suddenly goes quiet. Answer eleven classic horror-movie moments and find out which character you’d be and how long you’d last.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🎬 11 scenes",
    "start": "Start the movie →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Scene {n}"
  },
  "loading": {
    "text": "Reading your script…",
    "sub": "The director is deciding your fate"
  },
  "result": {
    "title": "My horror movie character: {name}",
    "metaDesc": "Horror movie survival test result: {name}. {vibe} See how long you’d last, your strengths, your signature scene and a survival tip.",
    "eyebrow": "In a horror movie, you’d be",
    "survivalLabel": "How long you last in the movie",
    "minuteText": "Minute {m} of {total}",
    "gaugeLabel": "Where your answers leaned",
    "axes": [
      ["Brave", "Cautious"],
      ["Head", "Gut"],
      ["Team", "Solo"]
    ],
    "strengthsLabel": "Your survival strengths",
    "sceneLabel": "Your signature scene",
    "tipLabel": "Survival tip",
    "buddyLabel": "Best buddy",
    "rivalLabel": "Friendly rival",
    "disclaimer": "Just for fun. The characters and survival times are playful movie clichés, not predictions about you and not real-life safety advice.",
    "sameShare": "{pct}% of people got this character",
    "shareText": "In a horror movie I’d be {name} {emoji} “{vibe}” Who would you be?",
    "ctaStrong": "A friend shared their horror movie role",
    "ctaSub": "Would you make it to the credits? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My horror movie character",
    "brand": "🎃 Horror Movie Survival Test",
    "defaultKicker": "Halloween movie-night quiz",
    "defaultTitle": "Would you survive a horror movie?",
    "defaultDesc": "11 classic scenes · 2 minutes"
  },
  "faq": [
    {
      "q": "How does the test pick my character?",
      "a": "Every answer nudges three scales: brave or cautious, head or gut, and sticking with the group or going it alone. Your character is where those three meet. The same answers always give the same result."
    },
    {
      "q": "Is the survival time a real prediction?",
      "a": "No. Each character comes with a playful screen time based on classic horror-movie clichés. It says nothing about how you would act in real life. The whole test is just for fun."
    },
    {
      "q": "Is the test scary?",
      "a": "Not really. There is no gore, no jump scares and no frightening images, only spooky, movie-style situations with a wink. It is made for a cozy Halloween movie night."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which character came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Horror Movie Survival Test",
    "description": "Privacy Policy for the Horror Movie Survival Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Horror Movie Survival Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of October 25, 2026."
      ]
    ],
    "back": "← Back to the Horror Movie Survival Test"
  },
  "questions": [
    {
      "q": "Your friends dare everyone to spend a night in the abandoned house at the edge of town. You…",
      "choices": [
        "Stay home and dig up the house’s history online instead",
        "Agree, but only with flashlights, a plan and a buddy system",
        "Tag along so you’re not left out, clutching someone’s sleeve all night",
        "Are already inside, hunting for the creepiest room on your own"
      ]
    },
    {
      "q": "Midnight. Your phone rings from an unknown number, and all you hear is slow breathing.",
      "choices": [
        "Stay on the line, note the time and try to trace the number yourself",
        "Hang up, switch the phone off and hide under the blanket",
        "Hang up and calmly ask the group chat if anyone else got the call",
        "Put it on speaker for your roommates and yell “Who IS this?!”"
      ]
    },
    {
      "q": "Your car breaks down on a forest road. Through the trees, a cabin’s lights are on.",
      "choices": [
        "Go with whatever the group decides, as long as nobody splits up",
        "March up and knock. What’s the worst that could happen?",
        "Organize it: two stay with the car, two go knock, phones charged",
        "Lock the doors, stay in the car and study the map for another way out"
      ]
    },
    {
      "q": "Upstairs, an old music box starts playing all by itself.",
      "choices": [
        "Grab a friend’s hand and go up together, laughing nervously",
        "Gather everyone downstairs and calmly suggest you all leave",
        "Go up alone to find the mechanism. There’s always an explanation",
        "Freeze, then quietly slip out of the house without a word"
      ]
    },
    {
      "q": "You find an old diary with one warning underlined: never say the name three times.",
      "choices": [
        "Say it three times. Someone has to test it",
        "Take it home and secretly read every page before telling anyone",
        "Put it back and make everyone promise never to mention it",
        "Read the rules aloud to the group so everybody knows them"
      ]
    },
    {
      "q": "Three in the morning. Someone knocks, then a familiar voice softly calls your name.",
      "choices": [
        "Wake your housemates and decide together what to do",
        "Check the door camera, then step out alone with a flashlight",
        "Pretend to be asleep and don’t make a sound",
        "Shout “Nice try!” loud enough to wake the whole house"
      ]
    },
    {
      "q": "In the bathroom mirror, your reflection blinks a second after you do.",
      "choices": [
        "Call everyone in: “Let’s test this properly, one at a time”",
        "Rush to the nearest person and refuse to be alone for the rest of the night",
        "Stare it down and wave. Let’s see who blinks first",
        "Cover the mirror and quietly read up on mirror legends"
      ]
    },
    {
      "q": "A storm knocks the power out. The house goes completely dark.",
      "choices": [
        "Curl up right where you are and wait for the lights to come back",
        "Start a ghost-story contest in the dark to keep everyone laughing",
        "Head down to the basement alone to check the fuse box",
        "Hand out candles and keep everyone together in one room"
      ]
    },
    {
      "q": "Someone in your group says the classic line: “Let’s split up and look around.” You…",
      "choices": [
        "Say no thanks and stay behind to keep researching",
        "Say “Great, I’ll take the creepy hallway” and go",
        "Agree, but in pairs, with a meeting point and a signal",
        "Refuse. Everyone stays together, holding hands if needed"
      ]
    },
    {
      "q": "At a foggy carnival, a fortune teller warns you to leave before midnight.",
      "choices": [
        "Laugh it off and drag your friends onto one last ride",
        "Leave right away, alone if you must, and don’t look back",
        "Round up your friends and find the safest exit together",
        "Stay and question her to work out what’s really going on"
      ]
    },
    {
      "q": "Every morning, the old toys in the playroom have moved to new spots.",
      "choices": [
        "Box them up and take the whole family to stay with relatives",
        "Set up cameras with your family and review the footage together",
        "Quietly research who owned the toys before you",
        "Sleep in the playroom alone to catch them in the act"
      ]
    }
  ],
  "types": {
    "leader": {
      "name": "The Brave Leader",
      "word": "brave leader",
      "vibe": "First through the door, flashlight up, everyone right behind you.",
      "survival": "Makes it deep into the final act",
      "desc": "When the lights go out, people turn to you. You step forward, but never blindly: you count heads, hand out flashlights and make a plan before anyone moves. Your courage keeps the group calm, and your planning keeps it in one piece. The only danger is that you always volunteer to go first.",
      "keywords": ["Brave", "Organized", "Protective"],
      "strengths": [
        "You turn panic into a plan in seconds",
        "You never leave anyone behind",
        "People trust you and follow your lead"
      ],
      "scene": "Standing at the top of the dark stairs, you turn to the group and say: “Stay close. Nobody goes anywhere alone.”",
      "tip": "Let someone else take a turn at the front once in a while. Leaders who rest last longer."
    },
    "skeptic": {
      "name": "The Skeptic",
      "word": "skeptic",
      "vibe": "There’s a logical explanation for everything. Probably.",
      "survival": "Leaves the story around the big midpoint twist",
      "desc": "Ghosts? Curses? Please. You trust facts, and you’re bold enough to go and prove everyone wrong, usually on your own and usually in the basement. Your clear head stops the group from panicking over every creak. You’re right surprisingly often, which is exactly what makes the one time you’re wrong so memorable.",
      "keywords": ["Logical", "Bold", "Independent"],
      "strengths": [
        "You stay level-headed when others panic",
        "You spot tricks and fake scares instantly",
        "You’re not afraid to check things yourself"
      ],
      "scene": "Rolling your eyes at the flickering lights, you announce: “It’s just old wiring. I’ll go and fix it.”",
      "tip": "Keep your logic, but bring a friend. Even facts are less scary in pairs."
    },
    "comic": {
      "name": "The Comic Relief",
      "word": "comic relief",
      "vibe": "Cracks a joke exactly when the music goes quiet.",
      "survival": "Lasts much longer than anyone expected",
      "desc": "You deal with fear the best way you know: by making everyone laugh. You charge in with your friends, say what everybody is thinking and lighten the mood when it gets too heavy. Audiences love you, and secretly so does the group. You act on instinct, which sometimes gets you into trouble and, just as often, out of it.",
      "keywords": ["Funny", "Loyal", "Spontaneous"],
      "strengths": [
        "You keep spirits up when hope runs low",
        "You say out loud what everyone is thinking",
        "Your quick reflexes surprise even you"
      ],
      "scene": "After a terrifying silence, you whisper: “Okay, who else just made a little noise? Because that wasn’t me.”",
      "tip": "Jokes are great, but whisper them. Loud laughter carries far in an empty house."
    },
    "curious": {
      "name": "The Curious One",
      "word": "curious one",
      "vibe": "You hear a strange noise. You go and check. Of course you do.",
      "survival": "Exits in the first act, off-screen and very dramatically",
      "desc": "A locked door, a strange sound, a box that says do not open: for you, these are invitations. You follow your gut and your curiosity, usually alone, and you discover things nobody else would dare to find. Every horror story needs someone brave enough to open the door, and that someone is you.",
      "keywords": ["Curious", "Fearless", "Adventurous"],
      "strengths": [
        "You find the clue everyone else missed",
        "You act while others are still debating",
        "Nothing stops you once you’re interested"
      ],
      "scene": "A soft knock comes from inside the closet. Everyone freezes. You’re already reaching for the handle.",
      "tip": "Before you open anything, count to three and tell someone where you’re going."
    },
    "strategist": {
      "name": "The Calm Strategist",
      "word": "calm strategist",
      "vibe": "Quiet, observant and always three steps ahead.",
      "survival": "Sees the sunrise with the survivors",
      "desc": "You don’t rush in and you don’t panic. You watch, think and quietly guide the group toward the safest choice: the exit nobody noticed, the rule everybody forgot. You let others be loud while you keep the plan in your head. In a horror movie, that kind of patience is a superpower.",
      "keywords": ["Calm", "Observant", "Strategic"],
      "strengths": [
        "You notice exits, patterns and warning signs",
        "You keep the group together without fuss",
        "You stay calm, so others do too"
      ],
      "scene": "While everyone argues, you point to the window: “That’s the way out. Nobody touches the basement door.”",
      "tip": "Say your plan out loud sooner. Your quiet ideas are the ones that save the day."
    },
    "researcher": {
      "name": "The Researcher",
      "word": "researcher",
      "vibe": "The one who finds the old newspaper clipping that explains everything.",
      "survival": "Cracks the mystery just in time",
      "desc": "Your weapon against fear is knowledge. While others run around, you dig through old diaries, library archives and forgotten websites until the pieces fit. You prefer to work alone and from a safe distance, and that is exactly why you are the one who finally works out the rules of the curse.",
      "keywords": ["Clever", "Careful", "Thorough"],
      "strengths": [
        "You find the backstory nobody else can",
        "You figure out the rules before anyone breaks them",
        "You stay safe by keeping a smart distance"
      ],
      "scene": "Surrounded by old books at midnight, you gasp: “It’s happened before. Exactly fifty years ago…”",
      "tip": "Share what you find right away. The answer only helps if the others hear it in time."
    },
    "final": {
      "name": "The Final Survivor",
      "word": "final survivor",
      "vibe": "Careful, kind and still standing when the credits roll.",
      "survival": "Still standing when the credits roll",
      "desc": "You listen to your instincts, and they are very good. You notice when something feels wrong, you don’t take silly risks and you look after the people around you. You are not the loudest character, but you are the one the audience trusts. When the sun finally comes up, you are the one walking out of the house.",
      "keywords": ["Intuitive", "Careful", "Caring"],
      "strengths": [
        "Your gut feeling warns you before danger shows up",
        "You avoid the classic horror-movie mistakes",
        "You protect your friends without hesitation"
      ],
      "scene": "Dawn breaks over the woods. You step outside, wrapped in a blanket, as the music swells.",
      "tip": "Keep trusting your instincts. That little voice saying “don’t go in there” is always right."
    },
    "runner": {
      "name": "The Runner",
      "word": "runner",
      "vibe": "Your plan is simple: run first, ask questions later.",
      "survival": "Outruns almost the whole cast",
      "desc": "Creepy doll? Gone. Strange voice? Already out the door. You don’t wait around to find out what the noise was, and honestly, that is the smartest move in most horror movies. You trust your gut, you travel light and you always know where the nearest exit is. Your friends might call you a coward, but you’ll be the one telling the story.",
      "keywords": ["Quick", "Instinctive", "Self-reliant"],
      "strengths": [
        "You leave before things get bad",
        "You always know the nearest exit",
        "You never get trapped by curiosity"
      ],
      "scene": "Before anyone has finished saying “Did you hear that?”, you’re already halfway down the driveway.",
      "tip": "Running is smart, but keep your phone charged and wait for your friends at a safe spot."
    }
  }
};
