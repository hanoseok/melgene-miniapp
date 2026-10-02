/* Halloween-Party-Einladung erstellen — Deutsch
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "auto"
  },
  meta: {
    title: "Halloween-Party-Einladung erstellen",
    description: "Halloween-Party-Einladung erstellen: Name, Datum, Uhrzeit, Ort eintragen, Motiv wählen (Gespenst, Kürbis, Fledermaus, Hexe), Bild speichern oder Link teilen. Gratis.",
    ogTitle: "Halloween-Einladung erstellen 🎃",
    ogDescription: "Gruselige Party-Einladung in einer Minute gestalten und an deine Gäste schicken."
  },
  siteName: "Halloween-Party-Einladung erstellen",
  privacyLink: "Datenschutz",
  start: {
    badge: "🎃 Halloween-Special",
    h1Kicker: "Halloween-Party-Einladung",
    h1Html: "Lade deine Gäste zur<br><em>Gruselparty ein</em>",
    hook: "Gib deiner Party einen Namen, such dir ein schaurig-schönes Motiv aus und verschick eine Einladung, die jeder gern öffnet.",
    start: "Einladung erstellen →"
  },
  editor: {
    title: "Gestalte deine Einladung",
    themesAria: "Einladungsmotive",
    themes: {
      ghost: "Gespenst",
      pumpkin: "Kürbis",
      bat: "Fledermaus",
      witch: "Hexe",
      spider: "Spinne"
    },
    previewAria: "Vorschau deiner Einladung",
    fields: {
      title: {
        label: "Name der Party",
        placeholder: "z. B. Spukhaus-Party"
      },
      date: {
        label: "Datum"
      },
      time: {
        label: "Uhrzeit"
      },
      place: {
        label: "Ort",
        placeholder: "z. B. Bei mir, 3. Stock"
      },
      note: {
        label: "Ein Wort an die Gäste",
        placeholder: "z. B. Verkleidung erwünscht!"
      }
    },
    done: "Einladung fertig"
  },
  card: {
    invited: "Du bist eingeladen!",
    defaultTitle: "Halloween-Party"
  },
  result: {
    eyebrowMine: "Deine Einladung ist fertig!",
    eyebrowFriend: "Du hast eine Einladung bekommen",
    imageAlt: "Einladung: {title}",
    save: "Bild speichern",
    saving: "Bild wird erstellt …",
    saved: "Bild gespeichert!",
    saveFail: "Das Bild konnte nicht erstellt werden. Mach stattdessen einen Screenshot.",
    copyText: "Text kopieren",
    copied: "Text kopiert!",
    copyFail: "Kopieren hat nicht geklappt. Versuch es noch einmal.",
    edit: "Bearbeiten",
    retry: "Noch eine Einladung erstellen",
    retryFriend: "Eigene Einladung erstellen",
    shareTitle: "Halloween-Party-Einladung erstellen",
    shareText: "Du bist zu „{title}“ eingeladen! 🎃 Öffne die Einladung:",
    shareTextNoTitle: "Du bist zu meiner Halloween-Party eingeladen! 🎃 Öffne die Einladung:",
    fileName: "party-invitation"
  },
  og: {
    brand: "🎃 Halloween-Einladung",
    defaultKicker: "Halloween-Party",
    defaultTitle: "Gestalte deine Party-Einladung",
    defaultDesc: "Schaurig-schönes Motiv wählen · als Bild speichern oder Link teilen",
    cardTitle: "Halloween-Party"
  },
  faq: [
    {
      q: "Wie erstelle ich meine Einladung?",
      a: "Wähle ein Motiv, trag Partyname, Datum, Uhrzeit, Ort und ein Wort an die Gäste ein und tippe auf „Einladung fertig“. Alle Felder sind optional, und die Vorschau aktualisiert sich beim Tippen."
    },
    {
      q: "Kann ich die Einladung als Bild speichern?",
      a: "Ja. „Bild speichern“ erstellt ein PNG, das du in jedem Chat verschicken kannst. Auf dem Handy öffnet sich das Teilen-Menü, am Computer wird die Datei heruntergeladen."
    },
    {
      q: "Wie funktioniert der Teilen-Link?",
      a: "Die ganze Einladung steckt im Link selbst – wer ihn öffnet, sieht genau dieselbe Karte. Auf unseren Servern wird nichts gespeichert, und das Öffnen eines Links verändert deine eigene Einladung nicht."
    },
    {
      q: "Kann ich nur den Text verschicken?",
      a: "Ja. „Text kopieren“ kopiert Partyname, Datum, Uhrzeit, Ort, deine Nachricht und den Link, bereit zum Einfügen in jede Nachricht."
    }
  ],
  privacy: {
    title: "Datenschutzerklärung | Halloween-Party-Einladung erstellen",
    description: "Datenschutzerklärung für Halloween-Party-Einladung erstellen: wie deine Einladungsdaten verarbeitet werden, Cookies, Werbung und anonyme Statistik.",
    h1: "Datenschutzerklärung",
    introHtml: "Halloween-Party-Einladung erstellen (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.",
    sections: [
      [
        "1. Informationen, die wir erfassen",
        "Der Dienst funktioniert ohne Konto oder Anmeldung. Partyname, Datum, Uhrzeit, Ort und Nachricht, die du eingibst, werden nie an einen Server gesendet – sie bleiben in deinem Browser (und beim Teilen in der URL). Manche Informationen können automatisch erfasst werden, während du den Dienst nutzt, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung des Dienstes zu verstehen. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann möglicherweise nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Werbung basierend auf deinen früheren Besuchen anzuzeigen. Mehr erfährst du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>, wo du auch deine Einstellungen ändern kannst."
      ],
      [
        "4. Statistik",
        "Um den Dienst zu verbessern, nutzen wir möglicherweise Google Analytics (GA4) sowie eigene aggregierte Zähler, die nur tägliche Gesamtzahlen pro Sprache speichern (Seitenaufrufe, fertige Einladungen, Sternebewertungen). Nichts davon identifiziert dich persönlich."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Mit „Teilen“ erstellte Links enthalten deine Einladungsdaten, codiert in der URL. Gespeicherte Bilder werden in deinem Browser erstellt. Bitte gib beim Ort keine exakte private Adresse oder andere personenbezogene Informationen ein."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Richtlinie wende dich bitte an den Betreiber des Dienstes."
      ],
      [
        "7. Gültigkeitsdatum",
        "Diese Richtlinie gilt ab dem 3. Oktober 2026."
      ]
    ],
    back: "← Zurück zur Einladung"
  }
};
