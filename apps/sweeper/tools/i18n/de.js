/* Minesweeper — de (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    display: "'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },
  meta: {
    title: 'Minesweeper – Kostenlos online spielen',
    description: 'Minesweeper online spielen: Deck alle sicheren Felder auf, markiere die Minen mit Flaggen und schlage die Zeit. Drei Stufen, der erste Tipp ist immer sicher.',
    ogTitle: 'Minesweeper 💣 Wie schnell räumst du das Feld?',
    ogDescription: 'Der Rätselklassiker im Browser: drei Größen, ein sicherer erster Klick und eine Bestzeit zum Knacken.',
  },
  siteName: 'Minesweeper',
  privacyLink: 'Datenschutz',
  start: {
    badge: '💣 Rätselklassiker · 3 Stufen',
    h1Kicker: 'Minesweeper',
    h1Html: 'Räum das Feld,<br>meide jede <em>Mine</em>',
    hook: 'Die Zahlen verraten, wie viele Minen nebenan lauern. Knobel, setz Flaggen auf gefährliche Felder und räum das Brett, bevor die Zeit davonläuft.',
    how: { reveal: 'Tippen deckt auf', flag: 'Halten = Flagge', chord: 'Zahl antippen' },
    facts: 'Der erste Tipp ist immer sicher',
    diffLabel: 'Stufe wählen',
    diffs: { beginner: 'Leicht', intermediate: 'Mittel', expert: 'Experte' },
    start: 'Spiel starten →',
  },
  play: {
    mines: 'Minen',
    time: 'Zeit',
    digMode: 'Graben',
    flagMode: 'Flagge',
    boardAria: 'Minesweeper-Brett. Tippe ein Feld an, um es aufzudecken; halten oder Flaggenmodus markiert eine Mine.',
    paused: 'Pausiert · tippen zum Fortsetzen',
    aHidden: 'Verdecktes Feld',
    aFlag: 'Feld mit Flagge',
    aMine: 'Mine',
    aNum: '{n} Minen in der Nähe',
  },
  result: {
    win: 'Feld geräumt!',
    lose: 'Bumm!',
    sec: 's',
    timeLabel: 'Zeit',
    clearedLabel: 'Aufgedeckt',
    best: 'Bestzeit: {t}',
    newBest: 'Neue Bestzeit!',
    top: 'Top {n} %',
    beat: 'Schneller als {pct} % der Spieler',
    beatAll: 'Schneller als jede bisherige Zeit',
    others: 'Verglichen mit {n} anderen Zeiten',
    comparing: 'Vergleich mit anderen Spielern…',
    retry: 'Nochmal spielen',
    shareTitle: 'Minesweeper – schaffst du das Feld?',
    shareWin: 'Ich habe Minesweeper ({diff}) in {time} Sekunden geräumt 💣 Schlägst du mich?',
    shareLose: 'Bei Minesweeper ({diff}) {pct} % aufgedeckt, dann Bumm 💥 Kannst du es besser?',
  },
  og: { brand: '💣 Minesweeper spielen', defaultKicker: 'Kostenloses Rätselspiel', defaultTitle: 'Schaffst du das Feld?', defaultDesc: 'Flaggen setzen · Zeit schlagen' },
  faq: [
    {
      q: 'Wie spielt man Minesweeper?',
      a: 'Tippe ein Feld an, um es aufzudecken. Eine Zahl zeigt, wie viele der acht Nachbarfelder eine Mine verbergen. Leite daraus die Minen ab, markiere sie mit Flaggen und decke alle minenfreien Felder auf, um zu gewinnen.',
    },
    {
      q: 'Wie setze ich auf dem Handy eine Flagge?',
      a: 'Halte ein Feld kurz gedrückt oder schalte die Taste Graben / Flagge über dem Brett in den Flaggenmodus und tippe. Am Computer geht auch Rechtsklick oder die Taste F auf dem markierten Feld.',
    },
    {
      q: 'Was passiert, wenn ich eine Zahl antippe?',
      a: 'Hast du rund um eine Zahl genau so viele Flaggen gesetzt, wie sie angibt, deckt das Antippen alle übrigen Nachbarfelder auf einmal auf. Stimmt eine Flagge nicht, explodiert das Feld – prüfe also vorher.',
    },
    {
      q: 'Ist der erste Tipp wirklich sicher?',
      a: 'Ja. Die Minen werden erst nach deinem ersten Tipp verteilt, nie auf diesem Feld oder direkt daneben, sodass sich immer eine Fläche öffnet. Die Zeit startet mit dem ersten Tipp und pausiert, wenn du den Tab verlässt.',
    },
  ],
  privacy: {
    "title": "Datenschutzerklärung | Minesweeper",
    "description": "Datenschutzerklärung von Minesweeper: anonyme Zeiten, Cookies, Werbung und Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Minesweeper (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Wenn Sie ein Spiel gewinnen, werden nur Stufe und Zeit (auf eine halbe Sekunde gerundet) als anonyme Zählung an unseren Server gesendet, ohne Namen oder persönliche Kennung. Bei der Nutzung des Dienstes können einige Informationen automatisch erfasst werden, wie unten beschrieben."
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
        "Diese Erklärung gilt ab dem 10. Oktober 2026."
      ]
    ],
    "back": "← Zurück zu Minesweeper"
  },
};
