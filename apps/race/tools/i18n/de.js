/* Tierrennen-Auslosung — Deutsch. Gleiche Schlüsselstruktur wie en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Tierrennen-Auslosung – Zufallsrennen entscheidet',
    description: 'Tierrennen-Auslosung online: 2 bis 10 Namen eintragen, jedes Tier läuft auf seiner eigenen Bahn. Der Erste gewinnt oder der Letzte zahlt den Kaffee. Fairer Zufall, kostenlos, ohne Anmeldung.',
    ogTitle: 'Tierrennen-Auslosung 🏁 Wer zahlt den Kaffee?',
    ogDescription: 'Namen eintragen, Tiere an den Start und das Rennen entscheiden lassen. Der Erste gewinnt oder der Letzte zahlt.',
  },
  siteName: 'Tierrennen-Auslosung',
  privacyLink: 'Datenschutzerklärung',

  hero: {
    h1Kicker: 'Tierrennen-Auslosung',
    h1Html: 'Keiner kann sich entscheiden?<br><em>Dann lass die Tiere rennen</em>',
    hook: 'Wer holt den Kaffee? Wer fängt an? Alle auf eine Bahn und los geht das Rennen.',
  },

  ui: {
    modeLabel: 'Wie wird entschieden?',
    modeWin: '🏆 Erster gewinnt',
    modeLose: '☕ Letzter zahlt',
    countLabel: 'Läufer',
    countValue: '{n} Läufer',
    less: 'Weniger Läufer',
    more: 'Mehr Läufer',
    namesLabel: 'Wer rennt mit?',
    namesHint: 'Leere Bahnen behalten ihren Standardnamen. Das Tier ist nur Deko und ändert niemandes Chancen.',
    playerN: 'Spieler {n}',
    nameAria: 'Name für Bahn {n}',
    start: 'Rennen starten 🏁',
    fair: 'Die Reihenfolge wird vor dem Start fair mit crypto-Zufall ausgelost · Namen bleiben auf deinem Gerät',
    trackAria: 'Rennbahn',
    go: 'LOS!',
    bannerWin: '🏆 Wer zuerst ankommt, gewinnt',
    bannerLose: '☕ Wer zuletzt ankommt, zahlt',
    liveStart: 'Drei, zwei, eins, los! Das Rennen läuft.',
  },

  errors: {
    tooFew: 'Es braucht mindestens 2 Läufer.',
    tooMany: 'Auf die Bahn passen höchstens 10 Läufer.',
    badLink: 'Dieser Link ist kaputt, es wurden keine Namen geladen.',
  },

  result: {
    winKicker: 'Und der Sieger ist',
    winTitle: '{name} gewinnt! 🏆',
    winSub: 'Als Erstes über die Ziellinie.',
    loseKicker: 'Als Letztes im Ziel',
    loseTitle: '{name} ist Letzter',
    loseSub: 'Pech gehabt! Diese Runde Kaffee geht auf {name} ☕',
    rankingTitle: 'Zieleinlauf',
    tagWin: 'Sieger',
    tagLose: 'Zahlt ☕',
    edit: 'Namen ändern',
    shareNames: 'Link mit diesen Namen kopieren',
    linkCopied: 'Link kopiert. Er öffnet dieselben Läufer, startklar.',
    sharedNote: 'Läufer aus einem geteilten Link geladen. Bereit, wenn du es bist!',
    history: 'Letzte Rennen',
    historyClear: 'Löschen',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} Läufer',
    liveWin: '{name} gewinnt das Rennen.',
    liveLose: '{name} kommt als Letztes an.',
    again: 'Noch ein Rennen 🏁',
    shareTitle: 'Tierrennen-Auslosung',
    shareText: 'Keiner kann sich entscheiden? Lass die Tiere rennen 🏁',
  },

  og: {
    brand: '🏁 Tierrennen-Auslosung',
    kicker: 'Auslosen per Rennen · 2 bis 10 Läufer',
    title: 'Lass die Tiere um die Wette rennen',
    desc: 'Der Erste gewinnt oder der Letzte zahlt den Kaffee',
  },

  faq: [
    { q: 'Ist das Rennen wirklich zufällig und fair?', a: 'Ja. Sobald du startest, wird die komplette Reihenfolge mit dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues), Verwerfungsmethode und Fisher-Yates-Mischen ausgelost. Jede Reihenfolge hat genau dieselbe Chance; das Rennen auf dem Bildschirm spielt sie nur nach.' },
    { q: 'Ändern das Tier oder die Bahn meine Chancen?', a: 'Nein. Die Tiere werden nur zum Spaß nach Bahn verteilt. Der Hase ist hier nicht schneller als die Schildkröte, und Bahn 1 hat dieselben Chancen wie Bahn 10.' },
    { q: 'Warum ist es am Ende immer so knapp?', a: 'Damit es spannend bleibt. Nach der Auslosung baut die Animation Sprints, Stolperer und ein knappes Finish an der entscheidenden Stelle ein, je nach Modus um Platz eins oder den letzten Platz. An der Reihenfolge ändert das nichts.' },
    { q: 'Kann ich dieselben Läufer an Freunde schicken?', a: 'Ja. „Link mit diesen Namen kopieren“ packt nur die Namen und den Modus in den Link, nie ein Ergebnis. Wer ihn öffnet, startet ein neues Rennen. Deine letzten Ergebnisse bleiben nur auf diesem Gerät.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Tierrennen-Auslosung',
    description: 'Datenschutzerklärung der Tierrennen-Auslosung: Namen und Ergebnisse bleiben im Browser, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Tierrennen-Auslosung (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto und Anmeldung. Die eingegebenen Namen werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Deine letzte Namensliste und deine zehn letzten Ergebnisse können im lokalen Speicher deines Browsers auf deinem Gerät bleiben. Wenn du einen Link mit Namen kopierst, stehen die Namen im Link selbst und gehen nur an die Personen, denen du ihn schickst.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher des Browsers nutzen, um Sprache und Einstellungen zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie gewohnt.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Zähler, die nur tägliche Summen pro Sprache speichern (Seitenaufrufe, gestartete und beendete Rennen, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 22. Oktober 2026.'],
    ],
    back: '← Zurück zur Tierrennen-Auslosung',
  },
};
