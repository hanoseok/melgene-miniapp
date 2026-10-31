/* Weihnachtskarte erstellen — Deutsch (/de/). Gleiche Schlüssel wie en.js. {name} {greeting} {n} {max} bitte unverändert lassen. */
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
    title: "Weihnachtskarte erstellen & online verschicken",
    description: "Weihnachtskarte erstellen: Motiv und Gruß wählen, Namen und ein paar liebe Worte eintragen, dann als Bild speichern oder als Link schicken, der sich wie ein Umschlag öffnet.",
    ogTitle: "Weihnachtskarte erstellen 🎄",
    ogDescription: "In einer Minute eine gemütliche Weihnachtskarte gestalten und an deine Liebsten schicken."
  },
  siteName: "Weihnachtskarte",
  privacyLink: "Datenschutz",
  start: {
    badge: "🎄 Zum Fest",
    h1Kicker: "Weihnachtskarte erstellen",
    h1Html: "Liebe Grüße<br><em>zu Weihnachten</em>",
    hook: "Schönes Motiv wählen, ein paar liebe Worte schreiben und eine Karte verschicken, die sich wie ein echter Umschlag öffnet.",
    start: "Karte gestalten →"
  },
  editor: {
    title: "Gestalte deine Karte",
    themesAria: "Kartenmotive",
    themes: {
      classic: "Klassisch",
      snowy: "Schneenacht",
      golden: "Gold",
      cute: "Süß",
      minimal: "Schlicht",
      forest: "Winterwald"
    },
    previewAria: "Vorschau deiner Karte",
    greetingsLabel: "Gruß",
    decoLabel: "Deko",
    decos: {
      snow: "Schnee",
      lights: "Lichter",
      sparkle: "Glitzer"
    },
    fields: {
      to: {
        label: "Für",
        placeholder: "z. B. Oma"
      },
      from: {
        label: "Von",
        placeholder: "z. B. Lena"
      },
      message: {
        label: "Deine Nachricht",
        placeholder: "Schreib ein paar liebe Worte …"
      }
    },
    ideas: "💡 Ideen",
    counter: "{n}/{max}",
    presets: [
      "Danke, dass du das ganze Jahr für mich da warst. Ich wünsche dir eine gemütliche Weihnachtszeit!",
      "Lass dich verwöhnen: Plätzchen, Kerzenschein und ganz viel Zeit mit deinen Liebsten.",
      "Auch wenn wir uns gerade selten sehen – ich denk an dich. Bis bald auf einen Glühwein!",
      "Ein turbulentes Jahr geht zu Ende. Erhol dich gut und rutsch gut ins neue Jahr!",
      "Frohe Festtage und ein neues Jahr voller Gesundheit, Glück und schöner Momente!"
    ],
    defaultGreeting: "merry",
    done: "Karte fertigstellen"
  },
  card: {
    greetings: {
      merry: "Frohe Weihnachten!",
      holidays: "Schöne Feiertage!",
      newyear: "Frohes neues Jahr!",
      seasons: "Frohes Fest!"
    },
    to: "Für {name}",
    from: "Alles Liebe, {name}"
  },
  open: {
    eyebrow: "Du hast eine Weihnachtskarte bekommen",
    fromName: "von {name}",
    fromNone: "von jemandem, der an dich denkt",
    open: "Karte öffnen"
  },
  result: {
    eyebrowMine: "Deine Karte ist fertig!",
    eyebrowFriend: "Eine Karte von {name}",
    eyebrowFriendNoName: "Eine Karte nur für dich",
    imageAlt: "Weihnachtskarte: {greeting}",
    save: "Bild speichern",
    saving: "Bild wird erstellt …",
    saved: "Bild gespeichert!",
    saveFail: "Bild konnte nicht erstellt werden. Mach lieber einen Screenshot.",
    copyText: "Text kopieren",
    copied: "Text kopiert!",
    copyFail: "Kopieren hat nicht geklappt. Versuch es noch mal.",
    edit: "Bearbeiten",
    retry: "Noch eine Karte",
    retryFriend: "Eigene Karte gestalten",
    shareTitle: "Weihnachtskarte erstellen",
    shareText: "{name} hat dir eine Weihnachtskarte geschickt 🎄 Hier öffnen:",
    shareTextNoName: "Du hast eine Weihnachtskarte bekommen 🎄 Hier öffnen:",
    fileName: "weihnachtskarte"
  },
  og: {
    brand: "🎄 Weihnachtskarte",
    defaultKicker: "Weihnachtskarte erstellen",
    defaultTitle: "Liebe Grüße zu Weihnachten",
    defaultDesc: "6 Motive · als Bild speichern oder als Link schicken",
    cardGreeting: "Frohe Weihnachten!"
  },
  faq: [
    {
      q: "Wie gestalte ich meine Karte?",
      a: "Motiv und Gruß wählen, Schnee, Lichter und Glitzer an- oder ausschalten, dann Empfänger, Absender und eine kurze Nachricht eintragen. Die Vorschau ändert sich sofort – tippe auf „Karte fertigstellen“, wenn alles passt."
    },
    {
      q: "Kann ich die Karte als Bild speichern?",
      a: "Ja. „Bild speichern“ erstellt ein PNG mit 1080×1350 Pixeln, ideal für WhatsApp oder Storys. Am Handy öffnet sich das Teilen-Menü, am Computer wird das Bild heruntergeladen."
    },
    {
      q: "Was sieht die Person, die meinen Link öffnet?",
      a: "Zuerst einen verschlossenen Umschlag. Ein Tippen öffnet ihn und die Karte erscheint – der Gruß in der eigenen Sprache. Danach kann sie direkt selbst eine Karte gestalten."
    },
    {
      q: "Wo wird meine Nachricht gespeichert?",
      a: "Nur im Link und, solange du schreibst, in deinem eigenen Browser. Nichts wird an unseren Server geschickt. Wer den Link hat, kann die Karte aber lesen – teile ihn also nur mit den richtigen Leuten."
    }
  ],
  privacy: {
    title: "Datenschutzerklärung | Weihnachtskarte",
    description: "Datenschutzerklärung für Weihnachtskarte: wie der Text deiner Karte behandelt wird, Cookies, Werbung und anonyme Statistiken.",
    h1: "Datenschutzerklärung",
    introHtml: "Weihnachtskarte (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, unbedingt nötigen Informationen.",
    sections: [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Namen und Nachricht, die Sie eingeben, werden nie an einen Server gesendet. Sie bleiben in Ihrem Browser (während der Bearbeitung als Entwurf im lokalen Speicher) und beim Teilen in der URL. Einige Informationen können bei der Nutzung automatisch erfasst werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung zu verstehen. Sie können Cookies in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage Ihrer früheren Besuche auszuspielen. Mehr dazu und Einstellungen unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene zusammengefasste Zähler nutzen, die nur Tagessummen je Sprache speichern (Seitenaufrufe, fertige Karten, Bewertungen). Nichts davon identifiziert Sie persönlich, und Ihre Nachricht ist nie enthalten."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Links, die Sie über „Teilen“ erstellen, enthalten Ihre Karte kodiert in der URL – wer den Link hat, kann sie sehen. Gespeicherte Bilder entstehen in Ihrem Browser. Bitte schreiben Sie keine Adressen, Telefonnummern oder andere persönlichen Daten in die Nachricht."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültig ab",
        "Diese Erklärung gilt ab dem 1. November 2026."
      ]
    ],
    back: "← Zurück zur Weihnachtskarte"
  }
};
