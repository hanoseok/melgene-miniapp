/* Flappy Bat — English (site root /, default + x-default)
 * Game rules and scoring live in bat-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a very short how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {s} — keep them as-is when translating.
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
    "title": "Flappy Bat – Halloween Flappy Game",
    "description": "Flappy Bat, a Halloween take on the flappy game: tap to flap and steer a little bat between gravestones and haunted trees. Free, no download.",
    "ogTitle": "Flappy Bat 🦇 How far can you fly tonight?",
    "ogDescription": "Tap to flap through the graveyard under the full moon. One touch and it’s over. How many gaps can you clear?"
  },
  "siteName": "Flappy Bat",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "🦇 One-tap Halloween arcade",
    "h1Kicker": "Flappy Bat",
    "h1Html": "Tap to flap,<br><em>dodge it all!</em>",
    "hook": "A little bat, a full moon and a graveyard full of narrow gaps. Keep it in the air and see how far it gets.",
    "how": {
      "tap": "Tap to flap",
      "pass": "Pass the gaps",
      "avoid": "Don’t touch"
    },
    "facts": "One tap · gets trickier · beat your best",
    "start": "Take off →"
  },
  "play": {
    "score": "Score",
    "best": "Best",
    "paused": "Paused",
    "resume": "Resume",
    "hint": "Tap to flap",
    "fieldAria": "Game area. Tap, click or press Space to flap your wings.",
    "pause": "Pause"
  },
  "result": {
    "over": "Bonk! The bat went down",
    "points": "gaps",
    "flaps": "Flaps",
    "time": "Flight time",
    "timeValue": "{s} s",
    "shareTitle": "Flappy Bat",
    "shareText": "My bat flew through {n} gaps in Flappy Bat 🦇 Can you fly farther?",
    "best": "Best: {n}",
    "newBest": "New best!",
    "top": "Top {n}%",
    "beat": "Higher than {pct}% of players",
    "beatAll": "Farther than every other bat so far",
    "others": "Compared with {n} other flights",
    "comparing": "Comparing with other players…",
    "retry": "Fly again"
  },
  "og": {
    "brand": "🦇 Flappy Bat",
    "defaultKicker": "Free one-tap Halloween game",
    "defaultTitle": "How far can your bat fly?",
    "defaultDesc": "Tap to flap · slip through the gaps · don’t touch"
  },
  "faq": [
    {
      "q": "How do I play?",
      "a": "Press the start button, then tap the game area, click, or press Space to make the bat flap. Each flap lifts it a little and gravity pulls it back down. Steer it through the gaps between the pillars. Touching a pillar or the ground ends the flight."
    },
    {
      "q": "How does scoring work?",
      "a": "You get one point for every gap the bat flies all the way through. Your best score is saved in this browser so you can try to beat it next time."
    },
    {
      "q": "Does it get harder?",
      "a": "Gently. The gaps narrow a little and the scenery speeds up a little as you go, until both reach a fixed limit. Every gap is always wide enough to fly through."
    },
    {
      "q": "What happens if I switch tabs?",
      "a": "The game pauses by itself when you leave the tab or app. You can also pause at any time with the pause button, P or Escape, and carry on with Resume."
    },
    {
      "q": "Is the top % real?",
      "a": "Yes. When a flight ends, only your score is sent to our server anonymously and compared with everyone else’s. The top % appears only when there are real scores to compare with; otherwise nothing is shown."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Flappy Bat",
    "description": "Privacy Policy for Flappy Bat: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Flappy Bat (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a flight ends, only your score (the number of gaps you cleared) is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
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
        "This policy is effective as of October 25, 2026."
      ]
    ],
    "back": "← Back to Flappy Bat"
  }
};
