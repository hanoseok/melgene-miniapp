/* Free MBTI Test – 16 Personality Types (en)
 * 16 result ids (intj intp entj entp infj infp enfj enfp istj isfj estj esfj istp isfp estp esfp) and question order as in mbti-core.js
 * (the scoring lives only there). questions[i] must stay in the same order as QUESTIONS[i] (axis + direction).
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a type, a nickname or quote a statement.
 * types.<id>.word = a distinctive word of the nickname (comma-separated) — only used by the spoiler check.
 * Placeholders: {code} {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 * Unofficial: never claim to be the official MBTI® assessment (result.disclaimer + faq[0]).
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Free MBTI Test – 16 Personality Types",
    "description": "Take a free MBTI-style test: 20 everyday statements, 3 minutes, no sign-up. Get your 4-letter personality type with real percentage bars, strengths and a best match.",
    "ogTitle": "Free MBTI Test 🧩 Which of the 16 types are you?",
    "ogDescription": "20 everyday statements, 3 minutes. Find your 4-letter type."
  },
  "siteName": "Free MBTI Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🧩 16 personality types",
    "h1Kicker": "Free MBTI Test",
    "h1Html": "Which of the 16<br><em>types are you</em>?",
    "hook": "Twenty quick statements about everyday life. Agree or disagree, then see your four-letter type and how strongly you lean each way.",
    "metaTime": "⏱️ 3 min",
    "metaCount": "✏️ 20 questions",
    "start": "Start the test →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}",
    "scale": [
      "Strongly disagree",
      "Disagree",
      "Not sure",
      "Agree",
      "Strongly agree"
    ]
  },
  "loading": {
    "text": "Reading your answers…",
    "sub": "Putting your four letters together"
  },
  "axes": [
    { "a": "Extraversion", "b": "Introversion" },
    { "a": "Sensing", "b": "Intuition" },
    { "a": "Thinking", "b": "Feeling" },
    { "a": "Judging", "b": "Perceiving" }
  ],
  "result": {
    "title": "MBTI test result: {code} – {name}",
    "metaDesc": "Free MBTI test result {code}: {name}. {vibe}",
    "eyebrow": "Your type is",
    "barsLabel": "How you lean",
    "strengthsLabel": "Strengths",
    "blindLabel": "Blind spots",
    "workLabel": "At work",
    "loveLabel": "In love",
    "bestLabel": "Best match",
    "clashLabel": "Clash",
    "sameShare": "{pct}% of players got this type",
    "shareText": "I’m {code} {emoji} “{name}”. {vibe} What’s your type?",
    "ctaStrong": "A friend shared their type",
    "ctaSub": "What’s yours? 20 questions, 3 minutes.",
    "retry": "Take the test again",
    "disclaimer": "Unofficial fun test inspired by the 16-type model. Not the official MBTI® assessment and not affiliated with The Myers-Briggs Company. MBTI is a trademark of its owner."
  },
  "og": {
    "eyebrow": "My type is",
    "brand": "🧩 Free MBTI Test",
    "defaultKicker": "16 personality types",
    "defaultTitle": "Which type are you?",
    "defaultDesc": "20 everyday statements · 3 minutes"
  },
  "faq": [
    {
      "q": "Is this the official MBTI test?",
      "a": "No. This is an unofficial fun test inspired by the 16-type model. It is not the official MBTI® assessment and is not affiliated with The Myers-Briggs Company. MBTI is a trademark of its owner."
    },
    {
      "q": "How is my type calculated?",
      "a": "Each statement leans toward one side of one of four pairs. Your answers are added up per pair, and the stronger side gives you that letter. The bars show how strongly you leaned each way."
    },
    {
      "q": "Why did I get a different result this time?",
      "a": "If a pair is close to 50%, a small change in mood can flip that letter. Answer as your everyday self, and read a close pair as a sign that you use both sides."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are scored in your browser and never stored. We only count, anonymously, which type came up, so we can show how common each one is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Free MBTI Test",
    "description": "Privacy Policy for the Free MBTI Test: how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Free MBTI Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which type came up, so we can show how common each type is."
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
        "This policy is effective as of October 12, 2026."
      ]
    ],
    "back": "← Back to the test"
  },
  "questions": [
    { "q": "After a weekend packed with plans and people, I feel recharged, not drained." },
    { "q": "I often catch myself daydreaming about “what if” scenarios." },
    { "q": "When a friend vents about a problem, my first instinct is to suggest a fix." },
    { "q": "I usually pack for a trip the night before, or even that morning." },
    { "q": "When the group chat lights up, I tend to read along quietly before jumping in." },
    { "q": "When I cook from a recipe, I follow the amounts exactly." },
    { "q": "I’d rather pick a restaurant everyone feels good about than the top-rated one." },
    { "q": "I feel more relaxed when my weekend already has a plan." },
    { "q": "In a new class or job, I’m usually the one who starts the small talk." },
    { "q": "After a movie, I care more about the hidden meaning than about what actually happened." },
    { "q": "In a discussion, being accurate matters more to me than keeping the mood light." },
    { "q": "I like to keep my options open instead of deciding early." },
    { "q": "My ideal Friday night is a cozy one at home, alone or with one close friend." },
    { "q": "I trust what I’ve seen and tried myself more than a hunch about the future." },
    { "q": "When I make a big decision, I think first about how it will affect the people around me." },
    { "q": "Crossing things off a to-do list is one of my small joys." },
    { "q": "I often think out loud. Talking helps me figure out what I mean." },
    { "q": "I get excited about a new idea even before I know whether it will work." },
    { "q": "I can give honest criticism without feeling bad about it for long." },
    { "q": "A sudden change of plans feels more exciting than stressful." }
  ],
  "types": {
    "intj": {
      "name": "Quiet Chess Master",
      "word": "chess",
      "vibe": "Three moves ahead, and calm about it.",
      "desc": "You see the big picture and quietly build a plan to get there. You value competence, think independently and rarely do anything without a reason. People may find you reserved at first, but your ideas are often the ones that stick.",
      "strengths": ["Long-term thinking", "Independent", "Sharp problem solver"],
      "blind": ["Can seem cold", "Impatient with small talk", "Hard on half-baked ideas"],
      "work": "You shine when you own a complex problem and have room to design the solution your way.",
      "love": "You show love through loyalty and effort, not grand speeches, and you want a partner who thinks with you."
    },
    "intp": {
      "name": "Curious Idea Lab",
      "word": "idea lab",
      "vibe": "Always asking “but why?”",
      "desc": "Your mind is a lab that never closes. You love taking ideas apart to see how they work and you enjoy a good theory more than a quick answer. You are relaxed, open-minded and surprisingly funny once you get going.",
      "strengths": ["Endlessly curious", "Logical", "Original thinker"],
      "blind": ["Lost in thought", "Leaves projects half done", "Forgets feelings in debates"],
      "work": "You do your best work with freedom to explore, a tricky puzzle and few pointless meetings.",
      "love": "You need a partner who enjoys deep, odd conversations and gives you space to think."
    },
    "entj": {
      "name": "Born Team Captain",
      "word": "captain",
      "vibe": "Sees the goal, rallies the team.",
      "desc": "You are decisive, energetic and made for leading. When a group stalls, you are the one who sets the direction and gets things moving. You love a challenge and you expect a lot from yourself and others.",
      "strengths": ["Natural leader", "Decisive", "Goal-driven"],
      "blind": ["Can be bossy", "Impatient with slow pace", "Forgets to rest"],
      "work": "Give you a team, a deadline and a big target, and you will organize a path to win.",
      "love": "You are committed and protective, and you appreciate a partner who can stand up to you."
    },
    "entp": {
      "name": "Debate Spark",
      "word": "debate",
      "vibe": "Every rule is just an opening argument.",
      "desc": "You are quick-witted, playful and full of ideas. You love testing limits, poking holes in plans and arguing for fun, even for the side you do not believe in. Boredom is your only real enemy.",
      "strengths": ["Quick thinker", "Inventive", "Charming talker"],
      "blind": ["Argues for sport", "Starts more than finishes", "Dislikes routine"],
      "work": "You thrive in brainstorming, pitching and fixing problems nobody else has figured out yet.",
      "love": "You want a partner who laughs at your jokes, pushes back on your ideas and never lets things get dull."
    },
    "infj": {
      "name": "Gentle Visionary",
      "word": "visionary",
      "vibe": "Quietly reads the room, and the future.",
      "desc": "You are insightful, idealistic and deeply caring. You often sense what people feel before they say it, and you want your life to mean something. You are private, but fiercely devoted to the few people you let in.",
      "strengths": ["Insightful", "Principled", "Deep listener"],
      "blind": ["Takes on others’ worries", "Perfectionist", "Hides own needs"],
      "work": "You are at your best when the work matters to you and helps people in a real way.",
      "love": "You seek a soulmate-level connection and give a partner full, thoughtful attention."
    },
    "infp": {
      "name": "Dreamy Poet",
      "word": "poet",
      "vibe": "A soft heart with a rich inner world.",
      "desc": "You are kind, imaginative and guided by your values. You notice beauty in small things and feel things deeply, even if you do not always show it. You want to be true to yourself and help the world become a little gentler.",
      "strengths": ["Empathetic", "Creative", "True to values"],
      "blind": ["Takes criticism hard", "Avoids conflict", "Daydreams past deadlines"],
      "work": "You flourish with meaningful, creative tasks and a team that respects your way of working.",
      "love": "You are romantic and loyal, and you need a partner who understands your feelings without judgment."
    },
    "enfj": {
      "name": "Warm Cheerleader",
      "word": "cheerleader",
      "vibe": "Brings out the best in everyone.",
      "desc": "You are warm, encouraging and naturally good with people. You see potential in others and love helping them grow. Groups tend to gather around you, because you make everyone feel included.",
      "strengths": ["Inspiring", "Socially aware", "Generous"],
      "blind": ["Overcommits", "Needs approval", "Forgets own limits"],
      "work": "You shine as a mentor, organizer or the person who keeps a team motivated and connected.",
      "love": "You are caring and attentive, and you put real effort into making a relationship grow."
    },
    "enfp": {
      "name": "Sunny Free Spirit",
      "word": "free spirit, sunny",
      "vibe": "Excited about people, ideas and everything.",
      "desc": "You are enthusiastic, creative and curious about everyone you meet. You see possibilities everywhere and your energy lifts a room. You need freedom and a little adventure, and you bring warmth to every plan.",
      "strengths": ["Enthusiastic", "Imaginative", "Warm with everyone"],
      "blind": ["Easily distracted", "Hates routine", "Overthinks at night"],
      "work": "You do great in creative, people-facing roles where every day brings something new.",
      "love": "You fall for connection and fun, and you want a partner who shares your curiosity about life."
    },
    "istj": {
      "name": "Reliable Rock",
      "word": "rock",
      "vibe": "Says it, does it, every time.",
      "desc": "You are responsible, steady and thorough. You keep your promises, respect proven methods and like things done properly. In a chaotic world, people know they can count on you.",
      "strengths": ["Dependable", "Organized", "Detail-minded"],
      "blind": ["Resists sudden change", "Can seem rigid", "Keeps feelings private"],
      "work": "You excel with clear goals, steady routines and responsibility you can carry from start to finish.",
      "love": "You show love through consistency and practical care, and you take commitment seriously."
    },
    "isfj": {
      "name": "Caring Guardian",
      "word": "guardian",
      "vibe": "Remembers your birthday and your favorite snack.",
      "desc": "You are gentle, loyal and quietly attentive. You notice what people need and take care of it without fuss. You value harmony and tradition, and you make any place feel safe and warm.",
      "strengths": ["Thoughtful", "Loyal", "Hard-working"],
      "blind": ["Struggles to say no", "Underrates self", "Worries a lot"],
      "work": "You are the steady helper every team needs, especially in roles where care and accuracy matter.",
      "love": "You love through small daily kindnesses and hope a partner notices them."
    },
    "estj": {
      "name": "Get-It-Done Organizer",
      "word": "organizer",
      "vibe": "Has a plan, a list and a backup list.",
      "desc": "You are practical, direct and great at running things. You like clear rules, fair play and visible results. When something needs organizing, you step up and get it done.",
      "strengths": ["Efficient", "Clear communicator", "Responsible"],
      "blind": ["Can be blunt", "Inflexible", "Judges others’ pace"],
      "work": "You excel at managing projects and people, especially when structure and deadlines matter.",
      "love": "You are reliable and straightforward, and you show love by building a stable life together."
    },
    "esfj": {
      "name": "Big-Hearted Host",
      "word": "host, big-hearted",
      "vibe": "Makes sure everyone has a seat and a snack.",
      "desc": "You are friendly, sociable and caring. You love bringing people together and making sure no one feels left out. You notice moods quickly and work hard to keep everyone happy.",
      "strengths": ["Warm", "Cooperative", "Great at hosting"],
      "blind": ["Sensitive to criticism", "Needs harmony", "Puts self last"],
      "work": "You thrive in team roles where you can support people and keep things running smoothly.",
      "love": "You are affectionate and devoted, and you love creating traditions with a partner."
    },
    "istp": {
      "name": "Cool-Headed Fixer",
      "word": "fixer",
      "vibe": "Calm in a crisis, handy with anything.",
      "desc": "You are practical, independent and calm under pressure. You learn by doing, love figuring out how things work and stay cool when others panic. You value freedom and keep your words short.",
      "strengths": ["Hands-on", "Calm in a crisis", "Resourceful"],
      "blind": ["Hard to read", "Dislikes long plans", "Bored by routine"],
      "work": "You shine when you can solve real problems with your own hands and skills.",
      "love": "You show love through action and shared activities more than words."
    },
    "isfp": {
      "name": "Soft-Spoken Artist",
      "word": "artist",
      "vibe": "Lives in the moment, beautifully.",
      "desc": "You are gentle, sensitive and quietly creative. You express yourself through style, art or small gestures rather than speeches. You value freedom and kindness and live closely by your own taste.",
      "strengths": ["Artistic", "Easygoing", "Kind"],
      "blind": ["Avoids planning", "Holds feelings in", "Shy in big groups"],
      "work": "You do best with creative freedom, a calm space and work that feels personally meaningful.",
      "love": "You are tender and loyal, and you show love with thoughtful surprises."
    },
    "estp": {
      "name": "Thrill Seeker",
      "word": "thrill",
      "vibe": "Jumps first, figures it out midair.",
      "desc": "You are bold, energetic and quick to act. You love action, adventure and a bit of risk. You read people well, think on your feet and bring excitement wherever you go.",
      "strengths": ["Action-oriented", "Persuasive", "Adaptable"],
      "blind": ["Impulsive", "Bored by theory", "Pushes limits"],
      "work": "You thrive in fast-moving jobs where you can act, negotiate and see results right away.",
      "love": "You are fun and spontaneous, and you want a partner who joins the adventure."
    },
    "esfp": {
      "name": "Spotlight Star",
      "word": "spotlight",
      "vibe": "The party starts when you walk in.",
      "desc": "You are lively, playful and warm. You love people, music and the joy of the present moment. You make ordinary days fun and you are often the first to cheer someone up.",
      "strengths": ["Fun-loving", "Friendly", "Lives in the moment"],
      "blind": ["Avoids hard talks", "Spends on impulse", "Easily bored"],
      "work": "You shine in lively, social roles where you can work with people and keep the energy up.",
      "love": "You are affectionate and generous, and you love making every date an event."
    }
  }
};
