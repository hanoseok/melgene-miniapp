/* Urkunde erstellen — Deutsch (de/). Gleiche Schlüsselstruktur wie en.js; Hinweise siehe Kopf von en.js. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "",
    wordBreak: "normal",
    hyphens: "auto"
  },
  meta: {
    title: "Urkunde erstellen: lustige Urkunden gratis",
    description: "Urkunde erstellen: Titel, Name und Begründung eintragen, Rahmen und Siegel wählen – als A4-Bild speichern oder als Link schicken, der wie eine Verleihung startet.",
    ogTitle: "Urkunde erstellen 🏆",
    ogDescription: "Lustige oder herzliche Urkunde in einer Minute – und per Link feierlich überreichen."
  },
  siteName: "Urkunden-Generator",
  privacyLink: "Datenschutz",
  start: {
    badge: "🏆 Zeit für die Jahresehrung",
    h1Kicker: "Urkunde erstellen",
    h1Html: "Irgendwer hat<br><em>eine Urkunde</em> verdient",
    hook: "Titel ausdenken, Grund aufschreiben und per Link überreichen – er öffnet sich wie eine echte Verleihung.",
    start: "Urkunde erstellen →"
  },
  editor: {
    title: "Urkunde gestalten",
    themesAria: "Urkunden-Designs",
    themes: {
      gold: "Goldrahmen",
      pastel: "Pastell",
      minimal: "Schlicht",
      ribbon: "Retro-Band"
    },
    previewAria: "Vorschau der Urkunde",
    examplesAria: "Ideen für den Titel",
    sealLabel: "Siegel",
    seals: {
      none: "Keins",
      red: "Rotes Siegel",
      gold: "Goldmedaille"
    },
    fields: {
      title: {
        label: "Titel der Ehrung",
        placeholder: "z. B. Kollege des Jahres"
      },
      to: {
        label: "Verliehen an",
        placeholder: "z. B. Lena"
      },
      reason: {
        label: "Begründung",
        placeholder: "Für …"
      },
      date: {
        label: "Datum"
      },
      issuer: {
        label: "Überreicht von",
        placeholder: "z. B. Das Kaffee-Komitee"
      }
    },
    titleExamples: [
      "Kollege des Jahres",
      "Snack-Held des Büros",
      "Gute-Laune-Preis",
      "Meister der Reaktion"
    ],
    dice: "🎲 Zufall",
    counter: "{n}/{max}",
    reasons: [
      "Für unerschöpfliche Geduld bei jeder „kurzen Frage“ – sogar am Montagmorgen.",
      "Für ein ganzes Jahr Gruppenchat-Unterhaltung mit Memes in bester Qualität.",
      "Für das Wissen, wo Ladekabel, Schere und die guten Kulis versteckt sind.",
      "Für die Kunst, aus jedem grauen Dienstag eine Geschichte zu machen.",
      "Für ehrliches Lachen über unsere Witze – auch beim dritten Mal.",
      "Für jedes „Ich mach das“ als Erster und jedes Aufräumen als Letzter.",
      "Für stoische Ruhe bei Papierstau, Zugverspätung und verbranntem Toast.",
      "Für das Teilen des letzten Kekses, obwohl es niemand gemerkt hätte.",
      "Für Geburtstage, Kaffeewünsche und all die kleinen Dinge, die zählen.",
      "Für das Dasein, jedes Mal genau dann, wenn es darauf ankam.",
      "Für den Mut, das neue Rezept als Erster zu probieren, damit wir es nicht mussten.",
      "Für den Beweis, dass Freundlichkeit eine Superkraft ist. Schön, dass es dich gibt."
    ],
    done: "Urkunde fertig"
  },
  card: {
    heading: "Urkunde",
    defaultTitle: "Ehrenpreis",
    presented: "Diese Urkunde wird feierlich verliehen an",
    name: "{name}",
    closing: "In Anerkennung dieser Leistung mit herzlichem Dank überreicht.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Verleihung",
    forName: "Eine Urkunde für {name}",
    forNone: "Eine Urkunde nur für dich",
    hint: "Tippe auf die Rolle, um sie zu öffnen",
    open: "Urkunde aufrollen"
  },
  result: {
    eyebrowMine: "Deine Urkunde ist fertig!",
    eyebrowFriend: "Glückwunsch, {name}!",
    eyebrowFriendNoName: "Herzlichen Glückwunsch!",
    imageAlt: "Urkunde: {title}",
    save: "Bild speichern",
    saving: "Bild wird erstellt …",
    saved: "Bild gespeichert!",
    saveFail: "Bild konnte nicht erstellt werden. Mach lieber einen Screenshot.",
    edit: "Bearbeiten",
    retry: "Neue Urkunde",
    retryFriend: "Eigene Urkunde machen",
    shareTitle: "Urkunde erstellen",
    shareText: "Für {name} gibt es eine Urkunde 🏆 Hier zur Verleihung:",
    shareTextNoName: "Jemand hat dir eine Urkunde gemacht 🏆 Hier zur Verleihung:",
    fileName: "urkunde"
  },
  og: {
    brand: "🏆 Urkunden-Generator",
    defaultKicker: "Urkunde erstellen",
    defaultTitle: "Irgendwer hat eine Urkunde verdient",
    defaultDesc: "4 Designs · Siegel · A4-Bild oder Verleihungs-Link",
    sampleTitle: "Snack-Held des Büros"
  },
  faq: [
    {
      q: "Wie erstelle ich eine Urkunde?",
      a: "Wähle eines von vier Designs, trage Titel, Namen und Begründung ein und lege Datum, Absender und Siegel fest. Die Vorschau ändert sich beim Tippen. Wenn alles passt, tippe auf „Urkunde fertig“."
    },
    {
      q: "Wie groß ist das gespeicherte Bild?",
      a: "„Bild speichern“ erzeugt ein PNG mit 1240×1754 Pixeln im A4-Format. Es lässt sich sauber auf A4 drucken und bleibt im Chat scharf. Auf dem Handy öffnet sich das Teilen-Menü, am Computer wird es heruntergeladen."
    },
    {
      q: "Was sieht die Person, die meinen Link öffnet?",
      a: "Eine kleine Verleihung: Eine Rolle erscheint, ein Tipp darauf, und die Urkunde mit ihrem Namen rollt sich auf. Überschrift und Datum erscheinen in ihrer Sprache, und sie kann direkt eine eigene Urkunde machen."
    },
    {
      q: "Wo wird mein Text gespeichert?",
      a: "Nur im Link und in deinem eigenen Browser. Nichts davon wird an unseren Server geschickt – wer den Link hat, kann die Urkunde lesen. Teile ihn also nur mit den richtigen Leuten."
    }
  ],
  privacy: {
    title: "Datenschutzerklärung | Urkunde erstellen",
    description: "Datenschutzerklärung des Urkunden-Generators: Umgang mit deinem Text, Cookies, Werbung und anonyme Statistik.",
    h1: "Datenschutzerklärung",
    introHtml: "Der Urkunden-Generator (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, minimal nötigen Informationen.",
    sections: [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Titel, Namen, Begründung und Datum, die du eingibst, werden nie an einen Server gesendet. Sie bleiben in deinem Browser (beim Bearbeiten als Entwurf im lokalen Speicher) und beim Teilen in der URL. Einige Informationen können bei der Nutzung automatisch erhoben werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst Cookies in den Browser-Einstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies nutzen, um Anzeigen auf Grundlage früherer Besuche dieser und anderer Websites auszuspielen. Mehr dazu und Einstellungen unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Zur Verbesserung des Dienstes nutzen wir ggf. Google Analytics (GA4) und eigene Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, fertige Urkunden, Sternebewertungen). Nichts davon identifiziert dich, und nichts davon enthält deinen Text."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Mit „Teilen“ erstellte Links enthalten deine Urkunde verschlüsselt in der URL, sodass jeder mit dem Link sie sehen kann. Gespeicherte Bilder entstehen in deinem Browser. Bitte keine Adressen, Telefonnummern oder andere persönliche Daten auf die Urkunde schreiben."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültig ab",
        "Diese Erklärung gilt ab dem 15. November 2026."
      ]
    ],
    back: "← Zurück zum Urkunden-Generator"
  }
};
