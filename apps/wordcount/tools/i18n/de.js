/* Zeichenzähler — Deutsch (de/)
 * Die Zähl-Logik steckt in wordcount-core.js; diese Datei enthält alle sichtbaren Texte dieser Sprache.
 * Schlüssel mit Html werden als HTML eingefügt (nur <br> und <em>); privacy.sections ebenfalls.
 * {n} {max} {m} {s} {pct} {chars} {words} unverändert lassen.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Zeichenzähler – Wörter zählen online, kostenlos',
    description: 'Kostenloser Zeichenzähler: Zeichen mit und ohne Leerzeichen, Wörter zählen, Sätze, Absätze, Bytes, Lesezeit und ein Ziellimit – live und direkt im Browser.',
    ogTitle: 'Zeichenzähler 📝 Zeichen, Wörter, Bytes live',
    ogDescription: 'Text einfügen und sofort Zeichen, Wörter, Sätze, Bytes und Lesezeit sehen. Nichts wird hochgeladen.',
  },
  siteName: 'Zeichenzähler',
  privacyLink: 'Datenschutz',

  hero: {
    h1Kicker: 'Zeichenzähler',
    h1Html: 'Jedes Zeichen gezählt,<br><em>während du tippst</em>',
    hook: 'Tippe oder füge deinen Text ein. Zeichen, Wörter und Bytes ändern sich live, und ein Balken zeigt, wann du das Limit erreichst.',
  },

  ui: {
    editorLabel: 'Dein Text',
    placeholder: 'Text hier eingeben oder einfügen…',
    bar: { chars: 'Zeichen', noSpaces: 'Ohne Leerz.', words: 'Wörter', bytes: 'Bytes' },
    toolsLabel: 'Textwerkzeuge',
    tools: { copy: 'Kopieren', tidy: 'Leerzeichen bereinigen', join: 'Zeilen verbinden', clear: 'Alles löschen', undo: 'Rückgängig' },
    saved: 'Dein Entwurf wird nur auf diesem Gerät gespeichert, nie hochgeladen.',
    copied: 'Text kopiert',
    copyFail: 'Kopieren hat nicht geklappt. Markiere den Text und kopiere ihn selbst.',
    cleared: 'Text gelöscht. Mit „Rückgängig“ holst du ihn zurück.',
    tidied: 'Doppelte Leerzeichen und Leerzeilen entfernt.',
    joined: 'Zeilenumbrüche entfernt.',
    undone: 'Änderung rückgängig gemacht.',
    nothing: 'Nichts zu ändern.',
    limitLabel: 'Ziellänge',
    limitOff: 'Aus',
    limitChip: '{n}',
    limitCustom: 'Eigene',
    limitCustomPh: 'z. B. 280',
    limitCustomAria: 'Eigene Ziellänge in Zeichen',
    limitSpaces: 'Leerzeichen zählen',
    limitText: '{n} / {max} Zeichen',
    limitLeft: 'noch {n}',
    limitOver: '{n} über dem Limit',
    statsLabel: 'Alle Werte',
    stats: {
      chars: 'Zeichen (mit Leerzeichen)',
      noSpaces: 'Zeichen (ohne Leerzeichen)',
      words: 'Wörter',
      sentences: 'Sätze',
      paragraphs: 'Absätze',
      lines: 'Zeilen',
      reading: 'Lesezeit',
      speaking: 'Sprechzeit',
      bytes: 'Bytes',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: 'Alt 2-Byte' },
    byteHint: {
      utf8: 'Standard-UTF-8: Buchstaben ohne Umlaut und Leerzeichen 1 Byte, ä ö ü ß 2, Chinesisch, Japanisch und Koreanisch 3, Emoji 4. Ein Zeilenumbruch ist 1 Byte.',
      neis: 'UTF-8, aber jeder Zeilenumbruch zählt 2 Bytes (CR + LF), wie in Windows-Textdateien.',
      legacy: 'Alte 2-Byte-Kodierungen (EUC-KR, Shift_JIS, GBK): ASCII 1 Byte, jedes andere Zeichen 2, Zeilenumbruch 2.',
    },
    time: { sec: '{s} Sek.', min: '{m} Min.', minSec: '{m} Min. {s} Sek.' },
    timeNote: 'Zeiten sind Schätzungen: etwa 238 Wörter pro Minute beim stillen Lesen und 150 beim Sprechen.',
    kwLabel: 'Häufigste Wörter',
    kwEmpty: 'Wörter, die du mindestens zweimal benutzt, erscheinen hier. Häufige Wörter wie „und“ oder „die“ werden übersprungen.',
    kwCount: '{n}×',
    finish: 'Auswertung zeigen ✓',
    needText: 'Bitte zuerst Text eingeben oder einfügen.',
    local: 'Wird auf deinem Gerät gezählt. Dein Text wird nirgendwohin gesendet.',
  },

  result: {
    heading: 'Dein Text auf einen Blick',
    limitOk: 'Innerhalb deines Ziels von {max} Zeichen ({pct} %).',
    limitOver: '{n} Zeichen über deinem Ziel von {max}.',
    copySummary: 'Auswertung kopieren',
    summaryCopied: 'Auswertung kopiert',
    summaryTitle: 'Auswertung Zeichenzähler',
    again: 'Neuen Text zählen',
    live: 'Auswertung fertig: {chars} Zeichen, {words} Wörter.',
    shareTitle: 'Zeichenzähler',
    shareText: 'Kostenloser Zeichen- und Wortzähler mit Bytes und Lesezeit. Dein Text bleibt auf deinem Gerät 📝',
  },

  og: {
    brand: '📝 Zeichenzähler',
    kicker: 'Zeichen · Wörter · Bytes · Lesezeit',
    title: 'Zeichen und Wörter live zählen',
    desc: 'Kostenlos, und dein Text bleibt auf deinem Gerät',
  },

  faq: [
    { q: 'Werden Leerzeichen und Zeilenumbrüche mitgezählt?', a: 'Beide Werte werden angezeigt. „Mit Leerzeichen“ zählt auch Leerzeichen und Zeilenumbrüche (je 1). „Ohne Leerzeichen“ lässt alle Leerzeichen, Tabs und Umbrüche weg. Mit dem Schalter „Leerzeichen zählen“ wählst du, welchem Wert der Zielbalken folgt.' },
    { q: 'Warum weicht das Ergebnis von Word oder Google Docs ab?', a: 'Jedes Programm zählt etwas anders. Manche werten ein Wort mit Bindestrich als zwei Wörter oder ein Emoji als zwei Zeichen, und Word lässt Zeilenumbrüche weg. Hier zählt ein Emoji oder ein Umlaut als 1 Zeichen, Bindestrich-Wörter als 1 Wort und ein Zeilenumbruch als 1.' },
    { q: 'Wie werden Bytes gezählt?', a: 'Wähle die Regel des Formulars, das du ausfüllst. UTF-8 nutzen die meisten Websites. UTF-8 + CRLF zählt jeden Zeilenumbruch als 2 Bytes. Alt 2-Byte zählt ASCII als 1 Byte und jedes andere Zeichen als 2, wie ältere asiatische Systeme.' },
    { q: 'Wird mein Text gespeichert oder hochgeladen?', a: 'Er verlässt nie dein Gerät. Der Entwurf liegt im lokalen Speicher dieses Browsers, damit er ein Neuladen übersteht, und „Alles löschen“ entfernt ihn. In der Adresse oder in geteilten Links steht dein Text nie.' },
  ],

  privacy: {
    title: 'Datenschutz | Zeichenzähler',
    description: 'Datenschutzerklärung des Zeichenzählers: Dein Text wird nur im Browser gezählt und gespeichert; Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Zeichenzähler (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Daten.',
    sections: [
      ['1. Welche Daten wir erheben', 'Der Dienst funktioniert ohne Konto und ohne Anmeldung. Der Text, den du tippst oder einfügst, wird nur in deinem Browser gezählt. Er wird nie an unseren oder einen anderen Server gesendet und nie in die Seitenadresse oder in Teilen-Links geschrieben. Damit dein Entwurf ein Neuladen übersteht, werden Text und Einstellungen nur im lokalen Speicher des Browsers auf diesem Gerät abgelegt; „Alles löschen“ entfernt den gespeicherten Entwurf, ebenso das Löschen der Websitedaten im Browser.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um Sprache und Einstellungen zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir möglicherweise Google Analytics (GA4) und eigene zusammengefasste Zähler, die nur Tagessummen je Sprache speichern (Seitenaufrufe, Nutzungen, Sternebewertungen). Diese Zähler enthalten nie deinen Text oder seine Werte und identifizieren dich nicht.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 15. Oktober 2026.'],
    ],
    back: '← Zurück zum Zeichenzähler',
  },
};
