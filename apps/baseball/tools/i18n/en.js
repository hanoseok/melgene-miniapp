/* Bulls and Cows (숫자 야구 / number baseball) — en
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Bulls and Cows – Number Baseball Guessing Game",
    "description": "Play Bulls and Cows (Number Baseball) online: crack the secret 3 or 4 digit number from strike, ball and out clues. Best record per level, no download.",
    "ogTitle": "Bulls and Cows ⚾ Can you crack the secret number?",
    "ogDescription": "A secret number with no repeated digits. Guess it, read the strikes and balls, and win in as few tries as you can."
  },
  "siteName": "Bulls and Cows – Number Baseball",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "⚾ Number Baseball",
    "h1Kicker": "Bulls and Cows",
    "h1Html": "Crack the secret<br><em>number</em>!",
    "hook": "The computer has hidden a secret number with no repeated digits. Make a guess, read the strikes and balls, and work out the code.",
    "how": "Strike = right digit, right spot · Ball = right digit, wrong spot · Out = no match",
    "levelLabel": "Choose how many digits",
    "levels": {
      "d3": "3 digits",
      "d4": "4 digits"
    },
    "levelSub": {
      "d3": "Classic",
      "d4": "Tougher"
    },
    "timer": "Show timer",
    "start": "Start →"
  },
  "play": {
    "tries": "Tries",
    "time": "Time",
    "slotAria": "Digit {n}",
    "enter": "Guess",
    "del": "Delete",
    "giveUp": "Give up",
    "giveUpSure": "Tap again to reveal the answer",
    "historyTitle": "Your guesses",
    "historyEmpty": "Enter a number to make your first guess.",
    "errLen": "Enter {n} digits",
    "errDup": "Digits can’t repeat",
    "errAgain": "You already tried that number",
    "strike": "Strike",
    "ball": "Ball",
    "out": "Out",
    "legend": "Strike: right digit, right spot · Ball: right digit, wrong spot"
  },
  "result": {
    "done": "Cracked it!",
    "gaveUp": "The answer was",
    "triesCaption": "Tries",
    "timeLabel": "Time",
    "secretLabel": "Secret number",
    "sec": "sec",
    "best": "Best on this level: {n}",
    "newBest": "New personal best!",
    "top": "Top {n}%",
    "beat": "Fewer tries than {pct}% of players",
    "beatAll": "Fewer tries than every other result so far",
    "others": "Compared with {n} other results on this level",
    "comparing": "Comparing with other players…",
    "retry": "Play again",
    "shareTitle": "Bulls and Cows – can you crack the secret number?",
    "shareText": "I cracked a {d}-digit Number Baseball in {n} tries ⚾ Can you beat me?"
  },
  "og": {
    "brand": "⚾ Bulls and Cows",
    "defaultKicker": "Free number guessing game",
    "defaultTitle": "Can you crack the secret number?",
    "defaultDesc": "Strike · Ball · Out"
  },
  "faq": [
    {
      "q": "How do I play Bulls and Cows?",
      "a": "The computer picks a secret number whose digits are all different. Type a number of the same length, also without repeated digits, and press Guess. Each digit in the right place is a strike, each right digit in the wrong place is a ball, and if nothing matches it is an out. You win when every digit is a strike."
    },
    {
      "q": "Can the secret number start with 0, and can digits repeat?",
      "a": "It can start with 0, for example 072, but a digit never appears twice. Your own guesses must not repeat digits either. A guess you already tried does not count again, so only new guesses add to your tries."
    },
    {
      "q": "Is there a hint button or a limit on tries?",
      "a": "No hints and no limit. It is a pure deduction puzzle, so the fewer tries you need the better. If you get stuck, press Give up to see the answer and start a new round. The timer is optional and only shows if you switch it on."
    },
    {
      "q": "What is the difference between 3 and 4 digits?",
      "a": "With 3 digits there are 720 possible secret numbers, with 4 digits there are more, and every one is equally likely. Your best record is kept separately for each level in this browser."
    },
    {
      "q": "Where does the “Top %” number come from?",
      "a": "When you solve a round, your number of tries is compared with the real results of other players on the same level. If there are no other results to compare with yet, the comparison is simply not shown. Rounds you give up on are not counted."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Bulls and Cows",
    "description": "Privacy Policy for Bulls and Cows (Number Baseball): anonymous results, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Bulls and Cows – Number Baseball (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When you solve a round, only the difficulty and your number of tries are sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
      ],
      [
        "2. Cookies and similar technologies",
        "The Service may use cookies and your browser’s local storage to remember your language and your best times, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do."
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
        "This policy is effective as of October 18, 2026."
      ]
    ],
    "back": "← Back to Bulls and Cows"
  }
};
