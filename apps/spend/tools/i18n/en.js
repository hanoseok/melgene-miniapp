/* Spending Personality Test (en)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Spending Personality Test: What Is Your Money Style?",
    "description": "Take the spending personality test: 12 everyday money situations, 2 minutes, no sign-up. Meet your own money style. For fun, not financial advice.",
    "ogTitle": "Spending Personality Test 💸 What is your money style?",
    "ogDescription": "12 everyday money moments, 2 minutes. Which kind of spender are you?"
  },
  "siteName": "Spending Personality Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "💸 Just for fun",
    "h1Kicker": "Spending Personality Test",
    "h1Html": "What kind of <em>spender</em><br>are you?",
    "hook": "Payday, discounts, group dinners and surprise subscriptions. Answer 12 everyday money moments honestly and meet your own spending style.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🛍️ 12 moments",
    "start": "Find my money style →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Counting your coins…",
    "sub": "Reading your receipts, just for fun"
  },
  "result": {
    "title": "My spending style: {name}",
    "metaDesc": "Spending personality test result: {name}. {vibe}",
    "eyebrow": "Your spending style is",
    "gaugeLabel": "Your own answers, by style",
    "axes": [
      "Saver",
      "Value hunter",
      "Flexer",
      "Impulse"
    ],
    "strengthsLabel": "Your money strengths",
    "weaknessLabel": "Watch out for",
    "tipLabel": "Fun idea",
    "disclaimer": "For entertainment only. This is not financial advice.",
    "sameShare": "{pct}% of people got this style",
    "shareText": "My spending style: {name} {emoji} “{vibe}” What’s yours?",
    "shareTextPct": "My spending style: {name} {emoji} (Saver {s}% · Value {v}% · Flex {f}% · Impulse {i}%) What’s yours?",
    "ctaStrong": "A friend shared their money style",
    "ctaSub": "Saver or flexer? Find out in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My spending style",
    "brand": "💸 Spending Personality Test",
    "defaultKicker": "Spending personality test",
    "defaultTitle": "What kind of spender are you?",
    "defaultDesc": "12 everyday money moments · 2 minutes"
  },
  "faq": [
    {
      "q": "How is my spending style decided?",
      "a": "Every answer leans toward one of four money habits: saving, hunting for value, treating yourself or buying on impulse. Your result depends on which habits you picked most and how close they were. The same answers always give the same result."
    },
    {
      "q": "Is this financial advice?",
      "a": "No. It is a light personality quiz made for fun. It says nothing about your real finances and should never be used to make money decisions. For real financial questions, talk to a qualified professional."
    },
    {
      "q": "Is there a good or bad spending style?",
      "a": "No. Every style has strengths and blind spots, and most people mix several. Your answers also change with your mood, your budget and your life stage, so try again another day."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are calculated in your browser and never stored. We only count, anonymously, which style came up, so we can show how common each one is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Spending Personality Test",
    "description": "Privacy Policy for the Spending Personality Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Spending Personality Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers and your style mix are calculated inside your browser and are never sent to or stored on our servers. We only count, anonymously, which result came up, so we can show how common each result is."
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
        "This policy is effective as of October 18, 2026."
      ]
    ],
    "back": "← Back to the Spending Personality Test"
  },
  "questions": [
    {
      "q": "Your pay arrives. What is the first thing you do?",
      "choices": [
        "Book something nice I have been eyeing",
        "Move a chunk straight into savings",
        "Open a shopping app: “I deserve this”",
        "Check which bills and subscriptions are due, then plan the rest"
      ]
    },
    {
      "q": "A friend invites you to a trendy, pricey restaurant.",
      "choices": [
        "Suggest a cheaper place or cooking at home instead",
        "Great! I will order exactly what I want",
        "Check reviews and set menus to find the best deal there",
        "Book it right now and worry about the bill later"
      ]
    },
    {
      "q": "Your headphones finally die and you need new ones.",
      "choices": [
        "Compare reviews and price trackers for weeks",
        "Buy the first one an ad shows me. Done in a minute",
        "Wait as long as possible, then buy the cheapest decent pair",
        "Get the top model that feels amazing and will last"
      ]
    },
    {
      "q": "Your favorite store is having a huge sale.",
      "choices": [
        "Fill the cart before I can think",
        "Buy only what was already on my list",
        "Grab the premium piece that is finally within reach",
        "Walk past. Cheap is only cheap if I needed it"
      ]
    },
    {
      "q": "A free trial is about to turn into a paid subscription.",
      "choices": [
        "I cancelled it the day I signed up",
        "Keep it. Good services are worth paying for",
        "I set a reminder and decide if it is worth it",
        "I forgot, and now I pay for several of them"
      ]
    },
    {
      "q": "Coffee break during the workday.",
      "choices": [
        "My favorite café’s signature drink, no regrets",
        "Coffee from home, in my own tumbler",
        "A coffee, a pastry and that cute mug by the register",
        "The café with the best coupons and stamp card"
      ]
    },
    {
      "q": "The group dinner bill arrives.",
      "choices": [
        "I pay for everyone on a whim, then wonder where the money went",
        "I use a split-the-bill app so it is quick and fair",
        "I cover a round of drinks, and we order dessert too",
        "I pay exactly what I ate, down to the last coin"
      ]
    },
    {
      "q": "The cashier offers a small add-on at checkout.",
      "choices": [
        "Only if the bundle price is actually better",
        "Yes, plus the candy by the counter",
        "“No, thank you.” No thinking needed",
        "Sure. Small luxuries make a day nicer"
      ]
    },
    {
      "q": "You are planning a vacation.",
      "choices": [
        "A spreadsheet and comparison sites to get the best value",
        "I book a flight tonight because the fare looked good",
        "Off-season dates, budget stay, free activities",
        "A really nice hotel. The trip is my reward"
      ]
    },
    {
      "q": "You open your bank app at the end of the month.",
      "choices": [
        "Wait, where did all of that go?",
        "I sort everything into categories and adjust next month",
        "I know where it went and it was worth it",
        "The balance is healthy and I am quietly proud"
      ]
    },
    {
      "q": "You pick up a new hobby.",
      "choices": [
        "Go straight for pro gear. If I do it, I do it properly",
        "Borrow gear and learn from free videos",
        "Gear, books, classes and a cute outfit, all in week one",
        "Buy the beginner kit with the best reviews"
      ]
    },
    {
      "q": "Which line sounds most like you?",
      "choices": [
        "“Every little bit I save counts”",
        "“You only live once”",
        "“Why pay more for the same thing?”",
        "“It just felt right in the moment”"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Penny-Pinching Pro",
      "word": "penny-pinching",
      "vibe": "Every coin has a job, and yours always show up on time.",
      "desc": "You like knowing where your money is and what it is for. You pack lunch without complaint, you notice small leaks and you feel a quiet thrill when the number in your account goes up. Friends call you when they need to know if something is really worth it, and you give them an honest answer. Your calm, steady habits make the future feel less scary.",
      "strengths": [
        "Patient and disciplined",
        "Spots waste quickly",
        "Calm about the future"
      ],
      "weakness": "You can say no to things that would have made you really happy, and then feel left out.",
      "tip": "Pick one small treat each month that is yours with zero guilt. Enjoying it is part of the plan."
    },
    "value": {
      "name": "Bargain Detective",
      "word": "detective",
      "vibe": "Research first, buy second.",
      "desc": "You research before you buy: reviews, price history, the other tab, the other store. Finding the best deal feels like solving a small puzzle, and you love sharing the answer. You are not stingy, just allergic to overpaying. People trust your recommendations because you have already done the homework.",
      "strengths": [
        "Great researcher",
        "Compares calmly",
        "Shares helpful finds"
      ],
      "weakness": "Comparing can take longer than the thing is worth, and you sometimes miss the moment.",
      "tip": "Set a time limit for research. The best deal is also the one you actually enjoy using."
    },
    "flex": {
      "name": "Main-Character Spender",
      "word": "main-character",
      "vibe": "Treats everyday life like a premiere.",
      "desc": "You believe good moments deserve good things: the nice dinner, the concert ticket, the gift that makes someone gasp. You spend with intention and without much guilt, and your generosity is contagious. Friends love being around you because you turn ordinary evenings into occasions. You live in the present and you make it sparkle.",
      "strengths": [
        "Generous and fun",
        "Creates memorable moments",
        "Knows what you love"
      ],
      "weakness": "Big moments can crowd out the quiet, boring ones that matter later.",
      "tip": "Keep one little “future me” treat on your calendar too. It makes the flex even sweeter."
    },
    "impulse": {
      "name": "Impulse Cart Hero",
      "word": "cart hero",
      "vibe": "The cart fills faster than the thought arrives.",
      "desc": "You follow your spark. A cute thing, a great mood or a friend’s excitement, and suddenly it is on its way to your door. That spontaneity is part of your charm: you try new things, you say yes to adventures and your life is rarely dull. Your shelves are full of stories, even the ones that started with “I just had to”.",
      "strengths": [
        "Spontaneous and curious",
        "Says yes to adventure",
        "Spreads good energy"
      ],
      "weakness": "Some buys fade fast, and the receipt surprises you at the end of the month.",
      "tip": "Try a “maybe cart” overnight. If you still smile tomorrow, it counts as a real yes."
    },
    "saverflex": {
      "name": "Save-Then-Splurge Combo",
      "word": "splurge",
      "vibe": "Careful for months, then one glorious yes.",
      "desc": "Most days you are the careful one: the coupons, the packed lunch, the “not now”. But you save with a purpose, and when the day comes you spend on the thing you really wanted, without apology. It is a surprising combination: thrifty and dramatic. People are often amazed at how big your one yes can be.",
      "strengths": [
        "Saves with a goal",
        "Enjoys purchases fully",
        "Knows what matters"
      ],
      "weakness": "The long wait can make the splurge feel too big, and guilt may sneak in afterwards.",
      "tip": "Give your big treat a name and a date. Looking forward to it is half the fun."
    },
    "dealhunter": {
      "name": "Sale-Season Hunter",
      "word": "sale",
      "vibe": "A good deal is hard to walk away from.",
      "desc": "Discounts light you up. You love a limited-time offer, a bundle and a coupon code that actually works, and you are quick to jump when the price looks right. Part detective, part adventurer, you get real joy from the hunt itself. Friends text you when they want to know if a deal is worth the hype.",
      "strengths": [
        "Sharp eye for offers",
        "Quick and decisive",
        "Fun to shop with"
      ],
      "weakness": "A great price can make you forget to ask whether you needed it at all.",
      "tip": "Before you click, ask: “Would I want this at full price?” If yes, it is a real win."
    },
    "quality": {
      "name": "Buy-It-Once Believer",
      "word": "once",
      "vibe": "Spend a little more once, enjoy it for years.",
      "desc": "You choose carefully and you choose well. You would rather own one great jacket than five average ones, and you care about how things feel, last and fit your life. You research enough to feel sure, then you commit without regret. Your things tend to look good and stay good, and you take real pride in that.",
      "strengths": [
        "Thoughtful and picky",
        "Values craft and durability",
        "Rarely regrets a purchase"
      ],
      "weakness": "The “best” option can be hard to find, and waiting for it can slow you down.",
      "tip": "Good enough is sometimes great. Let yourself enjoy the nice thing now."
    },
    "balance": {
      "name": "Balanced Budgeter",
      "word": "balanced",
      "vibe": "Not too stingy, not too wild. Just right.",
      "desc": "You mix a little of everything. You can save when it matters, shop smart when it helps, treat yourself when it counts and enjoy the occasional spontaneous buy. This makes you easy to shop, travel and split a bill with. People feel relaxed around your money habits, because they are flexible and friendly.",
      "strengths": [
        "Flexible and relaxed",
        "Adapts to any situation",
        "Easy to split a bill with"
      ],
      "weakness": "With no strong rule, small decisions can drift without you noticing.",
      "tip": "Choose one tiny habit you like and let it be your anchor. The rest can stay flexible."
    }
  }
};
