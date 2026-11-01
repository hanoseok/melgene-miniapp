/* 10-Sekunden-Challenge — de (10 Second Challenge / timer)
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
    "hyphens": "auto"
  },
  "meta": {
    "title": "10-Sekunden-Challenge – Stoppe genau bei 10,00 Sekunden",
    "description": "10-Sekunden-Challenge: Starte die Stoppuhr und stoppe sie nur nach Gefühl genau bei 10,00 Sekunden. 3 Versuche, Blind-Modus, 5 oder 30 Sekunden. Kostenlos, ohne Download.",
    "ogTitle": "10-Sekunden-Challenge ⏱️ Schaffst du genau 10,00?",
    "ogDescription": "Zähl im Kopf mit und drück im richtigen Moment auf STOP. 3 Versuche, im Blind-Modus verschwinden die Ziffern."
  },
  "siteName": "10-Sekunden-Challenge",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "⏱️ Spürst du 10 Sekunden?",
    "h1Kicker": "10-Sekunden-Challenge",
    "h1Html": "Stoppe die Uhr<br><em>genau bei 10,00</em>",
    "hook": "Starte die Stoppuhr, zähl im Kopf mit und drück im richtigen Moment auf Stopp. Drei Versuche, nur der genaueste zählt.",
    "targetLabel": "Zielzeit",
    "targetValue": "{n} s",
    "blindLabel": "Blind-Modus",
    "blindDesc": "Die Ziffern verschwinden nach 3 Sekunden",
    "how": "Start, dann STOP · tipp irgendwo oder drück die Leertaste",
    "start": "Los geht’s →",
    "facts": "3 Versuche · 5, 10 oder 30 Sekunden · knack deinen Rekord"
  },
  "play": {
    "target": "Ziel {t}",
    "blindTag": "Blind",
    "attempt": "Versuch {n} von {total}",
    "go": "Start",
    "stop": "STOPP",
    "next": "Nächster Versuch",
    "finish": "Mein Ergebnis",
    "readyHint": "Drück Start und stoppe genau bei {t}",
    "runHint": "Tipp irgendwo oder drück die Leertaste zum Stoppen",
    "early": "{n} zu früh",
    "late": "{n} zu spät",
    "perfect": "Perfekt! Genau {t} 🎉",
    "cancelled": "Du hast die Seite verlassen, dieser Versuch zählt nicht. Nochmal!",
    "hidden": "??:??.??",
    "change": "← Modus ändern",
    "clockAria": "Stoppuhr",
    "sec": "{n} s"
  },
  "result": {
    "over": "Dein Ergebnis",
    "mode": "Ziel {t}",
    "perfect": "Genau {t}! Perfekt gestoppt 🎉",
    "bestLabel": "Bester Versuch, daneben um",
    "stoppedAt": "Gestoppt bei {time}",
    "tierLabel": "Deine innere Uhr",
    "tiers": [
      "🐌 Zeitlos verloren",
      "⏳ So ungefähr",
      "🙂 Gute innere Uhr",
      "🎯 Präzises Timing",
      "⚡ Hundertstel-Profi",
      "🧠 Menschliche Stoppuhr"
    ],
    "newBest": "Neuer Rekord!",
    "pb": "Dein Rekord in diesem Modus: {n}",
    "avg": "Durchschnittliche Abweichung",
    "listLabel": "Deine 3 Versuche",
    "top": "Top {n}%",
    "beat": "Genauer als {pct}% der Spieler",
    "beatAll": "Genauer als alle anderen Spieler bisher",
    "others": "Verglichen mit {n} anderen Runden in diesem Modus",
    "comparing": "Vergleich mit anderen Spielern…",
    "shareTitle": "10-Sekunden-Challenge",
    "shareText": "Ich habe die Uhr nur {n} neben {t} gestoppt ⏱️ {tier}. Schaffst du es genau?",
    "retry": "Nochmal versuchen"
  },
  "og": {
    "brand": "⏱️ 10-Sekunden-Challenge",
    "defaultKicker": "Kostenloses Timing-Spiel",
    "defaultTitle": "Stoppst du die Uhr genau bei 10,00?",
    "defaultDesc": "3 Versuche · Blind-Modus · 5, 10 oder 30 Sekunden"
  },
  "faq": [
    {
      "q": "Wie spielt man?",
      "a": "Wähl eine Zielzeit (5, 10 oder 30 Sekunden) und drück Start. Die Stoppuhr läuft ab dem Moment, in dem du tippst. Zähl im Kopf mit und drück auf STOPP, tipp irgendwo auf den Spielbildschirm oder drück die Leertaste, wenn du glaubst, dass die Zeit um ist. Pro Runde hast du drei Versuche, der genaueste ist dein Ergebnis."
    },
    {
      "q": "Was macht der Blind-Modus?",
      "a": "Im Blind-Modus werden die Ziffern nach den ersten 3 Sekunden zu Fragezeichen, und du musst nur nach Gefühl weiterzählen. Das ist deutlich schwerer, und der Modus hat einen eigenen Rekord und einen eigenen Vergleich mit anderen Spielern."
    },
    {
      "q": "Warum ist genau 10,00 so schwer?",
      "a": "Dein Finger braucht einen Moment zum Reagieren, und dein Zählen driftet über zehn Sekunden ein wenig ab. Darum landet selbst ein guter Stopp ein paar Hundertstel zu früh oder zu spät. Die Uhr nimmt den Moment deines Tippens selbst und zeigt Hundertstel wie eine echte Stoppuhr. Ein Stopp genau bei 10,00 ist selten – genau das macht den Reiz aus."
    },
    {
      "q": "Warum hat mein Versuch nicht gezählt?",
      "a": "Wenn du während die Uhr läuft den Tab wechselst, das Handy sperrst oder die Seite verlässt, wird der Versuch aus Fairness abgebrochen. Starte denselben Versuch einfach noch einmal."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | 10-Sekunden-Challenge",
    "description": "Datenschutzerklärung von 10-Sekunden-Challenge: anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "10-Sekunden-Challenge (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende einer Runde wird nur dein Ergebnis (um wie viele Millisekunden dein bester Versuch danebenlag) als anonyme Zählung an unseren Server gesendet – ohne Namen oder persönliche Kennung. Während der Nutzung können automatisch die unten beschriebenen Informationen erfasst werden."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache und deinen Rekord zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und deine Einstellungen findest du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene zusammengefasste Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, gestartete und beendete Runden, Sternebewertungen). Nichts davon identifiziert dich persönlich."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 2. November 2026."
      ]
    ],
    "back": "← Zurück zu 10-Sekunden-Challenge"
  }
};
