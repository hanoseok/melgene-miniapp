/* 1 bis 50 Spiel — Deutsch */
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
    title: '1 bis 50 Spiel – Zahlen der Reihe nach antippen',
    description: 'Spiele das 1 bis 50 Spiel online: Tippe die Zahlen so schnell wie möglich der Reihe nach an und knacke deine Bestzeit auf 0,01 s. Klassisch oder schnell bis 25. Kostenlos, ohne Download.',
    ogTitle: '1 bis 50 Spiel 🔢 Wie schnell tippst du von 1 bis 50?',
    ogDescription: 'Finde die nächste Zahl und tippe sie an, bis zum Ende. Ein schneller Test für Konzentration und Fingertempo.',
  },
  siteName: '1 bis 50 Spiel',
  privacyLink: 'Datenschutz',
  start: {
    badge: '🔢 Zahlen tippen · Tempotest',
    h1Kicker: '1 bis 50 Spiel',
    h1Html: 'Von 1 bis 50,<br>so <em>schnell</em> es geht',
    hook: 'Die Zahlen sind über das Raster verstreut. Finde die nächste, tippe sie an und mach weiter bis zum Schluss. Deine Augen müssen schneller sein als deine Finger.',
    how: { order: 'Ab 1 der Reihe nach', swap: 'Neue Zahlen tauchen auf', penalty: 'Fehler +0,5 s' },
    facts: '3-2-1-Countdown · Zeit auf 0,01 s genau',
    modeLabel: 'Modus wählen',
    modes: { classic: 'Klassisch', quick: 'Schnell' },
    start: 'Los geht’s →',
  },
  play: {
    next: 'Nächste',
    time: 'Zeit',
    progress: 'Erledigt',
    go: 'LOS!',
    boardAria: '1-bis-50-Spielfeld. Tippe die Zahlen der Reihe nach an, beginnend mit 1.',
    paused: 'Pause · tippen zum Weitermachen',
    aBlank: 'Leeres Feld',
  },
  result: {
    done: 'Geschafft!',
    sec: 's',
    mistakesLabel: 'Fehler',
    perLabel: 'Pro Zahl',
    best: 'Bestzeit: {t}',
    newBest: 'Neue Bestzeit!',
    penNote: 'Inklusive +{s} s für Fehler',
    top: 'Top {n} %',
    beat: 'Schneller als {pct} % der Spieler',
    beatAll: 'Schneller als alle anderen Zeiten bisher',
    others: 'Verglichen mit {n} anderen Zeiten',
    comparing: 'Vergleich mit anderen Spielern…',
    retry: 'Nochmal spielen',
    shareTitle: '1 bis 50 Spiel – wie schnell bist du?',
    shareText: 'Ich habe 1 bis {max} in {time} Sekunden getippt 🔢 Schaffst du das schneller?',
  },
  og: {
    brand: '🔢 1 bis 50 Spiel',
    defaultKicker: 'Kostenloses Tempospiel',
    defaultTitle: 'Wie schnell tippst du 1 bis 50?',
    defaultDesc: 'Nächste Zahl finden · Uhr schlagen',
  },
  faq: [
    {
      q: 'Wie spielt man das 1 bis 50 Spiel?',
      a: 'Nach einem 3-2-1-Countdown zeigt ein 5×5-Raster die Zahlen 1 bis 25 an zufälligen Stellen. Tippe 1, dann 2, dann 3 und so weiter. Im Modus Klassisch erscheint auf jedem angetippten Feld eine neue Zahl von 26 bis 50, und du machst weiter bis 50.',
    },
    {
      q: 'Was passiert, wenn ich die falsche Zahl antippe?',
      a: 'Das Feld wackelt und deine Zeit bekommt 0,5 Sekunden dazu, wildes Tippen lohnt sich also nicht. Ein leeres Feld anzutippen bewirkt nichts. Im Ergebnis siehst du, wie viele Fehler du gemacht hast.',
    },
    {
      q: 'Was ist der Unterschied zwischen Klassisch und Schnell?',
      a: 'Klassisch geht von 1 bis 50 und ist der übliche Modus, um Zeiten zu vergleichen. Schnell endet bei 25, und jedes angetippte Feld bleibt leer. Das ist ein kurzes Aufwärmen und funktioniert wie eine Schulte-Tabelle.',
    },
    {
      q: 'Woher kommt die Angabe „Top %“?',
      a: 'Am Ende werden dein Modus und deine gerundete Zeit mit den echten Zeiten anderer Spieler im selben Modus verglichen. Gibt es noch keine anderen Zeiten, wird dieser Block einfach nicht angezeigt.',
    },
  ],
  privacy: {
    "title": "Datenschutzerklärung | 1 bis 50 Spiel",
    "description": "Datenschutzerklärung des 1 bis 50 Spiels: anonyme Zeiten, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "1 bis 50 Spiel (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Wenn Sie ein Spiel beenden, werden nur Modus und Zeit (auf eine Zehntelsekunde gerundet) als anonyme Zählung an unseren Server gesendet, ohne Namen oder persönliche Kennung. Bei der Nutzung des Dienstes können einige Informationen automatisch erfasst werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher Ihres Browsers verwenden, um Ihre Sprache und Ihren Rekord zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Sie können diese in Ihren Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage Ihrer früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und Ihre Einstellungen finden Sie in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene zusammengefasste Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, begonnene und beendete Spiele, Sternebewertungen). Nichts davon identifiziert Sie persönlich."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 14. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum 1 bis 50 Spiel"
  },
};
