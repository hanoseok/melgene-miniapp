/* Adventskalender erstellen — Deutsch (de/)
 * Designs, Grenzen, Datum und Linkformat in advent-core.js; Bildschirme und Canvas in advent.js. Diese Datei enthält alle sichtbaren Texte.
 * Schlüssel mit Html werden als HTML eingefügt (nur <br> und <em>); privacy.sections ebenfalls.
 * Startbildschirm = nur Teaser (kein Formular, keine FAQ). FAQ nur im gemeinsamen Endbildschirm.
 * Platzhalter {name} {n} {day} {date} {title} unverändert lassen. Pluralformen nach Intl.PluralRules (one, other).
 * editor.ideas = auf Deutsch geschriebene Nachrichten (keine Übersetzungen), je höchstens 80 Zeichen.
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
    title: "Adventskalender erstellen: 24 Türchen online",
    description: "Adventskalender online erstellen und verschenken: hinter jedem der 24 Türchen eine kurze Nachricht, per Link verschickt. Ab 1. Dezember öffnet sich täglich eins. Kostenlos.",
    ogTitle: "Adventskalender erstellen 🎄",
    ogDescription: "24 kleine Nachrichten für einen lieben Menschen. Im Dezember öffnet sich jeden Tag ein Türchen."
  },
  siteName: "Adventskalender erstellen",
  privacyLink: "Datenschutz",
  start: {
    badge: "🎄 Countdown bis Weihnachten",
    h1Kicker: "Adventskalender erstellen",
    h1Html: "24 kleine Türchen,<br>jeden Tag eine <em>Überraschung</em>",
    hook: "Versteck hinter jedem Türchen eine Nachricht für einen lieben Menschen. Ab dem 1. Dezember geht jeden Tag eins auf.",
    start: "Kalender erstellen →"
  },
  editor: {
    title: "Fülle deinen Kalender",
    themesAria: "Kalender-Designs",
    themes: {
      classic: "Klassisch",
      snow: "Verschneit",
      gold: "Sternengold",
      candy: "Zuckerstange"
    },
    fields: {
      to: { label: "Für", placeholder: "z. B. Lena" },
      from: { label: "Von", placeholder: "z. B. Jonas" }
    },
    daysLabel: "Nachrichten hinter den Türchen",
    daysHint: "Bis zu 80 Zeichen pro Türchen. Leere Türchen verstecken eine kleine Leckerei.",
    dayAria: "Nachricht für Türchen {day}",
    diceAria: "Zufällige Idee für Türchen {day}",
    placeholder: "Nachricht schreiben…",
    counter: "{n}/24 Türchen gefüllt",
    fillAll: "🎲 Leere füllen",
    preview: "👀 Vorschau",
    create: "Link erstellen",
    needOne: "Schreib zuerst mindestens eine Nachricht."
  },
  ideas: [
    "Guten Morgen! Heute ist ein wunderbarer Tag, um du zu sein.",
    "Die heiße Schokolade geht diese Woche auf mich. Du suchst das Café aus.",
    "Ich bin so froh, dass es dich gibt. Mehr steht hier nicht.",
    "Leg dein Lieblingslied auf und tanz eine Minute. Ärztliche Anordnung.",
    "Weißt du noch, wie wir Tränen gelacht haben? Ich denk oft daran.",
    "Gutschein: ein Filmabend, du wählst, ich bring die Snacks.",
    "Du bist mutiger, als du denkst, und lieber, als du weißt.",
    "Mission des Tages: Fotografier etwas, das dich zum Lächeln bringt.",
    "Kleine Erinnerung: ein Glas Wasser trinken und einmal strecken.",
    "Falls der Tag lang ist: Diese Nachricht ist eine kleine Umarmung.",
    "Mit dir fühlen sich ganz normale Tage wie Feiertage an.",
    "Telefonieren wir heute Abend? Ich will hören, wie dein Tag war.",
    "Gutschein: eine Umarmung, jederzeit einlösbar, ohne Ablaufdatum.",
    "Gönn dir heute etwas Süßes. Hast du dir verdient.",
    "Halbzeit bis Weihnachten! Stark, dass du so weit gekommen bist.",
    "Geh kurz raus und schau nach oben. Vielleicht schneit es ja.",
    "Drei Dinge, die ich an dir mag: dein Lachen, dein Herz, deine Playlists.",
    "Schreib etwas Schönes aus diesem Jahr auf. Ich fang an: dich zu kennen.",
    "Gutschein: Ich übernehme eine Aufgabe deiner Wahl. Ohne Meckern.",
    "Du bist meine liebste Benachrichtigung.",
    "Zünd heute Abend eine Kerze an und wünsch dir was.",
    "Ausruhen zählt auch. Mach heute langsam.",
    "Morgen ist Weihnachten schon wieder näher. Halt durch!",
    "Frohen Heiligabend! Danke, dass es dich gibt.",
    "Lass uns eine schöne Sache fürs neue Jahr planen. Nur wir zwei.",
    "Heute Abend: kuschligste Decke, Tee und gar nichts müssen.",
    "Fun Fact: Dich hat man ganz leicht gern.",
    "Schick heute jemandem eine liebe Nachricht. Bei mir anfangen ist erlaubt.",
    "Egal wie weit weg du bist, in meinem Herzen bist du ganz nah.",
    "Plätzchen, Lebkuchen oder gebrannte Mandeln? Heute ist Naschtag."
  ],
  calendar: {
    heading: "Adventskalender",
    forName: "Für {name}",
    forNone: "Ein Adventskalender für dich",
    fromName: "Von {name}",
    before: {
      one: "Das erste Türchen öffnet sich am {date}. Nur noch {n} Tag!",
      other: "Das erste Türchen öffnet sich am {date}. Noch {n} Tage!"
    },
    during: "Heute ist der {date}. Öffne das Türchen von heute!",
    after: "Weihnachten ist da. Alle Türchen sind offen.",
    locked: {
      one: "Türchen {day} öffnet sich am {date}, in {n} Tag.",
      other: "Türchen {day} öffnet sich am {date}, in {n} Tagen."
    },
    hint: "Tippe auf ein Türchen, um es zu öffnen",
    doorAria: "Türchen {day}",
    dayTitle: "{date}",
    treat: "Heute keine Nachricht, dafür eine kleine Leckerei für dich.",
    close: "Schließen",
    makeOwn: "🎄 Selbst einen machen"
  },
  preview: {
    badge: "👀 Vorschau",
    note: "Nur du siehst diese Ansicht. Hier sind alle Türchen offen, damit du deine Nachrichten prüfen kannst. Beim Empfänger öffnet sich eins pro Tag.",
    back: "← Zurück"
  },
  result: {
    eyebrowMine: "Dein Adventskalender ist fertig!",
    eyebrowFriend: "Ein Kalender nur für dich",
    linkLabel: "Link zum Kalender",
    copy: "Kopieren",
    copied: "Link kopiert!",
    copyFail: "Kopieren ging nicht. Markier den Link und kopier ihn.",
    note: "Die Nachrichten stecken nur in diesem Link. Wer ihn hat, kann jedes Türchen an seinem Tag öffnen – schick ihn also nur an die richtige Person.",
    save: "Bild speichern",
    saving: "Bild wird erstellt…",
    saved: "Bild gespeichert!",
    saveFail: "Bild konnte nicht erstellt werden. Mach einfach einen Screenshot.",
    imageAlt: "Adventskalender mit 24 geschlossenen Türchen",
    preview: "Alle Türchen ansehen",
    edit: "Bearbeiten",
    retry: "Noch einen Kalender machen",
    retryFriend: "Selbst einen machen",
    shareTitle: "Adventskalender erstellen",
    shareText: "Ich hab dir einen Adventskalender gemacht 🎄 Ab 1. Dezember geht jeden Tag ein Türchen auf:",
    shareTextFriend: "Mach einen Adventskalender für einen lieben Menschen 🎄",
    fileName: "adventskalender"
  },
  og: {
    brand: "🎄 Adventskalender erstellen",
    kicker: "Adventskalender erstellen",
    title: "24 Türchen, jeden Tag eine Überraschung",
    desc: "4 Designs · Nachricht hinter jedem Türchen · per Link"
  },
  faq: [
    {
      q: "Wann öffnen sich die Türchen?",
      a: "Türchen 1 am 1. Dezember, Türchen 2 am 2. Dezember und so weiter bis zum 24. – nach dem Datum auf dem Handy oder Computer des Empfängers. Vom 25. Dezember bis 31. Januar sind alle offen, vor Dezember bleiben alle zu."
    },
    {
      q: "Wo werden meine Nachrichten gespeichert?",
      a: "Nur im Link. Nichts, was du schreibst, wird an unseren Server geschickt. Wer den Link hat, kann die Nachrichten lesen, sobald sich die Türchen öffnen – also nur an die richtige Person schicken."
    },
    {
      q: "Kann ich eine Nachricht nach dem Verschicken ändern?",
      a: "Nein, die Nachrichten stecken im Link selbst und lassen sich später nicht ändern. Bearbeite den Kalender, erstelle einen neuen Link und schick den stattdessen."
    },
    {
      q: "Was ist hinter einem leeren Türchen?",
      a: "Eine kleine Leckerei für den Tag, zum Beispiel ein Plätzchen, eine Zuckerstange oder ein Stern. Du kannst alle Türchen füllen, nur ein paar oder dir vom Würfel Ideen geben lassen."
    }
  ],
  privacy: {
    title: "Datenschutz | Adventskalender erstellen",
    description: "Datenschutzerklärung für Adventskalender erstellen: Umgang mit deinen Nachrichten, Cookies, Werbung und anonyme Statistiken.",
    h1: "Datenschutzerklärung",
    introHtml: "Adventskalender erstellen (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen, unbedingt nötigen Informationen.",
    sections: [
      [
        "1. Welche Daten wir erheben",
        "Der Dienst funktioniert ohne Konto und Anmeldung. Die eingegebenen Namen und Nachrichten werden nie an einen Server gesendet. Sie bleiben in deinem Browser (beim Bearbeiten als Entwurf im lokalen Speicher) und beim Teilen im Link. Welche Türchen geöffnet wurden, merkt sich nur der Browser des Empfängers. Einige Informationen können bei der Nutzung automatisch erfasst werden, wie unten beschrieben."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst Cookies in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Anzeigen über Google AdSense. Google und seine Partner können Cookies nutzen, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und deine Einstellungen findest du unter <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene zusammengefasste Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, erstellte Kalender, Sternebewertungen). Nichts davon identifiziert dich, und nichts davon enthält, was du geschrieben hast."
      ],
      [
        "5. Geteilte Links und Bilder",
        "Mit dem Dienst erstellte Links enthalten deinen Kalender, kodiert in der URL. Wer den Link hat, kann jede Nachricht lesen, sobald ihr Türchen offen ist. Gespeicherte Bilder zeigen nur die Türchennummern und entstehen in deinem Browser. Bitte schreib keine Adressen, Telefonnummern oder andere persönlichen Daten in die Nachrichten."
      ],
      [
        "6. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "7. Gültig ab",
        "Diese Erklärung gilt ab dem 17. November 2026."
      ]
    ],
    back: "← Zurück zu Adventskalender erstellen"
  }
};
