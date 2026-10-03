/* 2048 Spiel (Halloween-Edition) — Deutsch */
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
    title: '2048 Spiel – kostenlos online spielen, Halloween',
    description: 'Das 2048 Spiel online als Halloween-Edition: wischen oder Pfeiltasten drücken, gleiche Zahlen verschmelzen und die 2048 knacken. Kostenlos, ohne Download.',
    ogTitle: '2048 Spiel 🎃 Schaffst du die 2048?',
    ogDescription: 'Wischen, verschmelzen, verdoppeln. Ein schaurig-schönes 2048 direkt im Browser.',
  },
  siteName: '2048 Spiel',
  privacyLink: 'Datenschutz',

  start: {
    badge: '🎃 Halloween-Edition · Zahlenrätsel',
    h1Kicker: '2048 Spiel',
    h1Html: 'Schaffst du<br>die <em>2048</em>?',
    hook: 'Schieb die Kacheln. Treffen zwei gleiche Zahlen aufeinander, verschmelzen sie zu einer — verdopple weiter, bevor das Feld voll ist.',
    how: { swipe: 'Wischen zum Schieben', match: 'Gleiche verbinden', goal: '2048 erreichen' },
    facts: 'Kein Zeitlimit · Wischen oder Pfeiltasten',
    start: 'Los geht’s →',
  },

  play: {
    score: 'Punkte',
    best: 'Rekord',
    boardAria: 'Spielfeld. Wische oder nutze die Pfeiltasten, um die Kacheln zu schieben.',
    won: 'Du hast 2048!',
    keepGoing: 'Weiterspielen',
    finish: 'Hier aufhören',
    over: 'Keine Züge mehr!',
  },

  result: {
    over: 'Keine Züge mehr!',
    won: 'Du hast die 2048 geschafft!',
    points: 'Punkte',
    best: 'Rekord: {n}',
    newBest: 'Neuer Rekord!',
    biggest: 'Größte Kachel',
    moves: 'Züge',
    top: 'Top {n} %',
    beat: 'Besser als {pct} % der Spieler',
    beatAll: 'Besser als alle anderen Ergebnisse bisher',
    others: 'Verglichen mit {n} anderen Ergebnissen',
    comparing: 'Vergleiche mit anderen Spielern…',
    retry: 'Nochmal spielen',
    shareTitle: '2048 Spiel – Halloween-Edition',
    shareText: 'Ich habe im 2048 Spiel {score} Punkte geholt 🎃 Schaffst du mehr?',
  },

  og: {
    brand: '🔢 2048 Spiel',
    defaultKicker: 'Gratis Halloween-2048',
    defaultTitle: 'Schaffst du die 2048?',
    defaultDesc: 'Wischen · verschmelzen · verdoppeln',
  },

  faq: [
    { q: 'Wie spielt man 2048?', a: 'Wische über das Spielfeld (oder drück die Pfeiltasten), dann rutschen alle Kacheln gleichzeitig in diese Richtung. Berühren sich zwei Kacheln mit derselben Zahl, verschmelzen sie zu einer mit doppeltem Wert. Nach jedem Zug kommt eine neue 2 oder 4 dazu.' },
    { q: 'Wann ist das Spiel vorbei?', a: 'Es gibt kein Zeitlimit. Das Spiel endet, wenn das Feld voll ist und keine benachbarten Kacheln mehr dieselbe Zahl haben. Hast du die 2048, kannst du aufhören oder für mehr Punkte weiterspielen.' },
    { q: 'Wie werden die Punkte berechnet?', a: 'Jedes Verschmelzen bringt den Wert der neuen Kachel als Punkte, große Kacheln zählen also mehr. Dein Rekord wird nur in diesem Browser gespeichert.' },
    { q: 'Ist das Top-% echt?', a: 'Ja. Am Ende einer Runde wird nur deine Punktzahl anonym an unseren Server geschickt und mit allen anderen verglichen. Das Top-% erscheint nur, wenn es echte Ergebnisse zum Vergleichen gibt; sonst wird nichts angezeigt.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | 2048 Spiel',
    description: 'Datenschutzerklärung für das 2048 Spiel: anonyme Punktzahlen, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Das 2048 Spiel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Daten.',
    sections: [
      ['1. Welche Daten wir erheben', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende einer Runde wird nur deine Punktzahl (auf 20 Punkte gerundet) als anonymer Zähler an unseren Server geschickt – ohne Namen oder persönliche Kennung. Bei der Nutzung können wie unten beschrieben einige Daten automatisch erfasst werden.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um Sprache und Rekord zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browser-Einstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und Einstellungen unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Sammelzähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, begonnene und beendete Spiele, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 4. Oktober 2026.'],
    ],
    back: '← Zurück zum 2048 Spiel',
  },
};
