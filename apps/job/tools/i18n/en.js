/* Career Personality Test (en)
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
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
    "title": "Career Personality Test – What Job Suits Me?",
    "description": "Take the career personality test: 11 quick questions, about 2 minutes, no sign-up. Find your work style, your strengths and jobs that might suit you. Just for fun.",
    "ogTitle": "Career Personality Test 💼 What job suits me?",
    "ogDescription": "Eleven light questions about how you like to work. Discover your work style, your strengths and a few jobs worth exploring."
  },
  "siteName": "Career Personality Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "💼 What job suits me?",
    "h1Kicker": "Career Personality Test",
    "h1Html": "Where would you<br><em>shine</em> at work?",
    "hook": "Some people light up in a busy room, others in a quiet corner with a tricky puzzle. Answer eleven everyday questions and discover your work style, your hidden strengths and a few jobs that might fit you surprisingly well.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 questions",
    "start": "Find my work style →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Sorting through your answers…",
    "sub": "Matching your style with the world of work"
  },
  "result": {
    "title": "My work style: {name}",
    "metaDesc": "Career personality test result: {name}. {vibe} See your strengths, jobs that might suit you and a tip for your work style.",
    "eyebrow": "Your work personality",
    "gaugeLabel": "Where your answers leaned",
    "axes": [
      ["People", "Things & ideas"],
      ["Imagination", "Structure"],
      ["Out in front", "Deep focus"]
    ],
    "jobsLabel": "Jobs worth exploring",
    "strengthsLabel": "Your strengths",
    "envLabel": "Where you shine",
    "watchLabel": "Watch out for",
    "tipLabel": "Work style tip",
    "buddyLabel": "Dream coworker",
    "rivalLabel": "Opposite style",
    "disclaimer": "Just for fun. This is a light quiz, not a professional career assessment. The jobs are ideas to explore, not advice, and you can thrive in many other paths too.",
    "sameShare": "{pct}% of people got this work style",
    "shareText": "My work style is {name} {emoji} “{vibe}” What’s yours?",
    "ctaStrong": "A friend shared their work style",
    "ctaSub": "Which job suits you? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My work personality",
    "brand": "💼 Career Personality Test",
    "defaultKicker": "A light career quiz",
    "defaultTitle": "What job suits me?",
    "defaultDesc": "11 questions · 2 minutes · your work style"
  },
  "faq": [
    {
      "q": "How is my result chosen?",
      "a": "Every answer nudges three scales: working with people or with things and ideas, imagining new things or building clear systems, and stepping out in front or diving deep. Your result is where those three meet, and the same answers always give the same result."
    },
    {
      "q": "Is this a real career assessment?",
      "a": "No. It is a light quiz made for fun and reflection, not a professional or scientific test. For important decisions about study or work, talk to a career counselor, teachers or people who do the jobs you are curious about."
    },
    {
      "q": "Why do the suggested jobs feel a bit off?",
      "a": "Four jobs can never cover a whole person. They are examples of work that often uses your style, so treat them as starting points. Many people with your result are happy in completely different fields."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which result came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Career Personality Test",
    "description": "Privacy Policy for the Career Personality Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Career Personality Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of October 31, 2026."
      ]
    ],
    "back": "← Back to the Career Personality Test"
  },
  "questions": [
    {
      "q": "A group project kicks off. Which role do you end up taking without even trying?",
      "choices": [
        "The one quietly working out a clever fix nobody else thought of",
        "The one pitching ideas and presenting them to the class or team",
        "The one who grabs the tools and actually builds the thing, step by step",
        "The one keeping the schedule and checking that nobody is left behind"
      ]
    },
    {
      "q": "You suddenly get a free day. What sounds best?",
      "choices": [
        "Coffee with a friend and a long chat about a film you both loved",
        "Finally sorting your photo folders or your budget, neat and tidy",
        "Getting people together for a match or a board game night you host",
        "A one-day workshop where you make something with your own hands"
      ]
    },
    {
      "q": "You just bought a new gadget. What do you do first?",
      "choices": [
        "Set it up right away, following the steps one by one",
        "Write a simple how-to so your family can use it too",
        "Film the unboxing or show it off to your friends",
        "Dig into the settings to find hidden features and clever uses"
      ]
    },
    {
      "q": "Which compliment makes your day?",
      "choices": [
        "“Not a single mistake. You’re so precise.”",
        "“The team runs smoothly because of you.”",
        "“Wait, you made this yourself? That’s amazing.”",
        "“What you said really stayed with me.”"
      ]
    },
    {
      "q": "Pick your dream workplace.",
      "choices": [
        "A friendly team office where everyone works in sync",
        "Out on site, moving around, with real equipment to handle",
        "A buzzing place where something new happens every day",
        "A quiet studio with a whiteboard full of half-finished ideas"
      ]
    },
    {
      "q": "Something goes wrong. What is your first move?",
      "choices": [
        "Gather everyone, split up the tasks and take the lead",
        "Listen to each person involved and look for a fresh angle",
        "Calmly check the numbers and records to find the cause",
        "Start tinkering and try a new way to fix it on the spot"
      ]
    },
    {
      "q": "What keeps showing up in your video recommendations?",
      "choices": [
        "Vlogs, comedy clips and the latest trends",
        "Repairs, DIY projects and camping gear reviews",
        "Science, space and unsolved mysteries explained",
        "Real stories of people who help others, like teachers and nurses"
      ]
    },
    {
      "q": "On a trip, you are usually the one who…",
      "choices": [
        "Wanders without a plan and fills a camera roll or sketchbook",
        "Builds the perfect spreadsheet of budget and timetable",
        "Ends up chatting with locals in a little café",
        "Guides the whole group from place to place"
      ]
    },
    {
      "q": "It’s the day before a deadline. You…",
      "choices": [
        "Write a clear to-do list and knock out the tasks one by one",
        "Polish the final presentation and keep everyone’s spirits up",
        "Check on teammates one by one to see if anyone is stuck",
        "Get lost in the work and come up with an even better idea"
      ]
    },
    {
      "q": "In a club or group, which job would you like most?",
      "choices": [
        "Welcoming newcomers and listening when someone needs to talk",
        "Being the president who keeps everything moving",
        "Designing the posters, logo and merch",
        "Keeping the records and the shared money in order"
      ]
    },
    {
      "q": "Ten years from now, what would you love to hear?",
      "choices": [
        "“I always felt safe knowing you were there.”",
        "“You were the first one to think of that, weren’t you?”",
        "“You made so many people smile.”",
        "“If it goes through your hands, it just works.”"
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "The Showrunner",
      "word": "showrunner",
      "vibe": "Give you a stage and an idea, and you’ll get the whole room excited.",
      "desc": "You come alive where people, ideas and action meet. You enjoy pitching something new, getting others on board and seeing it happen in front of an audience. Energy is your superpower: a dull meeting turns into a brainstorm when you walk in. Work that lets you launch, present and connect will probably feel less like work and more like play.",
      "keywords": ["Energetic", "Persuasive", "Full of ideas"],
      "strengths": ["Turning a rough idea into something people want to join", "Reading a room and lifting its mood", "Speaking up and presenting with confidence"],
      "jobs": ["Marketing manager", "TV producer", "Event planner", "Startup founder"],
      "env": "Fast-moving teams, launches and live events where every week brings something new and you can see people react to your work.",
      "watch": "Starting more projects than you can finish. Shiny new ideas can steal time from the ones already halfway done.",
      "tip": "Pair up with someone who loves details, and agree on one finish line before you start the next big thing."
    },
    "storyteller": {
      "name": "The Storyteller",
      "word": "storyteller",
      "vibe": "You turn ideas into words and stories that people remember.",
      "desc": "You are drawn to people and to meaning. You like to understand how others feel, then shape that into words, lessons or stories that help them see something new. You may not need the spotlight, but your quiet influence travels far. Work that lets you listen, write, teach or explain will probably feel like a natural fit.",
      "keywords": ["Empathetic", "Expressive", "Thoughtful"],
      "strengths": ["Explaining complicated things in a simple, human way", "Listening closely and noticing what people really mean", "Finding the story behind facts and numbers"],
      "jobs": ["Writer or editor", "Teacher", "Counselor", "Copywriter"],
      "env": "Calm spaces with room to think, close conversations and projects where your words reach and help real people.",
      "watch": "Taking other people’s worries home with you. Caring deeply is a gift, but you need time to recharge too.",
      "tip": "Keep a small notebook of ideas and phrases. Your best work often starts as a single line you almost forgot."
    },
    "captain": {
      "name": "The Captain",
      "word": "captain",
      "vibe": "When things get busy, people look to you to steer.",
      "desc": "You are at your best when there is a team to guide and a goal to reach. You like clear plans, you make decisions without fuss and you keep everyone moving in the same direction. People trust you in a crisis because you stay calm and organized. Work that puts you in charge of people, schedules or service will probably bring out your natural leadership.",
      "keywords": ["Decisive", "Organized", "Dependable"],
      "strengths": ["Splitting a big job into clear tasks for each person", "Staying calm and practical under pressure", "Keeping promises and deadlines"],
      "jobs": ["Project manager", "Sales manager", "Hotel manager", "Flight attendant"],
      "env": "Active teams with clear goals, where you can coordinate people, solve problems on the spot and see results quickly.",
      "watch": "Doing everything yourself because it feels faster. Letting others take the wheel sometimes makes the whole team stronger.",
      "tip": "Before you hand out tasks, ask each person what they would most like to do. You might be surprised by the answers."
    },
    "caretaker": {
      "name": "The Caretaker",
      "word": "caretaker",
      "vibe": "You make sure nobody falls through the cracks.",
      "desc": "You care about people, and you show it through steady, practical support. You notice when someone is struggling, you remember the details that matter and you like systems that keep everyone safe and looked after. You may not ask for credit, but teams feel the difference when you are there. Work that lets you help, support and protect others will probably feel meaningful to you.",
      "keywords": ["Caring", "Patient", "Reliable"],
      "strengths": ["Noticing small signs that someone needs help", "Following through carefully, day after day", "Creating a calm, trusting atmosphere"],
      "jobs": ["Nurse", "HR specialist", "Social worker", "Customer success manager"],
      "env": "Close-knit teams with a clear purpose, where kindness and good routines make a real difference to people.",
      "watch": "Saying yes to everyone. Protecting your own time is part of taking good care of others.",
      "tip": "Block out one hour a week that belongs only to your own goals, and guard it like any other appointment."
    },
    "creator": {
      "name": "The Creator",
      "word": "creator",
      "vibe": "Hand you the materials, and something new appears.",
      "desc": "You think with your hands and your eyes. You love making things that people can see, taste, hold or use, and you are happiest when you can try, test and improve as you go. Rules are fine, but you prefer room to experiment. Work that lets you design, craft or produce something real will probably keep you excited for a long time.",
      "keywords": ["Inventive", "Hands-on", "Visual"],
      "strengths": ["Turning an idea into a real, finished piece", "Spotting what looks or feels just right", "Learning fast by trying things out"],
      "jobs": ["Graphic designer", "Chef", "Video creator", "Interior designer"],
      "env": "Studios, kitchens, workshops or sets where you can work with real materials and show what you made.",
      "watch": "Polishing forever. A finished piece out in the world teaches you more than a perfect one in a drawer.",
      "tip": "Keep a portfolio of everything you make, even small things. It becomes your best story about yourself."
    },
    "inventor": {
      "name": "The Inventor",
      "word": "inventor",
      "vibe": "Your mind is a lab where new ideas never stop brewing.",
      "desc": "You love big questions and clever answers. You enjoy diving deep into a puzzle, testing ideas in your head and finding a solution nobody expected. You do your best thinking when you have quiet time and freedom to explore. Work that lets you research, design systems or solve hard problems will probably feel like a playground for your curiosity.",
      "keywords": ["Curious", "Original", "Analytical"],
      "strengths": ["Seeing patterns and connections others miss", "Focusing deeply on one hard problem", "Coming up with original solutions"],
      "jobs": ["Research scientist", "Software developer", "Architect", "Game developer"],
      "env": "Quiet places with space to focus, interesting problems and colleagues who enjoy a good debate about ideas.",
      "watch": "Keeping your brilliant ideas in your head. Sharing them early helps others understand and build on them.",
      "tip": "Explain your current idea to a friend in three sentences. If they get it, you are ready to build it."
    },
    "builder": {
      "name": "The Builder",
      "word": "builder",
      "vibe": "You don’t just talk about it. You get it done, properly.",
      "desc": "You are practical, steady and happiest when you can see real results. You like clear steps, good tools and work that gets you moving instead of sitting still. When something breaks, you are the one who calmly fixes it. Work that lets you build, repair, operate or keep things running safely will probably give you a deep sense of satisfaction.",
      "keywords": ["Practical", "Skilled", "Steady"],
      "strengths": ["Following a process carefully and safely", "Fixing problems with calm, hands-on skill", "Getting real, visible results"],
      "jobs": ["Mechanical engineer", "Electrician", "Pilot", "Car mechanic"],
      "env": "Workshops, sites, labs or cockpits where skill, safety and teamwork matter, and every day you can see what you achieved.",
      "watch": "Underselling your skills. What feels obvious to you is often impressive to everyone else.",
      "tip": "Learn one new tool or technique each season. Your skills grow fastest when you stack them step by step."
    },
    "analyst": {
      "name": "The Analyst",
      "word": "analyst",
      "vibe": "Details, data and order are your quiet superpowers.",
      "desc": "You notice what others overlook. You enjoy careful work, clear rules and the satisfaction of getting every number and detail exactly right. You think before you act, and people trust your judgment because it is based on facts. Work that lets you organize, check, measure or analyze information will probably feel calm and rewarding to you.",
      "keywords": ["Precise", "Logical", "Calm"],
      "strengths": ["Spotting errors and patterns in information", "Keeping complex things neat and organized", "Making careful, fact-based decisions"],
      "jobs": ["Accountant", "Data analyst", "Librarian", "Lab technician"],
      "env": "Calm, well-organized places with clear expectations, where accuracy is valued and you have time to do things right.",
      "watch": "Waiting for perfect information. Sometimes a good-enough decision today beats a perfect one next month.",
      "tip": "Share one insight from your work each week. Your careful findings help more people when they hear about them."
    }
  }
};
