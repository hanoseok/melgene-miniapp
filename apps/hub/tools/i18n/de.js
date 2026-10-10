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
        id: 'qr',
        kicker: "Praktisches Tool",
        headline: "Jeden Link als QR-Code",
        blurb: "Link, Text oder WLAN. Als PNG oder SVG, direkt im Browser.",
      },
      {
        id: 'randnum',
        kicker: "Faire Auslosung",
        headline: "Zufallszahlen mit einem Tipp",
        blurb: "Freier Bereich, auch ohne Doppelte. Ideal für Gewinnspiele.",
      },
      {
        id: 'coffee',
        kicker: "Persönlichkeitstest",
        headline: "Welcher Kaffee bist du?",
        blurb: "12 Alltagsfragen, 2 Minuten. Finde deinen Kaffee.",
      },
      {
        id: 'sweeper',
        kicker: "Rätselklassiker",
        headline: "Minen meiden, Feld räumen",
        blurb: "Zahlen lesen, Flaggen setzen. Der erste Tipp ist sicher.",
      },
      {
        id: 'hangul-name',
        kicker: "Zum Hangeul-Tag",
        headline: "Dein Name auf Koreanisch",
        blurb: "Namen eintippen und als Hangeul-Karte speichern.",
      },
      {
        id: 'dice',
        kicker: "Für Brettspiele",
        headline: "Würfeln direkt im Browser",
        blurb: "Bis zu sechs Würfel, W4 bis W20. Fair und mit Schwung.",
      },
      {
        id: 'brick',
        kicker: 'Arcade-Klassiker',
        headline: 'Ein Ball gegen die Neon-Mauer',
        blurb: 'Mit dem Schläger zurücklenken, alles abräumen. 3 Leben, immer schneller.',
      },
      {
        id: 'mentalage',
        kicker: 'Persönlichkeitstest',
        headline: 'Wie alt ist dein Kopf?',
        blurb: '12 Alltagsfragen, zwei Minuten. Dein mentales Alter aufs Jahr genau.',
      },
      {
        id: 'fancytext',
        kicker: 'Selbst gestalten',
        headline: 'Gib deinem Text mehr Stil',
        blurb: 'Verwandle Text in coole Schriftarten und kopiere ihn mit einem Tipp.',
      },
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
        id: 'lotto',
        kicker: 'Glück gehabt?',
        headline: 'Lottozahlen zum Spaß',
        blurb: 'Spiel wählen und bis zu fünf Tipps ziehen.',
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
  // Fußzeile aller Portalseiten (Über uns · Anleitungen · Nutzungsbedingungen · Datenschutz · Kontakt). Reiner Text (wird escaped).
  footerNav: { about: 'Über uns', guides: 'Anleitungen', terms: 'Nutzungsbedingungen', privacy: 'Datenschutz', contact: 'Kontakt' },
  aboutPage: {
    title: 'Über uns | Melgene Apps',
    description: 'Melgene Apps ist ein kleines unabhängiges Studio für kostenlose Browser-Minispiele, Persönlichkeitstests und Kreativ-Tools in 12 Sprachen. So entstehen sie.',
    h1: 'Über Melgene Apps',
    lead: 'Melgene Apps ist ein kleines, unabhängiges Studio, das kostenlose Mini-Apps für jeden Browser entwickelt: schnelle Spiele, unterhaltsame Persönlichkeitstests, kleine Kreativ-Tools und Helfer für alltägliche Entscheidungen. Kein Download, kein Konto – und die meisten dauern nur etwa eine Minute.',
    sections: [
      {
        h: 'Was wir machen',
        p: [
          'Jede Mini-App von Melgene macht genau eine Sache – und die richtig. Manche sind Arcade-Spiele für die Kaffeepause, etwa Hau den Maulwurf, Breakout oder ein Merge-Puzzle. Andere sind Persönlichkeitstests, die aus ein paar Alltagssituationen ein verspieltes Ergebnis zum Teilen machen. Wieder andere helfen dir, etwas zu gestalten – ausgefallene Schrift, eine Party-Einladung, einen Spitznamen – oder kleine Entscheidungen mit Glücksrad, Leiterspiel oder Münzwurf zu treffen.',
          'Wir bringen regelmäßig neue Apps heraus, oft passend zu Jahreszeiten und Feiertagen, und verbessern die älteren ständig – je nachdem, wie sie tatsächlich genutzt werden.',
        ],
      },
      {
        h: 'Warum wir das machen',
        p: ['Wir finden: Die schönsten kleinen Momente im Netz sollten schnell, freundlich und kostenlos sein. Viele Seiten mit Spielen oder Quiz verstecken sie hinter Anmeldungen, Pop-ups und App-Installationshinweisen. Wir wollen das Gegenteil: Link antippen, die App öffnet sich, du spielst – und mit einem weiteren Tipp schickst du sie an Freunde.'],
      },
      {
        h: 'Wie jede App entsteht und getestet wird',
        p: ['Jede App beginnt mit einem kurzen Konzept: für wen sie ist, wie lange eine Runde dauern soll und was der Ergebnisbildschirm zeigt. Dann bauen wir sie als schlanke Webseite und testen sie vor der Veröffentlichung:'],
        list: [
          'Auf kleinen Smartphone-Bildschirmen (360 px breit) ebenso wie auf Tablets und am Desktop',
          'In allen 12 Sprachen – passt jede Zeile auf den Bildschirm und liest sie sich natürlich?',
          'Mit automatischen Prüfungen auf defekte Links, fehlende Übersetzungen und Seitenstruktur',
          'Ohne Spoiler: Der Startbildschirm macht neugierig, verrät aber nie Fragen oder Ergebnisse',
        ],
      },
      {
        h: 'Mobile first, in 12 Sprachen',
        p: ['Die meisten spielen auf dem Handy, deshalb ist jede App zuerst für schmale Bildschirme gestaltet. Melgene Apps gibt es auf Deutsch, Englisch, Japanisch, Chinesisch, Koreanisch, Französisch, Thai, Vietnamesisch, Spanisch, Italienisch, Portugiesisch und Russisch. Wir schreiben jede Sprache für die Menschen vor Ort, statt Wort für Wort zu übersetzen, und verwenden die Namen, nach denen im jeweiligen Land wirklich gesucht wird.'],
      },
      {
        h: 'Datensparsam von Anfang an',
        p: ['Du brauchst nie ein Konto, und wir fragen nie nach Name, E-Mail-Adresse oder Telefonnummer. Was du in eine App eingibst, wird in deinem eigenen Browser verarbeitet. Spielzahlen, Herzen und Bewertungen sind nur anonyme Summen pro App. Die Seite finanziert sich über Werbung von Google AdSense; alle Details findest du in unserer Datenschutzerklärung.'],
      },
      {
        h: 'Hinweis zu Persönlichkeitstests',
        p: ['Unsere Persönlichkeitstests, Tests zum geistigen Alter und ähnliche Quiz dienen der Unterhaltung. Sie sind keine psychologischen, medizinischen oder fachlichen Gutachten, und ein Ergebnis sollte nie Grundlage für wichtige Entscheidungen über dich oder andere sein. Nimm sie als Gesprächsstoff und als kleinen Spaß.'],
      },
      {
        h: 'Schreib uns',
        p: ['Wir lesen jede Nachricht. Wenn du einen Fehler findest, eine Idee für eine neue Mini-App hast oder über eine Partnerschaft sprechen möchtest, besuche unsere Kontaktseite oder schreib an contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Kontakt | Melgene Apps',
    description: 'Kontaktiere Melgene Apps per E-Mail für Feedback, Fehlermeldungen, Partnerschaftsanfragen oder Datenschutzanliegen. Antwort meist innerhalb weniger Werktage.',
    h1: 'Kontakt',
    lead: 'Fragen, Ideen oder Probleme? Wir sind ein kleines Team und lesen jede Nachricht selbst.',
    emailH: 'E-Mail',
    emailNote: 'Wir antworten in der Regel innerhalb weniger Werktage.',
    sections: [
      {
        h: 'Worüber du uns schreiben kannst',
        p: ['Schreib uns gern zu allem, was mit Melgene Apps zu tun hat, zum Beispiel:'],
        list: [
          'Feedback und Ideen für neue Minispiele, Tests oder Tools',
          'Fehlermeldungen: Eine Seite lädt nicht, ein Button reagiert nicht oder Text wird abgeschnitten',
          'Übersetzungsfehler oder Formulierungen, die in deiner Sprache holprig klingen',
          'Anfragen zu Partnerschaften, Lizenzen oder Presse',
          'Datenschutzanliegen und Fragen zu Daten oder Cookies',
        ],
      },
      {
        h: 'Einen Fehler melden',
        p: ['Damit wir schnell helfen können, nenne bitte den Namen der Mini-App, die verwendete Sprache, dein Gerät und deinen Browser (zum Beispiel iPhone mit Safari oder Android mit Chrome) und beschreibe kurz, was passiert ist. Ein Screenshot hilft sehr.'],
      },
      {
        h: 'Antwortzeit',
        p: ['Wir antworten meist innerhalb weniger Werktage; rund um Feiertage kann es etwas länger dauern. Wir fragen dich niemals nach Passwörtern oder Zahlungsdaten.'],
      },
    ],
  },
  termsPage: {
    title: 'Nutzungsbedingungen | Melgene Apps',
    description: 'Nutzungsbedingungen von Melgene Apps: kostenlose Browser-Minispiele und Tests zur Unterhaltung, ohne Gewähr, mit Regeln zur Nutzung, Share-Links und Werbung Dritter.',
    h1: 'Nutzungsbedingungen',
    updated: 'Zuletzt aktualisiert: 9. Oktober 2026',
    lead: 'Diese Nutzungsbedingungen gelten für Melgene Apps (der „Dienst“), einschließlich des Portals und aller Mini-Apps auf unseren Seiten. Mit der Nutzung des Dienstes stimmst du diesen Bedingungen zu. Wenn du nicht einverstanden bist, nutze den Dienst bitte nicht.',
    sections: [
      { h: '1. Der Dienst', p: ['Melgene Apps bietet kostenlose Minispiele, Persönlichkeitstests, Kreativ-Tools und Entscheidungshelfer, die im Webbrowser laufen. Ein Konto ist nicht nötig. Wir können Apps und Funktionen jederzeit hinzufügen, ändern oder entfernen.'] },
      { h: '2. Bereitstellung ohne Gewähr', p: ['Der Dienst wird „wie besehen“ und „wie verfügbar“ bereitgestellt, ohne jegliche Gewährleistung. Wir geben uns Mühe, dass alles reibungslos läuft, garantieren aber nicht, dass der Dienst immer verfügbar, fehlerfrei oder für einen bestimmten Zweck geeignet ist. Soweit gesetzlich zulässig, haften wir nicht für Verluste oder Schäden aus der Nutzung des Dienstes.'] },
      { h: '3. Nur zur Unterhaltung', p: ['Ergebnisse von Persönlichkeitstests, Tests zum geistigen Alter, Zufallsauswahlen und ähnlichen Funktionen sind zum Spaß gedacht. Sie sind keine wissenschaftliche, psychologische, medizinische, finanzielle oder fachliche Beratung. Zufallsergebnisse wie Lottozahlen erhöhen deine Gewinnchancen nicht.'] },
      {
        h: '4. Zulässige Nutzung',
        p: ['Bei der Nutzung des Dienstes verpflichtest du dich, Folgendes zu unterlassen:'],
        list: [
          'Den Dienst für rechtswidrige, schädliche oder missbräuchliche Zwecke zu nutzen',
          'Hasserfüllte, belästigende, sexuell explizite oder rechtsverletzende Inhalte einzugeben',
          'Den Dienst zu stören, zu überlasten, massenhaft auszulesen oder unbefugt darauf zuzugreifen',
          'Spielzahlen, Herzen, Bewertungen oder Werbung zu manipulieren, auch mit automatisierten Tools oder ungültigen Klicks',
        ],
      },
      { h: '5. Was du erstellst und teilst', p: ['In manchen Apps kannst du Namen oder Text eingeben, ein Bild erstellen oder einen Share-Link erzeugen. Für deine Eingaben und das, was du teilst, bist du selbst verantwortlich. Ein Share-Link speichert nur die Angaben, die zum Anzeigen des Ergebnisses nötig sind, und jeder mit dem Link kann ihn öffnen – füge also bitte keine persönlichen oder sensiblen Daten ein. Links, die gegen diese Bedingungen verstoßen, können wir entfernen.'] },
      { h: '6. Werbung und Cookies', p: ['Der Dienst ist kostenlos, weil er durch Werbung finanziert wird. Anzeigen stammen von Drittanbietern wie Google AdSense, die Cookies und ähnliche Technologien verwenden können, um Anzeigen – auch personalisierte – auszuliefern und zu messen. Auf den Inhalt von Drittanzeigen und die verlinkten Seiten haben wir keinen Einfluss. Mehr dazu und deine Einstellungen findest du in unserer Datenschutzerklärung und in den Google-Anzeigeneinstellungen.'] },
      { h: '7. Geistiges Eigentum', p: ['Design, Code, Texte, Illustrationen und andere Inhalte des Dienstes gehören Melgene Apps oder den jeweiligen Rechteinhabern und sind gesetzlich geschützt. Du darfst den Dienst privat und nicht kommerziell nutzen und Links dazu frei teilen. Bitte kopiere, veröffentliche oder verkaufe die Apps oder ihre Inhalte nicht ohne unsere Erlaubnis.'] },
      { h: '8. Änderungen dieser Bedingungen', p: ['Wir können diese Nutzungsbedingungen gelegentlich aktualisieren und ändern dann das Datum oben auf dieser Seite. Wenn du den Dienst nach einer Änderung weiter nutzt, akzeptierst du die neuen Bedingungen.'] },
      { h: '9. Kontakt', p: ['Fragen zu diesen Bedingungen? Schreib an contact@melgene.com oder nutze unsere Kontaktseite.'] },
    ],
  },
  guidesPage: {
    title: 'Anleitungen & Tipps zu allen Mini-Apps | Melgene Apps',
    description: 'Spielregeln, Tipps und Hintergründe zu den Minispielen, Persönlichkeitstests und Tools von Melgene. Kurze Anleitung lesen, dann direkt loslegen.',
    h1: 'Anleitungen & Tipps',
    lead: 'Jede Anleitung erklärt, wie eine Mini-App funktioniert, wie du besser wirst und was man vor dem Start wissen sollte. Ohne Spoiler: Fragen und Ergebnisse bleiben eine Überraschung.',
    read: 'Anleitung lesen',
    play: 'Spielen',
    empty: 'Die Anleitungen sind unterwegs. Schau bald wieder vorbei!',
  },
};
