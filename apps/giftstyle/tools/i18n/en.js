/* Gift Giver Personality Test (en)
 * 8 result ids (quickfind, helper, moment, together, detective, wishlist, crafter, curator); questions[i].choices[j] follow giftstyle-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: timing spark/plan, focus useful/heart, style surprise/ask).
 * None of the types is negative: every one is a warm, generous way to give.
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own planning score ({n}) and the real server share ({pct}).
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
    "title": "Gift Giver Personality Test – What Kind of Gift Giver Are You?",
    "description": "Gift giver personality quiz: 12 everyday gift moments, 2 minutes, no sign-up. Discover your gifting style and your own gift planning score.",
    "ogTitle": "Gift Giver Personality Test 🎁 What kind of gift giver are you?",
    "ogDescription": "Twelve everyday gift moments. Discover your gifting style and your own planning score. A fun quiz, not a clinical assessment."
  },
  "siteName": "Gift Giver Personality Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎁 A quiz for gift season",
    "h1Kicker": "Gift Giver Personality Test",
    "h1Html": "Birthdays, holidays, Secret Santa:<br>what kind of <em>gift giver</em> are you?",
    "hook": "Some people find the perfect present months ahead. Others pull off a small miracle on the way to the party. Walk through twelve everyday gift moments and discover the way you show people you care.",
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
    "text": "Unwrapping your answers…",
    "sub": "Checking your timing, your focus and your gifting style"
  },
  "result": {
    "title": "My gift giver personality: {name}",
    "metaDesc": "Gift giver personality quiz result: {name}. {vibe} See your strengths, gifting tips, signature gift, best buddy and opposite type.",
    "eyebrow": "When it comes to gifts, you are…",
    "gaugeTitle": "Your gift planning meter",
    "gaugeLow": "In the moment",
    "gaugeHigh": "Planned ahead",
    "gaugeNote": "Calculated only from your own answers about birthdays, holiday shopping, wrapping and early finds. It is not compared with anyone else.",
    "scoreFmt": "{n}",
    "bandLow": "You shine in the moment: your best ideas often arrive right when you need them.",
    "bandMid": "You plan some gifts and improvise others, depending on the person and the season.",
    "bandHigh": "You like to be ready early: by the time the day comes, the gift is already waiting.",
    "traitsLabel": "Your gifting strengths",
    "tipsLabel": "Gift tips for you",
    "perfectLabel": "Your signature gift",
    "bestLabel": "Best buddy",
    "rivalLabel": "Opposite type",
    "disclaimer": "Just for fun! This quiz is for fun, not a clinical assessment or a psychological test. It looks at a few gift habits and cannot tell you who you are. Every style of giving is a kind one.",
    "sameShare": "{pct}% of people got this result",
    "shareText": "My gift giver personality is {name} {emoji} “{vibe}” What kind of gift giver are you?",
    "ctaStrong": "A friend shared their gift giver personality",
    "ctaSub": "What kind of gift giver are you? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My gift giver personality",
    "brand": "🎁 Gift Giver Personality Test",
    "defaultKicker": "A quiz for gift season",
    "defaultTitle": "What kind of gift giver are you?",
    "defaultDesc": "12 gift moments · 2 minutes · your own planning score"
  },
  "faq": [
    {
      "q": "What does this gift giver personality test look at?",
      "a": "Three gift habits: when you usually get gifts ready, whether you lean toward useful things or meaningful ones, and whether you love surprises or prefer to ask first."
    },
    {
      "q": "How is my result chosen?",
      "a": "Each moment looks at one of the three habits. The combination of all three picks your gift giver personality, and the same answers always give the same result."
    },
    {
      "q": "Where does my gift planning score come from?",
      "a": "It is calculated only from your own answers to the timing questions. Answers about getting ready early raise it, and answers about deciding in the moment lower it. It is not compared with anyone else."
    },
    {
      "q": "Is it bad to buy gifts at the last minute?",
      "a": "Not at all. Some of the most thoughtful presents are found in a flash of inspiration. Every style of giving has its own strengths, and the care behind a gift matters more than the date on the receipt."
    },
    {
      "q": "Is this a clinical or psychological assessment?",
      "a": "No. This quiz is for fun, not a clinical assessment or a psychological test. Your answers are calculated in your browser and are not stored; we only count anonymously which result came up."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Gift Giver Personality Test",
    "description": "Privacy Policy for the Gift Giver Personality Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "The Gift Giver Personality Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
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
        "This policy is effective as of November 18, 2026."
      ]
    ],
    "back": "← Back to the Gift Giver Personality Test"
  },
  "questions": [
    {
      "q": "Your best friend’s birthday is three weeks away. You…",
      "choices": [
        "Forget about it until the day before, then find something great",
        "Set a reminder to start looking next week",
        "Already have the gift. I had the idea months ago",
        "Think about it now and then, and decide when it feels right"
      ]
    },
    {
      "q": "Your gift budget this time is small. Where does it go?",
      "choices": [
        "A tiny thing that stands for an inside joke only we understand",
        "Something they will use every single day",
        "A nicer version of something they already use",
        "A small treat plus a long handwritten card"
      ]
    },
    {
      "q": "Secret Santa at work: you drew the name of someone you barely know. You…",
      "choices": [
        "Quietly look for clues on their desk and social media",
        "Ask them for a wishlist. Why guess?",
        "Trust my instinct. The surprise is half the fun",
        "Ask a colleague who knows them what they might like"
      ]
    },
    {
      "q": "When does your holiday gift shopping usually start?",
      "choices": [
        "Early December, with a rough list",
        "On the last weekend before the holidays. The rush is part of the tradition",
        "Whenever I happen to pass a nice shop",
        "In the autumn. I keep a gift list all year"
      ]
    },
    {
      "q": "Handmade or store-bought?",
      "choices": [
        "Store-bought, but good quality that lasts",
        "Handmade, every time, even if it is a little wonky",
        "Store-bought, but personalized with a name or a photo",
        "Store-bought. Useful beats cute"
      ]
    },
    {
      "q": "Someone tells you: “Oh, please don’t get me anything!” You…",
      "choices": [
        "Ask them straight out: “Okay, but if you had to pick one thing?”",
        "Suggest two or three small ideas and let them choose",
        "Bring something small anyway, just in case",
        "Smile, say okay, and secretly plan a surprise"
      ]
    },
    {
      "q": "When do you wrap your gifts?",
      "choices": [
        "The evening before, with whatever paper I can find",
        "In the car, five minutes before arriving. Gift bags exist for a reason",
        "Weeks ahead, with matching ribbon and the tag already written",
        "A few days ahead, so there is no stress"
      ]
    },
    {
      "q": "You need a gift for a coworker you don’t know very well. You choose…",
      "choices": [
        "A nice mug or something handy for their desk",
        "Local sweets with a short thank-you note",
        "A gift card, so they can pick what they need",
        "Something linked to a story they once told at lunch"
      ]
    },
    {
      "q": "You open a gift you don’t really like. What goes through your mind?",
      "choices": [
        "Maybe I should drop a few hints next time",
        "It is the thought that counts, honestly",
        "This is exactly why I keep a wishlist",
        "Surprises are the best part, even when they miss"
      ]
    },
    {
      "q": "In summer, you spot the perfect present for someone whose birthday is in winter. You…",
      "choices": [
        "Buy it right away and hide it in my gift drawer",
        "Take a photo and probably forget about it",
        "Save the link in my notes for later",
        "Keep walking. Winter me will handle it"
      ]
    },
    {
      "q": "The best gift anyone could give you would be…",
      "choices": [
        "A day out together, like a concert or a little trip",
        "A letter or a photo album that makes me cry",
        "That gadget I need but never buy for myself",
        "Something cozy that I will use all winter"
      ]
    },
    {
      "q": "The moment has come to hand over your gift. How?",
      "choices": [
        "Hide it and set up a little treasure hunt",
        "No secret: we picked it out together",
        "With a gift receipt and “You can swap it if you like”",
        "Leave it on their desk with a mysterious note"
      ]
    }
  ],
  "types": {
    "quickfind": {
      "name": "Quick-Find Hero",
      "word": "quick-find, quick find",
      "vibe": "Give you ten minutes and a shop, and you will walk out with something they actually need.",
      "keywords": ["Resourceful", "Calm under pressure", "Practical"],
      "desc": "You do not believe in stressing over gifts weeks in advance. When the moment arrives, your instincts switch on: you know what the person uses, what is missing from their life and where to find it fast. The surprise is real, because even you did not know what you would bring until you saw it. Friends are always amazed at how your quick decisions land so well. You prove that a great gift is about paying attention, not about the calendar.",
      "traits": ["You decide fast and well", "You notice what people really need", "You stay relaxed when time is short", "You love a genuine surprise"],
      "tips": ["Keep a small note on your phone with ideas you hear during the year", "Add one personal touch, like a quick handwritten line, to your fast finds"],
      "perfect": "A really good umbrella, handed over on a rainy day with a grin, exactly when it is needed."
    },
    "helper": {
      "name": "Practical Pal",
      "word": "practical pal",
      "vibe": "Why guess? You simply ask what would help and make it happen, quickly and kindly.",
      "keywords": ["Honest", "Helpful", "Easygoing"],
      "desc": "For you, a gift is a way of making someone’s life a little easier. You are not shy about asking what they need, and people love that there is never any awkward guessing. You do not spend weeks planning, but when you hear about a broken kettle or a worn-out bag, you are on it right away. Your gifts get used, every single day, and that is the best compliment there is. Your friends know that with you, kindness comes with no fuss.",
      "traits": ["You ask instead of guessing", "Your gifts get used every day", "You make giving feel relaxed", "You act quickly when someone needs help"],
      "tips": ["Wrap your useful gift in a fun way, so it still feels like a celebration", "Now and then, add a small surprise next to the item they asked for"],
      "perfect": "The exact headphones they mentioned last week, delivered with a smile and no guessing."
    },
    "moment": {
      "name": "Moment Maker",
      "word": "moment maker",
      "vibe": "You turn an ordinary day into a story, often with an idea that came to you that very morning.",
      "keywords": ["Spontaneous", "Warm", "Playful"],
      "desc": "Your gifts are rarely things. They are moments: a surprise picnic, a song you recorded, a spontaneous trip to the place where you first met. You follow your heart and your inspiration, and you love seeing someone’s face light up when they realize what you have done. You do not need a long plan, because your best ideas arrive like sparks. People remember your gifts for years, not because they were expensive, but because they felt alive.",
      "traits": ["You turn days into memories", "You follow your inspiration", "You make people feel special", "You bring joy without a script"],
      "tips": ["Write down your spark ideas, so a busy week does not swallow them", "Take one photo of the moment, so the memory lasts"],
      "perfect": "A surprise picnic in the park with their favorite snacks and a playlist of your shared songs."
    },
    "together": {
      "name": "Joy Sharer",
      "word": "joy sharer",
      "vibe": "The best gift is time together, so you ask what they would love and make it a shared adventure.",
      "keywords": ["Sociable", "Thoughtful", "Generous"],
      "desc": "To you, a present is best when it is shared. Instead of a box, you offer a plan: the concert they mentioned, the new restaurant, an afternoon of doing exactly what they enjoy. You like to ask what would make them happy, so the experience truly fits. You do not need to plan weeks ahead, and you are happy to decide together on the day. People feel seen and celebrated with you, and your gifts usually end with laughter and a story to tell.",
      "traits": ["You turn gifts into time together", "You ask what truly makes people happy", "You are generous with your time", "You make celebrations feel shared"],
      "tips": ["Give a small card or token on the day, so the plan feels real", "Book the popular things early, even if you decide on the rest later"],
      "perfect": "Two tickets to the show they have talked about for months, and dinner afterwards."
    },
    "detective": {
      "name": "Gift Detective",
      "word": "detective",
      "vibe": "You collect tiny clues all year and reveal the perfect useful surprise when nobody expects it.",
      "keywords": ["Observant", "Patient", "Clever"],
      "desc": "You listen closely. When a friend sighs about a slow coffee grinder in March, you remember it in November. You keep notes, compare options and find exactly the right version of the thing they need. Then you keep it a secret until the big day. Your gifts are useful and surprising at the same time, which is a rare combination. People often ask how you knew, and the honest answer is that you were paying attention all along.",
      "traits": ["You remember small details", "You find the best version of things", "You keep secrets well", "You plan without anyone noticing"],
      "tips": ["Share your clue list with a partner or friend, so ideas are never lost", "Leave a little room for a sentimental touch, like a short note"],
      "perfect": "The exact kitchen tool they sighed about months ago, wrapped neatly and saved for their birthday."
    },
    "wishlist": {
      "name": "Wishlist Wizard",
      "word": "wishlist wizard, wizard",
      "vibe": "Lists, links and perfect timing: everyone gets exactly what they hoped for, right on time.",
      "keywords": ["Organized", "Reliable", "Fair"],
      "desc": "You are the reason holiday gift exchanges run smoothly. You ask for wishlists early, keep track of sizes and colors and order well before the shops get crowded. Nothing gets returned, nobody gets two of the same thing and your budget stays perfectly on track. Some might call it unromantic, but people love receiving exactly what they wanted. Your gifts say: I listened, I remembered and I made sure it arrived on time.",
      "traits": ["You make gift exchanges easy", "You remember sizes and preferences", "You keep budgets on track", "You are always ready on time"],
      "tips": ["Add one item that is not on the list, just to see their surprise", "Help friends start their own lists. You will make everyone’s life easier"],
      "perfect": "Everything on the wishlist, wrapped and ready a week early, with a gift receipt tucked inside."
    },
    "crafter": {
      "name": "Heartfelt Crafter",
      "word": "crafter",
      "vibe": "Weeks of quiet work go into a one-of-a-kind present that nobody else could ever give.",
      "keywords": ["Creative", "Devoted", "Sentimental"],
      "desc": "You believe the most precious gifts are made, not bought. A knitted scarf, a hand-bound photo book, a recipe box written by hand: you start early and put real hours into every piece. You love keeping it a secret and imagining the moment it is unwrapped. Your gifts carry memories and inside jokes that only the two of you understand. They rarely end up in a drawer. They end up on the wall, on the shelf or around someone’s neck for years.",
      "traits": ["You make things that last", "You put your heart into the details", "You start early and stay patient", "You turn memories into objects"],
      "tips": ["Start with a simple project, so a busy season does not cause stress", "A short handmade card is enough when time is tight"],
      "perfect": "A hand-made photo book full of shared memories, with little notes written beside every picture."
    },
    "curator": {
      "name": "Experience Curator",
      "word": "curator",
      "vibe": "You ask, plan and book ahead, so the celebration feels effortless and perfectly made for them.",
      "keywords": ["Considerate", "Organized", "Caring"],
      "desc": "You believe that the best gifts are experiences that fit the person perfectly. You ask what they have always wanted to try, then quietly take care of everything: tickets, reservations, timing and the little extras. Nothing is left to chance, yet the day feels relaxed and joyful. People love that you treat their wishes seriously and turn them into real memories. With you, a birthday becomes an event that friends talk about long afterwards.",
      "traits": ["You turn wishes into real plans", "You think of every small detail", "You make people feel truly cared for", "You create celebrations to remember"],
      "tips": ["Leave a free hour in the plan for spontaneous fun", "Let the guest of honor choose one part of the day themselves"],
      "perfect": "A weekend trip they have always dreamed of, planned down to the last detail, with their favorite café on the way."
    }
  }
};
