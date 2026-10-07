/* Mental Age Test (en)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Mental Age Test: How Old Is Your Mind?",
    "description": "Take the mental age test: 12 light everyday questions, 2–3 minutes, no sign-up. Find out how old your mind really feels, with your exact mental age, strengths and tips.",
    "ogTitle": "Mental Age Test 🧠 How old is your mind?",
    "ogDescription": "A quick 2-minute quiz. 12 everyday questions reveal your mental age, down to the number."
  },
  "siteName": "Mental Age Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🧠 Quick mind quiz",
    "h1Kicker": "Mental Age Test",
    "h1Html": "How old is<br><em>your mind</em>, really?",
    "hook": "Your birthday says one number. Your everyday habits might say another. Answer honestly and see what your mind thinks.",
    "metaTime": "⏱️ 2–3 min",
    "metaCount": "✏️ 12 questions",
    "start": "Check my mental age →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Reading your doodles…",
    "sub": "Counting the candles on your mind’s cake"
  },
  "result": {
    "title": "Mental Age Test: I’m a {name}",
    "eyebrow": "Your mental age",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} year old",
      "few": "{n} years old",
      "many": "{n} years old",
      "other": "{n} years old"
    },
    "metaRange": "Mental age: {range}.",
    "strengthsLabel": "What makes you shine",
    "tipsLabel": "Tips for your mind’s age",
    "bestLabel": "Best buddy",
    "rivalLabel": "Rival",
    "sameShare": "{pct}% of players got this age group",
    "shareText": "My mental age: {age} {emoji} {name} — “{vibe}” How old is your mind?",
    "ctaStrong": "A friend shared their mental age",
    "ctaSub": "How old is your mind? 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My mental age",
    "brand": "🧠 Mental Age Test",
    "defaultKicker": "Mental age test",
    "defaultTitle": "How old is your mind?",
    "defaultDesc": "12 everyday questions · 2–3 minutes"
  },
  "faq": [
    {
      "q": "How is my mental age calculated?",
      "a": "Every answer carries a few “mind age” points. Your total places you in an age group, and where your answers land inside that group gives the exact number. The same answers always give the same result."
    },
    {
      "q": "Is this a real psychological test?",
      "a": "No, it’s just for fun. It looks at everyday habits and moods, not intelligence or maturity, so take it as a playful mirror rather than a diagnosis."
    },
    {
      "q": "Why is my result so different from my real age?",
      "a": "That’s the fun part. Lots of people have a mind younger or older than their birthday. Your result can also change with your mood, so try again another day."
    },
    {
      "q": "Are my answers saved?",
      "a": "No. Your answers are scored in your browser and never stored. We only count, anonymously, which age group came up, so we can show how common each result is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Mental Age Test",
    "description": "Privacy Policy for the Mental Age Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Mental Age Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which age group came up, so we can show how common each result is."
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
        "This policy is effective as of October 8, 2026."
      ]
    ],
    "back": "← Back to the mental age test"
  },
  "questions": [
    {
      "q": "A Saturday with no alarm. When do you wake up?",
      "choices": [
        "6 a.m., already planning the day",
        "Around 9, naturally refreshed",
        "Noon. What morning?",
        "Early, bouncing out of bed because it’s the weekend!"
      ]
    },
    {
      "q": "Your perfect birthday looks like…",
      "choices": [
        "Balloons, a giant cake and party games",
        "A big night out with the whole crew",
        "Dinner with a few close friends",
        "A quiet day and a call from family. Perfect."
      ]
    },
    {
      "q": "You’re out and your phone hits 15%.",
      "choices": [
        "Panic and hunt for a charger",
        "No worries, I always carry a power bank",
        "Let it die. Adventure mode!"
      ]
    },
    {
      "q": "At the supermarket, you head straight to…",
      "choices": [
        "The candy and snack aisle",
        "Frozen pizza and energy drinks",
        "Fresh veggies and this week’s deals",
        "My list, item by item, in order"
      ]
    },
    {
      "q": "Everyone’s talking about a new hit song.",
      "choices": [
        "I already know the dance",
        "Added to my playlist on day one",
        "Isn’t that a remake of an old song?",
        "I’ll give it a listen… eventually"
      ]
    },
    {
      "q": "A rainy day off. What’s the plan?",
      "choices": [
        "Rain boots on, puddle jumping!",
        "Blanket, snacks and a whole season of a series",
        "Cook something warm and tidy up a bit",
        "Tea, a good book and a nap to the sound of rain"
      ]
    },
    {
      "q": "You get a surprise bonus.",
      "choices": [
        "Finally buy that game or toy I’ve wanted",
        "Book a trip with friends right away",
        "One nice dinner, then save the rest",
        "Straight into savings. Future me says thanks."
      ]
    },
    {
      "q": "Friday night, nothing planned.",
      "choices": [
        "Gaming or chatting until the sun comes up",
        "Text around until something fun happens",
        "Pajamas by 9, asleep by 10. Bliss."
      ]
    },
    {
      "q": "You feel a cold coming on.",
      "choices": [
        "Whine a little and hope someone takes care of me",
        "Ignore it and keep going",
        "Ginger tea, vitamins and early to bed",
        "Take some medicine and carry on calmly"
      ]
    },
    {
      "q": "The group chat is blowing up.",
      "choices": [
        "Reply with ten stickers in a row",
        "Drop the perfect meme",
        "Read it all, then reply later with one long message",
        "Mute it. Why do people text so much?"
      ]
    },
    {
      "q": "Your room right now is…",
      "choices": [
        "Plushies, figures and colorful stuff everywhere",
        "Posters, cables and creative chaos",
        "Clean and minimal, everything has a place",
        "Plants, a cozy armchair and a reading lamp"
      ]
    },
    {
      "q": "If you could pick just one…",
      "choices": [
        "Be a carefree child again for a day",
        "Skip ahead to a peaceful, quiet retirement"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Playground Kid",
      "word": "playground,kid",
      "vibe": "Curious, playful and powered by pure joy.",
      "desc": "Your mind still runs at recess speed. You get excited easily, laugh loudly and find something fun in almost anything. Rules feel optional when there’s a game to play. That bright, honest energy is contagious, and it keeps the people around you young too.",
      "strengths": [
        "Endless curiosity",
        "Instant mood booster",
        "Fearless imagination"
      ],
      "tips": [
        "Keep the wonder, but set one small reminder for boring grown-up tasks.",
        "When something feels unfair, take three breaths before reacting.",
        "Share your favorite silly thing with a friend who needs a smile."
      ]
    },
    "teen": {
      "name": "Rebel Teen",
      "word": "rebel,teen",
      "vibe": "Big feelings, bold opinions and a playlist for every mood.",
      "desc": "Your mind lives in high-school intensity: everything matters a lot, and you feel it all. You question rules, chase what’s new and need your own space to be yourself. Underneath the attitude is a loyal heart that would do anything for the right friends.",
      "strengths": [
        "Passion for everything",
        "Fiercely loyal",
        "Trend radar"
      ],
      "tips": [
        "Not every mood needs an instant reply. Sleep on it.",
        "Write down your big ideas; some of them are really good.",
        "Let someone older surprise you. They were rebels once too."
      ]
    },
    "fresh": {
      "name": "Freshman Spirit",
      "word": "freshman",
      "vibe": "Free, spontaneous and up for anything.",
      "desc": "Your mind feels like the first year of college: a little broke, very free and always ready for a last-minute plan. You collect experiences instead of things and make friends everywhere you go. Life is one big adventure that you’re figuring out as you go.",
      "strengths": [
        "Spontaneous spirit",
        "Makes friends anywhere",
        "Brave about the new"
      ],
      "tips": [
        "Say yes to adventures, but keep a tiny savings habit too.",
        "Pick one goal for this month and see it through.",
        "Call home sometimes. They love your stories."
      ]
    },
    "hustle": {
      "name": "Go-Getter Twenties",
      "word": "go-getter",
      "vibe": "Ambitious, busy and fueled by coffee and big plans.",
      "desc": "Your mind is in full building mode. You juggle goals, side projects and a packed calendar, and you still find time to have fun. You care about growing up without growing boring. Your drive inspires people, as long as you remember to rest now and then.",
      "strengths": [
        "Unstoppable drive",
        "Great at juggling",
        "Optimistic planner"
      ],
      "tips": [
        "Schedule rest the same way you schedule work.",
        "Celebrate small wins, not just the big ones.",
        "You don’t have to have it all figured out yet."
      ]
    },
    "steady": {
      "name": "Steady Thirties",
      "word": "thirties",
      "vibe": "Calm, reliable and quietly in control.",
      "desc": "Your mind has found its rhythm. You know what you like, what you don’t and when to say no. You plan ahead, keep promises and make a mean home-cooked meal. People come to you when they need a steady hand, and you rarely let them down.",
      "strengths": [
        "Rock-solid reliability",
        "Smart planning",
        "Knows their limits"
      ],
      "tips": [
        "Leave some room for unplanned fun this week.",
        "Try something you’d be a beginner at again.",
        "Let others help you sometimes. Being reliable goes both ways."
      ]
    },
    "seasoned": {
      "name": "Seasoned Forties",
      "word": "forties",
      "vibe": "Experienced, practical and hard to fluster.",
      "desc": "Your mind has seen a few plot twists and keeps its cool. You solve problems quickly, give honest advice and don’t waste energy on drama. You value comfort, quality and people who mean what they say. Others feel safe with you around.",
      "strengths": [
        "Cool under pressure",
        "Honest advice",
        "Practical wisdom"
      ],
      "tips": [
        "Share your stories; younger friends learn a lot from them.",
        "Keep one hobby that’s just for fun, not for results.",
        "Stretch every morning. Your back will thank you."
      ]
    },
    "mellow": {
      "name": "Mellow Fifties",
      "word": "fifties,mellow",
      "vibe": "Easygoing, warm and happily unhurried.",
      "desc": "Your mind enjoys the slow lane. You’d rather have a good meal, a long walk and a meaningful chat than a loud night out. Little things make you happy, and you’ve stopped worrying about what others think. Your calm warmth makes every gathering cozier.",
      "strengths": [
        "Peaceful presence",
        "Enjoys small joys",
        "Generous listener"
      ],
      "tips": [
        "Say yes to one new experience this season.",
        "Teach someone a skill you’re proud of.",
        "Keep in touch with old friends with a short message."
      ]
    },
    "sage": {
      "name": "Wise Old Soul",
      "word": "old soul,wise",
      "vibe": "Deep, gentle and full of quiet wisdom.",
      "desc": "Your mind feels like it has lived many lives. You love peace, routine and the comfort of tea and good books. You notice what others miss and give advice that sticks for years. You may not chase trends, but people seek you out for your calm perspective.",
      "strengths": [
        "Deep perspective",
        "Gentle patience",
        "Advice that lasts"
      ],
      "tips": [
        "Do one spontaneous, silly thing this week. Just because.",
        "Your quiet routines are great; share them with a friend.",
        "Play a game with someone much younger. You’ll both laugh."
      ]
    }
  }
};
