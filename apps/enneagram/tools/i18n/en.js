/* Enneagram Test (en)
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
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
    "title": "Enneagram Test – What’s My Enneagram Type?",
    "description": "Free Enneagram test: 12 quick everyday questions, about 2 minutes, no sign-up. Find your Enneagram type, core motivation, strengths and growth tips.",
    "ogTitle": "Enneagram Test 🔷 What’s your type?",
    "ogDescription": "Twelve everyday questions about how you react, decide and recharge. Discover your Enneagram type, what drives you and how you grow."
  },
  "siteName": "Enneagram Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🔷 Nine ways of seeing the world",
    "h1Kicker": "Enneagram Test",
    "h1Html": "What really<br><em>drives</em> you?",
    "hook": "Some people lead, some keep the peace, some quietly figure everything out. The Enneagram maps nine ways people see the world and what they want most. Answer twelve quick everyday questions and meet your type.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 12 questions",
    "start": "Find my type →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Connecting the dots…",
    "sub": "Finding your point on the circle"
  },
  "result": {
    "title": "Enneagram Type {n}: {name}",
    "metaDesc": "Enneagram test result: Type {n}, {name}. {vibe} See your core motivation, strengths and three growth tips.",
    "eyebrow": "Your Enneagram type",
    "typeNum": "Type {n}",
    "desireLabel": "Deep down you want",
    "fearLabel": "What you try to avoid",
    "gaugeLabel": "Where your answers leaned",
    "centerLabel": "Your energy starts in the…",
    "centers": ["Gut", "Heart", "Head"],
    "stanceLabel": "You go after what you need by…",
    "stances": ["Pushing ahead", "Doing what’s right", "Stepping back"],
    "strengthsLabel": "Your strengths",
    "tipsLabel": "Tips for growth",
    "growthLabel": "When you grow, you borrow from",
    "disclaimer": "Just for fun and self-reflection. This short quiz is not an official Enneagram assessment such as the RHETI, and it is not a psychological test or diagnosis. Most people recognize themselves in several types, so read the result as a starting point, not a label.",
    "sameShare": "{pct}% of people got this type",
    "shareText": "I’m Enneagram Type {n}, {name} {emoji} “{vibe}” What’s your type?",
    "ctaStrong": "A friend shared their Enneagram type",
    "ctaSub": "What drives you? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My Enneagram type",
    "brand": "🔷 Enneagram Test",
    "defaultKicker": "A quick personality quiz",
    "defaultTitle": "What’s my Enneagram type?",
    "defaultDesc": "12 questions · 2 minutes · what drives you"
  },
  "faq": [
    {
      "q": "How is my type chosen?",
      "a": "Half of the questions look at where your energy tends to start, in your body and instincts, your feelings or your thinking. The other half look at how you usually go after what you need. Your type sits where those two answers meet, and the same answers always give the same result."
    },
    {
      "q": "Is this the official Enneagram test?",
      "a": "No. It is a short quiz for fun and self-reflection, not an official or validated assessment such as the RHETI, and not a psychological diagnosis. If your result does not feel right, read about the neighboring types too. Many people only find their type after some reflection."
    },
    {
      "q": "Can my type change?",
      "a": "In Enneagram teaching your core type stays fairly stable, but how you express it changes a lot with stress, mood and personal growth. Quiz answers can shift too, so try again in a few months and see whether the same type comes up."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which type came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Enneagram Test",
    "description": "Privacy Policy for the Enneagram Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Enneagram Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 4, 2026."
      ]
    ],
    "back": "← Back to the Enneagram Test"
  },
  "questions": [
    {
      "q": "You walk into a party where you hardly know anyone. What do you do first?",
      "choices": [
        "Get a feel for the room and go where the energy is",
        "Notice who looks friendly, and how I’m coming across",
        "Hang back a moment and work out how things go here",
        "Grab a drink and just jump into a conversation"
      ]
    },
    {
      "q": "In a group project, you naturally…",
      "choices": [
        "Take the lead and push things forward",
        "Take my part and do it my own way, quietly",
        "Make sure everyone’s on track and nothing is missed",
        "Throw out the boldest idea and get people excited"
      ]
    },
    {
      "q": "When you face a big decision, what do you trust most?",
      "choices": [
        "How it feels, and what it means for the people I care about",
        "Research, a pros-and-cons list and a backup plan",
        "Talking it over with someone close until it feels right",
        "My gut. Most of the time I just know."
      ]
    },
    {
      "q": "When you really want something, you usually…",
      "choices": [
        "Check that it’s okay with the people around me first",
        "Go straight after it",
        "Dream about it for a long time before doing anything",
        "Work hard, do it the right way and trust it will pay off"
      ]
    },
    {
      "q": "What throws you off the most on a bad day?",
      "choices": [
        "Not knowing what’s coming next",
        "Being bossed around, or something feeling unfair",
        "Feeling unappreciated or overlooked",
        "Too many loose ends and nobody with a clear plan"
      ]
    },
    {
      "q": "After a long, busy week, recharging looks like…",
      "choices": [
        "Time alone, phone off, in my own world",
        "A new plan: a trip, a night out, something big",
        "A slow day of doing absolutely nothing",
        "Clearing my to-do list so I can finally relax for real"
      ]
    },
    {
      "q": "You’re stuck in a line that isn’t moving. You…",
      "choices": [
        "Chat with the person next to me or text a friend",
        "Feel it in my body: restless, jaw tight",
        "Work out how long it’ll take and look for a faster option",
        "Walk up to the front to see what’s actually going on"
      ]
    },
    {
      "q": "Someone disagrees with you in front of others. You…",
      "choices": [
        "Look for a fair middle ground everyone can live with",
        "Push back and make my case",
        "Go quiet and mull it over later on my own",
        "Honestly, I kind of enjoy a good debate"
      ]
    },
    {
      "q": "Which compliment would make your day?",
      "choices": [
        "“You always know what’s really going on.”",
        "“You have such a big heart.”",
        "“You’re so real. You always stand your ground.”",
        "“There’s nobody quite like you.”"
      ]
    },
    {
      "q": "A rule that makes no sense to you…",
      "choices": [
        "Gets quietly worked around, without making a scene",
        "Bugs me, but I’d hate to let anyone down",
        "Gets questioned out loud, or simply ignored",
        "Still gets followed until it can be changed properly"
      ]
    },
    {
      "q": "When a friend has a problem, you’re the one who…",
      "choices": [
        "Steps in and does something about it",
        "Listens and makes them feel less alone",
        "Helps them think it through and see their options",
        "Looks things up and finds out who could help"
      ]
    },
    {
      "q": "A free Saturday with zero plans. You’re most likely to…",
      "choices": [
        "Message people and make something happen",
        "Disappear into a book, a game or a hobby for hours",
        "Catch up on chores or help someone who needs it",
        "Let the day drift and see where it goes"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "The Reformer",
      "word": "reformer",
      "vibe": "You see how things could be better, and you quietly hold yourself to it.",
      "desire": "To be good, fair and to do things right",
      "fear": "Being wrong, careless or letting things slide",
      "desc": "You carry a clear inner sense of right and wrong, and you notice what could be improved almost everywhere you look. You keep your promises, you take responsibility, and people trust you because you mean what you say. The same high standards can turn into a loud inner critic, though, and you may feel annoyed when others do not seem to care as much. At your best you are principled, patient and wise, and you know that good enough is sometimes exactly right.",
      "keywords": ["Principled", "Reliable", "Thorough"],
      "strengths": ["Doing things properly, even when nobody is checking", "Standing up for what is fair", "Turning messy situations into clear, workable plans"],
      "tips": ["Notice your inner critic and answer it the way a kind friend would.", "Choose one thing a week to leave unfinished on purpose, and see that the world does not fall apart.", "Make room for play. Rest and fun are part of doing life well, not a reward for finishing everything."],
      "growth": "In growth you loosen up and find more joy, spontaneity and lightness."
    },
    "type2": {
      "name": "The Helper",
      "word": "helper",
      "vibe": "You notice what people need before they say it, and you love making their day better.",
      "desire": "To be loved and to feel truly needed",
      "fear": "Being unwanted or unloved",
      "desc": "You are warm, generous and tuned in to other people. You remember birthdays, you show up when it matters, and friends often feel seen and cared for around you. Relationships are at the center of your life. Because you are so focused on others, you can forget your own needs, find it hard to say no, or feel hurt when your care is not noticed. At your best you give freely, without keeping score, and you let others look after you too.",
      "keywords": ["Warm", "Generous", "Caring"],
      "strengths": ["Making people feel welcome and valued", "Spotting what someone needs right now", "Building close, loyal friendships"],
      "tips": ["Before you say yes, ask yourself what you need today.", "Let people help you, even with small things. Receiving is part of a close relationship.", "Say your needs out loud instead of hoping someone will guess them."],
      "growth": "In growth you turn some of that care inward and get more honest about your own feelings and needs."
    },
    "type3": {
      "name": "The Achiever",
      "word": "achiever",
      "vibe": "You set a goal, find the fastest way there and bring everyone along with you.",
      "desire": "To feel valuable and to succeed",
      "fear": "Being worthless or failing",
      "desc": "You are driven, adaptable and energetic. You know how to set goals, read a room and get results, and people are often inspired by your confidence and drive. You like to grow, improve and be good at what you do. Sometimes, though, it is easy to measure yourself only by what you achieve and to keep running even when you are tired. At your best you are genuine as well as successful, and you know you are worth something even on a slow day.",
      "keywords": ["Driven", "Adaptable", "Inspiring"],
      "strengths": ["Turning ideas into real results", "Motivating a team and keeping momentum", "Learning quickly and adapting to any setting"],
      "tips": ["Ask yourself what you want, not just what will look good.", "Schedule real downtime and treat it as seriously as a deadline.", "Share a failure or a doubt with someone you trust. Being real makes people feel closer to you."],
      "growth": "In growth you become more loyal to people and causes bigger than your own success."
    },
    "type4": {
      "name": "The Individualist",
      "word": "individualist",
      "vibe": "You feel things deeply and want your life to mean something truly your own.",
      "desire": "To be yourself and to find your own meaning",
      "fear": "Having no identity or being ordinary",
      "desc": "You are sensitive, creative and honest about emotions that other people often avoid. You notice beauty and meaning in small things, and you would rather be authentic than fit in. Friends come to you when life gets hard, because you are not afraid of real feelings. At times you may feel that something is missing or that others have it easier, and moods can pull you along. At your best you turn deep feelings into creativity and compassion, and you enjoy what is already good in your life.",
      "keywords": ["Creative", "Authentic", "Deep"],
      "strengths": ["Expressing feelings in words, art or style", "Staying with people through difficult emotions", "Seeing beauty and meaning others miss"],
      "tips": ["When a mood hits, name it, then do one small practical thing anyway.", "Keep a list of what is already good in your life and add to it often.", "Create something regularly, even if nobody sees it. Steady habits give your feelings a home."],
      "growth": "In growth you add structure and discipline, turning feelings into steady work you are proud of."
    },
    "type5": {
      "name": "The Investigator",
      "word": "investigator",
      "vibe": "You want to understand how everything works, ideally from a quiet corner.",
      "desire": "To understand the world and to be capable",
      "fear": "Being helpless, overwhelmed or clueless",
      "desc": "You are curious, observant and independent. You love to dig into a topic until you really understand it, and you often notice details and patterns others overlook. You value your time, energy and privacy, and you need space to think before you act or share. Sometimes you may stay in your head a little too long, or pull back when people ask for more than you feel ready to give. At your best you share your knowledge generously and step into the world with confidence.",
      "keywords": ["Curious", "Insightful", "Independent"],
      "strengths": ["Thinking clearly when others panic", "Learning deeply and explaining complex ideas", "Staying objective and calm"],
      "tips": ["Share what you know before it feels finished. Your half-ready ideas are often already useful.", "Try things with your hands and body, not just your mind.", "Tell people when you need time alone, so they do not read your quiet as distance."],
      "growth": "In growth you move from watching to doing, and act with more confidence and presence."
    },
    "type6": {
      "name": "The Loyalist",
      "word": "loyalist",
      "vibe": "You are the friend who thinks ahead, has a plan and sticks around when it counts.",
      "desire": "To feel safe, supported and sure of the people around you",
      "fear": "Being without support or guidance",
      "desc": "You are loyal, responsible and quick to spot what could go wrong, which makes you a great planner and a trustworthy friend. You take commitments seriously and care deeply about your people and communities. Because you think through every scenario, your mind can get busy with doubts, and it may take you a while to trust others, or yourself. At your best you are brave and steady, and you trust your own judgment as much as you trust the people you love.",
      "keywords": ["Loyal", "Responsible", "Prepared"],
      "strengths": ["Spotting problems early and planning for them", "Standing by friends through thick and thin", "Bringing people together around a shared goal"],
      "tips": ["When worry spirals, write down what is actually happening right now, not what might happen.", "Make one small decision a day without asking anyone, and notice it works out.", "Remember your track record. You have handled hard things before."],
      "growth": "In growth you relax, trust life a little more and find a calm, steady center."
    },
    "type7": {
      "name": "The Enthusiast",
      "word": "enthusiast",
      "vibe": "Life is an adventure, and you want to try every flavor on the menu.",
      "desire": "To be happy, free and full of good experiences",
      "fear": "Being trapped in pain, boredom or limits",
      "desc": "You are upbeat, curious and full of ideas. You find the fun in almost anything, you bounce back quickly, and your energy lifts everyone around you. New places, plans and possibilities light you up. Because there is always something exciting next, you can find it hard to stay with one thing, or with difficult feelings, for long. At your best you combine your joy with focus and depth, and you discover that being present can feel even better than the next plan.",
      "keywords": ["Upbeat", "Curious", "Spontaneous"],
      "strengths": ["Bringing energy and fun to any group", "Coming up with creative solutions fast", "Bouncing back from setbacks"],
      "tips": ["Finish one plan before starting the next, and enjoy that finished feeling.", "When something hurts, let yourself feel it for a moment before looking for a distraction.", "Try a slow, quiet hour now and then. Calm can be its own kind of adventure."],
      "growth": "In growth you slow down, focus deeply and enjoy quiet, thoughtful moments."
    },
    "type8": {
      "name": "The Challenger",
      "word": "challenger",
      "vibe": "You say it straight, protect your people and never back down from a challenge.",
      "desire": "To be strong, in control of your own life and to protect others",
      "fear": "Being controlled, harmed or powerless",
      "desc": "You are confident, direct and full of energy. You take charge when things get messy, you stand up for people who cannot stand up for themselves, and others feel safe with you in their corner. You value honesty and respect strength. Sometimes your intensity can come across as too much, and you may hide softer feelings so you never look vulnerable. At your best you use your strength to lift others up, and you let the people you trust see your big, warm heart.",
      "keywords": ["Bold", "Protective", "Direct"],
      "strengths": ["Making decisions and taking charge in a crisis", "Protecting people who are treated unfairly", "Speaking honestly when others hold back"],
      "tips": ["Before you push, ask one more question and really listen to the answer.", "Show your softer side to someone you trust. It is strength, not weakness.", "Notice when you are running on full power, and pick which battles truly matter."],
      "growth": "In growth you open your heart and use your strength to care for others gently."
    },
    "type9": {
      "name": "The Peacemaker",
      "word": "peacemaker",
      "vibe": "You bring calm wherever you go and can see every side of the story.",
      "desire": "To have inner peace and harmony with others",
      "fear": "Conflict, loss of connection or being cut off",
      "desc": "You are easygoing, patient and accepting. You can see many points of view, you calm tense situations, and people feel relaxed and accepted around you. You are often the glue that keeps a group together. Because you want things to stay peaceful, you may go along with others, put off your own priorities or avoid saying what you really think. At your best you are steady and present, and you know that your voice and your wishes matter as much as anyone else’s.",
      "keywords": ["Calm", "Accepting", "Supportive"],
      "strengths": ["Calming conflict and helping people understand each other", "Listening without judging", "Creating a relaxed, welcoming atmosphere"],
      "tips": ["Ask yourself what you want before asking what others want.", "Pick one important task each morning and do it first.", "Share your honest opinion, kindly. A little friction can make relationships stronger."],
      "growth": "In growth you wake up to your own goals and take action with energy and focus."
    }
  }
};
