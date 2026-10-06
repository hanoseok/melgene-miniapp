/* Lottozahlen-Generator — de. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto'
  },
  meta: {
    title: 'Lottozahlen-Generator: Zufallszahlen für Lotto',
    description: 'Glückszahlen gesucht? Wähle Korea 6/45, ein Euro-Spiel 5/50 + 2 Sterne, US-Powerball 5/69 + 1 oder einen eigenen Bereich, behalte oder streiche Zahlen und ziehe bis zu fünf Tipps. Nur zum Spaß, ohne Anmeldung.',
    ogTitle: 'Lottozahlen-Generator 🎱 Zufallszahlen ziehen',
    ogDescription: 'Ziehe Glückszahlen zum Spaß, bis zu fünf Tipps auf einmal.'
  },
  siteName: 'Lottozahlen-Generator',
  privacyLink: 'Datenschutz',
  start: {
    badge: '🎱 Nur zum Spaß',
    h1Kicker: 'Lottozahlen-Generator',
    h1Html: 'Heute <em>Glück</em> gehabt?<br>Zieh deine Zahlen',
    hook: 'Wähle ein Spiel, behalte oder streiche ein paar Zahlen und sieh zu, wie die Kugeln rollen. Bis zu fünf Tipps auf einmal.',
    facts: 'Korea · Euro-Stil · Powerball · eigener Bereich · nur zur Unterhaltung',
    start: 'Zahlen ziehen →'
  },
  tool: {
    title: 'Ziehung einstellen',
    presetLabel: 'Welches Spiel?',
    presets: {
      kr: 'Korea 6/45',
      euro: 'Euro-Stil 5/50 + 2',
      us: 'US-Powerball',
      custom: 'Eigene'
    },
    presetInfo: {
      kr: '6 Zahlen von 1 bis 45',
      euro: '5 Zahlen von 1 bis 50 + 2 Sterne von 1 bis 12',
      us: '5 Zahlen von 1 bis 69 + 1 Powerball von 1 bis 26',
      custom: 'Lege Anzahl und höchste Zahl selbst fest'
    },
    pickLabel: 'Zahlen ziehen',
    maxLabel: 'Höchste Zahl',
    gamesLabel: 'Wie viele Tipps?',
    fixedLabel: 'Zahlen behalten (optional)',
    fixedHint: 'Immer in jedem Tipp dabei, z. B. 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Zahlen streichen (optional)',
    excludeHint: 'Werden nie gezogen, z. B. 4, 13',
    excludePh: '4, 13',
    draw: 'Kugeln ziehen 🎱',
    drawing: 'Ziehung läuft…',
    machine: 'Kugeln wirbeln in der Ziehungsmaschine',
    note: 'Nur zur Unterhaltung. Jede Kombination ist gleich wahrscheinlich, und dieses Tool kann weder Ergebnisse vorhersagen noch deine Gewinnchancen verbessern.',
    errors: {
      bad: 'Gib ganze Zahlen von 1 bis {max} ein, getrennt durch Kommas.',
      overlap: 'Eine Zahl kann nicht gleichzeitig behalten und gestrichen werden.',
      tooMany: 'Du kannst höchstens {pick} Zahlen behalten.',
      notEnough: 'Zu viele Zahlen gestrichen, um {pick} zu ziehen.'
    }
  },
  result: {
    title: 'Deine Glückszahlen',
    game: 'Tipp {n}',
    extraNames: {
      euro: 'Sterne',
      us: 'Powerball'
    },
    copy: 'Zahlen kopieren 📋',
    copied: 'Zahlen kopiert!',
    again: 'Nochmal ziehen',
    change: 'Zu den Einstellungen',
    disclaimer: 'Nur zur Unterhaltung. Keine Vorhersage, kein Gewinnversprechen.',
    shareTitle: 'Lottozahlen-Generator',
    shareText: 'Meine Glückszahlen 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Lottozahlen-Generator',
    kicker: 'Zufallszahlen · nur zum Spaß',
    title: 'Heute Glück gehabt?',
    desc: 'Spiel wählen und bis zu fünf Tipps ziehen'
  },
  faq: [
    {
      q: 'Wie ziehe ich meine Zahlen?',
      a: 'Wähle ein Spiel (Korea 6/45, Euro-Stil, US-Powerball oder eigener Bereich), stelle ein bis fünf Tipps ein und tippe auf den Ziehen-Button. Die Zahlen stehen zuerst fest, die Kugeln rollen nacheinander heraus, danach wird jeder Tipp sortiert angezeigt.'
    },
    {
      q: 'Sind die Zahlen wirklich zufällig?',
      a: 'Ja. Sie stammen aus dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) mit Rejection Sampling, daher ist jede erlaubte Zahl exakt gleich wahrscheinlich und es gibt keine Verzerrung. Die Kugel-Animation dient nur der Optik.'
    },
    {
      q: 'Was bewirken behaltene und gestrichene Zahlen?',
      a: 'Behaltene Zahlen stehen in jedem Tipp, die übrigen werden um sie herum gezogen. Gestrichene Zahlen kommen nie vor. Beides gilt nur für die Hauptzahlen, nicht für Sterne oder den Powerball.'
    },
    {
      q: 'Erhöht das meine Gewinnchancen?',
      a: 'Nein. Bei einer echten Ziehung ist jede Kombination gleich wahrscheinlich, und kein Tool kann das Ergebnis vorhersagen. Dieser Generator ist nur ein unterhaltsamer Weg, Zahlen zu wählen, und verspricht keinen Gewinn.'
    }
  ],
  privacy: {
    title: 'Datenschutzerklärung | Lottozahlen-Generator',
    description: 'Datenschutzerklärung für den Lottozahlen-Generator: Deine Zahlen bleiben im Browser, Cookies, Werbung und Statistiken.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Lottozahlen-Generator (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestdaten.',
    sections: [
      [
        '1. Erhobene Informationen',
        'Der Dienst funktioniert ohne Konto und ohne Anmeldung. Die Zahlen, die du eingibst, und deine Ziehungen werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Bei der Nutzung können jedoch automatisch einige Informationen erfasst werden, wie unten beschrieben.'
      ],
      [
        '2. Cookies und ähnliche Technologien',
        'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browser-Einstellungen ablehnen oder löschen; dann funktionieren manche Funktionen eventuell nicht wie vorgesehen.'
      ],
      [
        '3. Werbung (Google AdSense)',
        'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche dieser und anderer Websites auszuspielen. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'
      ],
      [
        '4. Statistiken',
        'Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene aggregierte Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, Ziehungen, Sternebewertungen). Nichts davon identifiziert dich persönlich.'
      ],
      [
        '5. Kontakt',
        'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'
      ],
      [
        '6. Inkrafttreten',
        'Diese Erklärung gilt ab dem 7. Oktober 2026.'
      ]
    ],
    back: '← Zurück zum Lottozahlen-Generator'
  }
};
