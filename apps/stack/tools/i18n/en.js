/* Stack Tower — English (site root /, default + x-default)
 * Game rules and scoring live in stack-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} — keep them as-is when translating.
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
    "title": "Stack Tower – Free Online Stack Game",
    "description": "Stack Tower, the tower stacking game: tap to drop the sliding block and build as high as you can. Overhangs get sliced off, perfect drops keep it wide. Free.",
    "ogTitle": "Stack Tower 🏗️ How high can you build?",
    "ogDescription": "Tap to drop each sliding block. Miss the edge and it gets sliced. How tall can your tower get?"
  },
  "siteName": "Stack Tower",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🏗️ One-tap arcade",
    "h1Kicker": "Stack Tower",
    "h1Html": "Tap. Drop.<br><em>Build higher.</em>",
    "hook": "A block slides back and forth above your tower. Drop it at just the right moment. Whatever hangs over the edge is gone for good.",
    "how": {
      "tap": "Tap to drop",
      "cut": "Overhang is cut",
      "perfect": "Line up perfectly"
    },
    "facts": "Speeds up · one tap · beat your best",
    "start": "Start stacking →"
  },
  "play": {
    "score": "Blocks",
    "best": "Best",
    "paused": "Paused",
    "resume": "Resume",
    "hint": "Tap to drop",
    "perfect": "Perfect!",
    "combo": "Combo ×{n}",
    "fieldAria": "Game area. Tap, click or press Space to drop the sliding block.",
    "pause": "Pause"
  },
  "result": {
    "over": "Missed the tower!",
    "blocks": "blocks",
    "perfects": "Perfect drops",
    "bestCombo": "Best combo",
    "shareTitle": "Stack Tower",
    "shareText": "I stacked {n} blocks in Stack Tower 🏗️ Can you build higher?",
    "best": "Best: {n}",
    "newBest": "New best!",
    "top": "Top {n}%",
    "beat": "Higher than {pct}% of players",
    "beatAll": "Higher than every other tower so far",
    "others": "Compared with {n} other towers",
    "comparing": "Comparing with other players…",
    "retry": "Play again"
  },
  "og": {
    "brand": "🏗️ Stack Tower",
    "defaultKicker": "Free one-tap stacking game",
    "defaultTitle": "How high can you stack it?",
    "defaultDesc": "Tap to drop · overhang gets cut · go for perfect"
  },
  "faq": [
    {
      "q": "How do I play?",
      "a": "A block slides back and forth above the tower. Tap the game area, click, or press Space to drop it. Only the part that lands on the block below stays; the rest is sliced off, so the next block is narrower. The round ends when a block misses the tower completely."
    },
    {
      "q": "What is a perfect drop?",
      "a": "If you drop a block almost exactly on top of the one below, it snaps into place and keeps its full size. Chain several perfect drops in a row and the block slowly grows wider again, giving you a little breathing room."
    },
    {
      "q": "Why does it get harder?",
      "a": "Each block you stack makes the next one slide a little faster, up to a top speed. Watch the rhythm and tap a moment before the block reaches the right spot."
    },
    {
      "q": "Is the top % real?",
      "a": "Yes. When a round ends, only your number of blocks is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Stack Tower",
    "description": "Privacy Policy for Stack Tower: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Stack Tower (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a round ends, only your score (the number of blocks you stacked) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, started and finished rounds, star ratings). None of this identifies you personally."
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
    "back": "← Back to Stack Tower"
  }
};
