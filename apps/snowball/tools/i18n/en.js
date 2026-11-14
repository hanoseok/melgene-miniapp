/* Snowball Fight — en (Snowball Fight)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "Snowball Fight Game – Throw, Duck, Hit",
    "description": "Snowball Fight is a free online snowball fight game: hit the kids popping up from their snow forts and duck behind your wall when a snowball comes your way.",
    "ogTitle": "Snowball Fight ☃️ How many hits can you land in 60 seconds?",
    "ogDescription": "Throw fast, duck in time and don't hit the dog. Three hearts, one minute."
  },
  "siteName": "Snowball Fight",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "☃️ Fresh snow, full pockets",
    "h1Kicker": "Snowball Fight Game",
    "h1Html": "Pop up, throw<br><em>and duck in time</em>",
    "hook": "The kids across the yard are hiding behind their snow forts. Tag them when they peek out, and get down fast when one winds up to throw back.",
    "how": {
      "throw": "Tap a kid to throw",
      "duck": "Hold Duck when ❗ shows",
      "avoid": "Don't hit friends"
    },
    "start": "Start the fight →",
    "facts": "60-second round · 3 hearts · phone or PC"
  },
  "play": {
    "score": "Score",
    "time": "Time",
    "lives": "Hearts",
    "secUnit": "s",
    "pause": "Pause",
    "paused": "Paused",
    "resume": "Back to the fight",
    "hint": "Tap the yard to begin",
    "fieldAria": "Snowy yard: tap a kid to throw a snowball, hold the wall or the Duck button to hide",
    "duck": "Duck (hold)",
    "duckAria": "Duck behind the wall while held",
    "combo": "Combo ×{n}",
    "golden": "Golden! +{n}",
    "oops": "A friend! −{n}",
    "miss": "Miss",
    "block": "Blocked!",
    "ouch": "Ouch!",
    "timeUp": "Time's up!",
    "out": "Snowed under!"
  },
  "result": {
    "over": "Fight over",
    "reasonTime": "You lasted the whole minute",
    "reasonOut": "Three hits and you're out",
    "unit": "pts",
    "newBest": "New personal best!",
    "best": "Your best: {n} pts",
    "hits": "Hits",
    "accuracy": "Accuracy",
    "bestCombo": "Best combo",
    "tierLabel": "Your snowball rank",
    "tiers": [
      "🧤 Frozen fingers",
      "❄️ Snow rookie",
      "⛄ Yard regular",
      "🎯 Sharp thrower",
      "⭐ Fort raider",
      "🏆 Snow legend"
    ],
    "top": "Top {n}%",
    "beat": "Better than {pct}% of players",
    "beatAll": "Better than every other player so far",
    "others": "Compared with {n} other rounds",
    "comparing": "Comparing with other players…",
    "shareTitle": "Snowball Fight",
    "shareText": "I scored {n} pts in a 60-second snowball fight ☃️ {tier}. Can you beat it?",
    "retry": "Fight again"
  },
  "og": {
    "brand": "☃️ Snowball Fight",
    "defaultKicker": "Online snowball fight game",
    "defaultTitle": "How many hits can you land in 60 seconds?",
    "defaultDesc": "Throw · duck · don't hit the dog"
  },
  "faq": [
    {
      "q": "How do I throw and duck?",
      "a": "Tap or click a kid who pops up from a snow fort and a snowball flies there. To hide, press and hold the Duck button or the snow wall at the bottom. You can't throw while you are ducking. On a computer, use ← and → to pick a fort, ↑ or F to throw and hold Space or ↓ to duck."
    },
    {
      "q": "How do I know a snowball is coming?",
      "a": "A kid who is about to throw raises an arm and a red ❗ appears above them. Hit them first and the throw never happens. Once the snowball is in the air, a big ❗ shows above your wall and the Duck button turns red, so hold it until the ball lands."
    },
    {
      "q": "How does scoring work?",
      "a": "Each hit scores points, and a snowman is worth a little more than a kid. Hitting several in a row builds a combo that raises every hit's value, while a miss resets it. A rare golden snowman is worth the most. The dog and the kid waving a white flag are friends, so hitting them costs points."
    },
    {
      "q": "When does a round end?",
      "a": "A round lasts 60 seconds, or ends early if you are hit three times. It gets busier as the clock runs down. The round pauses by itself if you switch tabs or lock your phone."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Snowball Fight",
    "description": "Privacy Policy for Snowball Fight: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Snowball Fight (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a round ends, only your score is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
      ],
      [
        "2. Cookies and similar technologies",
        "The Service may use cookies and your browser’s local storage to remember your language and your best score, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do."
      ],
      [
        "3. Advertising (Google AdSense)",
        "The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google Ad Settings</a>."
      ],
      [
        "4. Statistics",
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished games, star ratings). None of this identifies you personally."
      ],
      [
        "5. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "6. Effective date",
        "This policy is effective as of November 14, 2026."
      ]
    ],
    "back": "← Back to Snowball Fight"
  }
};
