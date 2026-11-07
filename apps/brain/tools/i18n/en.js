/* Left Brain Right Brain Test (en)
 * 8 result ids (architect, mapmaker, debater, hacker, weaver, designer, firework, dreamer); questions[i].choices[j] follow brain-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: think logic/intuition, plan plan/flow, express words/images;
 *  side 0 = what people usually call "left-brain style", side 1 = "right-brain style").
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own left/right bar ({n}) and the real server share ({pct}).
 * Honesty: left/right-brain "dominance" is a popular myth; both hemispheres work together. Just for fun — not a psychological test or diagnosis.
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
    "title": "Left Brain Right Brain Test – Logic or Intuition?",
    "description": "Free left brain right brain test: 12 everyday questions, about 2 minutes, no sign-up. See your left/right thinking-style balance and your brain character, just for fun.",
    "ogTitle": "Left Brain Right Brain Test 🧠 Logic or intuition?",
    "ogDescription": "Twelve quick everyday questions. See how your thinking style leans and meet your brain character. A fun quiz, not a diagnosis."
  },
  "siteName": "Left Brain Right Brain Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🧠 A thinking-style quiz",
    "h1Kicker": "Left Brain Right Brain Test",
    "h1Html": "Logic or intuition?<br>Which way do you <em>lean</em>?",
    "hook": "Do you make lists or follow your gut? Explain with words or with a quick sketch? Answer twelve everyday questions and see how your thinking habits balance out, plus the brain character that fits you.",
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
    "text": "Reading your thinking style…",
    "sub": "Both halves are talking it over"
  },
  "result": {
    "title": "My brain character: {name}",
    "metaDesc": "Left brain right brain test result: {name}. {vibe} See your strengths, tips, your best buddy and your friendly rival.",
    "eyebrow": "Your brain character is…",
    "lrTitle": "Your left / right thinking-style balance",
    "lrLeft": "Left-brain style",
    "lrRight": "Right-brain style",
    "lrNote": "Calculated from your own twelve answers: logic, plans and words count as left-brain style; intuition, flow and images as right-brain style.",
    "pctFmt": "{n}%",
    "leanLeft": "Your answers lean toward left-brain habits.",
    "leanRight": "Your answers lean toward right-brain habits.",
    "leanBalanced": "Your answers are nicely balanced between both styles.",
    "traitsLabel": "Your strengths",
    "tipsLabel": "Tips for you",
    "perfectLabel": "Where you shine",
    "bestLabel": "Best buddy",
    "rivalLabel": "Friendly rival",
    "disclaimer": "Just for fun! Being “left-brained” or “right-brained” is a popular myth: brain research shows both hemispheres work together on almost everything. This quiz only looks at your thinking-style preferences. It is not a psychological test or diagnosis.",
    "sameShare": "{pct}% of people got this result",
    "shareText": "My brain character is {name} {emoji} “{vibe}” Left or right, which way do you lean?",
    "ctaStrong": "A friend shared their brain character",
    "ctaSub": "Logic or intuition? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My brain character",
    "brand": "🧠 Left Brain Right Brain Test",
    "defaultKicker": "A thinking-style quiz",
    "defaultTitle": "Logic or intuition?",
    "defaultDesc": "12 questions · 2 minutes · your left/right balance"
  },
  "faq": [
    {
      "q": "Are people really left-brained or right-brained?",
      "a": "No, that is a popular myth. Each hemisphere has some specialties, but brain imaging shows both sides work together on almost every task, and large studies have not found people who use one side more overall. Here, “left-brain style” and “right-brain style” are just friendly nicknames for thinking habits."
    },
    {
      "q": "How is my result chosen?",
      "a": "Each question looks at one of three thinking habits: reasoning things out or trusting a hunch, planning ahead or going with the flow, and explaining with words or with pictures. The combination of the three picks your character, and the same answers always give the same result."
    },
    {
      "q": "Where does the left/right percentage come from?",
      "a": "It is calculated only from your own answers. Choices for logic, plans and words add to the left-brain style side, choices for intuition, flow and images add to the right-brain style side, and stronger answers count a little more."
    },
    {
      "q": "Is this a real psychological test?",
      "a": "No. It is a light-hearted quiz for fun, not a psychological assessment or diagnosis. Most people use every style depending on the situation, so enjoy your result and compare it with friends."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which result came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Left Brain Right Brain Test",
    "description": "Privacy Policy for the Left Brain Right Brain Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Left Brain Right Brain Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 8, 2026."
      ]
    ],
    "back": "← Back to the Left Brain Right Brain Test"
  },
  "questions": [
    {
      "q": "You need a new phone. How do you choose?",
      "choices": [
        "Compare specs and prices side by side until one clearly wins",
        "Read a few reviews, then go with the one that feels right",
        "Hold it in the store. If it feels right in my hand, that’s the one",
        "Check the key specs, then pick the best value"
      ]
    },
    {
      "q": "A free Saturday is coming up. What does it look like?",
      "choices": [
        "No plans at all. I’ll see where the day takes me",
        "Planned by Wednesday, almost down to the hour",
        "One or two things fixed, the rest left open",
        "A rough idea, but I’m happy to change it"
      ]
    },
    {
      "q": "A friend asks how to get to a café you know. You…",
      "choices": [
        "Text the street name and a landmark or two",
        "Draw a quick map or send a pin with a photo of the entrance",
        "Write step-by-step directions: left at the bakery, then second right…",
        "Send a screenshot of the map"
      ]
    },
    {
      "q": "A friend can’t decide between two job offers and asks you. You…",
      "choices": [
        "Ask which one makes them light up when they talk about it",
        "Make a pros and cons list together: salary, commute, growth",
        "Ask a few practical questions before saying anything",
        "Tell them to trust their gut. Deep down they already know"
      ]
    },
    {
      "q": "You’re packing for a weekend trip. You…",
      "choices": [
        "Pack the night before, following a list in my head",
        "Throw things in a bag right before I walk out the door",
        "Pack on the morning of the trip and buy whatever I forget",
        "Use a checklist I wrote days ago"
      ]
    },
    {
      "q": "How do you remember things best?",
      "choices": [
        "I picture it: the page, the color, where it was",
        "I doodle or sketch it in the margin",
        "I repeat it to myself a few times",
        "I write it down in my own words"
      ]
    },
    {
      "q": "A new board game arrives with a thick rulebook. You…",
      "choices": [
        "Skim the rules, then start playing",
        "Read every rule before the first move",
        "Skip the rules and learn by playing",
        "Watch others play a round, then jump in"
      ]
    },
    {
      "q": "What does your to-do list look like?",
      "choices": [
        "Neat, sorted by priority, ticked off every day",
        "It exists somewhere. I check it now and then",
        "A short list of the things that really matter",
        "A list? It all lives in my head and I go with the flow"
      ]
    },
    {
      "q": "You have to explain a new idea to your team or class. You…",
      "choices": [
        "Add a few simple pictures to the slides",
        "Talk it through with a couple of examples",
        "Draw a diagram on the board and build it up step by step",
        "Write a clear, well-organized summary first"
      ]
    },
    {
      "q": "Something feels off about someone you just met, but you can’t say why. You…",
      "choices": [
        "Trust the feeling. It’s usually right",
        "Wait and see what they actually do",
        "Keep a little distance for now, just in case",
        "Ignore it until there’s a real reason"
      ]
    },
    {
      "q": "You have one day in a city you’ve never visited. First move?",
      "choices": [
        "Pick one place to see, then wander from there",
        "Get lost on purpose and follow the side streets",
        "Follow the schedule I made before the trip",
        "Check a list of top spots and choose a few"
      ]
    },
    {
      "q": "What do you enjoy most in your free time?",
      "choices": [
        "Reading, writing or word games",
        "Drawing, taking photos or building things",
        "Watching films and beautifully shot videos",
        "Podcasts and long conversations"
      ]
    }
  ],
  "types": {
    "architect": {
      "name": "Blueprint Brain",
      "word": "blueprint",
      "vibe": "Clear plans, sharp reasons and the right words. You build ideas that stand.",
      "keywords": ["Logical", "Organized", "Articulate"],
      "desc": "You like to understand how things work before you jump in. You think in steps, keep a plan close and explain your ideas so clearly that others can follow them. People trust you with the tricky parts, because you notice gaps and fix them before they become problems. You enjoy a good argument as long as it is fair and based on facts. Sometimes you wait for the perfect plan a little too long, and that is when a small leap of faith helps.",
      "traits": ["You turn messy problems into clear steps", "You explain complicated things simply", "You keep promises and deadlines", "You spot mistakes others miss"],
      "tips": ["Try one small decision a day on gut feeling alone", "Leave a little empty space in your plans for surprises"],
      "perfect": "A project with a clear goal, a solid plan and a team that counts on your careful thinking."
    },
    "mapmaker": {
      "name": "Map Maker",
      "word": "map maker,mapmaker",
      "vibe": "You see the whole picture and draw the route. Logic with a visual eye.",
      "keywords": ["Strategic", "Visual", "Methodical"],
      "desc": "You reason things through, but you do it in pictures. Charts, layouts and mental maps help you see how everything connects, and you plan the route before you start walking. Friends ask you to organize trips, rearrange rooms or untangle complicated schedules, because you make it all look simple. You prefer showing to telling, and a quick sketch says more to you than a long paragraph. Remember that not every journey needs a map. Some of the best places are found by taking a wrong turn.",
      "traits": ["You see how the pieces fit together", "You plan routes, rooms and schedules with ease", "You explain with charts and sketches", "You stay calm when things get complicated"],
      "tips": ["Share your thinking out loud, not only on paper", "Let someone else plan a day for you once in a while"],
      "perfect": "Planning a big trip or a new space, with a blank page, a pen and time to think it all through."
    },
    "debater": {
      "name": "Quick-Witted Debater",
      "word": "debater",
      "vibe": "Fast logic, quick words and a love of the moment. You think best out loud.",
      "keywords": ["Witty", "Sharp", "Adaptable"],
      "desc": "You reason fast and talk even faster. You do not need a script, because your best arguments come to you in the middle of the conversation. You like facts and clear logic, but you also love the thrill of thinking on your feet, which makes you great at discussions, quizzes and last-minute presentations. People enjoy your humor and your honest opinions. Just remember that not every chat is a debate. Sometimes a friend wants you to listen more than to win.",
      "traits": ["You think clearly under pressure", "You find the right words on the spot", "You adapt quickly when plans change", "You make discussions lively and fun"],
      "tips": ["Pause and ask one more question before you answer", "Write your best ideas down so they don’t fly away"],
      "perfect": "A lively discussion, a quiz night or a meeting where quick thinking saves the day."
    },
    "hacker": {
      "name": "Puzzle Hacker",
      "word": "puzzle hacker",
      "vibe": "You tinker, test and figure it out. Logic in motion, one clever fix at a time.",
      "keywords": ["Curious", "Inventive", "Hands-on"],
      "desc": "You love a good puzzle, and you solve it by trying things. Instead of reading the manual, you take it apart, look at how it fits and find a clever shortcut nobody else saw. Your mind is logical, but it works best when your hands are busy and the plan is flexible. Friends call you when something is broken, confusing or stuck. You may get bored with routine tasks, so mix them with small challenges that keep your curiosity awake.",
      "traits": ["You learn fastest by trying things yourself", "You find shortcuts and clever fixes", "You stay curious about how things work", "You keep going when a problem gets tricky"],
      "tips": ["Finish one project before opening the next", "Explain your clever fixes so others can learn them too"],
      "perfect": "A broken gadget, a tricky game level or an escape room with the clock running."
    },
    "weaver": {
      "name": "Story Weaver",
      "word": "story weaver",
      "vibe": "You follow your feelings and turn them into words. Intuition with a steady plan.",
      "keywords": ["Empathic", "Thoughtful", "Expressive"],
      "desc": "You read people and moments with your heart, and you know how to put those feelings into words. You often sense what a friend needs before they say it, and you find the perfect message for a card, a speech or a difficult talk. You like a gentle rhythm in life, with plans and rituals that make you feel at home. Your intuition is strong, so trust it, but also give yourself permission to change course when your heart says something new.",
      "traits": ["You sense how others feel", "You find touching words for any moment", "You keep friendships warm and steady", "You turn experiences into great stories"],
      "tips": ["Share your own feelings as often as you listen to others", "Keep a notebook for the ideas that come at night"],
      "perfect": "A heartfelt letter, a deep talk with a good friend or a story that makes someone feel understood."
    },
    "designer": {
      "name": "Calm Designer",
      "word": "designer",
      "vibe": "A feeling for beauty and a patient hand. You make things look and feel right.",
      "keywords": ["Aesthetic", "Patient", "Intuitive"],
      "desc": "You have a feel for colors, shapes and moods, and you take your time to get them right. You may not explain why something works, but you know it when you see it, and your instinct is usually spot on. You enjoy calm projects with a clear rhythm: arranging a room, editing photos, cooking something that looks as good as it tastes. People feel relaxed in the spaces you create. Do not wait for perfection before sharing your work. It is already lovely.",
      "traits": ["You have a natural eye for beauty", "You create calm, cozy spaces", "You work patiently on the details", "You notice moods others miss"],
      "tips": ["Show your work before it feels finished", "Put your feelings into words now and then, not only into images"],
      "perfect": "A quiet afternoon arranging, painting or styling something until it feels just right."
    },
    "firework": {
      "name": "Idea Firework",
      "word": "firework",
      "vibe": "Sparks of ideas, bursts of words and big feelings. You light up every chat.",
      "keywords": ["Inspiring", "Spontaneous", "Warm"],
      "desc": "Ideas pop into your head all day, and you cannot wait to share them. You trust your intuition, follow your enthusiasm and talk about your plans with so much energy that others want to join in. You are the friend who suggests the spontaneous road trip, the new café or the crazy idea that turns out brilliant. You feel a lot and you show it, which makes people feel close to you. Your energy is a gift, but choose a few ideas to finish, so they can really shine.",
      "traits": ["You come up with ideas nonstop", "You inspire people with your enthusiasm", "You make new friends easily", "You turn ordinary days into adventures"],
      "tips": ["Pick your favorite idea of the week and see it through", "Give quieter friends space to share their ideas too"],
      "perfect": "A brainstorming session, a spontaneous trip or a party where everyone becomes friends."
    },
    "dreamer": {
      "name": "Daydream Artist",
      "word": "daydream",
      "vibe": "Free imagination and vivid pictures in your mind. You see worlds others don’t.",
      "keywords": ["Imaginative", "Free-spirited", "Original"],
      "desc": "Your mind is full of colors, scenes and what-ifs. You follow your intuition, change plans when inspiration strikes and think in pictures more than in sentences. Ordinary moments become little films in your head, and you often notice beauty that others walk past. You do your best work when nobody rushes you and you can follow a spark wherever it leads. Your originality is your superpower. Just keep a few simple routines, so your big ideas have room to land.",
      "traits": ["You imagine things nobody else would", "You see beauty in everyday details", "You stay open to new experiences", "You express yourself with style"],
      "tips": ["Turn one daydream into a real small project this month", "Set a gentle reminder for the things that matter to others"],
      "perfect": "A free day with music on, a sketchbook in your bag and no plan at all."
    }
  }
};
