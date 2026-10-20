/* Snake Game — English (site root /, default + x-default)
 * Game rules and scoring live in snake-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {score} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap",
    "display": "'Lilita One'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Snake Game – Classic Free Online Snake",
    "description": "Snake game: swipe or use the arrow keys to guide the snake, eat apples and grow without hitting a wall or your own tail. Free, no download, plays in your browser.",
    "ogTitle": "Snake Game 🐍 How long can you grow?",
    "ogDescription": "The classic snake game. It speeds up with every apple. How long can you survive?"
  },
  "siteName": "Snake Game",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🐍 Classic arcade",
    "h1Kicker": "Snake Game",
    "h1Html": "Eat. Grow.<br><em>Don’t crash.</em>",
    "hook": "Steer the snake to the apples. Every bite makes you longer and a little faster. One wrong turn and it’s over.",
    "how": {
      "move": "Swipe or arrow keys",
      "eat": "Eat apples",
      "avoid": "Avoid walls & tail"
    },
    "facts": "Speeds up · walls are deadly · beat your best",
    "start": "Start slithering →"
  },
  "play": {
    "score": "Score",
    "best": "Best",
    "paused": "Paused",
    "resume": "Resume",
    "go": "Go!",
    "fieldAria": "Game board. Swipe or use the arrow keys or W A S D to steer the snake.",
    "pause": "Pause"
  },
  "result": {
    "wall": "Hit the wall!",
    "self": "Bit your own tail!",
    "full": "Board full. Perfect!",
    "ate": "Apples eaten",
    "level": "Speed level reached",
    "shareTitle": "Snake Game",
    "shareText": "I scored {score} points in Snake 🐍 Can you beat me?",
    "points": "points",
    "best": "Best: {n}",
    "newBest": "New best!",
    "top": "Top {n}%",
    "beat": "Higher than {pct}% of players",
    "beatAll": "Higher than every other score so far",
    "others": "Compared with {n} other scores",
    "comparing": "Comparing with other players…",
    "retry": "Play again"
  },
  "og": {
    "brand": "🐍 Snake Game",
    "defaultKicker": "Free classic arcade game",
    "defaultTitle": "How long can your snake grow?",
    "defaultDesc": "Swipe to steer · eat apples · don’t crash"
  },
  "faq": [
    {
      "q": "How do I play?",
      "a": "Swipe in any direction on the board, or use the arrow keys or W A S D. The snake never stops moving, so steer it to the apples. Each apple makes it longer. The round ends when you hit a wall or your own tail."
    },
    {
      "q": "Why does the snake get faster?",
      "a": "Every few apples you reach a new speed level: the snake moves quicker and each apple is worth a little more. The speed stops rising after a while, so the game stays playable."
    },
    {
      "q": "Is the top % real?",
      "a": "Yes. When a round ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown."
    },
    {
      "q": "Why did the game pause by itself?",
      "a": "The game pauses automatically when you switch tabs or apps, so you never crash while you’re away. Tap Resume to carry on. Your best score is kept in this browser."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Snake Game",
    "description": "Privacy Policy for Snake Game: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Snake Game (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a round ends, only your score (rounded to the nearest 10 points) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of October 21, 2026."
      ]
    ],
    "back": "← Back to Snake Game"
  }
};
