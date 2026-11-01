/* Attachment Style Test (en)
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
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
    "title": "Attachment Style Test – What’s My Attachment Style?",
    "description": "Free attachment style quiz: 11 everyday questions about friends, family and partners, about 2 minutes, no sign-up. See how you connect and get gentle tips.",
    "ogTitle": "Attachment Style Test 🫂 How do you connect?",
    "ogDescription": "Eleven everyday situations with friends, family and partners. Discover your attachment style, your strengths and kind tips for closer relationships."
  },
  "siteName": "Attachment Style Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🫂 How do you connect?",
    "h1Kicker": "Attachment Style Test",
    "h1Html": "How do you love<br>and <em>connect</em>?",
    "hook": "A late reply, a cancelled plan, a friend who suddenly opens up. The way you react to these small moments says a lot about how you bond with people. Answer eleven everyday questions and meet your attachment style.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 questions",
    "start": "Find my style →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Reading between the lines…",
    "sub": "Mapping how you connect with people"
  },
  "result": {
    "title": "My attachment style: {name}",
    "metaDesc": "Attachment style test result: {name}, {nick}. {vibe} See your strengths and three kind tips for your relationships.",
    "eyebrow": "Your attachment style",
    "gaugeLabel": "Where your answers leaned",
    "axes": [
      ["At ease", "Often worried"],
      ["Lean in", "Need space"]
    ],
    "strengthsLabel": "Your strengths",
    "tipsLabel": "Tips for your relationships",
    "matchLabel": "Feels easy with",
    "disclaimer": "Just for fun and self-reflection. This is a light quiz, not a psychological assessment or diagnosis. Attachment styles can shift over time and in different relationships. If relationships often feel painful, talking with a counselor can really help.",
    "sameShare": "{pct}% of people got this style",
    "shareText": "My attachment style is {name} {emoji} “{vibe}” What’s yours?",
    "ctaStrong": "A friend shared their attachment style",
    "ctaSub": "How do you connect? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My attachment style",
    "brand": "🫂 Attachment Style Test",
    "defaultKicker": "A gentle relationship quiz",
    "defaultTitle": "What’s my attachment style?",
    "defaultDesc": "11 questions · 2 minutes · how you connect"
  },
  "faq": [
    {
      "q": "How is my result chosen?",
      "a": "Each answer nudges two scales that researchers use to describe adult attachment: how much you worry about closeness and how comfortable you are depending on others. Your result is where those two meet, and the same answers always give the same result."
    },
    {
      "q": "Is this a psychological diagnosis?",
      "a": "No. It is a light quiz for fun and self-reflection, not a professional or scientific assessment. Attachment style is not a disorder or a fixed label. If relationships often feel painful or confusing, a counselor or therapist can help you explore it properly."
    },
    {
      "q": "Can my attachment style change?",
      "a": "Yes. Many people show different patterns with different people, and supportive relationships, self-awareness and therapy can all help someone feel safer and more at ease over time. Try the test again in a few months and see."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and are not stored. We only count, anonymously, which result came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Attachment Style Test",
    "description": "Privacy Policy for the Attachment Style Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Attachment Style Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 2, 2026."
      ]
    ],
    "back": "← Back to the Attachment Style Test"
  },
  "questions": [
    {
      "q": "A close friend hasn’t replied to your message all day. What goes through your mind?",
      "choices": [
        "They’re probably busy. I’ll hear from them later.",
        "I reread my message, wondering if I said something wrong.",
        "Honestly, I barely notice. I’m not big on constant texting.",
        "I worry a little, then tell myself I shouldn’t care so much."
      ]
    },
    {
      "q": "Someone you’ve just started getting close to says, “I really like spending time with you.” You…",
      "choices": [
        "Feel thrilled, then wonder if they’ll still feel that way next month",
        "Feel warm inside and tell them the feeling is mutual",
        "Feel happy, yet strangely want to take a small step back",
        "Feel a bit awkward and change the subject with a joke"
      ]
    },
    {
      "q": "You’re having a really rough week. What do you usually do?",
      "choices": [
        "Handle it on my own. I don’t like leaning on people.",
        "Want to reach out, but stay quiet so I won’t be a burden",
        "Tell someone close what’s going on and let them help",
        "Message several people, hoping someone will check on me"
      ]
    },
    {
      "q": "A friend cancels your plans at the last minute.",
      "choices": [
        "I say it’s fine, but quietly decide not to count on them so much",
        "Secretly a little relieved. More time to myself!",
        "I wonder if they don’t really want to see me",
        "No problem. We just pick another day."
      ]
    },
    {
      "q": "A new friend starts sharing personal stories. How about you?",
      "choices": [
        "I open up too, step by step, as it feels natural",
        "I want to open up, but freeze halfway and pull back",
        "I share a lot quickly. I want us to get close fast.",
        "I keep things light. Personal stuff stays private."
      ]
    },
    {
      "q": "You and someone close disagree about something that matters.",
      "choices": [
        "I want to fix it right now. Waiting feels unbearable.",
        "I need space and go quiet until it blows over",
        "We talk it through calmly, even if it’s a bit uncomfortable",
        "I swing between wanting to talk and wanting to disappear"
      ]
    },
    {
      "q": "Someone close is away for a week. How much contact feels right?",
      "choices": [
        "We’ll catch up when they’re back. I enjoy the space.",
        "A few messages are nice, but no messages is fine too",
        "Hard to say. I miss them, yet too many messages make me tense.",
        "A little update every day. I like knowing we’re connected."
      ]
    },
    {
      "q": "Someone does something unexpectedly kind for you.",
      "choices": [
        "I’m touched, but part of me wonders what they want back",
        "I love it and feel I should do even more for them",
        "I feel slightly uneasy, like I now owe them one",
        "I say thank you and simply enjoy it"
      ]
    },
    {
      "q": "When you think about the people closest to you, which sounds most like you?",
      "choices": [
        "I trust they’ll be there for me, and they can count on me too",
        "I like them, but I’m happiest relying on myself",
        "I sometimes worry that I care more than they do",
        "I want to be close, yet part of me expects to get hurt"
      ]
    },
    {
      "q": "A new person joins your group and everyone seems to love them.",
      "choices": [
        "I don’t mind either way. I keep my own small circle.",
        "I worry a little that I’ll be left out",
        "I stay a bit guarded until I know I can trust them",
        "Great, one more friend to hang out with"
      ]
    },
    {
      "q": "Someone asks gently, “Is everything okay with you lately?”",
      "choices": [
        "I say “I’m fine,” then later wish I had told them more",
        "I tell them honestly how I’m doing",
        "I say I’m fine and change the subject. I’ll sort it out myself.",
        "I’m so relieved someone noticed that it all comes pouring out"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "Secure",
      "nick": "The Steady Harbor",
      "word": "secure",
      "vibe": "You can be close without losing yourself, and apart without losing faith.",
      "desc": "You tend to trust that the people you love will be there, and you are comfortable being there for them too. Closeness does not scare you, and neither does a little distance. When something goes wrong you can usually say what you feel without blowing up or shutting down. People often feel calmer around you, as if you give them a safe place to land. That does not mean you never worry; it means you usually find your way back to balance.",
      "keywords": ["Trusting", "Open", "Balanced"],
      "strengths": ["Saying what you need simply and kindly", "Giving others room without feeling rejected", "Repairing after an argument instead of keeping score"],
      "tips": ["Keep checking in with yourself too. Being the steady one should not mean carrying everything alone.", "When someone close seems anxious or distant, remember it may be their old pattern, not a verdict on you.", "Share how you stay calm. A simple “here is what helps me” can be a gift to friends who struggle."],
      "match": "Two steady hearts build easy, honest relationships. Your calm also helps any style feel safer over time."
    },
    "anxious": {
      "name": "Anxious",
      "nick": "The Devoted Heart",
      "word": "anxious, preoccupied",
      "vibe": "You love with your whole heart, and you feel every little change in the air.",
      "desc": "You care deeply and you notice everything: a shorter reply, a change in tone, a plan that slips. Being close to people matters a lot to you, so when a connection feels uncertain your mind can race to fill in the gaps. That sensitivity makes you warm, attentive and loyal. The worry is not a flaw; it is a sign of how much you value the people in your life. With a bit of reassurance and practice, that big heart can feel calm as well as close.",
      "keywords": ["Caring", "Attentive", "Loyal"],
      "strengths": ["Noticing how others feel before they say it", "Showing love and appreciation generously", "Putting real effort into keeping relationships alive"],
      "tips": ["When worry spikes, pause before you send that extra message. Ask yourself what you know, not what you fear.", "Tell people what reassures you, like a quick “talk later” text. Clear needs are easier to meet than guesses.", "Build a life that fills you up on its own: hobbies, friends, quiet time. Security grows from many anchors, not one."],
      "match": "A steady, consistent partner or friend helps your worries settle, and your warmth helps them open up."
    },
    "avoidant": {
      "name": "Dismissive-Avoidant",
      "nick": "The Free Spirit",
      "word": "dismissive",
      "vibe": "You value your independence, and you care in quiet, practical ways.",
      "desc": "You are self-reliant and good at handling things on your own. You enjoy people, but you also need plenty of space, and too much emotional intensity can make you want to step back. That is not coldness; it is often a habit learned long ago of trusting yourself first. Your calm under pressure and respect for others’ freedom are real strengths. Letting people in a little at a time can make your relationships feel lighter, not heavier.",
      "keywords": ["Independent", "Calm", "Capable"],
      "strengths": ["Staying composed when things get stressful", "Respecting other people’s space and choices", "Solving problems in practical, reliable ways"],
      "tips": ["When you need space, say so and say when you will be back. “I need an evening, let’s talk tomorrow” keeps trust intact.", "Try sharing one small feeling a week with someone you trust. Closeness can grow in tiny steps.", "Notice the urge to pull away when things get good. Staying a moment longer is often where connection deepens."],
      "match": "A secure, patient person respects your space without taking it personally, which makes it easier to let them closer."
    },
    "fearful": {
      "name": "Fearful-Avoidant",
      "nick": "The Tender Hedgehog",
      "word": "fearful, disorganized",
      "vibe": "You long for closeness, and you also know how much it can hurt.",
      "desc": "Part of you wants deep connection, and another part stays on guard, ready to protect you. So you might move closer, then step back, sometimes without quite knowing why. Like a hedgehog in the cold, you want warmth but fear the spikes. This mix often comes from experiences where closeness did not always feel safe. You are not too much or too complicated: you are perceptive, sensitive and deeply empathetic, and with trust and time you can feel both close and safe.",
      "keywords": ["Sensitive", "Empathetic", "Perceptive"],
      "strengths": ["Understanding pain in others because you have felt it", "Reading people and situations with real depth", "Treasuring trust once it is truly built"],
      "tips": ["Name the push and pull when you feel it. Saying “part of me wants to come closer and part of me is scared” is brave and helpful.", "Choose relationships that feel calm and consistent, and give them time to prove themselves.", "Be gentle with yourself. If old hurts keep shaping today, a counselor can be a real ally."],
      "match": "A secure, consistent person who stays kind when you wobble can slowly show you that closeness can be safe."
    }
  }
};
