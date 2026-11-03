/* CPS Test — en (click speed test / cps)
 * Rules live in cps-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {cps} {clicks} {sec} {tier} — keep them as-is when translating.
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
    "title": "CPS Test · Click Speed Test (Clicks per Second)",
    "description": "CPS Test: click as fast as you can for 1, 5 or 10 seconds and see your clicks per second, your speed badge and your best score. Free, works on phone and PC.",
    "ogTitle": "CPS Test 🖱️ How many clicks per second can you do?",
    "ogDescription": "Tap or click like crazy for 1, 5 or 10 seconds and get your CPS score and speed badge."
  },
  "siteName": "CPS Test",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🖱️ How fast are your fingers?",
    "h1Kicker": "CPS Test · Click Speed Test",
    "h1Html": "How many clicks<br><em>per second?</em>",
    "hook": "Click or tap the big box as fast as you can before the time runs out. Your score is your clicks per second.",
    "modeLabel": "Test length",
    "modeValue": "{n} s",
    "how": "The timer starts on your first click · mouse clicks and taps only",
    "start": "Let’s go →",
    "facts": "1, 5 or 10 seconds · phone or PC · beat your best"
  },
  "play": {
    "mode": "{n}-second test",
    "time": "Time",
    "clicks": "Clicks",
    "cps": "CPS",
    "ready": "Click here to start",
    "readySub": "The timer starts with your first click",
    "go": "Keep clicking!",
    "over": "Time’s up!",
    "cancelled": "You left the page, so that attempt didn’t count. Try again!",
    "change": "← Change mode",
    "zoneAria": "Click area",
    "sec": "{n} s"
  },
  "result": {
    "over": "Your result",
    "mode": "{n}-second test",
    "unit": "CPS",
    "clicks": "Clicks",
    "time": "Time",
    "tierLabel": "Your click speed badge",
    "tiers": [
      "🐢 Turtle tapper",
      "🐇 Quick bunny",
      "🐆 Cheetah fingers",
      "⚡ Lightning clicker",
      "🔥 Jitter-click master",
      "🚀 Click machine"
    ],
    "newBest": "New personal best!",
    "pb": "Your best in this mode: {n} CPS",
    "tooFast": "Over 25 CPS is beyond human speed, so this score isn’t saved or compared.",
    "top": "Top {n}%",
    "beat": "Faster than {pct}% of players",
    "beatAll": "Faster than every other player so far",
    "others": "Compared with {n} other rounds in this mode",
    "comparing": "Comparing with other players…",
    "shareTitle": "CPS Test",
    "shareText": "I hit {cps} CPS ({clicks} clicks in {sec} s) 🖱️ {tier}. Can you click faster?",
    "retry": "Try again"
  },
  "og": {
    "brand": "🖱️ CPS Test",
    "defaultKicker": "Free click speed test",
    "defaultTitle": "How many clicks per second can you do?",
    "defaultDesc": "1, 5 or 10 seconds · phone or PC"
  },
  "faq": [
    {
      "q": "How does the CPS test work?",
      "a": "Pick a test length of 1, 5 or 10 seconds and press the button. The timer starts the moment you first click or tap inside the big box, and that first click already counts. Click as fast as you can until the time is up. Your CPS is the number of clicks divided by the seconds in the test."
    },
    {
      "q": "What is a good CPS score?",
      "a": "With normal clicking most people land somewhere around 5 to 8 clicks per second. Gamers who use special techniques such as jitter clicking or butterfly clicking often reach 10 or more. The 1-second mode usually gives the highest number because there is no time to get tired."
    },
    {
      "q": "Do keyboard keys or several fingers count?",
      "a": "Only mouse clicks and taps inside the box count. Keyboard keys are ignored on purpose, because holding a key down repeats automatically. On a touchscreen every finger that touches the box counts as one click, so you can use two fingers or both thumbs."
    },
    {
      "q": "Why didn’t my attempt count?",
      "a": "If you switch tabs, lock your phone or leave the page while the timer is running, that attempt is cancelled to keep things fair. Scores above 25 clicks per second are impossible for a human finger, so they are not saved or compared with other players."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | CPS Test",
    "description": "Privacy Policy for CPS Test: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "CPS Test (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a test ends, only your score (clicks per second) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of November 4, 2026."
      ]
    ],
    "back": "← Back to CPS Test"
  }
};
