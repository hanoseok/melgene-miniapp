/* Aim Trainer — en (Aim Trainer)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "Aim Trainer · Online aim test for mouse & touch",
    "description": "Aim Trainer: click 30 targets as fast as you can or hit as many as possible in 30 seconds. See your average time, accuracy and rank. Free on phone or PC.",
    "ogTitle": "Aim Trainer 🎯 How fast and accurate is your aim?",
    "ogDescription": "Hit 30 targets or race a 30-second clock and get your average time, accuracy and aim badge."
  },
  "siteName": "Aim Trainer",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🎯 How sharp is your aim?",
    "h1Kicker": "Aim Trainer · Online aim test",
    "h1Html": "Hit every target<br><em>in a flash</em>",
    "hook": "Targets pop up anywhere in the box. Click or tap them before they vanish and find out how quick and precise you really are.",
    "modeLabel": "Mode",
    "modes": {
      "classic": {
        "name": "Classic",
        "sub": "30 targets"
      },
      "timed": {
        "name": "Timed",
        "sub": "30 seconds"
      }
    },
    "how": "Hit the center target to start · clicks off the target count as misses",
    "start": "Start training →",
    "facts": "Mouse, touchpad or finger · phone or PC · beat your best"
  },
  "modes": {
    "classic": "Classic · 30 targets",
    "timed": "Timed · 30 seconds"
  },
  "play": {
    "time": "Time",
    "hits": "Hits",
    "acc": "Accuracy",
    "ready": "Hit the target to start",
    "readySub": "The clock starts with that first hit",
    "done": "Done!",
    "timeUp": "Time’s up!",
    "cancelled": "You left the page, so that run didn’t count. Try again!",
    "change": "← Change mode",
    "areaAria": "Aim area"
  },
  "result": {
    "over": "Your result",
    "scoreClassic": "Average time per target",
    "scoreTimed": "Targets hit",
    "unitMs": "ms",
    "unitHits": "hits",
    "acc": "Accuracy",
    "avg": "Avg time",
    "misses": "Misses",
    "total": "Total time",
    "escaped": "Got away",
    "msValue": "{n} ms",
    "secValue": "{n} s",
    "tierLabel": "Your aim badge",
    "tiers": [
      "🐢 Warming up",
      "🙂 Casual aimer",
      "🎯 Sharp eye",
      "🦅 Eagle eye",
      "⚡ Flick master",
      "🏆 Aim legend"
    ],
    "newBest": "New personal best!",
    "pbClassic": "Your best in Classic: {n} ms",
    "pbTimed": "Your best in Timed: {n} hits",
    "invalid": "That’s faster than a human can react, so this run isn’t saved or compared.",
    "top": "Top {n}%",
    "beat": "Better than {pct}% of players",
    "beatAll": "Better than every other player so far",
    "others": "Compared with {n} other runs in this mode",
    "comparing": "Comparing with other players…",
    "shareTitle": "Aim Trainer",
    "shareClassic": "I averaged {avg} ms per target with {acc}% accuracy 🎯 {tier}. Can you aim faster?",
    "shareTimed": "I hit {hits} targets in 30 seconds with {acc}% accuracy 🎯 {tier}. Can you beat that?",
    "retry": "Try again"
  },
  "og": {
    "brand": "🎯 Aim Trainer",
    "defaultKicker": "Free online aim test",
    "defaultTitle": "How fast and accurate is your aim?",
    "defaultDesc": "30 targets or 30 seconds · phone or PC"
  },
  "faq": [
    {
      "q": "How does the aim trainer work?",
      "a": "Choose Classic or Timed and press start, then hit the target in the middle of the box to begin. In Classic, 30 targets appear one at a time and your score is the average time it takes you to hit each one. In Timed, you have 30 seconds to hit as many targets as you can; each target slowly shrinks and gets away if you are too slow."
    },
    {
      "q": "What is a good score?",
      "a": "In Classic most people average somewhere between 500 and 800 milliseconds per target, and strong players get under 450. In Timed, around 35 to 45 hits is typical. Accuracy matters too: if fewer than 70% of your clicks land on a target, your badge drops one level."
    },
    {
      "q": "Can I play with a mouse, touchpad or touchscreen?",
      "a": "Yes. Mouse clicks, touchpad taps, pens and fingers all work; the keyboard is not used. Only clicks inside the play area count. Scores from different devices are not really comparable, so a mouse score and a phone score can be quite different."
    },
    {
      "q": "Why didn’t my run count?",
      "a": "If you switch tabs, lock your phone or leave the page during a run, that run is cancelled to keep things fair. Results faster than a human can react, such as an average below 150 milliseconds per target, are not saved or compared with other players."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Aim Trainer",
    "description": "Privacy Policy for Aim Trainer: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Aim Trainer (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a run ends, only your score (average time per target or number of hits) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of November 6, 2026."
      ]
    ],
    "back": "← Back to Aim Trainer"
  }
};
