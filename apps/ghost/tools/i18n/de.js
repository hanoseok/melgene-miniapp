/* Gespenst erstellen — Deutsch (/de/)
 * Gleiche Schlüsselstruktur wie en.js. Zeichnungen und Anzahl der Teile stehen in ghost-core.js.
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
    title: 'Gespenst erstellen – süßes Halloween-Gespenst',
    description: 'Gespenst erstellen online: Form, Augen, Mund und Hut aussuchen und dein eigenes süßes Halloween-Gespenst gestalten. Kostenlos, ohne Download, in einer Minute fertig.',
    ogTitle: 'Gespenst erstellen 👻 dein Halloween-Gespenst',
    ogDescription: 'In einer Minute dein eigenes süßes Gespenst – es schwebt, und du kannst es Freunden schicken.',
  },
  siteName: 'Gespenst erstellen',
  privacyLink: 'Datenschutz',

  start: {
    badge: '👻 Halloween-Special',
    h1Kicker: 'Gespenst erstellen',
    h1Html: 'Dein eigenes<br><em>Gespenst</em>',
    hook: 'Unter dem Laken versteckt sich jemand Schüchternes. Gib ihm ein Gesicht und ein bisschen Charakter – und schau zu, wie es schwebt.',
    start: 'Gespenst erstellen →',
  },

  editor: {
    title: 'Gestalte dein Gespenst',
    hint: 'Tipp: Tippe auf das Gespenst für die nächste Variante',
    previewAria: 'Dein Gespenst. Tippen für die nächste Variante',
    tabsAria: 'Teile des Gespensts',
    tabs: { body: 'Körper', color: 'Farbe', eyes: 'Augen', mouth: 'Mund', cheeks: 'Wangen', hat: 'Hut', item: 'In der Hand', bg: 'Szene' },
    optionAria: '{part} {n}',
    nameLabel: 'Name deines Gespensts (optional)',
    namePlaceholder: 'z. B. Kleiner Buh',
    random: 'Zufällig',
    done: 'Fertig!',
  },

  result: {
    eyebrowMine: 'Dein Gespenst ist bereit zum Spuken!',
    eyebrowFriend: 'Jemand hat dieses Gespenst für dich gemacht',
    untitled: 'Mein kleines Gespenst',
    imageAlt: 'Gespenst: {name}',
    save: 'Bild speichern',
    saving: 'Bild wird erstellt …',
    saved: 'Bild gespeichert!',
    saveFail: 'Das Bild konnte nicht erstellt werden. Mach lieber einen Screenshot.',
    edit: 'Weiter gestalten',
    retry: 'Noch ein Gespenst',
    retryFriend: 'Eigenes Gespenst erstellen',
    shareTitle: 'Gespenst erstellen – süßes Halloween-Gespenst',
    shareText: 'Das ist mein Gespenst „{name}“ 👻 Mach dir auch eins!',
    shareTextNoName: 'Ich habe mein eigenes Gespenst gemacht 👻 Mach dir auch eins!',
    fileName: 'mein-gespenst',
  },

  og: {
    brand: '👻 Gespenst erstellen',
    defaultKicker: 'Halloween-Gespenst',
    defaultTitle: 'Erstelle dein eigenes Gespenst',
    defaultDesc: 'Gesichter, Hüte und kleine Freunde · kostenlos',
  },

  faq: [
    { q: 'Wie erstelle ich mein Gespenst?', a: 'Wähle oben im Editor einen Reiter und tippe auf eine Variante, die dir gefällt. Ein Tipp auf das Gespenst selbst springt zur nächsten Variante in diesem Reiter, und „Zufällig“ mischt alles durch. Wenn es dir gefällt, tippe auf „Fertig!“.' },
    { q: 'Kann ich mein Gespenst als Bild speichern?', a: 'Ja. „Bild speichern“ macht aus deinem Gespenst ein PNG. Auf dem Handy kannst du es über das Teilen-Menü in deinen Fotos ablegen, am Computer wird es heruntergeladen.' },
    { q: 'Wie funktioniert der Link zum Teilen?', a: 'Dein ganzes Gespenst samt Name steckt im Link selbst. Wer ihn öffnet, sieht genau dasselbe Gespenst und kann danach sein eigenes erstellen. Auf unseren Servern wird nichts gespeichert.' },
    { q: 'Warum schwebt mein Gespenst auf und ab?', a: 'Weil Gespenster nun mal schweben! Die kleine Bewegung gibt es nur auf dem Bildschirm. Wenn dein Gerät auf „Bewegung reduzieren“ eingestellt ist, bleibt es still, und das gespeicherte Bild ist immer unbewegt.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Gespenst erstellen',
    description: 'Datenschutzerklärung für Gespenst erstellen: wie dein Gespenst verarbeitet wird, Cookies, Werbung und anonyme Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Gespenst erstellen (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.',
    sections: [
      ['1. Informationen, die wir erfassen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Dein Gespenst und sein Name werden nie an einen Server gesendet – sie bleiben in deinem Browser (und beim Teilen in der URL). Manche Informationen können automatisch erfasst werden, während du den Dienst nutzt, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung des Dienstes zu verstehen. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann möglicherweise nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Werbung basierend auf deinen früheren Besuchen anzuzeigen. Mehr erfährst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>, wo du auch deine Einstellungen ändern kannst.'],
      ['4. Statistik', 'Um den Dienst zu verbessern, nutzen wir möglicherweise Google Analytics (GA4) sowie eigene aggregierte Zähler, die nur tägliche Gesamtzahlen pro Sprache speichern (Seitenaufrufe, fertige Gespenster, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Geteilte Links und Bilder', 'Mit „Teilen“ erstellte Links enthalten dein Gespenst und den eingegebenen Namen, codiert in der URL. Gespeicherte Bilder werden in deinem Browser erstellt. Bitte gib als Namen keine personenbezogenen Informationen ein.'],
      ['6. Kontakt', 'Bei Fragen zu dieser Richtlinie wende dich bitte an den Betreiber des Dienstes.'],
      ['7. Gültigkeitsdatum', 'Diese Richtlinie gilt ab dem 1. Oktober 2026.'],
    ],
    back: '← Zurück zu Gespenst erstellen',
  },
};
