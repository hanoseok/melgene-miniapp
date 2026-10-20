/* 집순이·집돌이 지수 테스트 — en (site root /, default + x-default)
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Homebody Test – How Homebody Are You?",
    "description": "How homebody are you? Take this free homebody test: 10 everyday situations, about 1 minute, no sign-up. Get your homebody % and find out how introverted-homey you really are.",
    "ogTitle": "Homebody Test 🏠 How Homebody Are You?",
    "ogDescription": "A free 1-minute quiz. Answer 10 everyday situations and get your homebody percentage."
  },
  "siteName": "Homebody Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🏠 Homebody index",
    "h1Kicker": "Homebody Test",
    "h1Html": "How much of a<br><em>homebody</em> are you?",
    "hook": "Ten tiny situations will tell you how much you love your home, and how hard the world outside has to try.",
    "metaTime": "⏱️ About 1 minute",
    "metaCount": "🛋️ 10 questions",
    "start": "Check my level →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Counting your cozy points…",
    "sub": "Checking the couch"
  },
  "result": {
    "title": "Homebody Test: I’m a {name}",
    "eyebrow": "Your homebody type is",
    "strengthsLabel": "Your superpowers",
    "othersLabel": "How others see you",
    "bestLabel": "Best match",
    "clashLabel": "Clashing type",
    "meterLabel": "Homebody level",
    "moreShare": "{pct}% of players are more homebody than you",
    "shareText": "I’m a {name} {emoji} — “{vibe}” How homebody are you?",
    "shareTextPct": "I’m {pct}% homebody: {name} {emoji}. How homebody are you?",
    "ctaStrong": "A friend shared their result with you",
    "ctaSub": "How homebody are you? It takes 1 minute.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My homebody level",
    "brand": "🏠 Homebody Test",
    "defaultKicker": "Homebody Test",
    "defaultTitle": "How homebody are you?",
    "defaultDesc": "10 everyday situations · about 1 minute"
  },
  "faq": [
    {
      "q": "How is my homebody percentage calculated?",
      "a": "Each answer is worth 0 to 10 points toward the home side. The points from your ten answers are added up and stretched to a 0 to 100 scale, so a higher percentage means you lean more toward staying in."
    },
    {
      "q": "Is a homebody the same as an introvert?",
      "a": "Not exactly. Introversion is about where you get your energy, while being a homebody is about where you like to spend your time. Plenty of extroverts love their couch and plenty of introverts love long walks."
    },
    {
      "q": "Is this test scientific?",
      "a": "No. It is a light-hearted quiz for fun and conversation, not a psychological assessment. Your result only reflects how you answer today."
    },
    {
      "q": "How is “more homebody than X% of players” worked out?",
      "a": "We anonymously count which score range each finished test lands in. Once at least 20 results exist, we compare yours with them. The line appears only on your own result and stays hidden until enough people have played."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Homebody Test",
    "description": "Privacy Policy for the Homebody Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Homebody Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which score range came up, so we can show how common each result is."
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
        "This policy is effective as of October 21, 2026."
      ]
    ],
    "back": "← Back to the homebody test"
  },
  "questions": [
    {
      "q": "It’s Friday evening and the group chat lights up: “Drinks downtown?”",
      "choices": [
        "Reply “rain check” and head home happy",
        "Go for an hour, then sneak away",
        "Counter-offer: someone’s place with takeout",
        "Go and stay until closing time"
      ]
    },
    {
      "q": "A long weekend with nothing booked. Your ideal plan?",
      "choices": [
        "Pack a bag and leave on a spontaneous trip",
        "Not leaving the house on purpose",
        "A day trip, then back to my own bed",
        "A nearby café or park, then home"
      ]
    },
    {
      "q": "The doorbell rings and you weren’t expecting anyone. You…",
      "choices": [
        "Open up, a little surprised",
        "Peek through the peephole first",
        "Love it. Spontaneous visits are the best",
        "Freeze and wait until they leave"
      ]
    },
    {
      "q": "Where would you most like to live?",
      "choices": [
        "A quiet home with my own corner",
        "Right in the middle of a buzzing city",
        "A nest where everything is within arm’s reach",
        "A flat with a nice balcony near the action"
      ]
    },
    {
      "q": "It’s a rainy Sunday. What’s your first thought?",
      "choices": [
        "Best weather ever: blanket, tea, window",
        "Ugh, there go all my plans",
        "Finally, a perfect excuse to stay in",
        "Fine, I’ll find an indoor outing"
      ]
    },
    {
      "q": "A friend invites you to an event two weeks from now.",
      "choices": [
        "Let me check my calendar first",
        "I start planning how to cancel gracefully",
        "Count me in!",
        "I say yes, then dread it as it gets close"
      ]
    },
    {
      "q": "You get home after a whole day out. You feel…",
      "choices": [
        "Still full of energy, ready for more",
        "Pleasantly tired",
        "Finally: door locked, phone on silent",
        "Relief, like a battery recharging"
      ]
    },
    {
      "q": "It’s dinnertime. Where do you want to be?",
      "choices": [
        "Cooking something at home",
        "Out, but at a quiet little place",
        "At a lively restaurant full of people",
        "On the couch with delivery and a show"
      ]
    },
    {
      "q": "How many days in a row can you stay home without going stir-crazy?",
      "choices": [
        "One day is plenty",
        "Weeks, and I wouldn’t even notice",
        "About three days",
        "A week, easily"
      ]
    },
    {
      "q": "You have some spare money. Where does it go?",
      "choices": [
        "A night out with friends",
        "Tickets and trips",
        "Gadgets, games or streaming for the couch",
        "A cozy upgrade: a good chair, lamp or bedding"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Born Outdoors",
      "vibe": "Home is where you drop your bag on the way out.",
      "desc": "You treat your front door like a revolving door. A day inside feels like a day wasted, and your best ideas arrive on a trail, a train or a terrace. You recharge around people and fresh air, and you collect plans the way other people collect mugs. Your home is mostly a place to sleep, shower and change shoes.",
      "strengths": [
        "Endless energy",
        "Says yes to adventure",
        "Never bored"
      ],
      "others": "People see you as the one who always has plans and somehow gets everyone else off the couch."
    },
    "roamer": {
      "name": "Weekend Roamer",
      "vibe": "Out more than in, but you do love a good nap.",
      "desc": "You love being out and about, especially with friends, but you also know the joy of an evening that ends early. Your week is full of plans, and a quiet night at home is a treat rather than a habit. You enjoy variety: a new café, a short trip, a street you haven’t walked yet.",
      "strengths": [
        "Social and curious",
        "Flexible plans",
        "Great at starting things"
      ],
      "others": "People see you as friendly and lively, always up for coffee, yet someone who sometimes disappears to recharge."
    },
    "switch": {
      "name": "Balanced Switcher",
      "vibe": "Half couch, half city, fully adaptable.",
      "desc": "You enjoy a loud night out and a silent night in with the same smile. Neither feels like a sacrifice; you simply read your own energy and follow it. That flexibility makes you easy company for outgoing friends and homebodies alike. Your only challenge is deciding which side to listen to on a Friday.",
      "strengths": [
        "Fits any plan",
        "Reads your own energy",
        "Easy company"
      ],
      "others": "People see you as easygoing and hard to pin down, the friend who fits into any plan."
    },
    "nester": {
      "name": "Cozy Nester",
      "vibe": "Happiest with a blanket, a lamp and a plan to stay.",
      "desc": "Home is where you feel most like yourself. You’ve made it comfortable on purpose: the right lighting, the right chair, the right snacks. You still go out for the people who matter, but you keep evenings short and exits close. Your ideal event has a start time, an end time and a couch nearby.",
      "strengths": [
        "Makes any space cozy",
        "Spends energy wisely",
        "Great host at home"
      ],
      "others": "People see you as warm and calm, the friend whose place everyone wants to hang out at."
    },
    "homebody": {
      "name": "Certified Homebody",
      "vibe": "Your best plans are the ones you cancel.",
      "desc": "You genuinely love being at home, and you’ve stopped apologizing for it. Your space is your recharge station, your hobby room and your safe place all at once. Invitations get a polite pause before an answer, and a free weekend with nothing on the calendar feels like a gift. You’re not antisocial; you just choose your outings carefully.",
      "strengths": [
        "Happy alone",
        "Rich inner world",
        "Protects your peace"
      ],
      "others": "People see you as calm, a bit mysterious and surprisingly funny once you’re in your element."
    },
    "legend": {
      "name": "Home Legend",
      "vibe": "The door is a suggestion. The couch is a kingdom.",
      "desc": "You have turned staying in into an art form. Delivery apps know you by name, your setup is optimized and your social battery runs on silence. You can go days without noticing the outside world and be perfectly content. When you do leave, it is for something truly worth it, and you plan the trip home before you go.",
      "strengths": [
        "Master of comfort",
        "Fully self-sufficient",
        "Zero FOMO"
      ],
      "others": "People see you as a legend: rarely spotted, always at peace and the person to ask for a great show recommendation."
    }
  }
};
