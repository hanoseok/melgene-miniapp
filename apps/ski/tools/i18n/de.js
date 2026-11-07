/* Ski Downhill — de (Skispiel)
 * Regeln stehen in ski-core.js; diese Datei enthält nur sichtbare Texte.
 * Schlüssel mit Html werden als HTML eingefügt (nur <br> und <em>); privacy.sections ebenfalls.
 * Platzhalter {n} {pct} {s} {c} {tier} unverändert lassen.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Skispiel online – Abfahrt & Slalom",
    "description": "Skispiel online: Fahr eine endlose verschneite Piste hinunter, weich Tannen, Felsen und Schneemännern aus und fahr durch Slalomtore für Bonusmeter. Auf Handy oder PC.",
    "ogTitle": "Skispiel ⛷️ Wie weit kommst du, bevor du stürzt?",
    "ogDescription": "Rase eine endlose Piste hinab, zieh durch die Slalomtore und weich den Tannen aus. Ein Sturz, und die Fahrt ist vorbei."
  },
  "siteName": "Skispiel",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "⛷️ Neuschnee, endlose Piste",
    "h1Kicker": "Skispiel online",
    "h1Html": "Ab ins Tal<br><em>so weit du kannst</em>",
    "hook": "Die Piste hört nie auf, und deine Ski werden immer schneller. Schlängel dich zwischen Tannen und Toren hindurch und schau, wie viele Meter du ohne Sturz schaffst.",
    "how": {
      "steer": "Links oder rechts halten",
      "gates": "Durchs Tor für Bonus",
      "avoid": "Tannen und Felsen meiden"
    },
    "start": "Ab auf die Piste →",
    "facts": "Gedrückt halten oder ← → · Handy oder PC · Rekord knacken"
  },
  "play": {
    "dist": "Strecke",
    "best": "Rekord",
    "pause": "Pause",
    "paused": "Pause",
    "resume": "Weiterfahren",
    "hint": "Tippen zum Losfahren",
    "fieldAria": "Skipiste: linke oder rechte Hälfte gedrückt halten, um zu lenken",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Tor verpasst"
  },
  "result": {
    "over": "Deine Fahrt",
    "unit": "m",
    "newBest": "Neuer Rekord!",
    "best": "Dein Rekord: {n} m",
    "gates": "Tore geschafft",
    "time": "Fahrzeit",
    "timeValue": "{s} s",
    "tierLabel": "Dein Ski-Level",
    "tiers": [
      "🧊 Kinderhang",
      "🟢 Übungshang",
      "🔵 Blaue Piste",
      "⚫ Schwarze Piste",
      "⚡ Pistenrakete",
      "🏆 Gipfellegende"
    ],
    "top": "Top {n} %",
    "beat": "Weiter als {pct} % der Fahrer",
    "beatAll": "Weiter als alle anderen bisher",
    "others": "Verglichen mit {n} anderen Fahrten",
    "comparing": "Vergleich mit anderen Fahrern…",
    "shareTitle": "Skispiel",
    "shareText": "Ich bin {n} m den Berg runtergefahren ⛷️ {tier}. Wie weit schaffst du es?",
    "retry": "Nochmal fahren"
  },
  "og": {
    "brand": "⛷️ Skispiel",
    "defaultKicker": "Skispiel online",
    "defaultTitle": "Wie weit kommst du, bevor du stürzt?",
    "defaultDesc": "Endlose Piste · Slalomtore · Handy oder PC"
  },
  "faq": [
    {
      "q": "Wie lenke ich den Skifahrer?",
      "a": "Halte mit Finger oder Maus die linke oder rechte Hälfte der Piste gedrückt oder halte die Tasten ← → (bzw. A / D). Der Skifahrer gleitet sanft zur Seite; lass los, um wieder geradeaus zu fahren. Die Fahrt beginnt mit deinem ersten Tippen oder Tastendruck."
    },
    {
      "q": "Wofür sind die Fahnen da?",
      "a": "Zwei Fahnen in derselben Farbe bilden ein Tor. Fahr dazwischen durch, um Bonusmeter zu bekommen, und schaff mehrere Tore hintereinander für eine Kombo, die jeden Bonus größer macht. Ein verpasstes Tor beendet die Fahrt nicht, setzt aber die Kombo zurück."
    },
    {
      "q": "Wie wird die Strecke gezählt?",
      "a": "Die gefahrenen Meter plus alle Torboni. Je weiter du kommst, desto schneller wird es, und die Fahrt endet, sobald du eine Tanne, einen Felsen oder einen Schneemann triffst. Dein Rekord wird in diesem Browser gespeichert."
    },
    {
      "q": "Was passiert, wenn ich den Tab wechsle?",
      "a": "Das Spiel pausiert automatisch, wenn du die Seite verlässt oder dein Handy sperrst. Mit „Weiterfahren“ (oder der Taste P) geht es genau dort weiter, wo du aufgehört hast."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Skispiel",
    "description": "Datenschutzerklärung für das Skispiel: anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Das Skispiel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Am Ende einer Fahrt wird nur deine Strecke in Metern als anonymer Zähler an unseren Server gesendet, ohne Namen oder persönliche Kennung. Während der Nutzung können einige Informationen automatisch erfasst werden, wie unten beschrieben."
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
        "Diese Erklärung gilt ab dem 8. November 2026."
      ]
    ],
    "back": "← Zurück zum Skispiel"
  }
};
