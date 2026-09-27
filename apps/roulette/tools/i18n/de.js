/* Glücksrad — Deutsch (/de/)
 * Suchbegriff: „Glücksrad“. title = „{Suchbegriff} | {Marke}“.
 * Gleiche Schlüssel wie die anderen Sprachdateien. ui.presets braucht in jeder Sprache dieselben Schlüssel
 * und dieselbe Anzahl an Einträgen (wird von check-roulette.js geprüft). Max. 24 Zeichen pro Option.
 * FAQ erscheint nur im gemeinsamen Endbildschirm (unter den Teilen-Buttons) — nie auf dem Startbildschirm.
 */
module.exports = {
  siteName: 'Glücksrad',
  meta: {
    title: 'Glücksrad | Melgene Apps',
    description: 'Kostenloses Online-Glücksrad. Optionen eintragen und drehen — ohne Download, ohne Anmeldung, in einer Minute fertig. Mit Gewichtung und Link zum Teilen.',
    ogTitle: 'Glücksrad — Optionen eintragen, drehen, fertig',
    ogDescription: 'Mittagessen, Aufgaben, Mutproben. Ein faires Online-Glücksrad direkt im Browser.',
  },
  // Schriftbild für Schild, Portal und Ergebnis (fontCss lädt sie, displayFont benennt sie)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Glücksrad',
    description: 'Ein kostenloses Online-Glücksrad für Mittagessen, Aufgaben, Mutproben oder eine faire Auslosung. Füge 2 bis 16 Optionen mit optionaler Gewichtung hinzu, dreh das Rad — der Gewinner wird fair per kryptografischem Zufall bestimmt. Teile einen Link zum exakt gleichen Rad.',
  },
  hero: {
    h1: 'Glücksrad',
    tagline: 'Unentschlossen? Aufschreiben und drehen.',
  },
  wheel: {
    spin: 'Drehen',
    spinAria: 'Glücksrad drehen',
    share: 'Teilen',
    fair: 'Der Gewinner wird in dem Moment ausgelost, in dem du auf Drehen drückst. Das Rad wird nur langsamer, um genau dort zu landen.',
  },
  history: {
    title: 'Verlauf',
    clear: 'Verlauf löschen',
  },
  editor: {
    title: 'Optionen',
    presetsLabel: 'Schnellstart',
    presets: { lunch: '🍕 Mittagessen', dare: '🎤 Mutproben', duty: '🙋 Namen', yesno: '👍 Ja/Nein', numbers: '🔢 1–10' },
    add: 'Option hinzufügen',
    shuffle: 'Mischen',
    weighted: 'Gewichtete Chancen',
    weightedHint: 'Höhere Zahlen bekommen ein breiteres Segment und kommen öfter dran.',
    themeLabel: 'Farben',
  },
  result: {
    kicker: 'Das Rad hat gewählt',
    again: 'Nochmal drehen',
    removeAgain: 'Entfernen & nochmal drehen',
    close: 'Schließen',
  },
  // Erscheint nur im gemeinsamen Endbildschirm (unter den Teilen-Buttons) — nicht auf dem Startbildschirm
  faq: [
    { q: 'Kann das Ergebnis manipuliert werden?', a: 'Nein. Der Gewinner wird in dem Moment, in dem du auf Drehen drückst, per kryptografischem Zufall gezogen, und das Rad stoppt einfach dort. Zeitpunkt des Tippens und die Animation haben keinen Einfluss auf das Ergebnis.' },
    { q: 'Wie funktioniert die Gewichtung?', a: 'Die Chance jeder Option ist ihr Gewicht (1–5) geteilt durch die Summe aller Gewichte. Bei den Gewichten 2, 1 und 1 gewinnt die erste Option 50 % der Zeit, die anderen je 25 %.' },
    { q: 'Wie viele Optionen kann ich hinzufügen?', a: 'Von 2 bis 16. Jede Option darf bis zu 24 Zeichen haben; lange Namen werden bei einem schmalen Segment verkleinert oder mit Auslassungspunkten gekürzt.' },
    { q: 'Kann ich mein Rad an jemanden schicken?', a: 'Ja. Teilen erstellt einen Link, in dem deine Optionen, Gewichte und Farbthema in der Adresse codiert sind — es wird nichts auf einem Server gespeichert.' },
    { q: 'Muss ich eine App installieren oder mich anmelden?', a: 'Nein. Das Glücksrad läuft direkt im Browser auf Handy, Tablet oder PC – ohne Download und ohne Konto.' },
  ],
  privacyLink: 'Datenschutzerklärung',

  ui: {
    itemN: 'Option {n}',
    wheelAria: 'Rad mit {n} Segmenten: {list}',
    ariaItem: 'Name von Option {n}',
    ariaHandle: 'Option {n} neu anordnen (Pfeiltasten hoch/runter)',
    ariaDelete: 'Option {n} löschen',
    ariaWeight: 'Option {n}, Gewicht {w}, zum Ändern drücken',
    count: '{n}/{max}',
    maxReached: 'Du kannst bis zu {max} Optionen hinzufügen',
    minReached: 'Das Rad braucht mindestens 2 Optionen',
    soundOn: 'Ton an',
    soundOff: 'Ton aus',
    announce: 'Ergebnis: {label}',
    historyItem: 'Drehung {n}',
    restore: '{n} entfernte wieder einsetzen',
    loadedShare: 'Geteiltes Rad geladen',
    badShare: 'Der Link ließ sich nicht öffnen', // Toast ist einzeilig (nowrap) — kurz halten
    shareTitle: 'Dreh mein Glücksrad',
    shareText: 'Ich hab ein Glücksrad gemacht — drehst du mal?',
    themes: { candy: 'Bonbon', macaron: 'Macaron', circus: 'Zirkus', jewel: 'Juwel' },
    presets: {
      lunch: ['Pizza', 'Döner', 'Currywurst', 'Sushi', 'Burger', 'Salat', 'Pasta', 'Falafel'],
      dare: ['Eine Strophe singen', '10 Liegestütze', 'Akzent nachmachen', 'Kaffee spendieren', 'Einen Witz erzählen', '15 Sekunden tanzen', 'Wie ein Pirat reden', 'Eine Grimasse ziehen'],
      duty: ['Mia', 'Ben', 'Emma', 'Finn', 'Lea', 'Paul'],
      yesno: ['Ja', 'Nein'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Kostenlos online',
    title: 'Glücksrad',
    tag: 'Mittagessen, Namen, Mutproben – eintragen und drehen',
  },

  privacy: {
    title: 'Datenschutzerklärung | Glücksrad',
    description: 'Datenschutzerklärung für Glücksrad — wie deine Optionen gespeichert werden, Cookies, Werbung und Analyse.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Glücksrad (der „Dienst") respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.',
    sections: [
      ['1. Informationen, die wir erfassen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Deine Radoptionen, Gewichte, Farbthema und dein Drehverlauf werden nie an einen Server gesendet — sie bleiben in deinem Browser (lokaler Speicher und URL). Manche Informationen können automatisch erfasst werden, während du den Dienst nutzt, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung des Dienstes zu verstehen. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann möglicherweise nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Werbung basierend auf deinen früheren Besuchen anzuzeigen. Mehr erfährst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>, wo du auch deine Einstellungen ändern kannst.'],
      ['4. Analyse', 'Um den Dienst zu verbessern, nutzen wir möglicherweise Google Analytics (GA4) sowie eigene aggregierte Zähler, die nur tägliche Gesamtzahlen pro Sprache speichern (Seitenaufrufe, Drehungen, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Geteilte Links', 'Mit „Teilen" erstellte Links enthalten die von dir eingegebenen Optionsnamen, Gewichte und das Farbthema, codiert in der URL. Bitte gib keine personenbezogenen Informationen ein.'],
      ['6. Kontakt', 'Bei Fragen zu dieser Richtlinie wende dich bitte an den Betreiber des Dienstes.'],
      ['7. Gültigkeitsdatum', 'Diese Richtlinie gilt ab dem 27. September 2026.'],
    ],
    back: '← Zurück zum Glücksrad',
  },
};
