/* Ice Fishing — de (Eisangeln)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "Eisangeln Spiel – Fische unter dem Eis fangen",
    "description": "Eisangeln Spiel kostenlos online: Lass die Schnur durchs Eisloch hinab, warte auf den Biss und hol den Fisch ein, ohne dass die Schnur reißt. 60 Sekunden, Handy oder PC.",
    "ogTitle": "Eisangeln 🎣 Wie viele Fische schaffst du in 60 Sekunden?",
    "ogDescription": "Schnur durchs Eis hinablassen, den Biss spüren und vorsichtig einholen. Zu fest gezogen, und die Schnur reißt."
  },
  "siteName": "Eisangeln",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🎣 Ein zugefrorener See, ein kleines Loch",
    "h1Kicker": "Eisangeln Spiel",
    "h1Html": "Schnur runter<br><em>und Fisch rein</em>",
    "hook": "Unter dem Eis schwimmt etwas. Lass den Haken auf die richtige Tiefe, warte auf den Ruck und kurbel dann sanft ein, bevor die Schnur nachgibt.",
    "how": {
      "lower": "Halten: Haken runter",
      "reel": "Biss? Halten zum Einholen",
      "red": "Im roten Bereich loslassen"
    },
    "start": "Angeln starten →",
    "facts": "60 Sekunden pro Runde · Handy oder PC · Rekord knacken"
  },
  "play": {
    "score": "Punkte",
    "time": "Zeit",
    "secUnit": "s",
    "pause": "Pause",
    "paused": "Pause",
    "resume": "Weiterangeln",
    "hint": "Unter dem Eis halten, um die Schnur abzulassen",
    "fieldAria": "Zugefrorener See: auf einer Tiefe halten, um den Haken abzulassen, beim Biss halten, um einzuholen",
    "bite": "Biss!",
    "catchPop": "{fish} +{n}",
    "snap": "Schnur gerissen!",
    "escape": "Entwischt",
    "timeUp": "Zeit ist um!"
  },
  "fish": {
    "minnow": "Elritze",
    "perch": "Barsch",
    "trout": "Forelle",
    "pike": "Hecht",
    "golden": "Goldfisch",
    "boot": "Alter Stiefel"
  },
  "result": {
    "over": "Dein Fang",
    "unit": "Pkt.",
    "newBest": "Neuer persönlicher Rekord!",
    "best": "Dein Rekord: {n} Pkt.",
    "caught": "Fische gefangen",
    "snapped": "Schnur gerissen",
    "bestCatch": "Bester Fang: {fish}",
    "noCatch": "Diesmal kein Fisch",
    "tierLabel": "Dein Angler-Level",
    "tiers": [
      "🧊 Kalte Finger",
      "🪝 Eisloch-Lehrling",
      "🐟 Geduldiger Angler",
      "🎣 Stammgast am See",
      "⭐ Fischflüsterer",
      "🏆 Legende des Sees"
    ],
    "top": "Top {n} %",
    "beat": "Besser als {pct} % der Angler",
    "beatAll": "Besser als alle anderen Angler bisher",
    "others": "Verglichen mit {n} anderen Runden",
    "comparing": "Vergleich mit anderen Anglern…",
    "shareTitle": "Eisangeln",
    "shareText": "Ich habe beim Eisangeln in 60 Sekunden {n} Pkt. geholt 🎣 {tier}. Schaffst du mehr?",
    "retry": "Nochmal angeln"
  },
  "og": {
    "brand": "🎣 Eisangeln",
    "defaultKicker": "Eisangeln Spiel online",
    "defaultTitle": "Wie viele Fische schaffst du in 60 Sekunden?",
    "defaultDesc": "Schnur ablassen · Biss spüren · nicht reißen lassen"
  },
  "faq": [
    {
      "q": "Wie lasse ich die Schnur ab?",
      "a": "Halte irgendwo im Wasser unter dem Eis gedrückt. Der Haken bewegt sich zu dieser Tiefe und bleibt stehen, sobald du loslässt. Am Computer gehen auch die Tasten ↓ und ↑. Jeder Fisch mag eine andere Tiefe, probier also mehrere aus."
    },
    {
      "q": "Wie funktioniert das Einholen?",
      "a": "Beißt ein Fisch, halte gedrückt, um einzukurbeln. Dabei steigt der Spannungsbalken rechts. Erreicht er den roten Bereich, lass kurz los, damit die Schnur nachgibt, und halte dann wieder. Ist der Balken voll, reißt die Schnur; bleibt sie zu lange locker, schlüpft der Fisch vom Haken."
    },
    {
      "q": "Warum sind manche Fische mehr wert?",
      "a": "Größere Fische aus tieferem Wasser ziehen stärker und bringen mehr Punkte, der seltene Goldfisch am meisten. Müll wie ein alter Stiefel kommt leicht hoch, zählt aber nichts. Dein Rekord wird in diesem Browser gespeichert."
    },
    {
      "q": "Was passiert, wenn ich den Tab wechsle?",
      "a": "Die Runde pausiert von selbst, wenn du die Seite verlässt oder das Handy sperrst, und die Uhr bleibt stehen. Tippe auf Weiterangeln (oder drück P), um genau dort weiterzumachen."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Eisangeln-Spiel",
    "description": "Datenschutzerklärung für das Eisangeln-Spiel: anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Das Eisangeln-Spiel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Am Ende einer Runde wird nur deine Punktzahl als anonymer Zähler an unseren Server gesendet, ohne Namen oder persönliche Kennung. Während der Nutzung können einige Informationen automatisch erfasst werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache und deinen Rekord zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und Einstellungen unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene zusammengefasste Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, gestartete und beendete Spiele, Sternebewertungen). Nichts davon identifiziert dich persönlich."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 10. November 2026."
      ]
    ],
    "back": "← Zurück zum Eisangeln-Spiel"
  }
};
