/* Halloween-Süßigkeiten fangen (Spiel) — Deutsch (/de/)
 * Gleiche Schlüsselstruktur wie en.js. Regeln und Punkte in candy-catch-core.js.
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
    title: 'Halloween-Süßigkeiten fangen – Spiel gratis',
    description: 'Halloween-Spiel: Süßigkeiten fangen mit dem Kürbiseimer, Spinnen und Geistern ausweichen und Combos sammeln. 50 Sekunden pro Runde, kostenlos, ohne Download.',
    ogTitle: 'Halloween-Süßigkeiten fangen 🍬 Wie viel schaffst du?',
    ogDescription: 'Es regnet Süßigkeiten. 50 Sekunden, 3 Leben – wie voll wird dein Eimer?',
  },
  siteName: 'Halloween-Süßigkeiten fangen',
  privacyLink: 'Datenschutzerklärung',

  start: {
    badge: '🎃 Süßes oder Saures · Arcade',
    h1Kicker: 'Halloween-Süßigkeiten fangen',
    h1Html: 'Wie viel Süßes<br>kannst du <em>fangen</em>?',
    hook: 'Heute Nacht regnet es Süßigkeiten. Füll deinen Eimer, bevor die Zeit abläuft – aber nicht alles, was fällt, ist süß.',
    how: { move: 'Wischen oder ← →', catch: 'Süßes fangen', avoid: 'Gruseliges meiden' },
    facts: '50 Sekunden · 3 Leben · Combos',
    start: 'Los geht’s →',
  },

  play: {
    score: 'Punkte',
    time: 'Zeit',
    lives: 'Leben',
    livesAria: 'Verbleibende Leben: {n}',
    combo: 'Combo ×{n}',
    pause: 'Pause',
    paused: 'Pausiert',
    resume: 'Weiter',
    go: 'Los!',
    fieldAria: 'Spielfeld. Wische, bewege die Maus oder nutze die Pfeiltasten, um den Eimer zu bewegen.',
  },

  result: {
    timeUp: 'Zeit abgelaufen!',
    outOfLives: 'Keine Leben mehr!',
    points: 'Punkte',
    best: 'Rekord: {n}',
    newBest: 'Neuer Rekord!',
    caught: 'Gefangene Süßigkeiten',
    streak: 'Längste Combo',
    top: 'Top {n} %',
    beat: 'Besser als {pct} % der Spieler',
    beatAll: 'Besser als alle anderen Ergebnisse',
    others: 'Verglichen mit {n} anderen Ergebnissen',
    comparing: 'Vergleich mit anderen Spielern …',
    retry: 'Nochmal spielen',
    shareTitle: 'Halloween-Süßigkeiten fangen',
    shareText: 'Ich habe beim Halloween-Süßigkeiten-Fangen {score} Punkte geholt 🍬 Schaffst du mehr?',
  },

  og: {
    brand: '🍬 Halloween-Süßigkeiten fangen',
    defaultKicker: 'Kostenloses Halloween-Spiel',
    defaultTitle: 'Wie viele Süßigkeiten kannst du fangen?',
    defaultDesc: 'Eimer schieben · Süßes fangen · 50 Sekunden',
  },

  faq: [
    { q: 'Wie spielt man?', a: 'Wische mit dem Finger über das Spielfeld, bewege die Maus oder halte die Pfeiltasten ← →, um den Kürbiseimer zu verschieben. Fang die fallenden Süßigkeiten und halte dich von allem Gruseligen fern. Eine Runde dauert 50 Sekunden oder bis alle drei Leben weg sind.' },
    { q: 'Wie funktionieren Punkte und Combos?', a: 'Jede Süßigkeit bringt Punkte, seltene und besonders edle bringen mehr. Fängst du mehrere hintereinander, wächst die Combo – je länger die Serie, desto höher der Multiplikator. Eine verpasste Süßigkeit oder ein gruseliger Fang setzt sie zurück.' },
    { q: 'Ist die Platzierung echt?', a: 'Ja. Am Ende einer Runde wird nur dein Ergebnis anonym an unseren Server geschickt und mit denen der anderen verglichen. Die Prozentangabe erscheint nur, wenn es echte Ergebnisse zum Vergleichen gibt – sonst wird nichts angezeigt.' },
    { q: 'Warum hat das Spiel von selbst angehalten?', a: 'Das Spiel pausiert automatisch, wenn du den Tab oder die App wechselst, damit du in der Zeit kein Leben verlierst. Tippe auf „Weiter“, um fortzufahren. Dein Rekord bleibt in diesem Browser gespeichert.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Halloween-Süßigkeiten fangen',
    description: 'Datenschutzerklärung für Halloween-Süßigkeiten fangen: anonyme Ergebnisse, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Halloween-Süßigkeiten fangen (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Am Ende einer Runde wird nur Ihr Ergebnis (auf 10 Punkte gerundet) als anonymer Zähler an unseren Server gesendet, ohne Namen oder persönliche Kennung. Einige Informationen können bei der Nutzung automatisch erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher Ihres Browsers nutzen, um Ihre Sprache und Ihren Rekord zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Sie können dies in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Anzeigen über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage Ihrer früheren Besuche auf dieser und anderen Websites zu schalten. Mehr dazu und Einstellungen unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir ggf. Google Analytics (GA4) und eigene Sammelzähler, die nur tägliche Summen pro Sprache speichern (Seitenaufrufe, begonnene und beendete Runden, Sternbewertungen). Nichts davon identifiziert Sie persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 30. September 2026.'],
    ],
    back: '← Zurück zu Halloween-Süßigkeiten fangen',
  },
};
