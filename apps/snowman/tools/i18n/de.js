/* Schneemann bauen — Deutsch (/de/). Gleiche Schlüsselstruktur wie en.js. {name} {n} {max} unverändert lassen.
 * UI duzt, die Datenschutzerklärung siezt. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Schneemann bauen: online in einer Minute",
    description: "Schneemann bauen online: Schneebälle stapeln, Augen, Karottennase, Hut, Schal und Arme wählen, einen Namen geben und das Bild speichern oder per Link teilen.",
    ogTitle: "Schneemann bauen ⛄",
    ogDescription: "Rolle, stapele und kleide deinen eigenen Schneemann in einer Minute ein und schick ihn an eine Freundin oder einen Freund."
  },
  siteName: "Schneemann bauen",
  privacyLink: "Datenschutzerklärung",
  start: {
    badge: "⛄ Winterspecial",
    h1Kicker: "Schneemann bauen online",
    h1Html: "Dein eigener<br><em>Schneemann</em>",
    hook: "Handschuhe brauchst du nicht. Such jedes Teil selbst aus, sieh dem Schnee beim Fallen zu und schick deinen Schneemann an jemanden, der ein Lächeln gebrauchen kann.",
    start: "Jetzt bauen →"
  },
  editor: {
    title: "Bau deinen Schneemann",
    canvasAria: "Vorschau deines Schneemanns in einer Winterlandschaft",
    stepOf: "Schritt {n} von {max}",
    steps: {
      body: "Körper",
      face: "Gesicht",
      nose: "Nase",
      hat: "Hut",
      scarf: "Schal",
      arms: "Arme",
      extras: "Extras",
      scene: "Szene",
      name: "Name"
    },
    labels: {
      body: "Schneebälle",
      eyes: "Augen",
      mouth: "Mund",
      nose: "Nase",
      hat: "Hut",
      scarf: "Schalfarbe",
      pattern: "Muster",
      arms: "Arme",
      extras: "Extras (beliebig viele)",
      scene: "Hintergrund",
      name: "Name (optional)"
    },
    bodies: {
      classic: "Klassisch",
      duo: "Zwei Kugeln",
      chubby: "Pummelig",
      slim: "Schlank"
    },
    eyes: {
      coal: "Kohle",
      buttons: "Knöpfe",
      sparkly: "Glitzer",
      sleepy: "Verschlafen"
    },
    mouths: {
      pebbles: "Steinchen",
      smile: "Lächeln",
      grin: "Grinsen",
      oh: "Oh!"
    },
    noses: {
      carrot: "Karotte",
      long: "Lange Möhre",
      berry: "Beere",
      pinecone: "Zapfen"
    },
    hats: {
      top: "Zylinder",
      beanie: "Mütze",
      santa: "Nikolaus",
      bucket: "Eimer",
      earmuffs: "Ohrenwärmer",
      none: "Ohne Hut"
    },
    scarves: {
      red: "Rot",
      green: "Grün",
      blue: "Blau",
      yellow: "Gelb",
      purple: "Lila",
      none: "Ohne Schal"
    },
    patterns: {
      solid: "Einfarbig",
      stripes: "Streifen",
      dots: "Punkte"
    },
    arms: {
      twigs: "Zweige",
      mittens: "Fäustlinge",
      wave: "Winkend",
      none: "Ohne Arme"
    },
    extras: {
      broom: "Besen",
      buttons: "Knöpfe",
      bird: "Vögelchen",
      flakes: "Funkeln"
    },
    scenes: {
      night: "Schneenacht",
      sunny: "Sonnenwiese",
      village: "Dorflichter"
    },
    random: "Überrasch mich",
    back: "← Zurück",
    next: "Weiter →",
    done: "Schneemann fertig",
    namePlaceholder: "z. B. Schneeball",
    ideas: "💡 Ideen",
    counter: "{n}/{max}",
    namePresets: [
      "Schneeball",
      "Herr Frostbeule",
      "Flöckchen",
      "Graf Eisbart",
      "Knöpfchen"
    ]
  },
  card: {
    named: "Das ist {name}!"
  },
  result: {
    eyebrowMine: "Dein Schneemann ist fertig!",
    eyebrowFriend: "Jemand hat {name} extra für dich gebaut",
    eyebrowFriendNoName: "Jemand hat einen Schneemann extra für dich gebaut",
    revealHint: "Er steckt noch unter frischem Schnee …",
    reveal: "❄️ Schnee wegwischen",
    imageAlt: "Ein Schneemann in einer Winterlandschaft",
    save: "Bild speichern",
    saving: "Dein Bild wird erstellt …",
    saved: "Bild gespeichert!",
    saveFail: "Das Bild konnte nicht erstellt werden. Mach stattdessen einen Screenshot.",
    edit: "Weiterbauen",
    retry: "Neuen Schneemann bauen",
    retryFriend: "Selbst einen bauen",
    shareTitle: "Schneemann bauen",
    shareText: "Das ist {name}, der Schneemann, den ich gebaut habe ⛄ Schau mal:",
    shareTextNoName: "Schau dir den Schneemann an, den ich gebaut habe ⛄",
    fileName: "schneemann"
  },
  og: {
    brand: "⛄ Schneemann bauen",
    defaultKicker: "Schneemann bauen online",
    defaultTitle: "Rollen, stapeln und einkleiden",
    defaultDesc: "Hüte · Schals · Schneefall · speichern oder teilen"
  },
  faq: [
    {
      q: "Wie baue ich meinen Schneemann?",
      a: "Geh die Schritte unter dem Bild durch: Schneebälle, Gesicht, Nase, Hut, Schal, Arme, Extras und Hintergrund. Tippe eine Option an, um sie auszuprobieren – der Schneemann ändert sich sofort. Zwischen den Schritten kannst du jederzeit springen."
    },
    {
      q: "Was macht „Überrasch mich“?",
      a: "Der Knopf wählt für dich eine zufällige Kombination aus allen Teilen. Tippe so lange, bis dir eine gefällt, und ändere dann einzelne Teile von Hand."
    },
    {
      q: "Wie speichere oder verschicke ich meinen Schneemann?",
      a: "Tippe auf „Schneemann fertig“. „Bild speichern“ erzeugt ein PNG mit 1080×1350 Pixeln, über die Teilen-Buttons verschickst du einen Link. Wer ihn öffnet, wischt den Schnee weg, lernt deinen Schneemann kennen und kann gleich einen eigenen bauen."
    },
    {
      q: "Wo wird mein Schneemann gespeichert?",
      a: "Deine Auswahl und der Name stecken nur im Link und, solange du baust, in deinem eigenen Browser. Nichts davon wird an unseren Server geschickt – deshalb kann jeder mit dem Link deinen Schneemann sehen."
    }
  ],
  privacy: {
    title: "Datenschutzerklärung | Schneemann bauen",
    description: "Datenschutzerklärung von Schneemann bauen: Umgang mit Schneemann und Namen, Cookies, Werbung und anonymen Statistiken.",
    h1: "Datenschutzerklärung",
    introHtml: "Schneemann bauen (der „Dienst“) achtet Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, unbedingt nötigen Informationen.",
    sections: [
      [
        "1. Erhobene Informationen",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Ihr Schneemann und der eingegebene Name werden nie an einen Server gesendet. Sie bleiben in Ihrem Browser (während des Bauens wird ein Entwurf im lokalen Speicher abgelegt) und beim Teilen in der URL. Bei der Nutzung des Dienstes können automatisch einige Informationen erfasst werden, wie unten beschrieben."
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
        "Zur Verbesserung des Dienstes nutzen wir unter Umständen Google Analytics (GA4) sowie eigene aggregierte Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, fertige Schneemänner, Sternebewertungen). Nichts davon identifiziert Sie persönlich, und der Name Ihres Schneemanns ist darin nicht enthalten."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Mit „Teilen“ erstellte Links enthalten Ihren Schneemann, kodiert in der URL. Jede Person mit dem Link kann ihn also sehen. Gespeicherte Bilder entstehen direkt in Ihrem Browser. Bitte schreiben Sie keine Adressen, Telefonnummern oder andere persönliche Angaben in den Namen."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültig ab",
        "Diese Erklärung gilt ab dem 9. November 2026."
      ]
    ],
    back: "← Zurück zu Schneemann bauen"
  }
};
