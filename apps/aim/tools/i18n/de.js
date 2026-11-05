/* Aim Trainer — de (Aim Trainer)
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
    "hyphens": "auto"
  },
  "meta": {
    "title": "Aim Trainer · Zielen üben online (Klassik & auf Zeit)",
    "description": "Aim Trainer: Triff 30 Ziele so schnell wie möglich oder so viele wie möglich in 30 Sekunden. Mit Durchschnittszeit, Trefferquote und Rang – gratis auf Handy oder PC.",
    "ogTitle": "Aim Trainer 🎯 Wie schnell und genau zielst du?",
    "ogDescription": "Triff 30 Ziele oder spiel 30 Sekunden auf Zeit und hol dir Durchschnittszeit, Trefferquote und dein Aim-Abzeichen."
  },
  "siteName": "Aim Trainer",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🎯 Wie gut ist dein Aim?",
    "h1Kicker": "Aim Trainer · Zielen üben",
    "h1Html": "Triff jedes Ziel<br><em>blitzschnell</em>",
    "hook": "Ziele tauchen irgendwo im Feld auf. Tipp oder klick sie an, bevor sie verschwinden, und finde heraus, wie schnell und präzise du bist.",
    "modeLabel": "Modus",
    "modes": {
      "classic": {
        "name": "Klassik",
        "sub": "30 Ziele"
      },
      "timed": {
        "name": "Auf Zeit",
        "sub": "30 Sekunden"
      }
    },
    "how": "Triff das Ziel in der Mitte zum Start · daneben = Fehlschuss",
    "start": "Los geht’s →",
    "facts": "Maus, Touchpad oder Finger · Handy oder PC · knack deinen Rekord"
  },
  "modes": {
    "classic": "Klassik · 30 Ziele",
    "timed": "Auf Zeit · 30 Sekunden"
  },
  "play": {
    "time": "Zeit",
    "hits": "Treffer",
    "acc": "Trefferquote",
    "ready": "Triff das Ziel zum Start",
    "readySub": "Die Uhr läuft ab dem ersten Treffer",
    "done": "Fertig!",
    "timeUp": "Zeit ist um!",
    "cancelled": "Du hast die Seite verlassen, deshalb zählt diese Runde nicht. Versuch’s nochmal!",
    "change": "← Modus wechseln",
    "areaAria": "Zielbereich"
  },
  "result": {
    "over": "Dein Ergebnis",
    "scoreClassic": "Durchschnittszeit pro Ziel",
    "scoreTimed": "Getroffene Ziele",
    "unitMs": "ms",
    "unitHits": "Treffer",
    "acc": "Trefferquote",
    "avg": "Ø Zeit",
    "misses": "Fehlschüsse",
    "total": "Gesamtzeit",
    "escaped": "Verpasst",
    "msValue": "{n} ms",
    "secValue": "{n} s",
    "tierLabel": "Dein Aim-Abzeichen",
    "tiers": [
      "🐢 Aufwärmphase",
      "🙂 Solider Anfang",
      "🎯 Scharfes Auge",
      "🦅 Adlerauge",
      "⚡ Flick-Meister",
      "🏆 Aim-Legende"
    ],
    "newBest": "Neuer persönlicher Rekord!",
    "pbClassic": "Dein Rekord in Klassik: {n} ms",
    "pbTimed": "Dein Rekord auf Zeit: {n} Treffer",
    "invalid": "Das ist schneller, als ein Mensch reagieren kann – dieses Ergebnis wird weder gespeichert noch verglichen.",
    "top": "Top {n} %",
    "beat": "Besser als {pct} % der Spieler",
    "beatAll": "Besser als alle anderen Spieler bisher",
    "others": "Verglichen mit {n} anderen Runden in diesem Modus",
    "comparing": "Vergleiche mit anderen Spielern…",
    "shareTitle": "Aim Trainer",
    "shareClassic": "Im Schnitt {avg} ms pro Ziel bei {acc} % Trefferquote 🎯 {tier}. Zielst du schneller?",
    "shareTimed": "{hits} Treffer in 30 Sekunden bei {acc} % Trefferquote 🎯 {tier}. Schaffst du mehr?",
    "retry": "Nochmal"
  },
  "og": {
    "brand": "🎯 Aim Trainer · Zielen üben",
    "defaultKicker": "Kostenloser Aim-Test",
    "defaultTitle": "Wie schnell und genau zielst du?",
    "defaultDesc": "30 Ziele oder 30 Sekunden · Handy oder PC"
  },
  "faq": [
    {
      "q": "Wie funktioniert der Aim Trainer?",
      "a": "Wähl Klassik oder Auf Zeit, drück auf Start und triff dann das Ziel in der Mitte des Feldes. In Klassik erscheinen 30 Ziele nacheinander, und dein Ergebnis ist die Durchschnittszeit pro Treffer. Auf Zeit hast du 30 Sekunden, um so viele Ziele wie möglich zu treffen; jedes Ziel schrumpft langsam und verschwindet, wenn du zu langsam bist."
    },
    {
      "q": "Was ist ein gutes Ergebnis?",
      "a": "In Klassik liegen die meisten zwischen 500 und 800 Millisekunden pro Ziel, starke Spieler kommen unter 450. Auf Zeit sind 35 bis 45 Treffer üblich. Auch die Genauigkeit zählt: Landen weniger als 70 % deiner Klicks auf einem Ziel, sinkt dein Abzeichen um eine Stufe."
    },
    {
      "q": "Geht das mit Maus, Touchpad und Touchscreen?",
      "a": "Ja. Mausklicks, Touchpad, Stift und Finger funktionieren alle; die Tastatur wird nicht genutzt. Es zählen nur Klicks im Spielfeld. Ergebnisse verschiedener Geräte sind kaum vergleichbar – mit Maus und am Handy kommt oft ganz Unterschiedliches heraus."
    },
    {
      "q": "Warum wurde meine Runde nicht gewertet?",
      "a": "Wechselst du während einer Runde den Tab, sperrst das Handy oder verlässt die Seite, wird die Runde aus Fairness abgebrochen. Ergebnisse, die schneller sind, als ein Mensch reagieren kann – etwa unter 150 Millisekunden pro Ziel im Schnitt –, werden weder gespeichert noch mit anderen verglichen."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Aim Trainer",
    "description": "Datenschutzerklärung vom Aim Trainer: anonyme Ergebnisse, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Aim Trainer (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende einer Runde wird nur dein Ergebnis (Durchschnittszeit pro Ziel oder Anzahl der Treffer) als anonyme Zählung an unseren Server gesendet – ohne Namen oder persönliche Kennung. Während der Nutzung können automatisch die unten beschriebenen Informationen erfasst werden."
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
        "Diese Erklärung gilt ab dem 6. November 2026."
      ]
    ],
    "back": "← Zurück zum Aim Trainer"
  }
};
