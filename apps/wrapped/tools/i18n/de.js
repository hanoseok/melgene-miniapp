/* Jahresrückblick-Karte — Deutsch (du). Key structure = en.js; see en.js for notes ({year}/{next} are filled in by the browser — never write a year as digits). */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "script": "'Pacifico'",
    "scriptWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Jahresrückblick-Karte erstellen: Dein Jahr kompakt",
    "description": "Jahresrückblick als Karte: Wort des Jahres, schönster Moment, Song, Essen, Ort, wem du danken willst und dein Ziel fürs neue Jahr eintragen, Design wählen und teilen.",
    "ogTitle": "Jahresrückblick-Karte 🎁",
    "ogDescription": "Dein Jahr auf einer Karte: ein Wort, ein Song, ein unvergesslicher Moment und was als Nächstes kommt."
  },
  "siteName": "Jahresrückblick-Karte",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🎁 Zum Jahresende",
    "h1Kicker": "Jahresrückblick-Karte",
    "h1Html": "Dein Jahr<br><em>auf einer Karte</em>",
    "hook": "Ein Wort, ein Song, ein Moment, den du nie vergisst. Ein paar Zeilen eintragen – fertig ist die Karte, die dein Jahr zusammenfasst.",
    "start": "Karte erstellen →"
  },
  "editor": {
    "title": "Dein Jahr in ein paar Zeilen",
    "themesAria": "Kartendesigns",
    "themes": {
      "aurora": "Polarlicht",
      "sunset": "Abendrot",
      "mint": "Minze",
      "midnight": "Mitternacht",
      "paper": "Papier",
      "neon": "Neon"
    },
    "previewAria": "Vorschau deiner Karte",
    "fields": {
      "nm": {
        "label": "Dein Name (optional)",
        "placeholder": "z. B. Lena"
      },
      "w": {
        "label": "Dein Wort des Jahres",
        "placeholder": "Ein Wort für dein Jahr"
      },
      "mo": {
        "label": "Schönster Moment",
        "placeholder": "z. B. Wintermeer mit meiner Schwester"
      },
      "so": {
        "label": "Song des Jahres",
        "placeholder": "Der Song in Dauerschleife"
      },
      "fo": {
        "label": "Essen des Jahres",
        "placeholder": "z. B. Döner nach Mitternacht"
      },
      "pl": {
        "label": "Ort des Jahres",
        "placeholder": "z. B. das kleine Café am Büro"
      },
      "th": {
        "label": "Danke an",
        "placeholder": "z. B. Mama, mein Team, Jonas"
      },
      "go": {
        "label": "Ziel fürs nächste Jahr",
        "placeholder": "z. B. 10 km laufen"
      }
    },
    "ideasAria": "Wort-Ideen",
    "ideas": [
      "Mut",
      "Wachstum",
      "Neustart",
      "Gelassenheit",
      "Dankbarkeit"
    ],
    "needWord": "Trag zuerst dein Wort des Jahres ein – der Rest ist optional.",
    "done": "Karte fertigstellen"
  },
  "card": {
    "kicker": "JAHRESRÜCKBLICK",
    "titleMine": "Mein {year}",
    "titleName": "Das Jahr {year} von {name}",
    "word": "Mein Wort des Jahres",
    "rows": {
      "mo": "Schönster Moment",
      "so": "Song des Jahres",
      "fo": "Essen des Jahres",
      "pl": "Ort des Jahres",
      "th": "Danke an",
      "go": "Ziel für {next}"
    }
  },
  "result": {
    "eyebrowMine": "Dein Rückblick auf {year} ist fertig!",
    "eyebrowFriend": "{name} blickt auf {year} zurück",
    "eyebrowFriendNoName": "Ein Jahresrückblick auf {year}",
    "imageAlt": "Jahresrückblick-Karte. Wort des Jahres: {word}",
    "save": "Bild speichern",
    "saving": "Bild wird erstellt…",
    "saved": "Bild gespeichert!",
    "saveFail": "Das Bild konnte nicht erstellt werden. Mach lieber einen Screenshot.",
    "copyText": "Text kopieren",
    "copied": "Text kopiert!",
    "copyFail": "Kopieren hat nicht geklappt. Versuch’s noch mal.",
    "edit": "Bearbeiten",
    "retry": "Neue Karte erstellen",
    "retryFriend": "Meine eigene erstellen",
    "shareTitle": "Jahresrückblick-Karte",
    "shareText": "{name} blickt auf {year} zurück 🎁 Schau mal:",
    "shareTextNoName": "Mein Jahresrückblick {year} 🎁 Schau mal:",
    "fileName": "jahresrueckblick"
  },
  "og": {
    "brand": "🎁 Jahresrückblick-Karte",
    "defaultKicker": "Jahresrückblick-Karte",
    "defaultTitle": "Dein Jahr auf einer Karte",
    "defaultDesc": "6 Designs · Wort, Song, Moment · speichern oder teilen",
    "cardKicker": "JAHRESRÜCKBLICK",
    "cardWord": "Mut",
    "cardRows": [
      "Schönster Moment",
      "Song des Jahres",
      "Ziel"
    ]
  },
  "faq": [
    {
      "q": "Was muss ich ausfüllen?",
      "a": "Nur dein Wort des Jahres. Name, schönster Moment, Song, Essen, Ort, wem du danken willst und dein Ziel sind optional – leere Zeilen erscheinen einfach nicht auf der Karte."
    },
    {
      "q": "Welches Jahr steht auf der Karte?",
      "a": "Das Jahr, auf das du gerade zurückblickst – nach dem Datum deines Geräts. Im Januar zeigt die Karte noch das gerade vergangene Jahr, du kannst sie also auch etwas später machen."
    },
    {
      "q": "Kann ich die Karte als Bild speichern?",
      "a": "Ja. „Bild speichern“ erstellt ein PNG mit 1080×1350 Pixeln, passend für Storys und Chats. Am Handy öffnet sich das Teilen-Menü, am Computer wird das Bild heruntergeladen."
    },
    {
      "q": "Wo wird gespeichert, was ich schreibe?",
      "a": "Nur in deinem eigenen Browser, solange du bearbeitest, und im Link, wenn du ihn teilst. Nichts davon wird an unseren Server geschickt. Wer den Link hat, kann die Karte sehen – teil ihn also nur mit Menschen, denen du vertraust."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Jahresrückblick-Karte",
    "description": "Datenschutzerklärung für die Jahresrückblick-Karte: wie der Text deiner Karte behandelt wird, Cookies, Werbung und anonyme Statistiken.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Die Jahresrückblick-Karte (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, unbedingt nötigen Informationen.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und ohne Anmeldung. Was Sie auf Ihre Karte schreiben, wird nie an einen Server gesendet. Es bleibt in Ihrem Browser (während der Bearbeitung als Entwurf im lokalen Speicher) und beim Teilen in der URL. Einige Informationen können bei der Nutzung automatisch erfasst werden, wie unten beschrieben."
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
        "Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene zusammengefasste Zähler nutzen, die nur Tagessummen je Sprache speichern (Seitenaufrufe, fertige Karten, Bewertungen). Nichts davon identifiziert Sie persönlich, und der Inhalt Ihrer Karte ist nie enthalten."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Links, die Sie über „Teilen“ erstellen, enthalten Ihre Karte kodiert in der URL – wer den Link hat, kann sie sehen. Gespeicherte Bilder entstehen in Ihrem Browser. Bitte schreiben Sie keine Adressen, Telefonnummern oder andere persönlichen Daten auf die Karte."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültig ab",
        "Diese Erklärung gilt ab dem 3. November 2026."
      ]
    ],
    "back": "← Zurück zur Jahresrückblick-Karte"
  }
};
