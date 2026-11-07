/* Ski Downhill — en (Ski Downhill)
 * Rules live in ski-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {s} {c} {tier} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Ski Game Online – Ski Downhill Slalom",
    "description": "Ski Downhill is an online ski game: steer down an endless snowy slope, dodge pine trees, rocks and snowmen, and pass slalom gates for bonus meters. Phone or PC.",
    "ogTitle": "Ski Downhill ⛷️ How far can you ski before you crash?",
    "ogDescription": "Steer down an endless slope, slip through slalom gates and dodge the trees. One crash ends the run."
  },
  "siteName": "Ski Downhill",
  "privacyLink": "Privacy Policy",
  "start": {
    "badge": "⛷️ Fresh powder, endless slope",
    "h1Kicker": "Ski Game Online",
    "h1Html": "Race down the slope<br><em>as far as you can</em>",
    "hook": "The slope never ends and your skis keep getting faster. Weave between trees and flags and see how many meters you can ski before you wipe out.",
    "how": {
      "steer": "Hold left or right to steer",
      "gates": "Ski between flags for bonus",
      "avoid": "Dodge trees, rocks, snowmen"
    },
    "start": "Hit the slope →",
    "facts": "Tap & hold or ← → keys · phone or PC · beat your best"
  },
  "play": {
    "dist": "Distance",
    "best": "Best",
    "pause": "Pause",
    "paused": "Paused",
    "resume": "Keep skiing",
    "hint": "Tap to start skiing",
    "fieldAria": "Ski slope: hold the left or right half to steer",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Missed gate"
  },
  "result": {
    "over": "Your run",
    "unit": "m",
    "newBest": "New personal best!",
    "best": "Your best: {n} m",
    "gates": "Gates passed",
    "time": "Run time",
    "timeValue": "{s} s",
    "tierLabel": "Your ski level",
    "tiers": [
      "🧊 Bunny slope",
      "🟢 Green run",
      "🔵 Blue run",
      "⚫ Black diamond",
      "⚡ Speed racer",
      "🏆 Mountain legend"
    ],
    "top": "Top {n}%",
    "beat": "Farther than {pct}% of skiers",
    "beatAll": "Farther than every other skier so far",
    "others": "Compared with {n} other runs",
    "comparing": "Comparing with other skiers…",
    "shareTitle": "Ski Downhill",
    "shareText": "I skied {n} m down the mountain ⛷️ {tier}. How far can you go?",
    "retry": "Ski again"
  },
  "og": {
    "brand": "⛷️ Ski Downhill",
    "defaultKicker": "Online ski game",
    "defaultTitle": "How far can you ski before you crash?",
    "defaultDesc": "Endless slope · slalom gates · phone or PC"
  },
  "faq": [
    {
      "q": "How do I steer the skier?",
      "a": "Hold the left or right half of the slope with your finger or mouse, or hold the ← → (or A / D) keys. The skier leans and drifts smoothly toward that side; let go to ski straight again. The run starts with your first tap or key press."
    },
    {
      "q": "What are the flags for?",
      "a": "Two flags of the same color make a gate. Ski between them to earn bonus meters, and keep passing gates in a row to build a combo that makes each bonus bigger. Missing a gate does not end your run, but it resets the combo."
    },
    {
      "q": "How is my distance counted?",
      "a": "The meters you ski downhill are added up, plus any gate bonus. The slope gets faster the farther you go, and the run ends the moment you hit a tree, a rock or a snowman. Your best distance is saved in this browser."
    },
    {
      "q": "What happens if I switch tabs?",
      "a": "The game pauses by itself when you leave the page or lock your phone. Press Keep skiing (or the P key) to continue from exactly where you stopped."
    }
  ],
  "privacy": {
    "title": "Privacy Policy | Ski Downhill",
    "description": "Privacy Policy for Ski Downhill: anonymous scores, cookies, advertising and statistics.",
    "h1": "Privacy Policy",
    "introHtml": "Ski Downhill (the \"Service\") respects your privacy and processes only the minimum information described below.",
    "sections": [
      [
        "1. Information we collect",
        "The Service works without an account or login. When a run ends, only your distance in meters is sent to our server as an anonymous count, with no name or personal identifier attached. Some information may be collected automatically while you use the Service, as described below."
      ],
      [
        "2. Cookies and similar technologies",
        "The Service may use cookies and your browser’s local storage to remember your language and your best distance, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do."
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
        "This policy is effective as of November 8, 2026."
      ]
    ],
    "back": "← Back to Ski Downhill"
  }
};
