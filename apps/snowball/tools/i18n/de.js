/* Snowball Fight — de (Schneeballschlacht)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "Schneeballschlacht Spiel – werfen, ducken, treffen",
    "description": "Kostenloses Schneeballschlacht Spiel online: Triff die Kinder, die hinter ihren Schneeburgen auftauchen, und duck dich hinter deine Mauer, wenn ein Schneeball kommt.",
    "ogTitle": "Schneeballschlacht ☃️ Wie oft triffst du in 60 Sekunden?",
    "ogDescription": "Schnell werfen, rechtzeitig ducken und bloß nicht den Hund treffen. Drei Herzen, eine Minute."
  },
  "siteName": "Schneeballschlacht",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "☃️ Neuschnee, volle Taschen",
    "h1Kicker": "Schneeballschlacht Spiel",
    "h1Html": "Zielen, werfen<br><em>und ducken!</em>",
    "hook": "Drüben im Garten verstecken sich die Kinder hinter ihren Schneeburgen. Triff sie, wenn sie hervorschauen, und geh schnell in Deckung, wenn einer zum Wurf ausholt.",
    "how": {
      "throw": "Kind antippen = Wurf",
      "duck": "Bei ❗ Ducken halten",
      "avoid": "Freunde verschonen"
    },
    "start": "Schlacht starten →",
    "facts": "60 Sekunden pro Runde · 3 Herzen · Handy oder PC"
  },
  "play": {
    "score": "Punkte",
    "time": "Zeit",
    "lives": "Herzen",
    "secUnit": "s",
    "pause": "Pause",
    "paused": "Pause",
    "resume": "Weiterkämpfen",
    "hint": "Tippe in den Garten, um zu starten",
    "fieldAria": "Verschneiter Garten: Tippe ein Kind an, um zu werfen, halte die Mauer oder die Ducken-Taste gedrückt, um dich zu verstecken",
    "duck": "Ducken (halten)",
    "duckAria": "Hinter der Mauer ducken, solange gedrückt",
    "combo": "Combo ×{n}",
    "golden": "Gold! +{n}",
    "oops": "Ein Freund! −{n}",
    "miss": "Daneben",
    "block": "Abgewehrt!",
    "ouch": "Autsch!",
    "timeUp": "Zeit um!",
    "out": "Eingeschneit!"
  },
  "result": {
    "over": "Schlacht vorbei",
    "reasonTime": "Du hast die ganze Minute durchgehalten",
    "reasonOut": "Dreimal getroffen – du bist raus",
    "unit": "Pkt.",
    "newBest": "Neue Bestleistung!",
    "best": "Deine Bestleistung: {n} Pkt.",
    "hits": "Treffer",
    "accuracy": "Präzision",
    "bestCombo": "Beste Combo",
    "tierLabel": "Dein Schneeball-Rang",
    "tiers": [
      "🧤 Kalte Finger",
      "❄️ Schnee-Neuling",
      "⛄ Garten-Stammgast",
      "🎯 Meisterwerfer",
      "⭐ Burgenstürmer",
      "🏆 Schneelegende"
    ],
    "top": "Top {n} %",
    "beat": "Besser als {pct} % der Spieler",
    "beatAll": "Besser als alle anderen bisher",
    "others": "Verglichen mit {n} anderen Runden",
    "comparing": "Vergleiche mit anderen Spielern …",
    "shareTitle": "Schneeballschlacht",
    "shareText": "Ich habe in 60 Sekunden Schneeballschlacht {n} Punkte geholt ☃️ {tier}. Schaffst du mehr?",
    "retry": "Nochmal kämpfen"
  },
  "og": {
    "brand": "☃️ Schneeballschlacht",
    "defaultKicker": "Online-Schneeballschlacht",
    "defaultTitle": "Wie oft triffst du in 60 Sekunden?",
    "defaultDesc": "Werfen · ducken · Hund verschonen"
  },
  "faq": [
    {
      "q": "Wie werfe ich und wie ducke ich mich?",
      "a": "Tippe (oder klicke) auf ein Kind, das hinter seiner Schneeburg auftaucht, und ein Schneeball fliegt dorthin. Zum Verstecken hältst du die Ducken-Taste oder die Schneemauer unten gedrückt. Solange du geduckt bist, kannst du nicht werfen. Am Computer wählst du mit ← und → eine Burg, wirfst mit ↑ oder F und duckst dich mit gedrückter Leertaste oder ↓."
    },
    {
      "q": "Woran erkenne ich, dass ein Schneeball kommt?",
      "a": "Ein Kind, das gleich wirft, hebt den Arm und über ihm erscheint ein rotes ❗. Triffst du es vorher, fällt der Wurf aus. Ist der Schneeball schon unterwegs, erscheint ein großes ❗ über deiner Mauer und die Ducken-Taste wird rot. Halte sie, bis der Ball aufschlägt."
    },
    {
      "q": "Wie werden die Punkte berechnet?",
      "a": "Jeder Treffer bringt Punkte, ein Schneemann etwas mehr als ein Kind. Mehrere Treffer hintereinander ergeben eine Combo, die jeden weiteren Treffer wertvoller macht. Ein Fehlwurf setzt sie zurück. Der seltene goldene Schneemann bringt am meisten. Der Hund und das Kind mit der weißen Fahne sind Freunde, wer sie trifft, verliert Punkte."
    },
    {
      "q": "Wann endet eine Runde?",
      "a": "Eine Runde dauert 60 Sekunden oder endet früher, wenn du dreimal getroffen wirst. Gegen Ende wird es immer hektischer. Wechselst du den Tab oder sperrst dein Handy, pausiert die Runde automatisch."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Schneeballschlacht-Spiel",
    "description": "Datenschutzerklärung für das Schneeballschlacht-Spiel: anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Das Schneeballschlacht-Spiel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.",
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
        "Diese Erklärung gilt ab dem 14. November 2026."
      ]
    ],
    "back": "← Zurück zum Schneeballschlacht-Spiel"
  }
};
