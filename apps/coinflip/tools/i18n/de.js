/* Münzwurf — Deutsch (du). Gleiche Struktur wie en.js (siehe Kommentare). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Münzwurf online: Kopf oder Zahl',
    description: 'Kannst du dich nicht entscheiden? Wirf online eine Münze, Kopf oder Zahl, und lass den Zufall wählen. Benenne beide Seiten selbst oder würfle mit einem bis drei Würfeln. Kostenlos, ohne Anmeldung.',
    ogTitle: 'Münzwurf 🪙 Kopf oder Zahl & Würfel',
    ogDescription: 'Münze werfen oder würfeln und den Zufall entscheiden lassen.',
  },
  siteName: 'Münzwurf',
  privacyLink: 'Datenschutzerklärung',

  start: {
    badge: '🪙 Die fairste Entscheidungshilfe',
    h1Kicker: 'Münzwurf',
    h1Html: 'Kopf oder Zahl?<br>Die <em>Münze</em> entscheidet',
    hook: 'Gib deinen beiden Optionen Namen, wirf die Münze und nimm, was oben liegt. Würfeln geht auch.',
    facts: 'Münze und Würfel · Seiten umbenennen · jedes Mal fair',
    start: 'Werfen →',
  },

  tool: {
    title: 'Wirf los',
    tabCoin: 'Münze',
    tabDice: 'Würfel',
    namesLabel: 'Benenne die beiden Seiten',
    namesHint: 'Standardmäßig Kopf und Zahl. Ändere sie in deine Optionen, etwa Pizza und Sushi.',
    sideA: 'Kopf',
    sideB: 'Zahl',
    fieldA: 'Name der ersten Seite',
    fieldB: 'Name der zweiten Seite',
    throwCoin: 'Münze werfen 🪙',
    diceLabel: 'Wie viele Würfel?',
    rollDice: 'Würfeln 🎲',
  },

  count: { one: '{n} Wurf in dieser Sitzung', other: '{n} Würfe in dieser Sitzung' },
  countDice: { one: '{n} Wurf in dieser Sitzung', other: '{n} Würfe in dieser Sitzung' },

  result: {
    titleCoin: 'Gefallen ist',
    titleDice: 'Du hast gewürfelt',
    sum: 'Summe {n}',
    tallyTitle: 'Diese Sitzung',
    tallySide: '{name} {n}',
    againCoin: 'Nochmal werfen',
    againDice: 'Nochmal würfeln',
    change: 'Zurück zum Wurf',
    shareTitle: 'Münzwurf – Kopf oder Zahl',
    shareTextCoin: 'Ich habe eine Münze geworfen und es wurde {name} 🪙',
    shareTextDice: 'Ich habe gewürfelt und {n} bekommen 🎲',
  },

  og: {
    brand: '🪙 Münzwurf',
    kicker: 'Kopf oder Zahl · Münze und Würfel',
    title: 'Kopf oder Zahl?',
    desc: 'Münze werfen oder würfeln · ein fairer Wurf entscheidet',
  },

  faq: [
    { q: 'Wie funktioniert der Münzwurf?', a: 'Benenne die beiden Seiten, wenn du möchtest, und tippe auf Werfen. Das Ergebnis wird zuerst gezogen und die Münze dreht sich nur dorthin, du siehst also immer das echte Ergebnis. Im Tab Würfel rollst du einen bis drei sechsseitige Würfel.' },
    { q: 'Ist der Wurf wirklich fair?', a: 'Ja. Das Ergebnis stammt aus dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) mit Rejection Sampling. Kopf und Zahl sind also exakt gleich wahrscheinlich, und jede Würfelseite hat dieselbe Chance. Die Animation dient nur der Optik.' },
    { q: 'Kann ich eigene Optionen statt Kopf und Zahl verwenden?', a: 'Ja. Tippe zwei beliebige Namen in die Felder über der Münze, zum Beispiel Pizza und Sushi, und das Ergebnis zeigt den Namen des Gewinners. Lässt du ein Feld leer, gilt wieder der Standardname.' },
    { q: 'Was bedeuten die Zahlen am Ende?', a: 'Sie zählen nur, was du auf dieser Seite seit dem Öffnen geworfen hast, samt der Häufigkeit jeder Seite. Beim Neuladen beginnen sie bei null und werden nirgendwohin gesendet.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Münzwurf',
    description: 'Datenschutzerklärung für Münzwurf: Deine Seitennamen bleiben im Browser, Cookies, Werbung und Statistiken.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Münzwurf (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestdaten.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto und ohne Anmeldung. Die Namen, die du eingibst, und deine Ergebnisse werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Bei der Nutzung können jedoch automatisch einige Informationen erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browser-Einstellungen ablehnen oder löschen; dann funktionieren manche Funktionen eventuell nicht wie vorgesehen.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche dieser und anderer Websites auszuspielen. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistiken', 'Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene aggregierte Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, Würfe, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Inkrafttreten', 'Diese Erklärung gilt ab dem 5. Oktober 2026.'],
    ],
    back: '← Zurück zu Münzwurf',
  },
};
