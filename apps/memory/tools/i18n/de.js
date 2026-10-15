/* Memory Spiel — Deutsch */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },
  meta: {
    title: 'Memory Spiel – Halloween-Karten umdrehen',
    description: 'Spiele das Memory Spiel kostenlos online: Dreh die Halloween-Karten paarweise um und finde alle Paare. Drei Stufen, Stoppuhr und Zugzähler. Ohne Download.',
    ogTitle: 'Memory Spiel 🎃 Findest du alle Paare?',
    ogDescription: 'Kürbisse, Gespenster und Fledermäuse verstecken sich unter den Karten. Dreh immer zwei um und teste dein Gedächtnis.',
  },
  siteName: 'Halloween Memory Spiel',
  privacyLink: 'Datenschutz',
  start: {
    badge: '🎃 Halloween-Kartenspiel',
    h1Kicker: 'Memory Spiel',
    h1Html: 'Karten umdrehen,<br>alle <em>Paare</em> finden',
    hook: 'Kürbisse, Gespenster und Fledermäuse verstecken sich unter den Karten. Dreh immer zwei um und merk dir genau, wo was liegt.',
    how: 'Zwei Karten umdrehen · gleiches Bild = Paar',
    levelLabel: 'Stufe wählen',
    levels: { easy: 'Leicht', normal: 'Mittel', hard: 'Schwer' },
    start: 'Los geht’s →',
  },
  play: {
    time: 'Zeit',
    moves: 'Züge',
    pairs: 'Paare',
    boardAria: 'Memory-Spielfeld. Dreh zwei Karten um, um ein Paar zu finden.',
    aDown: 'Karte {n}, verdeckt',
    paused: 'Pause · tippen zum Weiterspielen',
  },
  result: {
    done: 'Alle Paare gefunden!',
    sec: 's',
    movesLabel: 'Züge',
    accLabel: 'Trefferquote',
    best: 'Bestzeit: {t}',
    newBest: 'Neue Bestzeit!',
    top: 'Top {n} %',
    beat: 'Schneller als {pct} % der Spieler',
    beatAll: 'Schneller als alle bisherigen Zeiten',
    others: 'Verglichen mit {n} anderen Zeiten dieser Stufe',
    comparing: 'Vergleich mit anderen Spielern…',
    retry: 'Nochmal spielen',
    shareTitle: 'Halloween Memory Spiel – wie gut ist dein Gedächtnis?',
    shareText: 'Ich habe alle {pairs} Paare in {time} s mit {moves} Zügen gefunden 🎃 Schaffst du das schneller?',
  },
  og: {
    brand: '🃏 Memory Spiel',
    defaultKicker: 'Kostenloses Halloween-Memory',
    defaultTitle: 'Findest du alle Paare?',
    defaultDesc: 'Umdrehen · merken · Paare finden',
  },
  faq: [
    {
      q: 'Wie spielt man das Memory Spiel?',
      a: 'Am Anfang liegen alle Karten verdeckt. Tippe eine Karte an und dann eine zweite. Zeigen beide dasselbe Bild, bleiben sie als Paar offen; sonst drehen sie sich nach einem Moment wieder um. Finde alle Paare, um fertig zu werden. Die Uhr startet mit der ersten Karte.',
    },
    {
      q: 'Was ist ein Zug und wie wird die Trefferquote berechnet?',
      a: 'Jedes Mal, wenn du zwei Karten umdrehst, ist das ein Zug. Die Trefferquote ist die Zahl der Paare geteilt durch deine Züge – alle Paare ohne Fehler ergeben also 100 %. Fehler kosten keine Zeit, aber zusätzliche Züge.',
    },
    {
      q: 'Was unterscheidet die Stufen?',
      a: 'Leicht hat 12 Karten (6 Paare), Mittel 16 Karten (8 Paare) und Schwer 24 Karten (12 Paare). Karten und Bilder werden jede Runde neu gemischt, und deine Bestzeit wird für jede Stufe getrennt gespeichert.',
    },
    {
      q: 'Was passiert, wenn ich die App wechsle?',
      a: 'Die Uhr hält an und die Karten werden abgedeckt, damit niemand schummeln kann. Tippe nach der Rückkehr auf das Spielfeld, dann geht die Runde dort weiter, wo du aufgehört hast.',
    },
    {
      q: 'Woher kommt die Angabe „Top %“?',
      a: 'Am Ende werden deine Stufe und deine gerundete Zeit mit den echten Zeiten anderer Spieler auf derselben Stufe verglichen. Gibt es noch keine anderen Zeiten, wird der Vergleich einfach nicht angezeigt.',
    },
  ],
  privacy: {
    "title": "Datenschutzerklärung | Memory Spiel",
    "description": "Datenschutzerklärung für das Memory Spiel: anonyme Zeiten, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Das Halloween Memory Spiel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Wenn du eine Runde beendest, werden nur deine Stufe und deine Zeit (auf eine Zehntelsekunde gerundet) als anonyme Zählung an unseren Server gesendet – ohne Namen oder persönliche Kennung. Während der Nutzung können wie unten beschrieben einige Daten automatisch erfasst werden."
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
        "Diese Erklärung gilt ab dem 16. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Memory Spiel"
  },
};
