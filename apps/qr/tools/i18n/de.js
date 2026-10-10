/* QR-Code Generator — Deutsch (/de/)
 * Der Encoder steckt in qr-core.js; diese Datei enthält alle sichtbaren Texte. Gleiche Schlüsselstruktur wie en.js.
 * Platzhalter {bytes} {v} {n} {ratio} {value} unverändert lassen.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'QR-Code Generator – kostenlos, WLAN, PNG & SVG',
    description: 'Kostenloser QR-Code Generator für Links, Text, WLAN, E-Mail und Telefonnummern. Farben, Fehlerkorrektur und Größe wählen, als PNG oder SVG laden. Läuft im Browser, ohne Anmeldung.',
    ogTitle: 'QR-Code Generator 🔳 kostenlos und privat',
    ogDescription: 'QR-Code für Link, WLAN, E-Mail oder Telefon in Sekunden. Nichts verlässt deinen Browser.',
  },
  siteName: 'QR-Code Generator',
  privacyLink: 'Datenschutz',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'QR-Code Generator',
    h1Html: 'Eintippen, <em>scannen</em>,<br>teilen',
    hook: 'Link, Text, WLAN, E-Mail oder Telefonnummer werden beim Tippen zum QR-Code. Kostenlos, ohne Anmeldung, direkt in deinem Browser erstellt.',
  },

  ui: {
    typeLabel: 'Was soll in den QR-Code?',
    types: { link: 'Link', text: 'Text', wifi: 'WLAN', email: 'E-Mail', phone: 'Telefon' },
    link: { label: 'Webadresse', placeholder: 'beispiel.de/speisekarte' },
    text: { label: 'Dein Text', placeholder: 'Eine Notiz, ein Code, eine kurze Nachricht…' },
    wifi: {
      ssid: 'Netzwerkname (SSID)', ssidPh: 'FRITZ!Box 7590',
      password: 'Passwort', passwordPh: 'WLAN-Schlüssel',
      security: 'Verschlüsselung',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (veraltet)', nopass: 'Ohne Passwort' },
      hidden: 'Verstecktes Netzwerk',
    },
    email: { to: 'E-Mail-Adresse', toPh: 'name@beispiel.de', subject: 'Betreff (optional)', subjectPh: 'Hallo', body: 'Nachricht (optional)', bodyPh: 'Schreib eine Nachricht…' },
    phone: { label: 'Telefonnummer', placeholder: '+49 151 23456789' },

    previewLabel: 'QR-Code-Vorschau',
    previewReady: 'QR-Code-Vorschau, Version {v}',
    emptyPreview: 'Dein QR-Code erscheint hier, sobald du tippst',
    info: '{bytes} Byte · Version {v} · {n}×{n} Module',
    encodes: 'Inhalt: {value}',
    tooLong: 'Zu viel für einen QR-Code. Kürze den Inhalt oder wähle eine niedrigere Fehlerkorrektur (L).',
    encodeFail: 'Dieser QR-Code ließ sich nicht erstellen. Ändere den Text.',
    warnContrast: 'Geringer Kontrast ({ratio}:1). Scanner könnten Probleme haben – am besten dunkler Code auf hellem Grund.',
    warnInverted: 'Heller Code auf dunklem Grund. Manche Scanner-Apps lesen invertierte Codes nicht.',
    warnQuiet: 'Ein schmaler Rand erschwert das Scannen. Lass mindestens 2 Module frei (Standard: 4).',

    downloadPng: 'PNG laden',
    downloadSvg: 'SVG laden',
    copyImage: 'Bild kopieren',
    savedPng: 'PNG gespeichert. Vor dem Drucken einmal mit dem Handy scannen.',
    savedSvg: 'SVG gespeichert. Ideal für den Druck, in jeder Größe gestochen scharf.',
    copied: 'Bild kopiert. Füge es in ein Dokument oder einen Chat ein.',
    copyFail: 'Bilder kopieren ist hier nicht erlaubt. Nutze „PNG laden“.',
    saveFail: 'Speichern fehlgeschlagen. Bitte erneut versuchen.',

    options: '🎨 Farben, Größe & Fehlerkorrektur',
    colors: 'Farben',
    fg: 'Code',
    bg: 'Hintergrund',
    resetColors: 'Zurücksetzen',
    ecc: 'Fehlerkorrektur',
    eccHint: 'Höhere Stufen verkraften Kratzer und Logos, machen den Code aber dichter. M passt fast immer.',
    size: 'Bildgröße',
    margin: 'Ruhezone (Rand)',
    marginHint: 'Der leere Rand um den Code, in Modulen. Standard sind 4.',
    localNote: '🔒 Direkt in deinem Browser erstellt. Deine Eingaben werden nie an einen Server gesendet.',
  },

  result: {
    doneTitle: 'Dein QR-Code ist fertig ✓',
    doneText: 'Teste ihn mit einer Handykamera, bevor du ihn druckst oder teilst. Ändere die Felder oben, um jederzeit einen neuen zu erstellen.',
    again: 'Neuen QR-Code erstellen',
    shareTitle: 'QR-Code Generator – kostenlos und privat',
    shareText: 'QR-Code für Link, WLAN oder Text in Sekunden, direkt im Browser 🔳',
  },

  og: {
    brand: '🔳 QR-Code Generator',
    kicker: 'Link · WLAN · Text · PNG & SVG',
    title: 'QR-Code in Sekunden erstellen',
    desc: 'Kostenlos, privat, direkt im Browser',
  },

  faq: [
    { q: 'Werden meine Eingaben irgendwohin gesendet?', a: 'Nein. Der QR-Code wird per JavaScript in deinem Browser berechnet. Links, WLAN-Passwörter und Nachrichten erreichen nie einen Server und werden auch nicht gespeichert; beim Schließen der Seite sind sie weg.' },
    { q: 'Laufen die QR-Codes ab?', a: 'Nein. Es sind statische QR-Codes: Der Inhalt steckt im Muster selbst, ohne Weiterleitung oder Tracking-Link dazwischen. Ein gedruckter Code funktioniert, solange der Link oder das Netzwerk existiert.' },
    { q: 'Wie funktioniert der WLAN-QR-Code?', a: 'Er speichert Netzwerkname, Passwort und Verschlüsselung im Standardformat WIFI:. Die Kamera von iPhone und Android bietet beim Scannen direkt an, sich zu verbinden – Gäste müssen den langen Schlüssel nicht abtippen.' },
    { q: 'Welche Fehlerkorrektur soll ich wählen?', a: 'M (etwa 15 % Wiederherstellung) passt für die meisten Zwecke. Q oder H lohnen sich bei rauen Oberflächen, Kratzgefahr oder einem Logo in der Mitte. L ergibt den kleinsten Code für lange Inhalte auf Bildschirmen.' },
    { q: 'PNG oder SVG?', a: 'PNG ist ein normales Bild für Websites, Chats und Dokumente. SVG ist eine Vektordatei, die in jeder Größe scharf bleibt – ideal für Plakate, Flyer und die Druckerei.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | QR-Code Generator',
    description: 'Datenschutzerklärung des QR-Code Generators: Eingaben bleiben im Browser, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der QR-Code Generator (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.',
    sections: [
      ['1. Welche Daten wir erheben', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Die eingegebenen Links, Texte, WLAN-Daten, E-Mail-Adressen und Telefonnummern werden ausschließlich in deinem Browser in einen QR-Code umgewandelt. Sie werden weder an unseren Server gesendet noch gespeichert. Einige Informationen können bei der Nutzung automatisch erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage früherer Besuche dieser und anderer Websites auszuliefern. Mehr dazu und Einstellungen unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Zähler, die nur tägliche Summen pro Sprache speichern (Seitenaufrufe, erstellte Codes, Sternebewertungen). Der Inhalt deiner QR-Codes ist nie Teil davon, und nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 11. Oktober 2026.'],
    ],
    back: '← Zurück zum QR-Code Generator',
  },
};
