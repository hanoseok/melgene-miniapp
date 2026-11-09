/* Ice Fishing — en (Ice Fishing)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "Ice Fishing Game – Catch Fish Under the Ice",
    "description": "Ice Fishing is a free online ice fishing game: drop your line through the ice, wait for a bite and reel in without snapping the line. 60 seconds, phone or PC.",
    "ogTitle": "Ice Fishing 🎣 How many fish can you land in 60 seconds?",
    "ogDescription": "Lower your line through the ice, feel the bite and reel in carefully. Pull too hard and the line snaps."
  },
  "siteName": "Ice Fishing",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎣 A frozen lake, one little hole",
    "h1Kicker": "Ice Fishing Game",
    "h1Html": "Drop your line<br><em>and reel them in</em>",
    "hook": "Something is swimming under the ice. Lower your hook to the right depth, wait for the tug, then reel in gently before the line gives way.",
    "how": {
      "lower": "Hold to lower the hook",
      "reel": "Fish on? Hold to reel",
      "red": "Let go in the red zone"
    },
    "start": "Start fishing →",
    "facts": "60-second round · phone or PC · beat your best"
  },
  "play": {
    "score": "Score",
    "time": "Time",
    "secUnit": "s",
    "pause": "Pause",
    "paused": "Paused",
    "resume": "Keep fishing",
    "hint": "Hold under the ice to drop your line",
    "fieldAria": "Frozen lake: hold at a depth to lower the hook, hold to reel when a fish bites",
    "bite": "Bite!",
    "catchPop": "{fish} +{n}",
    "snap": "Snap!",
    "escape": "It got away",
    "timeUp": "Time's up!"
  },
  "fish": {
    "minnow": "Minnow",
    "perch": "Perch",
    "trout": "Trout",
    "pike": "Pike",
    "golden": "Golden fish",
    "boot": "Old boot"
  },
  "result": {
    "over": "Your catch",
    "unit": "pts",
    "newBest": "New personal best!",
    "best": "Your best: {n} pts",
    "caught": "Fish caught",
    "snapped": "Lines snapped",
    "bestCatch": "Best catch: {fish}",
    "noCatch": "No fish this time",
    "tierLabel": "Your angler level",
    "tiers": [
      "🧊 Cold hands",
      "🪝 Ice beginner",
      "🐟 Patient angler",
      "🎣 Lake regular",
      "⭐ Ice whisperer",
      "🏆 Lake legend"
    ],
    "top": "Top {n}%",
    "beat": "Better than {pct}% of anglers",
    "beatAll": "Better than every other angler so far",
    "others": "Compared with {n} other rounds",
    "comparing": "Comparing with other anglers…",
    "shareTitle": "Ice Fishing",
    "shareText": "I scored {n} pts ice fishing in 60 seconds 🎣 {tier}. Can you beat it?",
    "retry": "Fish again"
  },
  "og": {
    "brand": "🎣 Ice Fishing",
    "defaultKicker": "Online ice fishing game",
    "defaultTitle": "How many fish can you land in 60 seconds?",
    "defaultDesc": "Drop the line · feel the bite · don't snap it"
  },
  "faq": [
    {
      "q": "How do I lower the line?",
      "a": "Press and hold anywhere in the water under the ice. The hook moves toward the depth you are holding and stops when you let go. On a computer you can also hold the ↓ and ↑ keys. Different fish like different depths, so try a few."
    },
    {
      "q": "How does reeling work?",
      "a": "When a fish bites, hold to reel it up. Reeling raises the tension bar on the right. When the bar reaches the red zone, let go for a moment so the line can relax, then hold again. If the bar fills up, the line snaps; if you leave it slack for too long, the fish slips off."
    },
    {
      "q": "Why are some catches worth more?",
      "a": "Bigger, deeper fish pull harder and are worth more points, and a rare golden fish is worth the most. Junk such as an old boot is easy to pull up but scores nothing. Your best score is saved in this browser."
    },
    {
      "q": "What happens if I switch tabs?",
      "a": "The round pauses by itself when you leave the page or lock your phone, and the clock stops too. Press Keep fishing (or the P key) to carry on where you left off."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Ice Fishing",
    "description": "Privacy Policy for Ice Fishing: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Ice Fishing (the \"Service\") respects your privacy and processes only the minimum information described below.",
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
        "This policy is effective as of November 10, 2026."
      ]
    ],
    "back": "← Back to Ice Fishing"
  }
};
