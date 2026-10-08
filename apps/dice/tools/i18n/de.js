/* Würfeln — Deutsch (du). Gleiche Struktur wie en.js (siehe Kommentare). Würfelnotation mit W (W6, W20). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Würfeln online – virtueller Würfel',
    description: 'Würfeln online mit einem Tipp: Wirf einen bis sechs Würfel auf einmal, nimm den klassischen W6 oder W4, W8, W10, W12 und W20 für Pen-&-Paper-Rollenspiele und sieh sofort die Summe. Fair, kostenlos, ohne Anmeldung.',
    ogTitle: 'Würfeln 🎲 Online-Würfel',
    ogDescription: 'Wirf einen bis sechs Würfel, W6 bis W20, und sieh die Summe sofort.',
  },
  siteName: 'Würfeln',
  privacyLink: 'Datenschutzerklärung',

  hero: {
    h1Kicker: 'Würfeln online',
    h1Html: 'Schütteln, werfen und<br>die <em>Würfel</em> entscheiden lassen',
    hook: 'Wähle, wie viele Würfel und welche Sorte, und los. Für Brettspiele, Rollenspiele oder die Frage, wer heute abwäscht.',
  },

  ui: {
    dieLetter: 'W',
    countLabel: 'Wie viele Würfel?',
    typeLabel: 'Würfeltyp',
    typeHint: 'Der W6 ist der klassische Würfel. W4 bis W20 sind für Rollenspiele.',
    roll: 'Würfeln 🎲',
    rolling: 'Rollt…',
    keyHint: 'Tipp: Leertaste drücken zum Würfeln',
    idle: 'Bereit, wenn du es bist',
    total: 'Summe {n}',
    trayLabel: 'Würfelschale',
    live: 'Du hast {values} gewürfelt. Summe {total}.',
    liveOne: 'Du hast {values} gewürfelt.',
    fair: 'Jede Seite hat genau dieselbe Chance (kryptografischer Zufall)',
  },

  history: {
    title: 'Deine letzten 10 Würfe',
    note: 'Nur gespeichert, solange diese Seite offen ist.',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: 'Nochmal würfeln',
    shareTitle: 'Würfeln – Würfeln online',
    shareText: 'Ich habe {dice} gewürfelt: {values} = {total} 🎲',
    shareTextOne: 'Ich habe {dice} gewürfelt: {values} 🎲',
  },

  og: {
    brand: '🎲 Würfeln',
    kicker: '1–6 Würfel · W4 bis W20',
    title: 'Würfeln online',
    desc: 'Einmal tippen, alle Würfel und die Summe sehen',
  },

  faq: [
    { q: 'Ist der Online-Würfel wirklich zufällig und fair?', a: 'Ja. Jedes Ergebnis stammt aus dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) mit Rejection Sampling, sodass keine Seite auch nur minimal wahrscheinlicher ist als eine andere. Das Ergebnis steht fest, bevor die Animation beginnt; das Rollen ist nur Show.' },
    { q: 'Wie viele Würfel kann ich auf einmal werfen?', a: 'Einen bis sechs Würfel pro Wurf, alle vom gleichen Typ. Die Schale zeigt jeden Würfel und die Summe, und deine letzten zehn Würfe bleiben in einer kurzen Liste, solange die Seite offen ist.' },
    { q: 'Was bedeuten W4, W8, W10, W12 und W20?', a: 'Das sind Würfel mit 4, 8, 10, 12 und 20 Seiten, wie man sie aus Rollenspielen wie Dungeons & Dragons oder Das Schwarze Auge kennt. Die Zahl nach dem W ist die Anzahl der Seiten: Ein W20 zeigt 1 bis 20, und 2W6 heißt zwei sechsseitige Würfel. Im Englischen schreibt man d statt W, also d20.' },
    { q: 'Kann ich ihn für Brettspiele nutzen?', a: 'Klar. Zum Beispiel, wenn die Würfel fehlen, wenn du mehr brauchst, als in der Schachtel sind, oder wenn ihr per Videocall spielt. Mit der Leertaste würfelst du am schnellsten.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Würfeln',
    description: 'Datenschutzerklärung für Würfeln: Deine Würfe bleiben in deinem Browser, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Würfeln (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, unbedingt nötigen Informationen.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto und ohne Anmeldung. Deine Würfeleinstellungen und Ergebnisse werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Bei der Nutzung können jedoch automatisch einige Informationen erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache zu speichern, Werbung anzuzeigen und zu verstehen, wie der Dienst genutzt wird. Du kannst sie in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann möglicherweise nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr erfährst du und deine Einstellungen änderst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene aggregierte Zähler verwenden, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, Würfe, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Wenn du Fragen zu dieser Datenschutzerklärung hast, wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 9. Oktober 2026.'],
    ],
    back: '← Zurück zu Würfeln',
  },
};
