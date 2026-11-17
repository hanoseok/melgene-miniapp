/* Reindeer Jump — en
 * Rules live in reindeer-core.js; this file holds every visible string.
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
    "title": "Reindeer Jump Game – Rooftop Endless Runner",
    "description": "Reindeer Jump is a free one-button endless runner: leap across snowy night rooftops, clear chimneys and crows, double jump over gaps and grab every present.",
    "ogTitle": "Reindeer Jump 🦌 How far can you run across the rooftops?",
    "ogDescription": "Tap to jump, hold to fly higher, tap again for a double jump. Just don’t miss a roof."
  },
  "siteName": "Reindeer Jump",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🦌 Snowy rooftops, starry night",
    "h1Kicker": "Reindeer Jump Game",
    "h1Html": "Roof to roof,<br><em>don’t look down</em>",
    "hook": "Someone has to cross town tonight. Leap from rooftop to rooftop, hop over chimneys and crows, and scoop up every present on the way.",
    "how": {
      "tap": "Tap to jump",
      "hold": "Hold to go higher",
      "air": "Tap again in mid-air"
    },
    "start": "Start running →",
    "facts": "Endless run · 3 hearts · phone or PC"
  },
  "play": {
    "score": "Score",
    "dist": "Distance",
    "lives": "Hearts",
    "mUnit": "m",
    "pause": "Pause",
    "paused": "Paused",
    "resume": "Keep running",
    "hint": "Tap to start running",
    "fieldAria": "Snowy rooftops: tap, click or press Space to jump, hold to jump higher, tap again in mid-air to double jump",
    "bell": "Bell! +{n}",
    "ouch": "Ouch!",
    "fall": "Whoops!",
    "crash": "Out of hearts!"
  },
  "result": {
    "over": "Run over",
    "reasonFall": "You slipped between two roofs",
    "reasonCrash": "Three bumps and you ran out of hearts",
    "unit": "pts",
    "newBest": "New personal best!",
    "best": "Your best: {n} pts",
    "distance": "Distance",
    "presents": "Presents",
    "bells": "Bells",
    "tierLabel": "Your rooftop rank",
    "tiers": [
      "🧦 First hop",
      "❄️ Chimney hopper",
      "🦌 Steady runner",
      "🌙 Night glider",
      "⭐ Rooftop star",
      "🏆 Sky champion"
    ],
    "top": "Top {n}%",
    "beat": "Better than {pct}% of players",
    "beatAll": "Better than every other player so far",
    "others": "Compared with {n} other runs",
    "comparing": "Comparing with other players…",
    "shareTitle": "Reindeer Jump",
    "shareText": "I scored {n} pts leaping across the rooftops 🦌 {tier}. Can you beat it?",
    "retry": "Run again"
  },
  "og": {
    "brand": "🦌 Reindeer Jump",
    "defaultKicker": "One-button rooftop runner",
    "defaultTitle": "How far can you run across the rooftops?",
    "defaultDesc": "Tap to jump · hold to go higher · double jump"
  },
  "faq": [
    {
      "q": "How do I jump higher?",
      "a": "The longer you hold, the higher the jump. Keep your finger (or Space, ↑ or the mouse button) down while the reindeer rises and it keeps climbing; let go early for a short hop. While in the air you can tap once more for a double jump."
    },
    {
      "q": "What ends a run?",
      "a": "Falling into a gap between two roofs ends the run straight away. Bumping into a chimney, a snow pile, an ice block or a crow costs one heart, and the reindeer then blinks for a moment and can’t be hurt. Lose all three hearts and the run is over too."
    },
    {
      "q": "Can every gap really be cleared?",
      "a": "Yes. Each gap and obstacle is built so that a single held jump at the current speed clears it, with room to land before the next one. The double jump is your spare for a late take-off."
    },
    {
      "q": "How does scoring work?",
      "a": "Every metre you run adds a point, and the pace picks up the longer you last. Presents add 10 points and the rare golden bell adds 50. The run pauses by itself if you switch tabs or lock your phone."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Reindeer Jump",
    "description": "Privacy Policy for Reindeer Jump: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Reindeer Jump (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a run ends, only your score is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of November 18, 2026."
      ]
    ],
    "back": "← Back to Reindeer Jump"
  }
};
