/* Sled Race — en
 * Rules live in sled-core.js; this file holds every visible string.
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
    "title": "Sled Game – Sled Race Down a Snowy Hill",
    "description": "Sled Race is a free online sled game: steer down an endless snowy hill, dodge pine trees and rocks, grab flags and gifts, and fly off ramps in 90 seconds.",
    "ogTitle": "Sled Race 🛷 How far can you sled in 90 seconds?",
    "ogDescription": "Dodge the trees, grab the gifts, hit the ramps. Three hearts, one hill."
  },
  "siteName": "Sled Race",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🛷 Fresh powder, steep hill",
    "h1Kicker": "Sled Game",
    "h1Html": "Down the hill,<br><em>don't hit a tree</em>",
    "hook": "The hill is long, the snow is fast and someone left gifts all the way down. Steer around the trees, scoop up what you can and use the ramps to fly.",
    "how": {
      "steer": "Hold left or right to steer",
      "grab": "Grab flags, gifts and stars",
      "dodge": "Dodge trees and rocks"
    },
    "start": "Push off →",
    "facts": "90-second run · 3 hearts · phone or PC"
  },
  "play": {
    "score": "Score",
    "dist": "Distance",
    "lives": "Hearts",
    "mUnit": "m",
    "pause": "Pause",
    "paused": "Paused",
    "resume": "Keep sledding",
    "hint": "Tap to push off",
    "fieldAria": "Snowy hill: hold the left or right side, or drag, to steer the sled",
    "star": "Star! +{n}",
    "air": "Air! +{n}",
    "ouch": "Ouch!",
    "finish": "Finish line!",
    "crash": "Wipeout!"
  },
  "result": {
    "over": "Run complete",
    "reasonFinish": "You made it to the bottom",
    "reasonCrash": "Three bumps and you tumbled off",
    "unit": "pts",
    "newBest": "New personal best!",
    "best": "Your best: {n} pts",
    "distance": "Distance",
    "items": "Pickups",
    "jumps": "Jumps",
    "tierLabel": "Your sledding rank",
    "tiers": [
      "🧣 Wobbly beginner",
      "❄️ Bunny hill rider",
      "🛷 Steady steerer",
      "🌲 Tree dodger",
      "⭐ Ramp flyer",
      "🏆 Hill champion"
    ],
    "top": "Top {n}%",
    "beat": "Better than {pct}% of players",
    "beatAll": "Better than every other player so far",
    "others": "Compared with {n} other runs",
    "comparing": "Comparing with other players…",
    "shareTitle": "Sled Race",
    "shareText": "I scored {n} pts sledding down the hill 🛷 {tier}. Can you beat it?",
    "retry": "Sled again"
  },
  "og": {
    "brand": "🛷 Sled Race",
    "defaultKicker": "Online sled game",
    "defaultTitle": "How far can you sled in 90 seconds?",
    "defaultDesc": "Steer · grab gifts · fly off ramps"
  },
  "faq": [
    {
      "q": "How do I steer the sled?",
      "a": "Press and hold the left or right half of the hill to lean that way, or put a finger down and drag the sled where you want it. On a computer, hold ← and → (or A and D). Let go and the sled straightens out."
    },
    {
      "q": "What happens when I hit something?",
      "a": "Bumping into a tree, a rock or a snowman costs one heart and slows you down. For a moment afterwards the sled blinks and can't be hurt again. Lose all three hearts and the run is over."
    },
    {
      "q": "How does scoring work?",
      "a": "Every stretch of hill you cover adds points, and the pace picks up the longer you last. Flags, gift boxes and the rare golden star add bonus points. Riding over a ramp launches you into the air for a bonus, and you sail safely over anything below."
    },
    {
      "q": "How long is one run?",
      "a": "A full run lasts 90 seconds and ends at the finish line, or earlier if you lose all your hearts. The run pauses by itself if you switch tabs or lock your phone."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Sled Race",
    "description": "Privacy Policy for Sled Race: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Sled Race (the \"Service\") respects your privacy and processes only the minimum information described below.",
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
        "This policy is effective as of November 16, 2026."
      ]
    ],
    "back": "← Back to Sled Race"
  }
};
