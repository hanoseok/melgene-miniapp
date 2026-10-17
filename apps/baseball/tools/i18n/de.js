/* Zahlenraten – Bulls and Cows (숫자 야구 / number baseball) — de
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
    "hyphens": "auto"
  },
  "meta": {
    "title": "Zahlenraten – Bulls and Cows | Zahlen-Rätselspiel",
    "description": "Zahlenraten – Bulls and Cows online und gratis: Errate die geheime 3- oder 4-stellige Zahl mit Hinweisen zu Treffern und Fast-Treffern. Bestleistung pro Stufe, ohne Download.",
    "ogTitle": "Zahlenraten – Bulls and Cows ⚾ Knackst du die Geheimzahl?",
    "ogDescription": "Eine Geheimzahl ohne doppelte Ziffern. Rate sie, lies die Hinweise und brauche so wenige Versuche wie möglich."
  },
  "siteName": "Zahlenraten – Bulls and Cows",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "⚾ Zahlen-Baseball",
    "h1Kicker": "Zahlenraten – Bulls and Cows",
    "h1Html": "Knacke den<br><em>Geheimcode</em>!",
    "hook": "Der Computer hat sich eine Geheimzahl ohne doppelte Ziffern ausgedacht. Gib einen Tipp ab, lies die Hinweise und löse den Code.",
    "how": "Treffer = richtige Ziffer, richtiger Platz · Fast = richtige Ziffer, falscher Platz · Daneben = nichts",
    "levelLabel": "Anzahl der Ziffern wählen",
    "levels": {
      "d3": "3 Ziffern",
      "d4": "4 Ziffern"
    },
    "levelSub": {
      "d3": "Klassisch",
      "d4": "Härter"
    },
    "timer": "Stoppuhr anzeigen",
    "start": "Los geht’s →"
  },
  "play": {
    "tries": "Versuche",
    "time": "Zeit",
    "slotAria": "Ziffer {n}",
    "enter": "Raten",
    "del": "Löschen",
    "giveUp": "Aufgeben",
    "giveUpSure": "Noch einmal tippen, um die Lösung zu zeigen",
    "historyTitle": "Deine Tipps",
    "historyEmpty": "Gib eine Zahl ein, um deinen ersten Tipp abzugeben.",
    "errLen": "Gib {n} Ziffern ein",
    "errDup": "Ziffern dürfen sich nicht wiederholen",
    "errAgain": "Diese Zahl hast du schon probiert",
    "strike": "Treffer",
    "ball": "Fast",
    "out": "Daneben",
    "legend": "Treffer: richtige Ziffer am richtigen Platz · Fast: richtige Ziffer, falscher Platz"
  },
  "result": {
    "done": "Geknackt!",
    "gaveUp": "Die Lösung war",
    "triesCaption": "Versuche",
    "timeLabel": "Zeit",
    "secretLabel": "Geheimzahl",
    "sec": "Sek.",
    "best": "Bestwert in dieser Stufe: {n}",
    "newBest": "Neue persönliche Bestleistung!",
    "top": "Top {n} %",
    "beat": "Weniger Versuche als {pct} % der Spieler",
    "beatAll": "Weniger Versuche als alle bisherigen Ergebnisse",
    "others": "Verglichen mit {n} anderen Ergebnissen in dieser Stufe",
    "comparing": "Vergleich mit anderen Spielern …",
    "retry": "Nochmal spielen",
    "shareTitle": "Zahlenraten – knackst du die Geheimzahl?",
    "shareText": "Ich habe eine {d}-stellige Geheimzahl in {n} Versuchen geknackt ⚾ Schaffst du es mit weniger?"
  },
  "og": {
    "brand": "⚾ Zahlenraten",
    "defaultKicker": "Kostenloses Zahlenspiel",
    "defaultTitle": "Knackst du die Geheimzahl?",
    "defaultDesc": "Treffer · Fast · Daneben"
  },
  "faq": [
    {
      "q": "Wie spielt man Bulls and Cows?",
      "a": "Der Computer wählt eine Geheimzahl, deren Ziffern alle verschieden sind. Gib eine Zahl gleicher Länge ein, ebenfalls ohne doppelte Ziffern, und tippe auf Raten. Eine Ziffer am richtigen Platz ist ein Treffer, eine richtige Ziffer am falschen Platz ist „Fast“, und passt nichts, heißt es „Daneben“. Du gewinnst, wenn alle Ziffern Treffer sind."
    },
    {
      "q": "Kann die Geheimzahl mit 0 beginnen? Können sich Ziffern wiederholen?",
      "a": "Sie kann mit 0 beginnen, zum Beispiel 072, aber keine Ziffer kommt zweimal vor. Auch deine Tipps dürfen keine Ziffer doppelt enthalten. Eine schon probierte Zahl wird nicht noch einmal gezählt, nur neue Tipps erhöhen deine Versuche."
    },
    {
      "q": "Gibt es einen Hinweis-Knopf oder ein Versuchslimit?",
      "a": "Weder Hinweise noch ein Limit. Es ist ein reines Denkspiel: Je weniger Versuche, desto besser. Wenn du nicht weiterkommst, zeigt dir Aufgeben die Lösung, danach startet eine neue Runde. Die Stoppuhr ist optional und erscheint nur, wenn du sie einschaltest."
    },
    {
      "q": "Was ist der Unterschied zwischen 3 und 4 Ziffern?",
      "a": "Bei 3 Ziffern gibt es 720 mögliche Geheimzahlen, bei 4 Ziffern deutlich mehr, und jede ist gleich wahrscheinlich. Deine Bestleistung wird pro Stufe in diesem Browser gespeichert."
    },
    {
      "q": "Woher kommt die „Top-%“-Angabe?",
      "a": "Wenn du eine Runde löst, wird deine Versuchszahl mit den echten Ergebnissen anderer Spieler in derselben Stufe verglichen. Gibt es noch keine anderen Ergebnisse, wird der Vergleich nicht angezeigt. Aufgegebene Runden zählen nicht."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Zahlenraten",
    "description": "Datenschutzerklärung für Zahlenraten (Bulls and Cows): anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Zahlenraten – Bulls and Cows (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Wenn du eine Runde löst, werden nur die Stufe und deine Versuchszahl als anonyme Zählung an unseren Server gesendet – ohne Namen oder persönliche Kennung. Während der Nutzung können wie unten beschrieben einige Daten automatisch erfasst werden."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache und Bestzeiten zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und deine Einstellungen findest du unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene Zähler verwenden, die nur tägliche Summen pro Sprache speichern (Seitenaufrufe, begonnene und beendete Spiele, Sternebewertungen). Nichts davon identifiziert dich persönlich."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 18. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Zahlenraten"
  }
};
