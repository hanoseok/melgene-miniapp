/* Block Puzzle — English (site root /, default + x-default)
 * Game rules and scoring live in block-core.js; this file holds every visible string.
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
    "title": "Block Puzzle – 8×8 Block Game, Clear the Lines",
    "description": "Block Puzzle: drag blocks onto an 8×8 board, fill rows and columns to clear them and chain combos for big scores. Free, no download.",
    "ogTitle": "Block Puzzle 🧩 How long can you keep the board clear?",
    "ogDescription": "Drag the pieces, fill a row or a column and watch it vanish. Clear lines back to back for a combo."
  },
  "siteName": "Block Puzzle",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🧩 Relaxing 8×8 brain game",
    "h1Kicker": "Block Puzzle",
    "h1Html": "Fill the lines,<br><em>clear the board!</em>",
    "hook": "Three pieces, one 8×8 board and no timer. Fit them in, clear rows and columns, and keep going as long as there’s room.",
    "how": {
      "drag": "Drag a piece",
      "lines": "Fill a row or column",
      "plan": "Keep room to spare"
    },
    "facts": "No timer · combos · beat your best",
    "start": "Play →"
  },
  "play": {
    "score": "Score",
    "best": "Best",
    "combo": "Combo",
    "comboValue": "×{n}",
    "hint": "Drag a piece onto the board",
    "hintSelected": "Tap a spot on the board to place it",
    "hintNoFit": "That piece doesn’t fit there",
    "noRoom": "No more room!",
    "boardAria": "8 by 8 board. Choose a piece with 1, 2 or 3, move it with the arrow keys and press Enter to place it. Escape cancels.",
    "trayAria": "Pieces to place",
    "pieceAria": "Piece {n}",
    "pieceNoFit": "Piece {n} (no room)"
  },
  "result": {
    "over": "No more room on the board",
    "points": "points",
    "lines": "Lines cleared",
    "combo": "Best combo",
    "comboValue": "×{n}",
    "shareTitle": "Block Puzzle",
    "shareText": "I scored {n} points in Block Puzzle 🧩 Can you beat me?",
    "best": "Best: {n}",
    "newBest": "New best!",
    "top": "Top {n}%",
    "beat": "Higher than {pct}% of players",
    "beatAll": "Higher than every other player so far",
    "others": "Compared with {n} other games",
    "comparing": "Comparing with other players…",
    "retry": "Play again"
  },
  "og": {
    "brand": "🧩 Block Puzzle",
    "defaultKicker": "Free 8×8 block game",
    "defaultTitle": "Fill the lines, clear the board",
    "defaultDesc": "Drag · fill rows and columns · chain combos"
  },
  "faq": [
    {
      "q": "How do I play?",
      "a": "Drag one of the three pieces under the board and drop it on empty squares. When a row or a column is completely filled it clears. Once all three pieces are placed you get three new ones. The game ends when none of the remaining pieces fits anywhere."
    },
    {
      "q": "How is the score calculated?",
      "a": "Every square you place is worth one point. Clearing lines adds a bonus that grows with the number of lines cleared at once (10, 30, 60, 100 …), and the bonus is multiplied by your combo."
    },
    {
      "q": "How do combos work?",
      "a": "Each placement that clears at least one line raises your combo by one, and the combo is the multiplier for that clear. If three placements in a row clear nothing, the combo goes back to zero."
    },
    {
      "q": "Can I play without dragging?",
      "a": "Yes. Tap a piece to pick it, then tap the board where you want it. With a keyboard, press 1, 2 or 3 to pick a piece, move it with the arrow keys and press Enter to place it."
    },
    {
      "q": "Is the top % real?",
      "a": "Yes. When a game ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Block Puzzle",
    "description": "Privacy Policy for Block Puzzle: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Block Puzzle (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a game ends, only your score is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of October 29, 2026."
      ]
    ],
    "back": "← Back to Block Puzzle"
  }
};
