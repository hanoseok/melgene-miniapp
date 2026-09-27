/* Kürbis schnitzen online – Halloween-Kürbis — Deutsch (/de/)
 * Gleiche Schlüsselstruktur wie en.js. Zeichnungen und Anzahl der Teile stehen in pumpkin-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Kürbis schnitzen online – Halloween-Kürbis',
    description: 'Kürbis schnitzen online: Augen, Nase und Mund wählen, Kerze anzünden und deinen eigenen Halloween-Kürbis gestalten. Kostenlos, ohne Download, in einer Minute.',
    ogTitle: 'Kürbis schnitzen online 🎃 Halloween-Kürbis',
    ogDescription: 'Schnitz in einer Minute deinen eigenen Halloween-Kürbis, zünde die Kerze an und schick ihn deinen Freunden.',
  },
  siteName: 'Halloween-Kürbis',
  privacyLink: 'Datenschutz',

  start: {
    badge: '🎃 Halloween-Special',
    h1Kicker: 'Kürbis schnitzen online',
    h1Html: 'Schnitz deinen<br><em>Halloween-Kürbis</em>',
    hook: 'Kein Messer, keine Sauerei. Gib deinem Kürbis ein Gesicht, zünde die Kerze an und sieh zu, wie er leuchtet.',
    start: 'Los geht’s →',
  },

  editor: {
    title: 'Schnitz deinen Kürbis',
    hint: 'Tipp: Kürbis antippen und die nächste Variante sehen',
    previewAria: 'Dein Kürbis. Antippen für die nächste Variante',
    tabsAria: 'Kürbis-Teile',
    tabs: { shape: 'Form', color: 'Farbe', eyes: 'Augen', nose: 'Nase', mouth: 'Mund', stem: 'Stiel', extra: 'Extras' },
    optionAria: '{part} {n}',
    glow: 'Kerze',
    night: 'Nacht',
    nameLabel: 'Name für deinen Kürbis (optional)',
    namePlaceholder: 'z. B. Grinse-Klaus',
    random: 'Zufällig',
    done: 'Fertig!',
  },

  result: {
    eyebrowMine: 'Dein Halloween-Kürbis ist fertig!',
    eyebrowFriend: 'Diesen Kürbis hat jemand extra für dich geschnitzt',
    untitled: 'Mein Kürbis',
    imageAlt: 'Halloween-Kürbis: {name}',
    save: 'Bild speichern',
    saving: 'Bild wird erstellt …',
    saved: 'Bild gespeichert!',
    saveFail: 'Das Bild konnte nicht erstellt werden. Mach lieber einen Screenshot.',
    edit: 'Weiter bearbeiten',
    retry: 'Noch einen Kürbis schnitzen',
    retryFriend: 'Eigenen Kürbis schnitzen',
    shareTitle: 'Kürbis schnitzen online – Halloween-Kürbis',
    shareText: 'Ich habe einen Halloween-Kürbis namens „{name}“ geschnitzt 🎃 Schnitz deinen eigenen!',
    shareTextNoName: 'Ich habe meinen eigenen Halloween-Kürbis geschnitzt 🎃 Schnitz deinen auch!',
    fileName: 'mein-kuerbis',
  },

  og: {
    brand: '🎃 Halloween-Kürbis',
    defaultKicker: 'Kürbis schnitzen online',
    defaultTitle: 'Schnitz deinen Halloween-Kürbis',
    defaultDesc: 'Augen, Nase, Mund und Kerzenlicht · kostenlos im Browser',
  },

  faq: [
    { q: 'Wie schnitze ich meinen Kürbis?', a: 'Wähl einen Reiter (Form, Farbe, Augen, Nase, Mund, Stiel oder Extras) und tipp eine Variante an. Tippst du auf den Kürbis selbst, kommt die nächste Variante, und „Zufällig“ mischt alles durch. Gefällt er dir, tipp auf „Fertig!“.' },
    { q: 'Kann ich meinen Kürbis als Bild speichern?', a: 'Ja. „Bild speichern“ macht aus deinem Kürbis ein PNG. Auf dem Handy kannst du es über das Teilen-Menü in deinen Fotos ablegen, am Computer wird es heruntergeladen.' },
    { q: 'Wie funktioniert der Link zum Teilen?', a: 'Dein ganzer Kürbis samt Name steckt im Link selbst. Wer ihn öffnet, sieht genau denselben Kürbis und kann danach einen eigenen schnitzen. Auf unseren Servern wird nichts gespeichert.' },
    { q: 'Was machen die Schalter „Kerze“ und „Nacht“?', a: 'Die Kerze lässt die geschnitzten Stellen warm leuchten, wie eine echte Kerze im Kürbis. Ausgeschaltet sieht er aus wie bei Tageslicht. „Nacht“ wechselt den Hintergrund zwischen Sternenhimmel und hellem Hintergrund.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Halloween-Kürbis',
    description: 'Datenschutzerklärung für Halloween-Kürbis: wie dein Kürbis verarbeitet wird, Cookies, Werbung und anonyme Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Halloween-Kürbis (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.',
    sections: [
      ['1. Informationen, die wir erfassen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Dein Kürbis und sein Name werden nie an einen Server gesendet – sie bleiben in deinem Browser (und beim Teilen in der URL). Manche Informationen können automatisch erfasst werden, während du den Dienst nutzt, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung des Dienstes zu verstehen. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann möglicherweise nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Werbung basierend auf deinen früheren Besuchen anzuzeigen. Mehr erfährst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>, wo du auch deine Einstellungen ändern kannst.'],
      ['4. Statistik', 'Um den Dienst zu verbessern, nutzen wir möglicherweise Google Analytics (GA4) sowie eigene aggregierte Zähler, die nur tägliche Gesamtzahlen pro Sprache speichern (Seitenaufrufe, fertige Kürbisse, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Geteilte Links und Bilder', 'Mit „Teilen“ erstellte Links enthalten deinen Kürbis und den eingegebenen Namen, codiert in der URL. Gespeicherte Bilder werden in deinem Browser erstellt. Bitte gib als Namen keine personenbezogenen Informationen ein.'],
      ['6. Kontakt', 'Bei Fragen zu dieser Richtlinie wende dich bitte an den Betreiber des Dienstes.'],
      ['7. Gültigkeitsdatum', 'Diese Richtlinie gilt ab dem 28. September 2026.'],
    ],
    back: '← Zurück zum Halloween-Kürbis',
  },
};
