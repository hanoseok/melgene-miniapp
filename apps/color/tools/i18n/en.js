/* Personal Color Test (en)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap",
    "display": "'Playfair Display'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Personal Color Test: Seasonal Color Analysis Quiz",
    "description": "Take the personal color test: 12 questions you can check in a mirror, about 2 minutes, no photo and no sign-up. Find your seasonal colors. Just for fun.",
    "ogTitle": "Personal Color Test 🎨 Which colors make you glow?",
    "ogDescription": "A seasonal color analysis quiz with 12 mirror-check questions. Find your undertone and your best shades."
  },
  "siteName": "Personal Color Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎨 Mirror self-check",
    "h1Kicker": "Personal Color Test",
    "h1Html": "Which colors make<br>your face <em>glow</em>?",
    "hook": "Grab a mirror and find some daylight. Answer 12 quick questions about your skin, hair, eyes and the shades people compliment, and discover your seasonal palette.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🪞 12 questions",
    "start": "Find my colors →"
  },
  "quiz": {
    "backAria": "Previous question",
    "progressAria": "Progress",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Mixing your palette…",
    "sub": "Holding each shade up to the light"
  },
  "result": {
    "title": "My personal color: {name}",
    "metaDesc": "Personal color test result: {name}. {vibe} See the best shades, colors to avoid and makeup, hair and jewelry tips.",
    "eyebrow": "Your personal color is",
    "gaugeLabel": "Where your answers leaned",
    "axes": [
      ["Warm", "Cool"],
      ["Light", "Deep"],
      ["Bright", "Muted"]
    ],
    "paletteLabel": "Your best colors",
    "avoidLabel": "Colors to go easy on",
    "avoidNote": "Not forbidden, just harder to wear near your face. Keep them for shoes, bags or trousers.",
    "makeupLabel": "Makeup",
    "hairLabel": "Hair color",
    "jewelryLabel": "Jewelry",
    "disclaimer": "A fun self-check, not a professional color analysis. Real draping uses fabric in controlled light, and lighting, screens and makeup change how colors look.",
    "sameShare": "{pct}% of people got this palette",
    "shareText": "My personal color: {name} {emoji} “{vibe}” What’s yours?",
    "ctaStrong": "A friend shared their colors",
    "ctaSub": "Warm or cool? Find yours in 2 minutes.",
    "retry": "Take the test again"
  },
  "og": {
    "eyebrow": "My personal color",
    "brand": "🎨 Personal Color Test",
    "defaultKicker": "Seasonal color analysis quiz",
    "defaultTitle": "Which colors make you glow?",
    "defaultDesc": "12 mirror-check questions · 2 minutes"
  },
  "faq": [
    {
      "q": "How does the test decide my colors?",
      "a": "Each answer nudges three scales: warm or cool undertone, light or deep, and bright or muted. Your result is the seasonal palette where those three meet. The same answers always give the same result."
    },
    {
      "q": "Is this as accurate as a professional color analysis?",
      "a": "No. It is a fun self-check based on things you can see in a mirror. A professional analysis compares fabric drapes on your face in neutral light, which a quiz cannot do. Treat your result as a starting point to experiment with."
    },
    {
      "q": "How can I get a more reliable answer?",
      "a": "Answer in natural daylight near a window, with a bare face and your hair pulled back. Indoor bulbs, phone filters and dyed hair can all push colors warmer or cooler than they really are."
    },
    {
      "q": "Are my answers or photos saved?",
      "a": "The test never asks for a photo. Your answers are calculated in your browser and are not stored. We only count, anonymously, which result came up, so we can show how common it is."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Personal Color Test",
    "description": "Privacy Policy for the Personal Color Test — how we use cookies, advertising and anonymous statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Personal Color Test (the \"Service\") respects your privacy and processes only the minimum information necessary, as described below.",
    "sections": [
      [
        "1. Information we collect",
        "You can use the Service without signing up or logging in, and it never asks for a photo. Your answers are calculated inside your browser and are never sent to or stored on our servers. We only count, anonymously, which result came up, so we can show how common each result is."
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
        "This policy is effective as of October 23, 2026."
      ]
    ],
    "back": "← Back to the Personal Color Test"
  },
  "questions": [
    {
      "q": "In daylight, look at the veins on the inside of your wrist. What color are they?",
      "choices": [
        "Mostly blue or purple",
        "Mostly green or olive",
        "A mix of both, hard to tell"
      ]
    },
    {
      "q": "Which jewelry makes your skin look its best?",
      "choices": [
        "Yellow gold",
        "Silver or platinum",
        "Rose gold or soft, brushed metal",
        "Shiny statement pieces, any metal"
      ]
    },
    {
      "q": "After an hour in the sun without sunscreen, your skin usually…",
      "choices": [
        "Turns pink and burns, and barely tans",
        "Burns a little first, then tans lightly",
        "Turns golden and tans easily",
        "Rarely burns and gets a little deeper"
      ]
    },
    {
      "q": "Hold a pure white top and an ivory or cream one under your chin. Which looks better?",
      "choices": [
        "Pure white. I look fresh and clear",
        "Ivory or cream. White looks harsh on me",
        "Honestly, I can’t see a difference"
      ]
    },
    {
      "q": "Which dark basic looks best right next to your face?",
      "choices": [
        "Jet black. Sharp and striking",
        "Chocolate brown or camel",
        "Soft charcoal or navy. Black feels heavy",
        "None: cream or light beige suits me better"
      ]
    },
    {
      "q": "What is your natural hair color (or what was it as a child)?",
      "choices": [
        "Very dark, almost black",
        "Medium to dark brown with red or golden glints",
        "Soft ash or mousy brown",
        "Light: golden brown, strawberry or blonde"
      ]
    },
    {
      "q": "How would you describe your eyes?",
      "choices": [
        "Dark and intense, with very clear whites",
        "Warm hazel, amber or golden brown",
        "Soft gray-brown or gray-green, gently blended",
        "Light and sparkly, with a crisp outer ring"
      ]
    },
    {
      "q": "Which outfit colors bring you the most compliments?",
      "choices": [
        "Vivid colors like cobalt blue or hot pink",
        "Soft, dusty shades like old rose or sage",
        "Light, airy pastels",
        "Rich, deep shades like burgundy or forest green"
      ]
    },
    {
      "q": "How strong is the contrast between your hair and your skin?",
      "choices": [
        "High. My hair stands out sharply from my skin",
        "Somewhere in the middle",
        "Low and light. Both are soft and pale",
        "Low and deep. Both are rich and close in tone"
      ]
    },
    {
      "q": "Without makeup, your lips and cheeks look…",
      "choices": [
        "Rosy pink",
        "Peachy or coral",
        "Pale and beige, without much color",
        "Naturally deep, almost berry"
      ]
    },
    {
      "q": "Which blush shade looks most natural on you?",
      "choices": [
        "Peach or coral",
        "Baby pink or rose",
        "Terracotta or soft brick",
        "Berry or plum"
      ]
    },
    {
      "q": "Which mood feels most like you in the mirror?",
      "choices": [
        "Sunny and fresh, like lemonade at a picnic",
        "Airy and soft, like lavender in morning mist",
        "Cozy and rich, like spiced tea by the fire",
        "Crisp and dramatic, like city lights at night"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Light Spring",
      "word": "light spring",
      "vibe": "Warm, delicate and full of morning light.",
      "desc": "Your coloring is warm but gentle, with a soft golden glow and very little harsh contrast. Light, clear, slightly warm shades make your skin look fresh and rested, while heavy or very dark colors can sit on top of you instead of with you. Think peach, butter yellow, light aqua and warm pink: colors that look like they were mixed with sunshine.",
      "keywords": ["Warm", "Light", "Fresh"],
      "makeup": "Peach or apricot blush, a sheer coral or warm pink lip and soft brown or bronze eyeliner instead of black.",
      "hair": "Golden blonde, honey or light caramel brown. Avoid very dark or ash tones that cast a shadow on your face.",
      "jewelry": "Light yellow gold, rose gold and delicate pieces. Pearls in a warm cream tone look lovely on you."
    },
    "springbright": {
      "name": "Bright Spring",
      "word": "bright spring",
      "vibe": "Warm, clear and full of sparkle.",
      "desc": "You have warm coloring with a lively, clear quality, often with bright eyes and a fresh contrast. Saturated, sunny colors wake your face up, while dusty or grayed shades can make you look tired. Coral, tangerine, sunflower yellow, turquoise and grass green are your playground. You can wear color in bold doses and still look like yourself.",
      "keywords": ["Warm", "Clear", "Vivid"],
      "makeup": "Coral or warm red lipstick, a clear peach blush and a touch of shimmer. A warm brown or teal liner adds pop.",
      "hair": "Warm golden brown, copper or bright chestnut. Glossy, warm highlights suit you better than flat, ashy color.",
      "jewelry": "Polished yellow gold, colorful enamel and bright stones. Shiny finishes beat matte ones for you."
    },
    "summerlight": {
      "name": "Light Summer",
      "word": "light summer",
      "vibe": "Cool, soft and airy as a clear sky.",
      "desc": "Your coloring is light and cool, with a rosy or neutral undertone and a soft overall look. Cool pastels and gentle mid-tones make your skin look smooth and luminous, while very dark, very warm or neon colors can overpower you. Powder blue, lavender, soft pink and mint are your easy wins. Think of colors with a little bit of white and a little bit of blue mixed in.",
      "keywords": ["Cool", "Light", "Soft"],
      "makeup": "Rose or baby-pink blush, a sheer pink or mauve lip and taupe or soft gray eyeliner.",
      "hair": "Ash blonde, light ash brown or soft beige blonde. Strong golden or orange tones can fight with your skin.",
      "jewelry": "Silver, white gold and platinum, with pearls, moonstone or pale blue stones."
    },
    "summermute": {
      "name": "Soft Summer",
      "word": "soft summer",
      "vibe": "Cool, calm and quietly elegant.",
      "desc": "Your coloring is cool to neutral and naturally blended, with low contrast between hair, skin and eyes. Dusty, grayed shades make you look polished and serene, while very bright or very warm colors can look loud next to your face. Mauve, dusty rose, slate blue, sage and soft plum are your signature. Tone-on-tone outfits look especially refined on you.",
      "keywords": ["Cool", "Muted", "Calm"],
      "makeup": "Dusty rose or mauve lip, a soft rose blush and gray-brown or plum eyeliner for gentle definition.",
      "hair": "Ash brown, cool mushroom brown or soft ash blonde. Avoid brassy golden or very dark, harsh black.",
      "jewelry": "Brushed silver, white gold and soft pewter. Matte finishes and gray pearls feel very you."
    },
    "autumnmute": {
      "name": "Soft Autumn",
      "word": "soft autumn",
      "vibe": "Warm, gentle and softly golden.",
      "desc": "Your coloring is warm and blended, with an earthy softness and little harsh contrast. Muted, warm shades look natural and expensive on you, while icy or very bright colors can make you look pale. Camel, olive, soft terracotta, warm taupe and moss green are your best friends. Layering several gentle, warm neutrals is one of your superpowers.",
      "keywords": ["Warm", "Muted", "Earthy"],
      "makeup": "Nude-peach or soft brick lip, a warm terracotta blush and brown or khaki eyeliner.",
      "hair": "Soft golden brown, warm beige or muted caramel. Avoid cool ash or blue-black that drains your warmth.",
      "jewelry": "Matte or brushed gold, bronze and wood, with warm stones like amber or tiger’s eye."
    },
    "autumndeep": {
      "name": "Deep Autumn",
      "word": "deep autumn",
      "vibe": "Warm, rich and full of depth.",
      "desc": "You have warm coloring with real depth, often dark hair or eyes and a golden or olive undertone. Rich, spicy, saturated earth tones make you look strong and radiant, while pastels and icy shades can look washed out. Rust, chocolate, mustard, olive and deep teal are your power colors. You can wear dark shades without them looking heavy on you.",
      "keywords": ["Warm", "Deep", "Rich"],
      "makeup": "Brick red, cinnamon or warm burgundy lip, a bronze or terracotta blush and deep brown or olive eyeliner.",
      "hair": "Rich chocolate, chestnut, auburn or dark caramel. Very light or ashy colors can look disconnected from your face.",
      "jewelry": "Antique or rich yellow gold, copper and bronze, with garnet, tiger’s eye or deep green stones."
    },
    "winterbright": {
      "name": "Bright Winter",
      "word": "bright winter",
      "vibe": "Cool, vivid and impossible to ignore.",
      "desc": "Your coloring is cool and clear, often with striking contrast between hair, skin and eyes. Pure, jewel-bright colors and crisp black and white make you look sharp and alive, while muted, beige or dusty shades can dull your sparkle. Fuchsia, cobalt, emerald, true red and icy white are your signature. You can wear the boldest color in the room.",
      "keywords": ["Cool", "Clear", "High contrast"],
      "makeup": "True red, fuchsia or cool pink lip, a bright rose blush and crisp black eyeliner.",
      "hair": "Cool dark brown, blue-black or a clean cool tone. Warm caramel or brassy highlights can look muddy on you.",
      "jewelry": "Polished silver, white gold and platinum, with diamonds, sapphires or bright colored stones."
    },
    "winterdeep": {
      "name": "Deep Winter",
      "word": "deep winter",
      "vibe": "Cool, deep and quietly dramatic.",
      "desc": "You have deep coloring with a cool or neutral-cool undertone, often dark hair and dark eyes. Deep, cool shades and true black look elegant and powerful on you, while light warm pastels and beiges can make you look tired. Black, ink navy, plum, burgundy, pine green and icy white for contrast make your ideal wardrobe.",
      "keywords": ["Cool", "Deep", "Elegant"],
      "makeup": "Berry, wine or deep plum lip, a cool rose blush and black or deep plum eyeliner.",
      "hair": "Deep espresso, cool dark brown or soft black. Light golden tones can wash out your natural depth.",
      "jewelry": "Silver, white gold or gunmetal, with deep stones like ruby, amethyst or onyx."
    }
  }
};
