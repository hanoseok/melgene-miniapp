/* Block-Puzzle — Deutsch */
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
    "title": "Block-Puzzle – 8×8 Blöcke-Spiel, Reihen abräumen",
    "description": "Block-Puzzle: Zieh Blöcke auf ein 8×8-Feld, füll Reihen und Spalten, damit sie verschwinden, und sammle Combo-Punkte. Kostenlos, ohne Download.",
    "ogTitle": "Block-Puzzle 🧩 Wie lange hältst du das Feld frei?",
    "ogDescription": "Teile reinziehen, eine Reihe oder Spalte füllen – weg ist sie. Räum mehrmals hintereinander ab für eine Combo."
  },
  "siteName": "Block-Puzzle",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🧩 Entspanntes 8×8-Denkspiel",
    "h1Kicker": "Block-Puzzle",
    "h1Html": "Reihen füllen,<br><em>Feld abräumen!</em>",
    "hook": "Drei Teile, ein 8×8-Feld und keine Zeitbegrenzung. Pass sie ein, räum Reihen und Spalten ab und spiel weiter, solange Platz ist.",
    "how": {
      "drag": "Teil ziehen",
      "lines": "Reihe füllen",
      "plan": "Platz lassen"
    },
    "facts": "Ohne Zeitlimit · Combos · Rekord knacken",
    "start": "Los geht’s →"
  },
  "play": {
    "score": "Punkte",
    "best": "Rekord",
    "combo": "Combo",
    "comboValue": "×{n}",
    "hint": "Zieh ein Teil aufs Feld",
    "hintSelected": "Tippe auf ein Feld zum Ablegen",
    "hintNoFit": "Das Teil passt dort nicht",
    "noRoom": "Kein Platz mehr!",
    "boardAria": "Spielfeld 8 mal 8. Wähle ein Teil mit 1, 2 oder 3, verschiebe es mit den Pfeiltasten und leg es mit Enter ab. Escape bricht ab.",
    "trayAria": "Teile zum Ablegen",
    "pieceAria": "Teil {n}",
    "pieceNoFit": "Teil {n} (kein Platz)"
  },
  "result": {
    "over": "Kein Platz mehr auf dem Feld",
    "points": "Punkte",
    "lines": "Reihen geräumt",
    "combo": "Beste Combo",
    "comboValue": "×{n}",
    "shareTitle": "Block-Puzzle",
    "shareText": "Ich habe {n} Punkte im Block-Puzzle geschafft 🧩 Schaffst du mehr?",
    "best": "Rekord: {n}",
    "newBest": "Neuer Rekord!",
    "top": "Top {n} %",
    "beat": "Besser als {pct} % der Spieler",
    "beatAll": "Besser als alle anderen bisher",
    "others": "Verglichen mit {n} anderen Spielen",
    "comparing": "Vergleich mit anderen Spielern …",
    "retry": "Nochmal spielen"
  },
  "og": {
    "brand": "🧩 Block-Puzzle",
    "defaultKicker": "Kostenloses 8×8-Blockspiel",
    "defaultTitle": "Reihen füllen, Feld abräumen",
    "defaultDesc": "Ziehen · Reihen und Spalten füllen · Combos"
  },
  "faq": [
    {
      "q": "Wie spielt man?",
      "a": "Zieh eins der drei Teile unter dem Feld auf freie Kästchen. Ist eine Reihe oder Spalte komplett gefüllt, verschwindet sie. Wenn alle drei Teile liegen, bekommst du drei neue. Das Spiel endet, wenn keins der übrigen Teile mehr irgendwo passt."
    },
    {
      "q": "Wie werden die Punkte berechnet?",
      "a": "Jedes abgelegte Kästchen bringt einen Punkt. Für geräumte Reihen gibt es einen Bonus, der mit der Zahl gleichzeitig geräumter Reihen wächst (10, 30, 60, 100 …), und dieser Bonus wird mit deiner Combo multipliziert."
    },
    {
      "q": "Wie funktionieren Combos?",
      "a": "Jedes Teil, das mindestens eine Reihe räumt, erhöht die Combo um eins – diese Zahl ist der Multiplikator für diesen Zug. Räumen drei Teile hintereinander nichts ab, fällt die Combo auf null."
    },
    {
      "q": "Kann ich ohne Ziehen spielen?",
      "a": "Ja. Tippe ein Teil an, um es auszuwählen, und dann auf die Stelle im Feld, wo es hin soll. Mit der Tastatur wählst du mit 1, 2 oder 3, verschiebst mit den Pfeiltasten und legst mit Enter ab."
    },
    {
      "q": "Ist die Top-%-Angabe echt?",
      "a": "Ja. Am Ende eines Spiels wird nur deine Punktzahl anonym an unseren Server geschickt und mit allen anderen verglichen. Die Angabe erscheint nur, wenn es echte Ergebnisse zum Vergleichen gibt."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Block-Puzzle",
    "description": "Datenschutzerklärung für Block-Puzzle: anonyme Punktzahlen, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Block-Puzzle (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    "sections": [
      [
        "1. Welche Informationen wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende eines Spiels wird nur deine Punktzahl als anonyme Zählung an unseren Server gesendet – ohne Namen oder persönliche Kennung. Während der Nutzung können automatisch Informationen erhoben werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache und deinen Rekord zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Basis deiner früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und deine Einstellungen findest du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene zusammengefasste Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, begonnene und beendete Spiele, Sternebewertungen). Nichts davon identifiziert dich persönlich."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 29. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Block-Puzzle"
  }
};
