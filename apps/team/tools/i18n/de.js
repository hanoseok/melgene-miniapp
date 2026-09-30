/* Zufällige Teams erstellen — Deutsch (/de/)
 * Gleiche Schlüsselstruktur wie en.js. Lange Wörter: hyphens auto.
 */
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
    title: 'Zufällige Teams erstellen – Gruppen einteilen',
    description: 'Zufällige Teams erstellen: Namen einfügen, Anzahl der Teams oder Personen pro Team wählen und fair in ausgeglichene Teams einteilen. Kapitäne getrennt, Ergebnis per Link teilen. Kostenlos, ohne Anmeldung.',
    ogTitle: 'Zufällige Teams erstellen 🎲 Gruppen fair einteilen',
    ogDescription: 'Namen einfügen, mischen – in Sekunden faire Teams. Und das genaue Ergebnis per Link teilen.',
  },
  siteName: 'Zufällige Teams',
  privacyLink: 'Datenschutzerklärung',

  start: {
    badge: '🎲 Schluss mit Teamwählen',
    h1Kicker: 'Zufällige Teams erstellen',
    h1Html: 'Wer landet<br>in <em>deinem Team</em>?',
    hook: 'Namen einfügen, auf Mischen tippen und der Zufall teilt die Gruppe auf. Ohne Diskussion.',
    facts: 'Bis zu 60 Namen · Kapitäne getrennt · Ergebnis teilen',
    start: 'Teams erstellen →',
  },

  input: {
    title: 'Wer spielt mit?',
    namesLabel: 'Namen',
    namesHint: 'Einer pro Zeile oder durch Kommas getrennt. Setz * vor einen Kapitän.',
    placeholder: 'Mia\nLeon\n*Emma\nPaul, Hannah, Felix',
    sample: 'Beispielnamen',
    clear: 'Leeren',
    tooMany: 'Nur die ersten {max} Namen werden verwendet.',
    needMore: 'Mindestens 2 Namen eingeben.',
    modeLabel: 'Aufteilen nach',
    modeTeams: 'Anzahl Teams',
    modeSize: 'Personen pro Team',
    minus: 'Weniger',
    plus: 'Mehr',
    previewEq: '{k} Teams × {size}',
    previewRange: '{k} Teams × {min}–{max}',
    leaders: 'Kapitäne (*) in verschiedene Teams',
    leadersCount: 'Markierte Kapitäne: {n}',
    leadersNone: 'Setz * vor einen Namen, um einen Kapitän zu markieren',
    shuffle: 'Teams auslosen 🎲',
  },

  result: {
    shuffling: 'Wird gemischt …',
    title: 'Eure Teams',
    sharedTitle: 'Geteilte Teams',
    sharedNote: 'Jemand hat diese Teams mit dir geteilt.',
    captain: 'Kapitän',
    rename: 'Neue Teamnamen',
    again: 'Neu mischen',
    edit: 'Namen bearbeiten',
    copy: 'Als Text kopieren',
    copied: 'Teams kopiert!',
    makeOwn: 'Eigene Teams erstellen',
    badShare: 'Der Link funktioniert nicht – erstell hier deine eigenen Teams.',
    shareTitle: 'Zufällige Teams erstellen – Gruppen einteilen',
    shareText: 'Hier sind unsere {k} zufälligen Teams 🎲',
  },

  people: { one: '{n} Person', other: '{n} Personen' },

  teams: {
    tiger: 'Die Tiger',
    eagle: 'Die Adler',
    shark: 'Die Haie',
    wolf: 'Die Wölfe',
    fox: 'Die Füchse',
    panda: 'Die Pandas',
    lion: 'Die Löwen',
    owl: 'Die Eulen',
    dolphin: 'Die Delfine',
    bear: 'Die Bären',
    rabbit: 'Die Hasen',
    penguin: 'Die Pinguine',
    dragon: 'Die Drachen',
    unicorn: 'Die Einhörner',
    octopus: 'Die Kraken',
    frog: 'Die Frösche',
    koala: 'Die Koalas',
    parrot: 'Die Papageien',
    bee: 'Die Bienen',
    turtle: 'Die Schildkröten',
  },

  sample: ['Mia', 'Leon', 'Emma', 'Paul', 'Hannah', 'Felix', 'Lena', 'Jonas', 'Sophie', 'Lukas', 'Marie', 'Finn'],

  og: {
    brand: '🎲 Zufällige Teams',
    kicker: 'Namen rein · Teams raus',
    title: 'Wer landet in deinem Team?',
    desc: 'Faire Zufallsteams in Sekunden · Kapitäne getrennt · Ergebnis teilen',
  },

  faq: [
    { q: 'Wie teile ich Namen in Teams ein?', a: 'Gib die Namen ein oder füge sie ein, einen pro Zeile oder durch Kommas getrennt (bis zu 60). Wähle die Anzahl der Teams oder die Personen pro Team und tippe auf Mischen. Die Teams unterscheiden sich nie um mehr als eine Person.' },
    { q: 'Ist das Auslosen wirklich fair?', a: 'Ja. Die Namen werden mit dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) und einem Fisher-Yates-Shuffle gemischt, so dass jede mögliche Aufteilung genau gleich wahrscheinlich ist. Weder wir noch sonst jemand kann das Ergebnis beeinflussen.' },
    { q: 'Wie funktionieren Kapitäne?', a: 'Setz * vor einen Namen und schalte „Kapitäne in verschiedene Teams“ ein. Zuerst wird jedem Team ein Kapitän zugeteilt, danach werden alle anderen dazugemischt. Gibt es mehr Kapitäne als Teams, bekommen manche Teams zwei.' },
    { q: 'Was steckt im geteilten Link?', a: 'Der Link selbst enthält die Namen und die genauen Teams, deshalb sieht jeder, der ihn öffnet, dasselbe Ergebnis. Auf unserem Server wird nichts gespeichert. Deine letzte Liste bleibt nur in diesem Browser, damit du sie nicht neu tippen musst.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Zufällige Teams',
    description: 'Datenschutzerklärung für „Zufällige Teams erstellen“: Namen bleiben im Browser, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: '„Zufällige Teams erstellen“ (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen minimalen Informationen.',
    sections: [
      ['1. Welche Daten wir erfassen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Die eingegebenen Namen werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Wenn du ein Ergebnis teilst, stehen die Namen und Teams im Link selbst – jeder mit dem Link kann sie sehen. Bei der Nutzung können automatisch einige Informationen erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache und deine letzte Namensliste zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir ggf. Google Analytics (GA4) und eigene Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, Mischvorgänge, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 1. Oktober 2026.'],
    ],
    back: '← Zurück zu „Zufällige Teams“',
  },
};
