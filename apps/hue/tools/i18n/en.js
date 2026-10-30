/* Find the Different Color — English (site root /, default + x-default)
 * Game rules live in hue-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a one-line how-to. FAQ appears only in the shared end screen.
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
    "title": "Find the Different Color – Color Vision Test Game",
    "description": "Find the Different Color: spot the one tile that is a slightly different shade before the 60-second timer runs out. A free color vision test game, no download.",
    "ogTitle": "Find the Different Color 🎨 How sharp are your eyes?",
    "ogDescription": "One tile is a tiny bit different. Find it, then find the next one. The grid grows and the colors get closer."
  },
  "siteName": "Find the Different Color",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎨 60-second color sense test",
    "h1Kicker": "Find the Different Color",
    "h1Html": "One tile is off.<br><em>Can you spot it?</em>",
    "hook": "Every tile looks the same, but one is a shade lighter or darker. Tap it to level up, and the colors keep getting closer.",
    "how": "Tap the odd tile · a wrong tap costs 3 seconds",
    "facts": "60 seconds · up to 8×8 · beat your best",
    "start": "Start →"
  },
  "play": {
    "level": "Level",
    "time": "Time",
    "best": "Best",
    "hint": "Tap the tile that looks different",
    "penalty": "−{n}s",
    "timeUp": "Time’s up!",
    "boardAria": "Color grid. Use the arrow keys to move and Enter to pick the tile that looks different."
  },
  "result": {
    "over": "Time’s up",
    "unit": "levels",
    "tierLabel": "Your color sense",
    "tiers": [
      "🌫️ Warming up",
      "👀 Good eye",
      "🔍 Color detective",
      "🎯 Shade hunter",
      "🦅 Eagle eye",
      "🌈 Human color meter"
    ],
    "misses": "Wrong taps",
    "grid": "Biggest grid",
    "gridValue": "{n}×{n}",
    "shareTitle": "Find the Different Color",
    "shareText": "I cleared {n} levels in Find the Different Color 🎨 {tier}. Can you beat me?",
    "best": "Best: {n}",
    "newBest": "New best!",
    "top": "Top {n}%",
    "beat": "Better than {pct}% of players",
    "beatAll": "Better than every other player so far",
    "others": "Compared with {n} other games",
    "comparing": "Comparing with other players…",
    "retry": "Play again"
  },
  "og": {
    "brand": "🎨 Find the Different Color",
    "defaultKicker": "Free color vision game",
    "defaultTitle": "One tile is different. Can you spot it?",
    "defaultDesc": "60 seconds · grids up to 8×8 · closer and closer shades"
  },
  "faq": [
    {
      "q": "How do I play?",
      "a": "Press Start and a grid of tiles appears. All of them are the same color except one, which is very slightly lighter or darker. Tap that tile to move to the next level. The grid gets bigger and the difference gets smaller as you go. You have 60 seconds in total."
    },
    {
      "q": "What happens if I tap the wrong tile?",
      "a": "Nothing breaks, but 3 seconds come off your clock and the grid shakes. Guessing quickly is usually worse than taking one extra second to look."
    },
    {
      "q": "Why are some colors harder than others?",
      "a": "Our eyes are more sensitive to brightness changes in some colors than in others, and every screen shows colors a little differently. Brightness, night mode, blue-light filters and viewing angle all matter, so turn the screen up and look at it straight on."
    },
    {
      "q": "Is this a color blindness test?",
      "a": "No. It is a game for fun and not a medical test. A low score does not mean anything is wrong with your eyes. If you are worried about your color vision, please see an eye doctor."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Find the Different Color",
    "description": "Privacy Policy for Find the Different Color: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Find the Different Color (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a game ends, only your score (the number of levels cleared) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of October 31, 2026."
      ]
    ],
    "back": "← Back to Find the Different Color"
  }
};
