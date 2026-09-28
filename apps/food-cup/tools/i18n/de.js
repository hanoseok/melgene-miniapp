/* Essen-Turnier – Was isst du lieber? — Deutsch (/de/)
 * Gleiche Schlüsselstruktur wie en.js. Gericht-IDs, Emojis und Turnierbaum: food-cup-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Essen-Turnier – Was isst du lieber?',
    description: 'Essen-Turnier: immer zwei Gerichte – tippe auf das, was du lieber isst, bis ein Sieger übrig ist. „Was isst du lieber?“ in einer Minute. Kostenlos, ohne Download.',
    ogTitle: 'Essen-Turnier 🏆 Was isst du lieber?',
    ogDescription: 'Zwei Gerichte, eine Wahl, fünfzehn Duelle. Welches Essen krönst du?',
  },
  siteName: 'Essen-Turnier',
  privacyLink: 'Datenschutz',

  start: {
    badge: '🍽️ Entweder-oder · Essen-Edition',
    h1Kicker: 'Essen-Turnier',
    h1Html: 'Welches Essen holt<br>die <em>Krone</em>?',
    hook: 'Zwei Gerichte, eine Wahl. Weiter so, bis nur dein Lieblingsessen übrig bleibt.',
    facts: '16 Gerichte · 15 Duelle · 1 Min.',
    start: 'Turnier starten →',
  },

  play: {
    rounds: { r16: 'Achtelfinale', qf: 'Viertelfinale', sf: 'Halbfinale', f: 'Finale' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Wahl {n} von {total}',
    hint: 'Was würdest du lieber essen?',
    vs: 'VS',
    pickAria: '{food} wählen',
    same: '{pct} % haben genauso gewählt',
  },

  result: {
    eyebrow: 'Dein Lieblingsessen',
    champPct: '{pct} % der Spieler haben dieses Gericht auch gekrönt',
    champFirst: 'Du bist unter den Ersten, die fertig sind – noch keine Statistik.',
    fourTitle: 'Deine letzten vier',
    retry: 'Nochmal (neuer Turnierbaum)',
    shareTitle: 'Essen-Turnier – Was isst du lieber?',
    shareText: 'Mein Lieblingsessen ist {emoji} {food}! Und deins?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Burger',
    sushi: 'Sushi',
    noodles: 'Ramen',
    chicken: 'Brathähnchen',
    tacos: 'Tacos',
    pasta: 'Spaghetti',
    curry: 'Curry',
    dumplings: 'Maultaschen',
    steak: 'Steak',
    hotpot: 'Eintopf',
    hotdog: 'Bratwurst',
    friedrice: 'Gebratener Reis',
    sandwich: 'Sandwich',
    stew: 'Paella',
    shrimp: 'Backgarnelen',
  },

  og: {
    brand: '🏆 Essen-Turnier',
    defaultKicker: 'Entweder-oder · Essen-Edition',
    defaultTitle: 'Welches Essen holt die Krone?',
    defaultDesc: 'Immer zwei Gerichte · ein Sieger · etwa eine Minute',
  },

  faq: [
    { q: 'Wie funktioniert das Essen-Turnier?', a: 'Sechzehn Gerichte werden zufällig in einen Turnierbaum gelost. In jedem Duell treten zwei gegeneinander an – tippe auf das, was du lieber isst, und es kommt weiter. Achtelfinale, Viertelfinale, Halbfinale und Finale ergeben 15 Entscheidungen, und das letzte Gericht ist dein Sieger.' },
    { q: 'Sind die Prozentzahlen echt?', a: 'Ja. Jede Wahl wird anonym auf unserem Server gezählt, pro Browser nur einmal je Duell. Eine Prozentzahl erscheint erst, wenn genug Leute genau dieses Duell gespielt haben. Vorher zeigen wir lieber nichts als eine ausgedachte Zahl.' },
    { q: 'Kann ich nochmal spielen oder mein Ergebnis teilen?', a: 'Spiel so oft du willst: Jede Runde bekommt einen neuen zufälligen Turnierbaum, also ändern sich die Duelle. Mit den Teilen-Knöpfen schickst du deinen Sieger an Freunde und vergleichst, was sie wählen.' },
    { q: 'Warum gerade diese sechzehn Gerichte?', a: 'Es sind Gerichte, die Menschen überall auf der Welt lieben – vom Streetfood bis zum Soulfood. Die Namen folgen dem, was man auf Deutsch sagt, aber die Gerichte sind in allen Sprachen dieselben. Die Prozentzahlen vergleichen also Spieler aus allen Ländern.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Essen-Turnier',
    description: 'Datenschutzerklärung des Essen-Turniers: anonyme Auswahlzählung, Cookies, Werbung und Statistiken.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Essen-Turnier (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.',
    sections: [
      ['1. Welche Daten wir erheben', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Deine Auswahl wird nur als anonyme Summe an unseren Server gesendet (welches Gericht welches Duell gewonnen hat und welches du gekrönt hast), ohne Namen oder persönliche Kennung. Bei der Nutzung können automatisch die unten beschriebenen Informationen erfasst werden.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache und bereits gezählte Duelle zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht wie gewohnt.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistiken', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Sammelzähler, die nur tägliche Summen pro Sprache speichern (Seitenaufrufe, beendete Turniere, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 29. September 2026.'],
    ],
    back: '← Zurück zum Essen-Turnier',
  },
};
