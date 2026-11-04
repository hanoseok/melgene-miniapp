/* Weihnachtsbaum schmücken — Deutsch (/de/). Gleiche Schlüsselstruktur wie en.js. {name} {n} {max} unverändert lassen.
 * UI duzt (wie die Weihnachtskarte), die Datenschutzerklärung siezt. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "auto"
  },
  meta: {
    title: "Weihnachtsbaum schmücken – direkt im Browser",
    description: "Weihnachtsbaum online schmücken: Baum wählen, Kugeln, Sterne und Zuckerstangen aufhängen, Lichterkette und Schnee an, dann Bild speichern oder Link teilen.",
    ogTitle: "Weihnachtsbaum schmücken 🎄",
    ogDescription: "Häng Kugeln auf, lass die Lichter funkeln und teile deinen eigenen Weihnachtsbaum in einer Minute."
  },
  siteName: "Weihnachtsbaum schmücken",
  privacyLink: "Datenschutzerklärung",
  start: {
    badge: "🎄 Weihnachtsspecial",
    h1Kicker: "Weihnachtsbaum schmücken",
    h1Html: "Dein Baum<br><em>voller Glanz</em>",
    hook: "Häng Kugeln und Zuckerstangen auf, knipse die Lichter an, lass es schneien und schick deinen Baum an einen lieben Menschen.",
    start: "Jetzt schmücken →"
  },
  editor: {
    title: "Schmücke deinen Baum",
    canvasAria: "Dein Weihnachtsbaum. Tippe, um den gewählten Schmuck aufzuhängen, und ziehe ein Teil, um es zu verschieben.",
    hint: "Auf den Baum tippen zum Aufhängen · ziehen zum Verschieben",
    paletteLabel: "Baumschmuck",
    kinds: {
      red: "Rote Kugel",
      gold: "Goldkugel",
      blue: "Blaue Kugel",
      purple: "Lila Kugel",
      silver: "Silberkugel",
      star: "Stern",
      bell: "Glöckchen",
      cane: "Zuckerstange",
      gift: "Geschenk",
      bow: "Schleife",
      sock: "Strumpf",
      flake: "Schneeflocke",
      cookie: "Plätzchen",
      erase: "Radierer"
    },
    undo: "Zurück",
    clear: "Alles weg",
    auto: "Zufällig",
    count: "{n}/{max} Schmuckteile",
    full: "Dein Baum ist voll! Verschiebe oder entferne zuerst ein Teil.",
    styleLabel: "Baum",
    styles: {
      classic: "Klassisch",
      snowy: "Verschneit",
      nordic: "Nordisch",
      pink: "Rosa"
    },
    bgLabel: "Hintergrund",
    bgs: {
      night: "Sternennacht",
      cozy: "Gute Stube",
      snowfield: "Schneefeld",
      red: "Festlich rot"
    },
    topperLabel: "Baumspitze",
    toppers: {
      none: "Keine",
      star: "Stern",
      angel: "Engel",
      bow: "Schleife"
    },
    extrasLabel: "Extras",
    snow: "Schnee",
    lights: "Lichter",
    fields: {
      name: {
        label: "Dein Name",
        placeholder: "z. B. Lena"
      },
      message: {
        label: "Grußtext",
        placeholder: "z. B. Frohe Weihnachten!"
      }
    },
    ideas: "💡 Ideen",
    counter: "{n}/{max}",
    presets: [
      "Frohe Weihnachten und ein gesegnetes Fest!",
      "Kerzenschein, Plätzchenduft und Zeit für euch 🍪",
      "O Tannenbaum – wir denken an euch!",
      "Besinnliche Feiertage und einen guten Rutsch!",
      "Fröhliche Weihnacht aus unserer Stube ✨"
    ],
    done: "Fertig geschmückt"
  },
  card: {
    by: "Geschmückt von {name}"
  },
  result: {
    eyebrowMine: "Dein Baum ist fertig!",
    eyebrowFriend: "{name} hat diesen Baum für dich geschmückt",
    eyebrowFriendNoName: "Jemand hat diesen Baum für dich geschmückt",
    imageAlt: "Geschmückter Weihnachtsbaum mit {n} Schmuckteilen",
    save: "Bild speichern",
    saving: "Bild wird erstellt …",
    saved: "Bild gespeichert!",
    saveFail: "Das Bild konnte nicht erstellt werden. Mach stattdessen einen Screenshot.",
    edit: "Weiter schmücken",
    retry: "Neuen Baum schmücken",
    retryFriend: "Eigenen Baum schmücken",
    shareTitle: "Weihnachtsbaum schmücken",
    shareText: "{name} hat einen Weihnachtsbaum geschmückt 🎄 Schau mal:",
    shareTextNoName: "Schau dir meinen geschmückten Weihnachtsbaum an 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Weihnachtsbaum schmücken",
    defaultKicker: "Weihnachtsbaum schmücken",
    defaultTitle: "Dein Baum voller Glanz",
    defaultDesc: "Baumschmuck · Lichter · Schnee · speichern oder teilen"
  },
  faq: [
    {
      q: "Wie hänge ich Schmuck an den Baum?",
      a: "Wähle unter dem Baum ein Schmuckteil und tippe dann auf eine beliebige Stelle am Baum. Zum Verschieben hältst du das Teil gedrückt und ziehst es. Mit dem Radierer entfernst du ein einzelnes Teil, mit Zurück machst du den letzten Schritt rückgängig."
    },
    {
      q: "Kann ich den Baum ändern, wenn schon Schmuck dran hängt?",
      a: "Ja. Baumform, Hintergrund und Baumspitze lassen sich jederzeit wechseln, Schnee und Lichter kannst du an- und ausschalten. Dein Schmuck bleibt genau dort hängen, wo du ihn platziert hast."
    },
    {
      q: "Wie speichere oder verschicke ich meinen Baum?",
      a: "Tippe auf „Fertig geschmückt“. „Bild speichern“ erzeugt ein PNG mit 1080×1350 Pixeln, über die Teilen-Buttons verschickst du einen Link. Wer ihn öffnet, sieht deinen Baum mit funkelnden Lichtern und kann gleich einen eigenen schmücken."
    },
    {
      q: "Wo wird mein Baum gespeichert?",
      a: "Schmuck, Name und Grußtext stecken nur im Link und, solange du schmückst, in deinem eigenen Browser. Nichts davon wird an unseren Server geschickt – deshalb kann jeder mit dem Link deinen Baum sehen."
    }
  ],
  privacy: {
    title: "Datenschutzerklärung | Weihnachtsbaum schmücken",
    description: "Datenschutzerklärung von Weihnachtsbaum schmücken: Umgang mit Baum, Name und Grußtext, Cookies, Werbung und anonymen Statistiken.",
    h1: "Datenschutzerklärung",
    introHtml: "Weihnachtsbaum schmücken (der „Dienst“) achtet Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, unbedingt nötigen Informationen.",
    sections: [
      [
        "1. Erhobene Informationen",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Ihr Baum sowie der eingegebene Name und Grußtext werden nie an einen Server gesendet. Sie bleiben in Ihrem Browser (während des Schmückens wird ein Entwurf im lokalen Speicher abgelegt) und beim Teilen in der URL. Bei der Nutzung des Dienstes können automatisch einige Informationen erfasst werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung zu verstehen. Sie können Cookies in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann möglicherweise nicht wie vorgesehen."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage Ihrer früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und Einstellungen unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Zur Verbesserung des Dienstes nutzen wir unter Umständen Google Analytics (GA4) sowie eigene aggregierte Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, fertige Bäume, Sternebewertungen). Nichts davon identifiziert Sie persönlich, und weder Ihr Name noch Ihr Grußtext sind darin enthalten."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Mit „Teilen“ erstellte Links enthalten Ihren Baum, kodiert in der URL. Jede Person mit dem Link kann ihn also sehen. Gespeicherte Bilder entstehen direkt in Ihrem Browser. Bitte schreiben Sie keine Adressen, Telefonnummern oder andere persönliche Angaben in Ihren Grußtext."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültig ab",
        "Diese Erklärung gilt ab dem 5. November 2026."
      ]
    ],
    back: "← Zurück zu Weihnachtsbaum schmücken"
  }
};
