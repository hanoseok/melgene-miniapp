/* Schneeflocken-Maker — Deutsch (/de/ Kopie). Gleiche Schlüssel wie en.js. Natürlich formulieren, nicht wörtlich übersetzen.
 * Schlüssel mit Endung Html werden unverändert eingefügt (nur <br> und <em>). */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Nunito'",
    scriptWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "auto"
  },
  meta: {
    title: "Schneeflocke online erstellen · Schneeflocken-Maker",
    description: "Erstelle deine eigene symmetrische Schneeflocke online. Stell Arme, Detailgrad und Größe ein, wähle Form und Farbe und speichere ein PNG mit 1080 × 1080 Pixeln oder teile einen Link.",
    ogTitle: "Eine Schneeflocke basteln ❄️",
    ogDescription: "Mit wenigen Klicks wächst deine eigene sechsstrahlige Schneeflocke. Speichern oder an Freunde schicken."
  },
  siteName: "Schneeflocken-Maker",
  privacyLink: "Datenschutzerklärung",
  start: {
    badge: "❄️ Winter-Special",
    h1Kicker: "Schneeflocke online erstellen",
    h1Html: "Lass deine Schneeflocke<br><em>ganz allein wachsen</em>",
    hook: "Ein paar Klicks, und eine perfekt symmetrische Schneeflocke entsteht vor deinen Augen. Als Bild speichern oder den Link an Freunde schicken.",
    start: "Jetzt basteln →"
  },
  editor: {
    title: "Bastle deine Schneeflocke",
    canvasAria: "Vorschau deiner Schneeflocke",
    labels: {
      arms: "Arme pro Seite",
      complexity: "Detailgrad",
      size: "Armlänge"
    },
    levels: {
      complexity: ["Einfach", "Mittel", "Fein"],
      size: ["Kurz", "Mittel", "Lang"]
    },
    buttons: {
      newFlake: "Neue Schneeflocke",
      shape: "Form ändern",
      color: "Farbe ändern",
      save: "PNG speichern",
      share: "Teilen",
      done: "Fertig, zeig sie mir"
    },
    shapes: {
      needle: "Nadeln",
      plate: "Plättchen",
      spike: "Stacheln",
      feather: "Federn"
    },
    palettes: ["Eisblau", "Frostweiß", "Flieder", "Mitternachtsgold", "Minze"],
    status: {
      copied: "Link kopiert!",
      copyFail: "Der Link konnte nicht kopiert werden. Speichere lieber das PNG.",
      shared: "Geteilt!",
      saving: "Bild wird erstellt…",
      saved: "Bild gespeichert!",
      saveFail: "Das Bild konnte nicht erstellt werden. Mach doch einen Screenshot."
    }
  },
  result: {
    eyebrowMine: "Deine Schneeflocke ist fertig!",
    eyebrowFriend: "Ein Freund hat diese Schneeflocke für dich gemacht",
    save: "PNG speichern",
    edit: "Weiter basteln",
    retry: "Neue Schneeflocke basteln",
    retryFriend: "Meine eigene basteln",
    shareTitle: "Schneeflocken-Maker",
    shareText: "Schau dir die Schneeflocke an, die ich gebastelt habe ❄️ Öffne den Link, dann siehst du sie:",
    fileName: "schneeflocke"
  },
  og: {
    brand: "❄️ Schneeflocken-Maker",
    defaultKicker: "Schneeflocke online erstellen",
    defaultTitle: "Lass deine Schneeflocke ganz allein wachsen",
    defaultDesc: "Sechs Arme · Formen · Farben · speichern oder teilen"
  },
  faq: [
    {
      q: "Wie entsteht eine Schneeflocke?",
      a: "Tippe auf „Neue Schneeflocke“ für ein frisches Muster und stell dann mit den drei Reglern Arme, Detailgrad und Armlänge ein. Jede Flocke besteht aus einem Arm, der sechsmal gedreht und gespiegelt wird, deshalb wirkt sie immer symmetrisch."
    },
    {
      q: "Was machen die Buttons für Form und Farbe?",
      a: "„Form ändern“ wechselt, wie die Arme gezeichnet werden: als Nadeln, Plättchen, Stacheln oder Federn, bei gleichem Muster. „Farbe ändern“ tauscht Hintergrund und Linienfarbe. Probier beides an derselben Flocke aus."
    },
    {
      q: "Wie speichere oder teile ich meine Schneeflocke?",
      a: "„PNG speichern“ lädt ein Bild mit 1080 × 1080 Pixeln herunter. „Teilen“ erzeugt einen Link mit deinen Einstellungen. Wer ihn öffnet, sieht dieselbe Schneeflocke."
    },
    {
      q: "Wird meine Schneeflocke irgendwo gespeichert?",
      a: "Nein. Die Flocke steckt nur im Bild und im Link. Beim Speichern oder Teilen wird nichts von dem, was du gebastelt hast, auf unseren Server hochgeladen."
    }
  ],
  privacy: {
    title: "Datenschutzerklärung | Schneeflocken-Maker",
    description: "Datenschutzerklärung für den Schneeflocken-Maker: Umgang mit deiner Schneeflocke, Cookies, Werbung und anonyme Statistiken.",
    h1: "Datenschutzerklärung",
    introHtml: "Der Schneeflocken-Maker (der „Dienst“) achtet deine Privatsphäre und verarbeitet nur die unten beschriebenen, notwendigen Informationen.",
    sections: [
      [
        "1. Welche Informationen wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Die Einstellungen deiner Schneeflocke werden nie an einen Server gesendet. Sie bleiben in deinem Browser und im Link, wenn du ihn teilst. Während der Nutzung können wie unten beschrieben automatisch einige Informationen erhoben werden."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst Cookies in deinen Browser-Einstellungen ablehnen oder löschen; dann funktionieren manche Funktionen womöglich nicht wie vorgesehen."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Werbung auf Basis früherer Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und Einstellungen findest du unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Werbeeinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, fertige Schneeflocken). Damit wirst du nicht persönlich identifiziert."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Ein mit „Teilen“ erstellter Link enthält deine Einstellungen in der URL. Wer den Link hat, sieht dieselbe Schneeflocke. Gespeicherte Bilder entstehen in deinem Browser und werden nicht zu uns hochgeladen."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültigkeit",
        "Diese Erklärung gilt ab dem 11. November 2026."
      ]
    ],
    back: "← Zurück zum Schneeflocken-Maker"
  }
};
