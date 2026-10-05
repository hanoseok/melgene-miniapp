/* Melgene Apps Portal (hub) — Deutsch (/de/).
 * privacy.introHtml und die Texte in privacy.sections sind HTML, alles andere ist reiner Text.
 * ui wird von script.js genutzt und als window.PAGE_I18N in die Seite eingebettet.
 * Keine Spoiler: Die Empfehlungstexte beschreiben nur die Stimmung einer App, nie ihre echten Fragen oder Ergebnisse.
 * Anrede: „du“ wie in den gemeinsamen UI-Texten (shared/i18n.js). */
module.exports = {
  siteName: 'Melgene Apps',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.de.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: 'Apps' },
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Kostenlose Minispiele & Persönlichkeitstests | Melgene Apps',
    description:
      'Kostenlose Minispiele und Persönlichkeitstests für zwischendurch – direkt im Browser, ohne Download und ohne Anmeldung, in einer Minute gespielt.',
    ogTitle: 'Melgene Apps: kostenlose Minispiele & Persönlichkeitstests',
    ogDescription: 'Minispiele, Psychotests und Kreatives. Kein Download, keine Anmeldung – antippen und in einer Minute durch.',
  },
  homeAria: 'Melgene Apps – Startseite',
  h1: 'Kostenlose Minispiele & Persönlichkeitstests',
  curation: {
    h2: 'Mini-Apps des Tages',
    items: [
      {
        id: 'mole',
        kicker: 'Reaktionsspiel',
        headline: 'Maulwürfe hauen, Bomben meiden',
        blurb: 'Antippen, bevor sie weg sind. 30 Sekunden, ein Titel.',
      },
      {
        id: 'nickname',
        kicker: 'Selbst gestalten',
        headline: 'Ein Nickname, der zu dir passt',
        blurb: 'Stimmung wählen und mit einem Tipp einen Nickname erhalten.',
      },
      {
        id: 'coinflip',
        kicker: 'Unentschlossen?',
        headline: 'Münzwurf und Würfel',
        blurb: 'Münze werfen oder bis zu drei Würfel, immer fair.',
      },
      {
        id: 'invite',
        kicker: 'Selbst gestalten',
        headline: 'Halloween-Einladung gestalten',
        blurb: 'Party-Infos eintragen, Motiv wählen, speichern oder teilen.',
      },
      {
        id: 'lunch',
        kicker: 'Keine Ahnung, was essen?',
        headline: 'Dreh den Slot für dein Essen',
        blurb: 'Mahlzeit und Stimmung wählen, der Slot entscheidet.',
      },
      {
        id: 'merge',
        kicker: 'Schnelles Spiel',
        headline: 'Fallen lassen, verschmelzen, wachsen',
        blurb: 'Zwei gleiche verschmelzen zu etwas Größerem. Nicht überlaufen lassen!',
      },
      {
        id: 'costume',
        kicker: 'Persönlichkeitstest',
        headline: 'Als was gehst du dieses Halloween?',
        blurb: 'Beantworte ein paar Situationen und finde dein Kostüm.',
      },
      {
        id: 'ghost',
        kicker: 'Selbst gestalten',
        headline: 'Bastle dein eigenes kleines Gespenst',
        blurb: 'Form, Gesicht und Hut wählen, dann speichern oder teilen.',
      },
      {
        id: 'team',
        kicker: 'Teams einteilen',
        headline: 'Faire Zufallsteams mit einem Tipp',
        blurb: 'Namen eingeben, Teamanzahl wählen und mischen.',
      },
      {
        id: 'lovestyle',
        kicker: 'Persönlichkeitstest',
        headline: 'Wie tickst du in der Liebe?',
        blurb: 'Zehn kleine Momente zu zweit zeigen, wie du liebst.',
      },
      {
        id: 'animal',
        kicker: 'Persönlichkeitstest',
        headline: 'Welches Tier bist du?',
        blurb: 'Acht Alltagsmomente, zwei Minuten. Triff deine wilde Seite.',
      },
      {
        id: 'game2048',
        kicker: 'Denkspiel',
        headline: 'Schieben, verbinden, 2048 schaffen',
        blurb: 'Gleiche Zahlen verschmelzen. Das Kult-Puzzle als Halloween-Edition.',
      },
      {
        id: 'aura',
        kicker: 'Persönlichkeitstest',
        headline: 'Welche Farbe hat deine Aura?',
        blurb: 'Beantworte ein paar Alltagsmomente und entdecke dein Leuchten.',
      },
      {
        id: 'candy-catch',
        kicker: 'Schnelles Spiel',
        headline: 'Fang die fallenden Süßigkeiten',
        blurb: 'Schieb deinen Kürbiseimer und weich allem Gruseligen aus.',
      },
    ],
  },
  browse: {
    h2: 'Alle Mini-Apps',
    searchLabel: 'Mini-Apps durchsuchen',
    searchPlaceholder: 'Mini-Apps suchen',
    catLabel: 'Kategorien',
    sortLabel: 'Sortieren nach',
  },
  ui: {
    // „Psychotests“ = deutsches Gegenstück zu 심리테스트 / 心理テスト (Persönlichkeitstests zum Spaß).
    cats: { all: 'Alle', game: 'Spiele', test: 'Psychotests', create: 'Kreativ', vote: 'Abstimmen' },
    sorts: { popular: 'Beliebt', rating: 'Top bewertet', newest: 'Neu' },
    totalHtml: 'Schon <strong>{n} Mal</strong> gespielt',
    play: 'Spielen',
    newBadge: 'NEU',
    plays: '{n} Mal gespielt',
    ratingAria: 'Mit {avg} von 5 bewertet ({votes} Bewertungen)',
    prev: 'Vorherige Empfehlung',
    next: 'Nächste Empfehlung',
    goTo: 'Empfehlung {n} anzeigen',
    count: '{n} Apps',
    countOne: '1 App',
    emptyCat: 'In dieser Kategorie gibt es noch keine Mini-Apps.',
    emptySearch: 'Keine Mini-App passt zu „{q}“. Versuch es mit einem anderen Wort oder zeig alle an.',
    reset: 'Alle anzeigen',
  },
  faqTitle: 'Häufige Fragen',
  faq: [
    [
      'Was ist Melgene Apps?',
      'Eine kostenlose Sammlung von Mini-Apps: schnelle Minispiele, Persönlichkeitstests und Apps, die aus ein paar Antworten etwas ganz Eigenes machen. Jede dauert etwa eine Minute und öffnet sich direkt im Browser.',
    ],
    [
      'Muss ich etwas herunterladen oder mich anmelden?',
      'Nein. Jedes Minispiel und jeder Test ist eine Webseite, die auf Handy, Tablet und Computer funktioniert – schick einfach den Link, und deine Freunde können sofort mitspielen. Wenn du oft spielst, leg die Seite über „Zum Startbildschirm hinzufügen“ im Browsermenü wie eine App ab.',
    ],
    [
      'Sammelt ihr persönliche Daten?',
      'Nein. Wir fragen nie nach Name, E-Mail oder Telefonnummer. Herzen, Bewertungen und Spielzahlen sind anonyme Summen pro App, und ein Teilen-Link speichert nur die Eingaben, die für das Ergebnis nötig sind.',
    ],
    [
      'Wie oft kommen neue Mini-Apps dazu?',
      'Wir ergänzen laufend neue Spiele und Psychotests, passend zu aktuellen Trends. Neue Apps tragen zwei Wochen lang ein NEU-Abzeichen und stehen bei „Neu“ ganz vorne.',
    ],
  ],
  privacyLink: 'Datenschutz',
  og: {
    h1Html: 'Kostenlose Minispiele<br>&amp; Psychotests',
    tag: 'Kein Download. Keine Anmeldung. Einfach spielen.',
  },
  privacy: {
    title: 'Datenschutzerklärung | Melgene Apps',
    description:
      'Datenschutzerklärung von Melgene Apps: Werbung (Google AdSense), anonyme Spielzahlen, Herzen und Bewertungen, Cookies und Browserspeicher.',
    h1: 'Datenschutzerklärung',
    introHtml:
      'Melgene Apps (der „Dienst“) ist eine Sammlung von Mini-Apps, die ohne Konto nutzbar sind. Wir respektieren deine Privatsphäre und verarbeiten nur die Informationen, die für den Betrieb des Dienstes unbedingt nötig sind – wie im Folgenden beschrieben.',
    sections: [
      [
        '1. Welche Daten wir nicht erheben',
        'Der Dienst fragt keine personenbezogenen Daten wie Name, E-Mail-Adresse, Telefonnummer oder ein Konto ab und erhebt sie auch nicht. Was du in die einzelnen Mini-Apps eingibst, wird grundsätzlich nur in deinem eigenen Browser verarbeitet.',
      ],
      [
        '2. Anonyme Zähler: Spiele, Herzen und Bewertungen (Supabase)',
        'Um Spielzahlen, Herzen und Bewertungen anzuzeigen, speichern wir in Supabase (einem Datenbankdienst) ausschließlich Folgendes: laufende Summen pro Mini-App (Spiele und Herzen), Sternebewertungen (1–5) pro Mini-App sowie Tagessummen pro Datum, Mini-App und Sprache (Seitenaufrufe, abgeschlossene Spiele und ob eine Anzeige ausgeliefert wurde). Damit derselbe Besuch nicht innerhalb von 30 Sekunden doppelt gezählt wird, speichert der Server kurzzeitig einen Einweg-Hash deiner IP-Adresse und löscht ihn automatisch, in der Regel innerhalb eines Tages. Damit pro Browser nur eine Bewertung zählt, legt dein Browser eine zufällige Kennung an; der Server speichert davon nur einen Hash. Wenn du einen Link zum Teilen erstellst, speichern wir nur die Eingaben, die nötig sind, um dasselbe Ergebnis anzuzeigen. Keine dieser Angaben wird verwendet, um dich zu identifizieren.',
      ],
      [
        '3. Werbung (Google AdSense Auto-Anzeigen)',
        'Der Dienst blendet Werbung über Google AdSense Auto-Anzeigen ein; die Platzierung bestimmt Google automatisch. Google und seine Partner können Cookies verwenden, um Anzeigen auf Basis deiner Interessen zu zeigen. Personalisierte Werbung kannst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a> prüfen und ändern.',
      ],
      [
        '4. Reichweitenmessung (Google Analytics)',
        'Der Dienst kann Google Analytics (GA4) für Besucherstatistiken und zur Verbesserung des Dienstes nutzen. Diese Daten dienen ausschließlich statistischen Zwecken und identifizieren dich nicht persönlich.',
      ],
      [
        '5. Cookies und Browserspeicher',
        'Einstellungen wie deine Sprache, die zuletzt genutzte Kategorie und Sortierung sowie deine abgegebenen Bewertungen werden nur in deinem Browser (localStorage sowie ein Cookie, das deine Sprache speichert) gespeichert. Cookies und Websitedaten kannst du jederzeit in den Browsereinstellungen löschen oder blockieren.',
      ],
      ['6. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['7. Gültig ab', 'Diese Datenschutzerklärung gilt ab dem 26. September 2026.'],
    ],
    back: '← Zurück zu Melgene Apps',
  },
};
