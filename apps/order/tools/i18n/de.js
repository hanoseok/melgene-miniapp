/* Reihenfolge auslosen — Deutsch (/de/). Schlüsselstruktur wie en.js (siehe dortigen Kopf). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Reihenfolge auslosen – zufällige Reihenfolge online',
    description: 'Kostenlos die Reihenfolge auslosen: Namen einfügen oder Zahlen 1 bis N nehmen und eine faire Reihenfolge für Referate, Spielzüge oder den Putzplan bekommen. Ohne Anmeldung.',
    ogTitle: 'Reihenfolge auslosen 🔢 Wer fängt an?',
    ogDescription: 'Eine Namensliste fair durchmischen und die Reihenfolge Karte für Karte aufdecken.',
  },
  siteName: 'Reihenfolge auslosen',
  privacyLink: 'Datenschutz',

  hero: {
    h1Kicker: 'Reihenfolge auslosen',
    h1Html: 'Wer ist <em>zuerst dran?</em>',
    hook: 'Namen eintippen, einmal mischen – und die ganze Reihenfolge vom Ersten bis zum Letzten steht.',
  },

  ui: {
    presetLabel: 'Wofür ist die Reihenfolge?',
    modeLabel: 'Namen oder Zahlen',
    modeNames: 'Namen',
    modeNumbers: 'Zahlen 1–N',
    namesLabel: 'Namen, einer pro Zeile',
    namesPh: 'Mia\nBen\nEmma\nPaul',
    namesHint: 'Liste aus WhatsApp oder Excel einfügen. Kommas trennen auch.',
    namesCount: '{n} / {max}',
    clear: 'Leeren',
    numbersLabel: 'Wie viele?',
    numbersDec: 'Eins weniger',
    numbersInc: 'Eins mehr',
    numbersHint: 'Mischt die Zahlen 1 bis N – praktisch für Platz- oder Losnummern.',
    numberItem: 'Nr. {n}',
    fromLabel: 'Aufdecken',
    fromFirst: 'Ab Platz 1',
    fromLast: 'Ab dem Letzten',
    shuffle: 'Reihenfolge auslosen 🔀',
    fair: 'Einmal mit Krypto-Zufall gemischt · Namen bleiben im Browser',
  },

  presets: [
    { label: 'Einfach so', heading: 'Die ausgeloste Reihenfolge' },
    { label: 'Referate', heading: 'Reihenfolge der Referate' },
    { label: 'Spielzüge', heading: 'Spielreihenfolge' },
    { label: 'Putzplan', heading: 'Putzplan' },
  ],

  errors: {
    namesFew: 'Mindestens 2 Namen eintragen, einen pro Zeile – oder auf Zahlen wechseln.',
    namesMany: 'Höchstens 40 Namen.',
    numbersRange: 'Wähle eine Zahl zwischen 2 und 40.',
    badLink: 'Dieser Link ist kaputt oder unvollständig, daher wird nichts angezeigt.',
  },

  reveal: {
    progress: '{k} von {n} aufgedeckt',
    tapHint: 'Tippe auf die Karte oder „Weiter“. Die Reihenfolge stand schon beim Mischen fest.',
    first: 'Aufdecken ▶',
    next: 'Weiter ▶',
    done: 'Ganze Reihenfolge',
    auto: 'Automatisch',
    autoStop: 'Pause',
    showAll: 'Alle zeigen',
    soFar: 'Bisher aufgedeckt',
    live: 'Platz {k}: {who}',
  },

  result: {
    sharedBadge: '🔢 Geteilte Reihenfolge',
    sharedNote: 'Das ist die im Link gespeicherte Reihenfolge. Sie wurde nicht neu gemischt.',
    summary: '{n} insgesamt, vom Ersten bis zum Letzten',
    copy: 'Als Text kopieren',
    copied: 'Reihenfolge kopiert',
    copyLink: 'Link kopieren',
    linkCopied: 'Link kopiert. Wer ihn öffnet, sieht genau diese Reihenfolge.',
    linkTooLong: 'Die Liste ist zu lang für einen Link, daher wurde nur die Seitenadresse kopiert.',
    edit: 'Namen ändern',
    again: 'Neu mischen 🔀',
    againShared: 'Neu mischen / selbst losen 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Reihenfolge auslosen',
    shareText: 'Unsere ausgeloste Reihenfolge 🔢',
  },

  og: {
    brand: '🔢 Reihenfolge auslosen',
    kicker: 'Referate · Spiele · Putzplan',
    title: 'Wer fängt an? Fair auslosen',
    desc: 'Namen rein, Reihenfolge raus – in Sekunden',
  },

  faq: [
    { q: 'Ist die Auslosung wirklich fair?', a: 'Ja. Beim Mischen nutzt der Browser seinen kryptografischen Zufallsgenerator (crypto.getRandomValues) mit Verwerfungsmethode und Fisher-Yates-Mischung, sodass jede mögliche Reihenfolge genau gleich wahrscheinlich ist. Die Reihenfolge steht in diesem Moment fest, das Aufdecken zeigt sie nur.' },
    { q: 'Was ist der Unterschied zu einer Gewinner-Auslosung?', a: 'Eine Gewinner-Auslosung endet nach einem Namen. Hier bekommt jede Person einen Platz vom Ersten bis zum Letzten – genau richtig für Referate, Spielzüge, Redelisten oder den Putzplan.' },
    { q: 'Ab Platz 1 oder ab dem Letzten aufdecken?', a: 'Ab Platz 1 geht es schneller, wenn sich alle vorbereiten müssen. Ab dem Letzten ist spannender, weil Platz 1 erst ganz am Ende kommt.' },
    { q: 'Werden die Namen gespeichert oder verschickt?', a: 'Nein. Die Namen bleiben in deinem Browser. Nur deine letzte Liste wird auf diesem Gerät gespeichert, damit du sie wieder nutzen kannst, und ein geteilter Link bringt die Reihenfolge nur zu den Leuten, denen du ihn schickst.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Reihenfolge auslosen',
    description: 'Datenschutzerklärung für „Reihenfolge auslosen“: Namen und Reihenfolgen bleiben im Browser, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: '„Reihenfolge auslosen“ (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.',
    sections: [
      ['1. Welche Daten wir erfassen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Die eingegebenen Namen oder Zahlen und die ausgeloste Reihenfolge werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Deine letzte Liste wird im lokalen Speicher deines Browsers auf deinem Gerät abgelegt. Wenn du einen Link kopierst, steht die Reihenfolge im Link selbst und wird nur mit den Personen geteilt, denen du ihn schickst.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Browserspeicher nutzen, um Sprache und Einstellungen zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Anzeigen über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, gestartete und beendete Runden). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 15. November 2026.'],
    ],
    back: '← Zurück zu „Reihenfolge auslosen“',
  },
};
