/* 10 Second Challenge — en (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "10 Second Challenge – Stop the Timer at Exactly 10.00",
    "description": "10 Second Challenge: start the stopwatch and stop it at exactly 10.00 seconds by feel. Three tries, a blind mode and 5 or 30 second targets. Free, no download.",
    "ogTitle": "10 Second Challenge ⏱️ Can you stop at exactly 10.00?",
    "ogDescription": "Count in your head and hit stop right on time. Three tries, and the digits can vanish in blind mode."
  },
  "siteName": "10 Second Challenge",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "⏱️ Can you feel 10 seconds?",
    "h1Kicker": "10 Second Challenge",
    "h1Html": "Stop the timer at<br><em>exactly 10.00</em>",
    "hook": "Start the stopwatch, count in your head and hit stop right on time. Three tries, and only your closest one counts.",
    "targetLabel": "Target time",
    "targetValue": "{n} s",
    "blindLabel": "Blind mode",
    "blindDesc": "The digits disappear after 3 seconds",
    "how": "Tap Start, then STOP · tap anywhere or press Space",
    "start": "Let’s go →",
    "facts": "3 tries · 5, 10 or 30 seconds · beat your best"
  },
  "play": {
    "target": "Target {t}",
    "blindTag": "Blind",
    "attempt": "Try {n} of {total}",
    "go": "Start",
    "stop": "STOP",
    "next": "Next try",
    "finish": "See my result",
    "readyHint": "Press Start, then stop at exactly {t}",
    "runHint": "Tap anywhere or press Space to stop",
    "early": "{n} too early",
    "late": "{n} too late",
    "perfect": "Perfect! Exactly {t} 🎉",
    "cancelled": "You left the page, so that try didn’t count. Go again!",
    "hidden": "??:??.??",
    "change": "← Change mode",
    "clockAria": "Stopwatch",
    "sec": "{n} s"
  },
  "result": {
    "over": "Your result",
    "mode": "Target {t}",
    "perfect": "Exactly {t}! Perfect stop 🎉",
    "bestLabel": "Closest try, off by",
    "stoppedAt": "Stopped at {time}",
    "tierLabel": "Your inner clock",
    "tiers": [
      "🐌 Lost in time",
      "⏳ Roughly there",
      "🙂 Good inner clock",
      "🎯 Sharp timing",
      "⚡ Split-second pro",
      "🧠 Human stopwatch"
    ],
    "newBest": "New personal best!",
    "pb": "Your best in this mode: {n}",
    "avg": "Average error",
    "listLabel": "Your 3 tries",
    "top": "Top {n}%",
    "beat": "More accurate than {pct}% of players",
    "beatAll": "More accurate than every other player so far",
    "others": "Compared with {n} other rounds in this mode",
    "comparing": "Comparing with other players…",
    "shareTitle": "10 Second Challenge",
    "shareText": "I stopped the timer just {n} away from {t} ⏱️ {tier}. Can you hit it exactly?",
    "retry": "Try again"
  },
  "og": {
    "brand": "⏱️ 10 Second Challenge",
    "defaultKicker": "Free timing game",
    "defaultTitle": "Can you stop the timer at exactly 10.00?",
    "defaultDesc": "3 tries · blind mode · 5, 10 or 30 seconds"
  },
  "faq": [
    {
      "q": "How do I play?",
      "a": "Pick a target time (5, 10 or 30 seconds) and press Start. The stopwatch begins the moment you tap. Count in your head, then hit STOP, tap anywhere on the game screen or press Space when you think the time is up. You get three tries per round, and your closest try is your result."
    },
    {
      "q": "What does blind mode do?",
      "a": "In blind mode the digits turn into question marks after the first 3 seconds, so you have to keep counting by feel alone. It is much harder, and it keeps its own personal best and its own comparison with other players."
    },
    {
      "q": "Why is hitting exactly 10.00 so hard?",
      "a": "Your finger needs a moment to react, and a steady count drifts a little over ten seconds, so even a good stop lands a few hundredths early or late. The timer uses the moment of your tap itself and shows hundredths of a second like a real stopwatch. A stop that reads exactly 10.00 is rare, which is what makes it fun."
    },
    {
      "q": "Why didn’t my try count?",
      "a": "If you switch tabs, lock your phone or leave the page while the timer is running, that try is cancelled to keep things fair. Just start the same try again."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | 10 Second Challenge",
    "description": "Privacy Policy for 10 Second Challenge: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "10 Second Challenge (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a game ends, only your score (how many milliseconds your closest try was off) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of November 2, 2026."
      ]
    ],
    "back": "← Back to 10 Second Challenge"
  }
};
