/* Ja oder Nein Orakel — Deutsch. Gleiche Schlüsselstruktur wie en.js (siehe Kommentare). Duzen.
 * oracle: 12 Antworten (0-3 positiv · 4-7 neutral · 8-11 negativ), kurz, weil sie in der Kugel stehen. */
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
    title: 'Ja oder Nein Orakel – Entscheidungshilfe online',
    description: 'Du kannst dich nicht entscheiden? Frage eintippen, und das Ja oder Nein Orakel antwortet sofort: Ja/Nein, Ja/Nein/Vielleicht, Orakelkugel oder Best of 3 und 5. Kostenlos, fair, ohne Anmeldung.',
    ogTitle: 'Ja oder Nein Orakel 🎱 Frag, und die Kugel antwortet',
    ogDescription: 'Ja, Nein, Vielleicht oder ein Spruch der Orakelkugel. Faire Zufallsantworten für jedes kleine Dilemma.',
  },
  siteName: 'Ja oder Nein Orakel',
  privacyLink: 'Datenschutz',

  hero: {
    h1Kicker: 'Ja oder Nein Orakel',
    h1Html: 'Frag, was du willst.<br>Die Kugel sagt <em>Ja</em> oder <em>Nein</em>',
    hook: 'Tipp die Frage ein, über die du ständig grübelst, wähl einen Modus und lass den Zufall entscheiden.',
  },

  ui: {
    questionLabel: 'Deine Frage (optional)',
    questionPh: 'z. B. Heute Abend Döner bestellen?',
    questionHint: 'Bleibt auf diesem Gerät. Sie landet nur in einem Link, wenn du die Antwort teilst.',
    modeLabel: 'Wie soll die Kugel antworten?',
    modes: {
      classic: 'Ja / Nein',
      maybe: 'Ja / Nein / Vielleicht',
      oracle: 'Orakelkugel',
      best3: 'Best of 3',
      best5: 'Best of 5',
    },
    modeHints: {
      classic: 'Klares Ja oder Nein, 50 : 50.',
      maybe: 'Ja, Nein oder Vielleicht, je ein Drittel.',
      oracle: 'Einer von 12 Kugelsprüchen: manche sagen Ja, manche Nein, manche „warte noch“.',
      best3: 'Es wird geworfen, bis eine Seite zweimal gewinnt.',
      best5: 'Es wird geworfen, bis eine Seite dreimal gewinnt.',
    },
    ask: 'Frag die Kugel 🔮',
    asking: 'Die Kugel denkt nach…',
    fair: 'Fairer Krypto-Zufall · nur zum Spaß, entscheiden tust du',
  },

  answers: { yes: 'JA', no: 'NEIN', maybe: 'VIELLEICHT' },
  tones: { positive: 'Eher Ja', neutral: 'Abwarten', negative: 'Eher Nein' },
  oracle: [
    'Mach es einfach!',
    'Die Sterne sagen Ja',
    'Ja, ohne Reue',
    'Dein Bauch weiß es: Ja',
    'Schlaf erst drüber',
    'Frag mich morgen nochmal',
    'Red drüber, dann entscheide',
    'Noch liegt dichter Nebel',
    'Diesmal nicht',
    'Die Sterne sagen Nein',
    'Lass das lieber sein',
    'Warte noch ein bisschen',
  ],

  result: {
    heading: 'Die Kugel sagt',
    sharedBadge: '🔗 Geteilte Antwort',
    sharedNote: 'Antwort vom {date}. Das ist die ursprüngliche Antwort aus dem Link. Beim Öffnen wird nicht neu gefragt.',
    noQuestion: 'Keine Frage eingegeben',
    bestOf: 'Best of {n}',
    score: '{yes} {a} : {b} {no}',
    flipYes: 'J',
    flipNo: 'N',
    copyLink: 'Antwort teilen 🔗',
    linkCopied: 'Link mit Frage und Antwort kopiert',
    again: 'Nochmal fragen',
    askOwn: 'Selbst fragen',
    live: 'Antwort: {answer}',
    shareTitle: 'Ja oder Nein Orakel',
    shareText: 'Ich habe das Ja-oder-Nein-Orakel gefragt, und es sagt: {answer} 🎱',
  },

  tally: {
    title: 'Diese Runde',
    total: 'Antworten: {n}',
  },

  history: {
    title: 'Letzte Antworten',
    note: 'Deine letzten 10 Antworten, nur auf diesem Gerät gespeichert.',
    clear: 'Löschen',
  },

  errors: {
    badLink: 'Dieser Antwort-Link ist kaputt oder unvollständig, daher wird nichts angezeigt.',
  },

  og: {
    brand: '🎱 Ja oder Nein Orakel',
    kicker: 'Ja · Nein · Vielleicht · Orakelkugel',
    title: 'Frage stellen, Ja oder Nein bekommen',
    desc: 'Faire Zufallsantworten für jedes kleine Dilemma',
  },

  faq: [
    { q: 'Wie funktioniert das Ja oder Nein Orakel?', a: 'Tipp eine Frage ein, wenn du magst, wähl einen Modus und tipp auf „Frag die Kugel“. Die Antwort wird zuerst gezogen, dann wackelt die Kugel oder die Würfe laufen nacheinander ab. Ja/Nein ist 50 : 50, Ja/Nein/Vielleicht gibt jeder Antwort ein Drittel, die Orakelkugel wählt einen von 12 Sprüchen, und Best of 3 oder 5 wirft, bis eine Seite die Mehrheit hat.' },
    { q: 'Ist die Antwort wirklich zufällig?', a: 'Ja. Jede Antwort kommt aus dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) mit Verwerfungsmethode, sodass keine Antwort auch nur ein bisschen wahrscheinlicher ist. Die Animation zeigt nur ein Ergebnis, das schon feststeht.' },
    { q: 'Muss ich mich an die Antwort halten?', a: 'Nur wenn du willst. Es ist eine Zufallsantwort zum Spaß, kein Rat und keine Vorhersage, also nutze sie nicht für Gesundheit, Geld, Recht oder Sicherheit. Kleiner Trick: Achte darauf, ob du erleichtert oder enttäuscht bist, wenn die Antwort erscheint. Dieses Gefühl ist oft deine echte Antwort.' },
    { q: 'Wird meine Frage gespeichert oder verschickt?', a: 'Deine Frage bleibt in deinem Browser. Deine letzten 10 Antworten werden auf diesem Gerät gespeichert, damit du zurückschauen kannst, und du kannst sie jederzeit löschen. Die Frage verlässt dein Gerät nur, wenn du auf „Antwort teilen“ tippst. Dann steckt sie im Link, den du verschickst.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Ja oder Nein Orakel',
    description: 'Datenschutzerklärung für das Ja oder Nein Orakel: deine Fragen bleiben im Browser, Cookies, Werbung und Statistiken.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Das Ja oder Nein Orakel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.',
    sections: [
      ['1. Welche Daten wir erheben', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Die Fragen, die du eingibst, und die Antworten werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Deine letzten 10 Antworten samt Frage werden im lokalen Speicher deines Browsers auf deinem Gerät gespeichert und können jederzeit mit „Löschen“ entfernt werden. Wenn du auf „Antwort teilen“ tippst, werden Frage und Antwort in den Link selbst geschrieben und nur mit den Menschen geteilt, denen du ihn schickst.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache und letzten Antworten zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browser-Einstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistiken', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, gestellte Fragen, Sternebewertungen). Deine Fragen sind nie Teil dieser Zählungen, und nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 15. Oktober 2026.'],
    ],
    back: '← Zurück zum Ja oder Nein Orakel',
  },
};
