/* CPS Test — de (click speed test / cps). Same keys as en.js; see en.js header for rules and placeholders. */
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
    "title": "CPS-Klicktest · Klickgeschwindigkeit testen",
    "description": "CPS-Klicktest: Klick 1, 5 oder 10 Sekunden lang so schnell du kannst und miss deine Klicks pro Sekunde und deinen Rang. Kostenlos, auf Handy und PC.",
    "ogTitle": "CPS-Klicktest 🖱️ Wie viele Klicks pro Sekunde schaffst du?",
    "ogDescription": "Klick oder tipp 1, 5 oder 10 Sekunden wie verrückt und hol dir deinen CPS-Wert und dein Abzeichen."
  },
  "siteName": "CPS-Klicktest",
  "privacyLink": "Datenschutzerklärung",
  "start": {
    "badge": "🖱️ Wie schnell sind deine Finger?",
    "h1Kicker": "CPS-Klicktest · Klickgeschwindigkeit",
    "h1Html": "Wie oft klickst<br>du <em>pro Sekunde?</em>",
    "hook": "Klick oder tipp so schnell du kannst auf das große Feld, bevor die Zeit abläuft. Dein Ergebnis: Klicks pro Sekunde.",
    "modeLabel": "Testdauer",
    "modeValue": "{n} s",
    "how": "Die Zeit läuft ab deinem ersten Klick · nur Maus und Touch",
    "start": "Los geht’s →",
    "facts": "1, 5 oder 10 Sekunden · Handy oder PC · knack deinen Rekord"
  },
  "play": {
    "mode": "{n}-Sekunden-Test",
    "time": "Zeit",
    "clicks": "Klicks",
    "cps": "CPS",
    "ready": "Hier klicken zum Starten",
    "readySub": "Die Zeit startet mit deinem ersten Klick",
    "go": "Weiterklicken!",
    "over": "Zeit um!",
    "cancelled": "Du hast die Seite verlassen, dieser Versuch zählt nicht. Nochmal!",
    "change": "← Modus ändern",
    "zoneAria": "Klickfeld",
    "sec": "{n} s"
  },
  "result": {
    "over": "Dein Ergebnis",
    "mode": "{n}-Sekunden-Test",
    "unit": "CPS",
    "clicks": "Klicks",
    "time": "Zeit",
    "tierLabel": "Dein Klick-Abzeichen",
    "tiers": [
      "🐢 Gemütliche Schildkröte",
      "🐇 Flinker Hase",
      "🐆 Gepardenfinger",
      "⚡ Blitzklicker",
      "🔥 Jitter-Klick-Profi",
      "🚀 Klickmaschine"
    ],
    "newBest": "Neuer persönlicher Rekord!",
    "pb": "Dein Rekord in diesem Modus: {n} CPS",
    "tooFast": "Über 25 CPS schafft kein Mensch – dieses Ergebnis wird weder gespeichert noch verglichen.",
    "top": "Top {n} %",
    "beat": "Schneller als {pct} % der Spieler",
    "beatAll": "Schneller als alle anderen Spieler bisher",
    "others": "Verglichen mit {n} anderen Runden in diesem Modus",
    "comparing": "Vergleiche mit anderen Spielern…",
    "shareTitle": "CPS-Klicktest",
    "shareText": "Ich habe {cps} CPS geschafft ({clicks} Klicks in {sec} s) 🖱️ {tier}. Klickst du schneller?",
    "retry": "Nochmal spielen"
  },
  "og": {
    "brand": "🖱️ CPS-Klicktest",
    "defaultKicker": "Kostenloser Klicktest",
    "defaultTitle": "Wie viele Klicks pro Sekunde schaffst du?",
    "defaultDesc": "1, 5 oder 10 Sekunden · Handy oder PC"
  },
  "faq": [
    {
      "q": "Wie funktioniert der CPS-Test?",
      "a": "Wähl eine Testdauer von 1, 5 oder 10 Sekunden und drück den Knopf. Die Zeit startet in dem Moment, in dem du zum ersten Mal ins große Feld klickst oder tippst – dieser erste Klick zählt schon mit. Klick so schnell du kannst, bis die Zeit abgelaufen ist. Dein CPS-Wert ist die Zahl der Klicks geteilt durch die Sekunden des Tests."
    },
    {
      "q": "Was ist ein guter CPS-Wert?",
      "a": "Mit normalem Klicken landen die meisten Leute bei etwa 5 bis 8 Klicks pro Sekunde. Gamer mit Techniken wie Jitter-Klicken oder Butterfly-Klicken schaffen oft 10 und mehr. Der 1-Sekunden-Modus bringt meist die höchste Zahl, weil du keine Zeit hast, müde zu werden."
    },
    {
      "q": "Zählen Tastatur oder mehrere Finger?",
      "a": "Es zählen nur Mausklicks und Tipps ins Feld. Tasten werden absichtlich ignoriert, weil eine gedrückt gehaltene Taste sich automatisch wiederholt. Auf dem Touchscreen zählt jeder Finger, der das Feld berührt, als ein Klick – du kannst also zwei Finger oder beide Daumen nehmen."
    },
    {
      "q": "Warum hat mein Versuch nicht gezählt?",
      "a": "Wenn du den Tab wechselst, das Handy sperrst oder die Seite verlässt, während die Zeit läuft, wird der Versuch aus Fairness abgebrochen. Ergebnisse über 25 Klicks pro Sekunde sind für einen menschlichen Finger unmöglich und werden weder gespeichert noch mit anderen verglichen."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | CPS-Klicktest",
    "description": "Datenschutzerklärung vom CPS-Klicktest: anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der CPS-Klicktest (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende eines Tests wird nur dein Ergebnis (Klicks pro Sekunde) als anonyme Zählung an unseren Server gesendet – ohne Namen oder persönliche Kennung. Während der Nutzung können automatisch die unten beschriebenen Informationen erfasst werden."
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
        "Diese Erklärung gilt ab dem 4. November 2026."
      ]
    ],
    "back": "← Zurück zum CPS-Klicktest"
  }
};
