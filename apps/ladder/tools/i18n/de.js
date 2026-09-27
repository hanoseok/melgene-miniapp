/* Leiterspiel — Deutsch (/de/)
 * Suchbegriffe: "Losentscheid", "Leiterspiel", "Auslosung", "Amidakuji".
 * page.* wird von tools/gen-i18n.js ins statische HTML geschrieben; ui.* wird für ladder.js inline eingebettet.
 */
module.exports = {
  siteName: 'Leiterspiel',
  meta: {
    title: 'Losentscheid / Leiterspiel | Melgene Apps',
    description: 'Wer zahlt den Kaffee? Wohin zum Mittagessen? Wer spült ab? Dieser kostenlose Losentscheid (ein Leiterspiel, auch Amidakuji genannt) entscheidet fair — ganz ohne Installation oder Anmeldung. Teile genau dieselbe Leiter per Link.',
    ogTitle: 'Leiterspiel — der faire Losentscheid, kostenlos in 1 Minute',
    ogDescription: 'Namen und Ergebnisse eingeben, antippen und den Pfad verfolgen. Ein kostenloser Losentscheid ohne Installation.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap',
  app: {
    name: 'Leiterspiel',
    currency: 'EUR',
    description: 'Ein kostenloses Leiterspiel (ein Losentscheid) für Mittagessen, wer den Kaffee zahlt, Aufgabenverteilung oder die Reihenfolge. Spieler und Ergebnisse eingeben, eine faire Zufallsleiter entsteht, und per Link teilst du genau dieselbe Leiter mit Freunden.',
  },
  setup: {
    badge: '🪜 Kostenlos online',
    h1Html: 'Unentschlossen?<br>Mach einen <em>Losentscheid</em>',
    hook: 'Namen und Ergebnisse eintragen, den Rest übernimmt der Zufall. Mittagessen, Kaffee, Aufgaben, Reihenfolge — alles fair geregelt.',
    countLabel: 'Anzahl Spieler',
    minusAria: 'Weniger Spieler',
    plusAria: 'Mehr Spieler',
    presetLabel: 'Schnellauswahl',
    presets: { lunch: '🍕 Mittagessen', coffee: '☕ Kaffeekasse', clean: '🧹 Aufgaben', order: '🔢 Reihenfolge' },
    namesLabel: 'Spieler',
    resultsLabel: 'Ergebnisse',
    shuffle: '🔀 Mischen',
    build: 'Leiter erstellen →',
  },
  play: {
    edit: '← Bearbeiten',
    rebuild: '🔁 Neue Leiter',
    hint: 'Tippe auf einen Spieler, um den Pfad zu verfolgen',
    revealAll: 'Alle Ergebnisse zeigen',
    finalTitle: 'Endergebnis',
  },
  privacyLink: 'Datenschutzerklärung',

  // Kurze, spoilerfreie FAQ — erscheint nur im gemeinsamen Endbildschirm (MG_FAQ)
  faq: [
    { q: 'Ist das Leiterspiel wirklich fair?', a: 'Ja. Die Sprossen werden bei jeder Leiter zufällig platziert, und Pfade können sich nie überschneiden — niemand kann das Ergebnis vorhersagen oder manipulieren.' },
    { q: 'Kann ich mit denselben Spielern neu würfeln?', a: 'Tippe auf „Neue Leiter“, um Spieler und Ergebnisse zu behalten, aber eine völlig neue zufällige Leiter zu erzeugen.' },
    { q: 'Wie viele Spieler können mitmachen?', a: 'Zwischen 2 und 10 Spielern.' },
    { q: 'Funktioniert es auf dem Handy?', a: 'Ja. Es ist für Antippen gemacht, und die Leiter passt sich automatisch jeder Bildschirmgröße an.' },
  ],

  ui: {
    defaultName: 'Spieler {n}',
    win: 'Gewinner 🎉',
    lose: 'Verloren',
    coffeeWin: 'Zahlt Kaffee',
    coffeeLose: 'Sicher',
    order: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.'],
    pools: {
      lunch: ['Pizza', 'Döner', 'Currywurst', 'Burger', 'Sushi', 'Pasta', 'Salat', 'Falafel', 'Ramen', 'Schnitzel'],
      clean: ['Abwasch', 'Staubsaugen', 'Wäsche', 'Müll', 'Bad putzen', 'Einkaufen', 'Staubwischen', 'Fenster', 'Pflanzen', 'Mülltrennen'],
    },
    ariaName: 'Spielername {n}',
    ariaResult: 'Ergebnis {n}',
    ariaTrace: 'Pfad von {name} verfolgen',
    ariaHidden: 'Ergebnis {n}, noch verdeckt',
    ariaRevealed: '{result} aufgedeckt',
    shareTitle: 'Schau dir dieses Leiterspiel an',
    shareText: 'Ich habe eine Leiter erstellt — probier dieselbe aus und sieh, wo du landest!',
    retryLabel: 'Neue Leiter',
  },

  og: {
    badge: '🪜 Kostenlos online',
    title: 'Leiterspiel',
    tag: 'Vom Mittagessen bis zur Kaffeekasse, fair entschieden',
  },

  privacy: {
    title: 'Datenschutzerklärung | Leiterspiel',
    description: 'Datenschutzerklärung für das Leiterspiel — Nutzung von Cookies, Werbung und Analyse.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Das Leiterspiel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die im Folgenden beschriebenen, minimal notwendigen Informationen.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst kann ohne Registrierung oder Anmeldung genutzt werden. Die von dir eingegebenen Namen und Ergebnisse werden niemals auf unseren Servern gespeichert; sie werden nur in deinem Browser verarbeitet (lokaler Speicher und Seiten-URL). Bei der Nutzung des Dienstes können automatisch einige der unten beschriebenen Informationen erfasst werden.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann möglicherweise nicht richtig.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Werbung basierend auf deinen früheren Besuchen dieser und anderer Websites anzuzeigen. Mehr erfährst du und deine Einstellungen zur personalisierten Werbung änderst du unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Analyse (Google Analytics)', 'Der Dienst kann Google Analytics (GA4) verwenden, um Besucherzahlen und Traffic-Quellen zur Verbesserung zu verstehen. Diese Daten dienen nur statistischen Zwecken und identifizieren dich nicht persönlich.'],
      ['5. Freigabelinks', 'Mit „Teilen“ erstellte Links enthalten die von dir eingegebenen Spielernamen, Ergebnistexte und den Aufbau der Leiter, codiert in der URL. Wir empfehlen, keine personenbezogenen Informationen einzugeben.'],
      ['6. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Seite.'],
      ['7. Gültigkeitsdatum', 'Diese Richtlinie gilt ab dem 1. Januar 2026.'],
    ],
    back: '← Zurück zum Leiterspiel',
  },
};
