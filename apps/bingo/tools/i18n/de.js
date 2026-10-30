/* Vorsätze-Bingo — Deutsch (/de). Gleiche Schlüssel wie en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Vorsätze-Bingo 2027 – Ziele-Bingo Karte erstellen',
    description: 'Erstelle kostenlos dein Vorsätze-Bingo für 2027: Ziele in ein 3×3-, 4×4- oder 5×5-Raster schreiben, Farben wählen, als Bild speichern und jedes erreichte Ziel abstempeln.',
    ogTitle: 'Vorsätze-Bingo 🎯 Dein 2027 auf einer Karte',
    ogDescription: 'Mach dir eine Ziele-Bingo-Karte, speichere sie als Bild und stemple ab, was du geschafft hast.',
  },
  siteName: 'Vorsätze-Bingo',
  privacyLink: 'Datenschutz',

  hero: {
    h1Kicker: 'Vorsätze-Bingo',
    h1Html: 'Mach aus deinem neuen Jahr <em>ein Bingo-Spiel</em>',
    hook: 'Schreib deine Ziele in die Felder, speichere eine Karte zum Teilen und stemple jedes ab, sobald du es geschafft hast.',
  },

  ui: {
    sizeLabel: 'Feldgröße',
    startBtn: 'Meine Bingo-Karte machen',
    continueBtn: 'Gespeicherte Karte öffnen',
    editH: 'Schreib deine Ziele',
    titleLabel: 'Titel',
    defaultTitle: 'Mein Bingo {year}',
    freeLabel: 'Freifeld in der Mitte',
    free: 'FREI',
    themeLabel: 'Farben',
    cellLabel: 'Feld {n}',
    cellPh: 'Ziel eingeben',
    next: 'Weiter',
    filled: '{n}/{total} Felder ausgefüllt',
    ideas: '✨ Mit Ideen füllen',
    shuffle: '🔀 Mischen',
    clear: 'Alles löschen',
    done: 'Fertig – Karte erstellen',
    needAll: 'Füll zuerst alle Felder aus oder tippe auf „Mit Ideen füllen“.',
    doneH: 'Deine Bingo-Karte',
    tapHint: 'Tippe auf ein Feld der Karte, wenn du das Ziel erreicht hast.',
    lines: { one: '{n} Bingo-Reihe', other: '{n} Bingo-Reihen' },
    goalsDone: '{n} von {total} Zielen geschafft',
    blackout: 'Volle Karte! Alle Ziele geschafft 🎉',
    download: 'Bild speichern',
    link: 'Link zur Karte kopieren',
    linkCopied: 'Link kopiert. Er öffnet diese Karte mit deinen Stempeln.',
    edit: 'Ziele bearbeiten',
    sharedNote: 'Jemand hat seine Bingo-Karte mit dir geteilt. Mach unten deine eigene.',
    again: 'Neue Karte erstellen',
    localNote: 'Deine Karte wird nur auf diesem Gerät gespeichert. Nichts geht an einen Server.',
    imageAlt: 'Bingo-Karte: {title}',
    saved: 'Bild gespeichert',
    shareTitle: 'Vorsätze-Bingo',
    shareText: 'Mach dein eigenes Vorsätze-Bingo für 2027 🎯',
  },

  errors: {
    badLink: 'Dieser Link konnte nicht gelesen werden. Erstell lieber eine neue Karte.',
  },

  themes: { sunrise: 'Morgenrot', mint: 'Minze', berry: 'Beere', night: 'Nacht', ocean: 'Ozean', paper: 'Papier' },

  ideas: [
    '12 Bücher lesen', '5 km laufen', 'Mehr Wasser trinken', 'Allein verreisen', 'Notgroschen ansparen', '3× pro Woche Sport',
    'Spanisch lernen', 'Vor Mitternacht schlafen', 'Öfter Oma anrufen', 'Neues Hobby testen', 'Tagebuch schreiben', 'Neues Land besuchen',
    'Kleiderschrank ausmisten', 'Eine Alpenwanderung', 'Öfter selbst kochen', 'Weniger Social Media', 'Yoga ausprobieren', 'Auf ein Konzert gehen',
    'Ehrenamtlich helfen', 'Besser schwimmen lernen', 'Brot selbst backen', 'Einen Brief schreiben', 'Ins Museum gehen', 'Zelten gehen',
    'Blut spenden', 'Kräuter anpflanzen', 'Picknick im Park', 'Sonnenaufgang sehen', 'Instrument lernen', 'Dry January schaffen',
    'Zum Check-up gehen', 'Neue Leute kennenlernen', 'Fotobuch gestalten', '5 neue Restaurants testen', 'Alleine ins Kino', '10.000 Schritte am Tag',
    'Tanzkurs machen', 'Schulden abbezahlen', 'Mit dem Rad zur Arbeit', 'Einen Blog starten',
  ],

  og: {
    brand: '🎯 Vorsätze-Bingo',
    kicker: '3×3 · 4×4 · 5×5',
    title: 'Deine Ziele für 2027 auf einer Bingo-Karte',
    desc: 'Aufschreiben, als Bild speichern, abstempeln',
  },

  faq: [
    { q: 'Wie erstelle ich eine Ziele-Bingo-Karte?', a: 'Wähl die Feldgröße, gib der Karte einen Titel und schreib in jedes Feld ein Ziel. Wenn dir nichts einfällt, tippe auf Mit Ideen füllen und pass die Vorschläge an dein Leben an. Mit Fertig bekommst du deine Karte.' },
    { q: 'Kann ich Ziele später im Jahr abhaken?', a: 'Ja. Deine Karte bleibt in diesem Browser gespeichert. Komm jederzeit zurück, tippe auf Gespeicherte Karte öffnen und dann auf das Feld, das du abstempeln willst. Eine volle Reihe, Spalte oder Diagonale zählt als Bingo.' },
    { q: 'Wie poste ich die Karte auf Instagram oder drucke sie aus?', a: 'Mit Bild speichern lädst du eine Karte im Hochformat herunter, passend für Instagram oder als Handy-Hintergrund. Du kannst dasselbe Bild auch auf A4 drucken und an den Kühlschrank hängen.' },
    { q: 'Landet meine Karte über den Link auf einem Server?', a: 'Nein. Die Karte steht im Teil des Links nach dem #, und der wird nie an einen Server geschickt. Nur wer den Link von dir bekommt, sieht deine Ziele und Stempel.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Vorsätze-Bingo',
    description: 'Datenschutzerklärung für Vorsätze-Bingo: Deine Ziele bleiben in deinem Browser. Dazu Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Vorsätze-Bingo (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestdaten.',
    sections: [
      ['1. Welche Daten wir erheben', 'Der Dienst funktioniert ohne Konto und Anmeldung. Titel, Ziele und Stempel, die du eingibst, werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Deine Karte wird im lokalen Speicher deines Browsers auf deinem eigenen Gerät abgelegt, damit du später weiter abstempeln kannst. Wenn du Link zur Karte kopieren nutzt, steht die Karte im Teil des Links nach „#“, den Browser nicht an Server senden; nur Empfänger des Links können sie sehen. Gespeicherte Bilder entstehen auf deinem Gerät.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher des Browsers nutzen, um deine Sprache und Karte zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage früherer Besuche auf dieser und anderen Websites zu zeigen. Mehr dazu und Einstellungen unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Sammelzähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, begonnene und fertige Karten, Sternebewertungen). Deine Ziele fließen nie in diese Zahlen ein, und nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 30. Oktober 2026.'],
    ],
    back: '← Zurück zum Vorsätze-Bingo',
  },
};
