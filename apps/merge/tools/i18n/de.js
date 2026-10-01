/* Suika Game Halloween-Edition (Wassermelonen-Spiel) — Deutsch (/de/)
 * Schlüsselstruktur wie en.js. Regeln, Stufen und Punkte in merge-core.js. Im Spiel duzen wir.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Suika Game Halloween-Edition, Wassermelonen-Spiel',
    description: 'Suika Game als Halloween-Edition: Lass Süßes ins Glas fallen, verschmelze gleiche Paare zu größeren und züchte eine Riesen-Kürbislaterne. Kostenlos, ohne Download.',
    ogTitle: 'Suika Game Halloween-Edition 🎃 Wie groß schaffst du es?',
    ogDescription: 'Fallen lassen, Paare finden, verschmelzen. Bleib unter der Linie und schau, wie weit du kommst.',
  },
  siteName: 'Suika Game Halloween-Edition',
  privacyLink: 'Datenschutz',

  start: {
    badge: '🎃 Halloween · Merge-Puzzle',
    h1Kicker: 'Suika Game Halloween-Edition',
    h1Html: 'Wie groß wird<br>dein <em>Merge</em>?',
    hook: 'Lass Süßes ins Glas fallen. Berühren sich zwei gleiche, verschmelzen sie zu etwas Größerem – aber nichts darf über die Linie quellen.',
    how: { aim: 'Zielen, loslassen', match: 'Zwei gleiche', line: 'Unter der Linie' },
    facts: 'Kein Zeitlimit · in deinem Tempo',
    start: 'Los geht’s →',
  },

  play: {
    score: 'Punkte',
    best: 'Rekord',
    next: 'Nächstes',
    nextAria: 'Nächstes Teil: {name}',
    pause: 'Pause',
    paused: 'Pause',
    resume: 'Weiter',
    full: 'Glas voll!',
    chainAria: 'Reihenfolge der Verschmelzungen vom kleinsten zum größten Teil',
    fieldAria: 'Spielglas. Bewegen oder ziehen zum Zielen, loslassen oder klicken zum Fallenlassen. Pfeiltasten zielen, Leertaste lässt fallen.',
  },

  result: {
    full: 'Das Glas läuft über!',
    points: 'Punkte',
    best: 'Rekord: {n}',
    newBest: 'Neuer Rekord!',
    biggest: 'Größtes Teil',
    merges: 'Verschmelzungen',
    top: 'Top {n} %',
    beat: 'Besser als {pct} % der Spieler',
    beatAll: 'Besser als alle anderen Ergebnisse',
    others: 'Verglichen mit {n} anderen Ergebnissen',
    comparing: 'Vergleich mit anderen Spielern…',
    retry: 'Nochmal spielen',
    shareTitle: 'Suika Game Halloween-Edition',
    shareText: 'Ich habe {score} Punkte im Suika Game Halloween-Edition 🎃 Schaffst du mehr?',
  },

  tiers: ['Zuckermais', 'Bonbon', 'Lutscher', 'Kastanie', 'Apfel', 'Pilz', 'Fledermaus', 'Gespenst', 'Kristallkugel', 'Kürbis', 'Kürbislaterne'],

  og: {
    brand: '🎃 Suika Game Halloween-Edition',
    defaultKicker: 'Kostenloses Halloween-Merge-Spiel',
    defaultTitle: 'Wie groß wird dein Merge?',
    defaultDesc: 'Fallen lassen · zwei gleiche · verschmelzen',
  },

  faq: [
    { q: 'Wie spielt man?', a: 'Bewege Finger oder Maus über dem Glas, um zu zielen, und lass los (oder klicke), um das Teil fallen zu lassen. Mit den Pfeiltasten zielst du, mit der Leertaste lässt du fallen. Berühren sich zwei gleiche Teile, verschmelzen sie zur nächsten Größe.' },
    { q: 'Wann ist das Spiel vorbei?', a: 'Es gibt kein Zeitlimit. Das Spiel endet, wenn der Stapel etwa zwei Sekunden lang über der gestrichelten Linie oben bleibt. Lass also Platz und plane deine Verschmelzungen.' },
    { q: 'Wie werden Punkte vergeben?', a: 'Jede Verschmelzung bringt Punkte, größere bringen mehr. Kettenreaktionen lassen den Punktestand schnell steigen.' },
    { q: 'Ist das Top-% echt?', a: 'Ja. Am Ende wird nur dein Ergebnis anonym an unseren Server geschickt und mit allen anderen verglichen. Das Top-% erscheint nur, wenn es echte Ergebnisse zum Vergleich gibt, sonst wird nichts angezeigt. Wechselst du den Tab, pausiert das Spiel automatisch.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Suika Game Halloween-Edition',
    description: 'Datenschutzerklärung für Suika Game Halloween-Edition: anonyme Ergebnisse, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Suika Game Halloween-Edition (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende einer Runde wird nur Ihr Ergebnis (auf 10 Punkte gerundet) als anonymer Zähler an unseren Server gesendet, ohne Namen oder persönliche Kennung. Einige Informationen können bei der Nutzung automatisch erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher Ihres Browsers nutzen, um Ihre Sprache und Ihren Rekord zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Sie können dies in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Anzeigen über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage Ihrer früheren Besuche auf dieser und anderen Websites zu schalten. Mehr dazu und Einstellungen unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir ggf. Google Analytics (GA4) und eigene Sammelzähler, die nur tägliche Summen pro Sprache speichern (Seitenaufrufe, begonnene und beendete Runden, Sternbewertungen). Nichts davon identifiziert Sie persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 2. Oktober 2026.'],
    ],
    back: '← Zurück zu Suika Game Halloween-Edition',
  },
};
